import { getTransactionSignerFromMnemonic } from '../src/util';
import algosdk from 'algosdk';
import 'dotenv/config'
import { MIMCClient } from 'algo-mimc-hasher'

const TEST_MNEMONIC: string = process.env.TEST_MNEMONIC!

const getAlgod = async () => {
  // Define the Algorand node connection parameters
  const algodToken = '' // free service does not require tokens
  const algodServer = 'https://testnet-api.algonode.cloud'
  const algodPort = 443

  // Create an instance of the algod client
  return new algosdk.Algodv2(algodToken, algodServer, algodPort)
}

test("MIMC Constant as hex string", async () => {
  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const dataAsBuf = Buffer.from('hello', 'utf8')
  const data = Uint8Array.from(dataAsBuf)

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data, true)
  await mimcClient.verifyMimcHash(data, true)
}, 120_000)

test("MIMC of large RSA signing modulus (n)", async () => {
  const googleSigningModulus = "nzGsrziOYrMVYMpvUZOwkKNiPWcOPTYRYlDSdRW4UpAHdWPbPlyqaaphYhoMB5DXrVxI3bdvm7DOlo-sHNnulmAFQa-7TsQMxrZCvVdAbyXGID9DZYEqf8mkCV1Ohv7WY5lDUqlybIk1OSHdK7-1et0QS8nn-5LojGg8FK4ssLf3mV1APpujl27D1bDhyRb1MGumXYElwlUms7F9p9OcSp5pTevXCLmXs9MJJk4o9E1zzPpQ9Ko0lH9l_UqFpA7vwQhnw0nbh73rXOX2TUDCUqL4ThKU5Z9Pd-eZCEOatKe0mJTpQ00XGACBME_6ojCdfNIJr84Y_IpGKvkAEksn9w"

  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const dataAsBuf = Buffer.from(googleSigningModulus, 'base64url')
  const data = Uint8Array.from(dataAsBuf)

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data, true)
  await mimcClient.verifyMimcHash(data, true)
}, 120_000)

