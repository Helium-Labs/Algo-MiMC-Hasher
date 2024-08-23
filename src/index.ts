import algosdk, { bigIntToBytes, bytesToBigInt } from 'algosdk'
import { chunks, leftPadAsMultiple, base64ToBase64url, sha256, generateRandomString } from './util'
import { MimcClient } from './PuyaContracts/build/MIMC.client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { AppReference, CompiledTeal } from '@algorandfoundation/algokit-utils/types/app'
import { getDummyLSIG } from './LSIGs'
import { MAX_NOTE_FIELD_SIZE } from './constants'
import { SimulateResponse } from './types'
import { compileTeal } from '@algorandfoundation/algokit-utils'
import * as crypto from 'crypto'
import mimcHasherARC32 from './PuyaContracts/build/MIMC.arc32.json'
import { setTealSourceMapForTxn } from './util'
import { multiMiMC7 } from 'mimc-hasher'

export class MIMCClient {
  private mimcClient: MimcClient
  private mimcAppId: number = 0

  constructor(
    readonly algod: algosdk.Algodv2,
    readonly signer: TransactionSignerAccount,
    mimcAppId: number = 0
  ) {
    this.mimcAppId = mimcAppId
    this.mimcClient = new MimcClient(
      { id: this.mimcAppId, sender: signer, resolveBy: 'id' },
      this.algod
    )
  }

  async createMimcApp(): Promise<AppReference> {
    const suggestedParams = await this.algod.getTransactionParams().do()
    this.mimcClient = new MimcClient(
      {
        id: 0,
        sender: this.signer,
        params: suggestedParams,
        resolveBy: 'id'
      },
      this.algod
    )

    const createApp = this.mimcClient.create.create
    const created = await createApp([])

    this.mimcAppId = Number(created.appId)
    await this.mimcClient.appClient.fundAppAccount({
      amount: AlgoAmount.Algos(1)
    })

    const approvalSourceBuf = Buffer.from(mimcHasherARC32.source.approval, 'base64')
    const approvalSource = approvalSourceBuf.toString('utf8')
    const compiledTeal: CompiledTeal = await compileTeal(approvalSource, this.algod)
    const programHash = crypto.createHash('SHA-512/256').update(Buffer.from(compiledTeal.compiled, 'base64')).digest('base64')

    compiledTeal.sourceMap.sources = [`${base64ToBase64url(programHash)}.teal`]
    setTealSourceMapForTxn(`${this.mimcAppId}`, {
      sourceMap: compiledTeal.sourceMap,
      programHash,
      source: approvalSource
    })

    return created
  }

  getBoxRefs(data: Uint8Array): algosdk.BoxReference[] {
    const prefixes = [
      'r',
      'data',
      'num_chunks',
      'num_completed',
      'result'
    ]
    const sha256Hash = sha256(data)
    const names = prefixes.map(prefix => {
      const bufPrefix = Buffer.from(prefix, 'utf8')
      const buf = Buffer.concat([bufPrefix, sha256Hash])
      return Uint8Array.from(buf)
    })

    return names.map(name => ({
      appIndex: this.mimcAppId,
      name
    }))
  }

