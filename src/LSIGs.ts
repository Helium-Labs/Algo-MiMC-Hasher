import { compileTeal } from '@algorandfoundation/algokit-utils'
import { CompiledTeal } from '@algorandfoundation/algokit-utils/types/app'
import algosdk from 'algosdk'
import { base64ToBase64url, setTealSourceMapForTxn, sha256 } from './util'
import { sha512_256 } from 'js-sha512';

export async function compileLSIGTeal(algod: algosdk.Algodv2, source: string, args: (Uint8Array | Buffer)[] = []): Promise<algosdk.LogicSigAccount> {
  const compiledTeal: CompiledTeal = await compileTeal(source, algod)
  const smartSig = new algosdk.LogicSigAccount(
    Buffer.from(compiledTeal.compiled, 'base64'),
    args
  )
  const lsigSha = Buffer.from(sha256(smartSig.lsig.logic)).toString('base64')
  const programHashBuf = sha512_256.arrayBuffer(Buffer.from(compiledTeal.compiled, 'base64'));
  const programHash = Buffer.from(programHashBuf).toString('base64')
  compiledTeal.sourceMap.sources = [`${base64ToBase64url(programHash)}.teal`]
  setTealSourceMapForTxn(lsigSha, {
    sourceMap: compiledTeal.sourceMap,
    programHash,
    source
  })
  return smartSig
}

export async function getDummyLSIG(
  algod: algosdk.Algodv2,
  args: Uint8Array[]
): Promise<algosdk.LogicSigAccount> {
  const dummyTeal = '#pragma version 9\nint 1'
  const smartSig = await compileLSIGTeal(algod, dummyTeal, args)
  return smartSig
}
