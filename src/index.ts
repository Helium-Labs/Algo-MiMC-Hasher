import algosdk, { bigIntToBytes, bytesToBigInt } from 'algosdk'
import { base64ToBase64url, sha256, getTransactionSignerFromMnemonic, getRandomBytes } from './util'
import { MimcClient } from './PuyaContracts/build/MIMC.client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { AppReference, CompiledTeal } from '@algorandfoundation/algokit-utils/types/app'
import { getDummyLSIG, getMIMCHasherLSIG } from './LSIGs'
import { MAX_NOTE_FIELD_SIZE } from './constants'
import { MIMCPayload, SimulateResponse } from './types'
import { compileTeal } from '@algorandfoundation/algokit-utils'
import * as crypto from 'crypto'
import mimcHasherARC32 from './PuyaContracts/build/MIMC.arc32.json'
import { setTealSourceMapForTxn } from './util'
import { multiMiMC7, BinaryFormat } from 'mimc-hasher'

export { getTransactionSignerFromMnemonic }

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

const MIMC_CONSTANTS_B64 = "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"
const MIMCPayloadABICodec = algosdk.ABIType.from('(byte[32],byte[32],uint64,uint64,byte[],byte[])')

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
    const mimcHasherLSIG = await getMIMCHasherLSIG(this.algod, [])

    const created = await createApp([], {
      deployTimeParams: {
        MIMC_HASHER_ADDR: Buffer.from(algosdk.decodeAddress(mimcHasherLSIG.address()).publicKey)
      }
    })

    this.mimcAppId = Number(created.appId)
    await this.mimcClient.appClient.fundAppAccount({
      amount: AlgoAmount.Algos(1)
    })

    const compiledTeal: CompiledTeal = created.compiledApproval!
    const programHash = crypto.createHash('SHA-512/256').update(Buffer.from(compiledTeal.compiled, 'base64')).digest('base64')
    compiledTeal.sourceMap.sources = [`${base64ToBase64url(programHash)}.teal`]
    setTealSourceMapForTxn(`${this.mimcAppId}`, {
      sourceMap: compiledTeal.sourceMap,
      programHash,
      source: Buffer.from(mimcHasherARC32.source.approval, 'base64').toString('utf8')
    })

    return created
  }

  getBoxRefs(data: Uint8Array, resultOnly: boolean = false): algosdk.BoxReference[] {
    const padded = BinaryFormat.leftPadAsMultiple(data, 32).padded
    let prefixes: string[]
    if (resultOnly) {
      prefixes = ['result']
    } else {
      prefixes = [
        'num_chunks',
        'num_completed',
        'result',
        'r'
      ]
    }
    const sha256Hash = sha256(padded)
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

  static encodeMIMCPayload(mimcPayload: MIMCPayload): Uint8Array {
    const {
      mimcHash,
      previousRValue,
      computeStartIdx,
      computeEndIdx,
      constants,
      mimcHashPreimage
    } = mimcPayload

    const note: Uint8Array = MIMCPayloadABICodec.encode([
      mimcHash,
      previousRValue,
      computeStartIdx,
      computeEndIdx,
      constants,
      mimcHashPreimage
    ])

    return note
  }

  static decodeMIMCPayload(data: Uint8Array): MIMCPayload {
    const payloadABIValue: algosdk.ABIValue[] = MIMCPayloadABICodec.decode(data.slice()) as algosdk.ABIValue[]
    const result = {
      mimcHash: new Uint8Array(payloadABIValue[0] as Uint8Array),
      previousRValue: new Uint8Array(payloadABIValue[1] as Uint8Array),
      computeStartIdx: payloadABIValue[2] as number,
      computeEndIdx: payloadABIValue[3] as number,
      constants: new Uint8Array(payloadABIValue[4] as Uint8Array),
      mimcHashPreimage: new Uint8Array(payloadABIValue[5] as Uint8Array),
    }

    return result
  }

  public async initialize(data: Uint8Array, simulate: true): Promise<SimulateResponse>;
  public async initialize(data: Uint8Array, simulate?: false): Promise<string[]>;
  public async initialize(data: Uint8Array, simulate: boolean = false): Promise<SimulateResponse | string[]> {
    const dataAsUint8Array = Uint8Array.from(data)
    const dataCopy = dataAsUint8Array.slice()
    const mimcPayload: MIMCPayload = {
      mimcHash: Buffer.alloc(32),
      previousRValue: Buffer.alloc(32),
      computeStartIdx: 0,
      computeEndIdx: 0,
      constants: Buffer.from(MIMC_CONSTANTS_B64, 'base64'),
      mimcHashPreimage: BinaryFormat.leftPadAsMultiple(dataCopy, 32).padded,
    }
    const encodedMIMCPayload: Uint8Array = MIMCClient.encodeMIMCPayload(mimcPayload)
    const noteCount = Math.ceil(encodedMIMCPayload.length / MAX_NOTE_FIELD_SIZE)
    const boxes = this.getBoxRefs(mimcPayload.mimcHashPreimage)
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
      const note: Uint8Array = encodedMIMCPayload.slice(i * MAX_NOTE_FIELD_SIZE, (i + 1) * MAX_NOTE_FIELD_SIZE)
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

    atc.buildGroup()

    if (simulate) {
      const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
      return simulatedResponse
    }
    const txIds = await atc.submit(this.algod)
    return txIds
  }

  public async multimimc7(data: Uint8Array, simulate: true, overrideDataMimc?: Uint8Array): Promise<SimulateResponse>;
  public async multimimc7(data: Uint8Array, simulate?: false, overrideDataMimc?: Uint8Array): Promise<string[]>;
  public async multimimc7(data: Uint8Array, simulate: boolean = false, overrideDataMimc?: Uint8Array): Promise<SimulateResponse | string[]> {
    const dataAsUint8Array = Uint8Array.from(data)
    const dataCopy = dataAsUint8Array.slice()
    let previousRValue: Uint8Array = Uint8Array.from(Buffer.alloc(32))
    const mimcPayload: MIMCPayload = {
      mimcHash: Buffer.alloc(32),
      previousRValue: previousRValue.slice(),
      computeStartIdx: 0,
      computeEndIdx: 0,
      constants: Buffer.from(MIMC_CONSTANTS_B64, 'base64'),
      mimcHashPreimage: BinaryFormat.leftPadAsMultiple(dataCopy, 32).padded,
    }

    const getNumChunks = (mimcPreimage: Uint8Array) => {
      const nChunks = parseInt(String(mimcPreimage.length / 32))
      return nChunks
    }

    const getNumLSIGSToProvideBudgetForNumChunks = (numChunks: number) => {
      const computeCost = numChunks * 27_000
      return Math.ceil(computeCost / 20_000)
    }

    let completedChunks = 0
    let totalChunks = getNumChunks(mimcPayload.mimcHashPreimage)
    let allTxIds: string[] = []
    while (completedChunks < totalChunks) {
      const numChunksToHash: number = Math.min(totalChunks - completedChunks, 10)
      const noteCount = Math.ceil(MIMCClient.encodeMIMCPayload(mimcPayload).length / MAX_NOTE_FIELD_SIZE)
      const lsigCount = Math.max(noteCount, getNumLSIGSToProvideBudgetForNumChunks(numChunksToHash))

      mimcPayload.computeStartIdx = completedChunks
      mimcPayload.computeEndIdx = completedChunks + numChunksToHash
      const mimcInputs = mimcPayload.mimcHashPreimage.slice(mimcPayload.computeStartIdx * 32, mimcPayload.computeEndIdx * 32)
      mimcPayload.previousRValue = previousRValue.slice()
      mimcPayload.mimcHash = bigIntToBytes(multiMiMC7(mimcInputs, bytesToBigInt(mimcPayload.previousRValue)), 32)
      mimcPayload.mimcHash = overrideDataMimc ?? mimcPayload.mimcHash

      const boxes = this.getBoxRefs(mimcPayload.mimcHashPreimage)

      const dummyLsig = await getDummyLSIG(this.algod, [])
      const mimcHasherLSIG = await getMIMCHasherLSIG(this.algod, [])
      const atc = await this.mimcClient
        .compose()
        .multimimc7([], {
          sendParams: { fee: AlgoAmount.MicroAlgos(1000 * (lsigCount + 1)) },
          boxes
        })
        .atc()

      const suggestedParams = await this.algod.getTransactionParams().do()
      for (let i = 0; i < lsigCount; i++) {
        const note: Uint8Array = MIMCClient.encodeMIMCPayload(mimcPayload).slice(i * MAX_NOTE_FIELD_SIZE, (i + 1) * MAX_NOTE_FIELD_SIZE)
        const lsig = (i === 0 && !overrideDataMimc) ? mimcHasherLSIG : dummyLsig
        const lsigTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: lsig.address(),
          to: lsig.address(),
          amount: 0,
          suggestedParams: {
            ...suggestedParams,
            fee: 0,
            flatFee: true,
          },
          note
        })
        const lease = await getRandomBytes(32)
        lsigTx.addLease(lease)
        atc.addTransaction({
          txn: lsigTx,
          signer: algosdk.makeLogicSigAccountTransactionSigner(lsig)
        })
      }

      atc.buildGroup()

      if (simulate) {
        try {
          const txIds = await atc.submit(this.algod)
          allTxIds = allTxIds.concat(txIds)
        } catch (e) {
          const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
          return simulatedResponse
        }
      } else {
        const txIds = await atc.submit(this.algod)
        allTxIds = allTxIds.concat(txIds)
      }

      previousRValue = Uint8Array.from(mimcPayload.mimcHash).slice()
      completedChunks += numChunksToHash
    }

    return allTxIds
  }

  public async verifyMimcHash(data: Uint8Array, simulate: true, overrideDataMimc?: Uint8Array): Promise<SimulateResponse>;
  public async verifyMimcHash(data: Uint8Array, simulate?: false, overrideDataMimc?: Uint8Array): Promise<string[]>;
  public async verifyMimcHash(data: Uint8Array, simulate: boolean = false, overrideDataMimc?: Uint8Array): Promise<SimulateResponse | string[]> {
    const dataAsUint8Array = Uint8Array.from(data)
    const dataCopy = dataAsUint8Array.slice()
    const paddedData = BinaryFormat.leftPadAsMultiple(dataCopy, 32).padded
    const dataSha256 = sha256(paddedData)
    const dataMimcAsBigInt = multiMiMC7(BinaryFormat.leftPadAsMultiple(dataCopy, 32).padded)
    const dataMimc = overrideDataMimc ?? bigIntToBytes(dataMimcAsBigInt, 32)
    const boxes = this.getBoxRefs(dataCopy, true)
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
      const simulatedResponse: SimulateResponse = await atc.simulate(this.algod, simreq)
      return simulatedResponse
    }

    const txIds = await atc.submit(this.algod)
    return txIds
  }


}