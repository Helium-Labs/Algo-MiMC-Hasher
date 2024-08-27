import { compileTeal } from '@algorandfoundation/algokit-utils'
import { CompiledTeal } from '@algorandfoundation/algokit-utils/types/app'
import algosdk from 'algosdk'
import { AssertDefined, base64ToBase64url, setTealSourceMapForTxn, sha256 } from './util'
import { sha512_256 } from 'js-sha512';
import mimcHasherLSIGTEAL from './PuyaContracts/build/mimc_hasher'

function getTealInstanceFromTemplateMap(
  templateMap: Record<string, string>,
  source: string
): string {
  // get copy of source
  let instance = source.slice()

  // Check all template values are strings
  for (const key in templateMap) {
    if (typeof templateMap[key] !== 'string') {
      throw new Error('Template value is not a string')
    }
  }

  // Check the template provided keys are completely contained in the source
  const regex = /^\s*byte *TMPL_.*$/gm
  const matches = instance.match(regex) ?? []
  const templateKeys = matches.map((t: string) => t.trim().split(' ').pop() ?? '')

  if (templateKeys === null) {
    throw new Error('No template keys found in source')
  }
  const templateKeysSet = new Set(templateKeys)
  const templateMapKeysSet = new Set(Object.keys(templateMap))
  if (templateKeysSet.size !== templateMapKeysSet.size) {
    throw new Error(
      'Number of template keys in source does not match number of template keys in map'
    )
  }
  for (const key of templateKeysSet) {
    if (!templateMapKeysSet.has(key)) {
      throw new Error('Template key not found in template map')
    }
  }

  // fill out template variables
  for (const key in templateMap) {
    const regex = new RegExp(key, 'g')
    const templateValue = templateMap[key]
    AssertDefined(templateValue, "templateMap[key] must be defined")
    instance = instance.replaceAll(regex, templateValue)
  }

  return instance
}

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

export async function getMIMCHasherLSIG(
  algod: algosdk.Algodv2,
  args: Uint8Array[]
): Promise<algosdk.LogicSigAccount> {
  const templateMap: any = {}
  const sourceInstance = getTealInstanceFromTemplateMap(
    templateMap,
    mimcHasherLSIGTEAL
  )

  const smartSig = await compileLSIGTeal(algod, sourceInstance, args)

  return smartSig
}