import { TealSource } from "./types"
import algosdk from "algosdk";
import * as crypto from 'crypto'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { type Transaction } from 'algosdk'

const sourceMapsByGUID = new Map<string, TealSource>()

export const sha256 = (data: crypto.BinaryLike) => crypto.createHash('sha256').update(data).digest();

export function chunks(input: Uint8Array, size: number): Uint8Array[] {
  const result: Uint8Array[] = []
  for (let i = 0; i < input.length; i += size) {
    result.push(input.slice(i, i + size))
  }
  return result
}

export function pad(arr: Uint8Array, width = 1024): { length: number, padded: Uint8Array } {
  // pad the uint8array to the width with 0s
  const padded = new Uint8Array(width)
  padded.set(arr)
  const length = arr.length
  return { length, padded }
}

export function leftPad(arr: Uint8Array, width = 1024): { length: number, padded: Uint8Array } {
  // pad the uint8array to the width with 0s
  const padded = new Uint8Array(width)
  const reversedArr = arr.reverse()
  padded.set(reversedArr)
  const length = arr.length
  const reversedPadded = padded.reverse()
  return { length, padded: reversedPadded }
}

export function leftPadAsMultiple(arr: Uint8Array, multiple = 32): { length: number, padded: Uint8Array } {
  const missingLength = multiple - arr.length % multiple
  const width = arr.length + missingLength
  return leftPad(arr, width)
}

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