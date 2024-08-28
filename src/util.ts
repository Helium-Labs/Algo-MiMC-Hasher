import { TealSource } from "./types"
import algosdk from "algosdk";
import * as crypto from 'crypto'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { type Transaction } from 'algosdk'

const sourceMapsByGUID = new Map<string, TealSource>()

export const sha256 = (data: crypto.BinaryLike) => crypto.createHash('sha256').update(data).digest();

export function base64ToBase64url(base64: string): string {
  return base64
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, '') // Remove any trailing '=' padding characters
}


export function getTealSourceMapForTxn(txn: algosdk.EncodedSignedTransaction) {
  if (txn.txn.apid) {
    return sourceMapsByGUID.get(txn.txn.apid.toString())
  }
  return sourceMapsByGUID.get(Buffer.from(sha256(txn.lsig!.l)).toString('base64'))
}

export function setTealSourceMapForTxn(programHash: string, tealSource: TealSource) {
  sourceMapsByGUID.set(programHash, tealSource)
}

// Assert as being true (e.g. it's not undefined)
export function Assert(value: boolean, message: string): asserts value is true {
  if (!value) {
    throw new Error(message)
  }
}

export function AssertDefined<T>(value: T | undefined | null, message: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(message)
  }
}

export function getTransactionSignerFromMnemonic(
  mnemonic: string
): TransactionSignerAccount {
  const account = algosdk.mnemonicToSecretKey(mnemonic)
  return {
    addr: account.addr,
    signer: async (txnGroup: Transaction[], indexesToSign: number[]) => {
      const signedTxs: Uint8Array[] = []
      for (const indexToSign of indexesToSign) {
        const txToSign = txnGroup[indexToSign]
        AssertDefined(txToSign, 'txToSign must be defined')
        const signedTx = algosdk.signTransaction(txToSign, account.sk)
        signedTxs.push(signedTx.blob)
      }
      return signedTxs
    }
  }
}

export async function getRandomBytes(len: number): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    crypto.randomBytes(len, (err, buf: Buffer) => {
      if (err) rej(err)
      res(Uint8Array.from(buf))
    });
  })
}