  public async initialize(data: Uint8Array, simulate: true): Promise<SimulateResponse>;
  public async initialize(data: Uint8Array, simulate?: false): Promise<string[]>;
  public async initialize(data: Uint8Array, simulate: boolean = false): Promise<SimulateResponse | string[]> {
    // Make the data left padded as a multiple of 32
    const paddedData = leftPadAsMultiple(data, 32).padded
    // initialize with all the data carrier tx with the note field containing the data to hash
    const noteCount = Math.ceil(paddedData.length / 1024)
    const boxes = this.getBoxRefs(paddedData)
    // initialize each time
    const atc = await this.mimcClient
      .compose()
      .initialize([], {
        sendParams: { fee: AlgoAmount.MicroAlgos(1000 * (noteCount + 1)) },
        boxes
      })
      .atc()
    const dummyLsig = await getDummyLSIG(this.algod, [])
    const dummySigner = algosdk.makeLogicSigAccountTransactionSigner(dummyLsig)
    const suggestedParams = await this.algod.getTransactionParams().do()
    for (let i = 0; i < noteCount; i++) {
      const note: Uint8Array = paddedData.slice(i * MAX_NOTE_FIELD_SIZE, (i + 1) * MAX_NOTE_FIELD_SIZE)
      const dataCarrierTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: dummyLsig.address(),
        to: dummyLsig.address(),
        amount: 0,
        suggestedParams: {
          ...suggestedParams,
          fee: 0,
          flatFee: true
        },
        note
      })
      atc.addTransaction({
        txn: dataCarrierTxn,
        signer: dummySigner
      })
    }

    if (simulate) {
      const simreq = new algosdk.modelsv2.SimulateRequest({
        allowEmptySignatures: true,
        allowUnnamedResources: true,
        txnGroups: [],
        execTraceConfig: new algosdk.modelsv2.SimulateTraceConfig({
          enable: true,
          scratchChange: true,
          stackChange: true,
          stateChange: true,
        }),
      });
      const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
      return simulatedResponse
    }

    const txIds = await atc.submit(this.algod)
    return txIds
  }

  // Do as many tx as necessary until computed
  // TODO: extend to handle over 480 bytes. It is enough forRSA modulus hashing.
  public async multimimc7(data: Uint8Array, simulate: true): Promise<SimulateResponse>;
  public async multimimc7(data: Uint8Array, simulate?: false): Promise<string[]>;
  public async multimimc7(data: Uint8Array, simulate: boolean = false): Promise<SimulateResponse | string[]> {
    // Make the data left padded as a multiple of 32
    const paddedData = leftPadAsMultiple(data, 32).padded

    // Number of LSIGs: 27_000 cost per 32 bytes, and each LSIG provides 20_000 budget
    const groupsOf32Bytes = Math.ceil(paddedData.length / 32)
    const lsigCount = Math.ceil(groupsOf32Bytes * 27 / 20)

    // Do hash rounds 
    const dataSha256 = sha256(paddedData)
    const boxes = this.getBoxRefs(paddedData)
    const atc = await this.mimcClient
      .compose()
      .multimimc7([
        dataSha256
      ], {
        sendParams: { fee: AlgoAmount.MicroAlgos(1000 * (lsigCount + 1)) },
        boxes
      })
      .atc()

    const dummyLsig = await getDummyLSIG(this.algod, [])
    const dummySigner = algosdk.makeLogicSigAccountTransactionSigner(dummyLsig)

    const suggestedParams = await this.algod.getTransactionParams().do()
    for (let i = 0; i < lsigCount; i++) {
      const dataCarrierTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: dummyLsig.address(),
        to: dummyLsig.address(),
        amount: 0,
        suggestedParams: {
          ...suggestedParams,
          fee: 0,
          flatFee: true
        }
      })
      atc.addTransaction({
        txn: dataCarrierTxn,
        signer: dummySigner
      })
    }
    if (simulate) {
      const simreq = new algosdk.modelsv2.SimulateRequest({
        allowEmptySignatures: true,
        allowUnnamedResources: true,
        txnGroups: [],
        execTraceConfig: new algosdk.modelsv2.SimulateTraceConfig({
          enable: true,
          scratchChange: true,
          stackChange: true,
          stateChange: true,
        }),
      });
      const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
      return simulatedResponse
    }

    const txIds = await atc.submit(this.algod)
    return txIds
  }

  // Verify the MIMC hash correctness
  public async verifyMimcHash(data: Uint8Array, simulate: true): Promise<SimulateResponse>;
  public async verifyMimcHash(data: Uint8Array, simulate?: false): Promise<string[]>;
  public async verifyMimcHash(data: Uint8Array, simulate: boolean = false): Promise<SimulateResponse | string[]> {
    // Make the data left padded as a multiple of 32
    const paddedData = leftPadAsMultiple(data, 32).padded

    // Do hash rounds 
    const dataSha256 = sha256(paddedData)
    const dataMimcAsBigInt = multiMiMC7(chunks(paddedData, 32).map(bytes => { return bytesToBigInt(bytes) }))
    const dataMimc = bigIntToBytes(dataMimcAsBigInt, 32)
    const boxes = this.getBoxRefs(paddedData)
    const atc = await this.mimcClient
      .compose()
      .verifyHash([
        dataSha256,
        dataMimc
      ], {
        sendParams: { fee: AlgoAmount.MicroAlgos(1000) },
        boxes
      })
      .atc()

    if (simulate) {
      const simreq = new algosdk.modelsv2.SimulateRequest({
        allowEmptySignatures: true,
        allowUnnamedResources: true,
        txnGroups: [],
        execTraceConfig: new algosdk.modelsv2.SimulateTraceConfig({
          enable: true,
          scratchChange: true,
          stackChange: true,
          stateChange: true,
        }),
      });
      const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
      return simulatedResponse
    }

    const txIds = await atc.submit(this.algod)
    return txIds
  }


}