import { fundAccount, getAlgokitTestkit } from 'algokit-testkit'
import { MIMCClient } from '../src'
import { getTransactionSignerFromMnemonic } from '../src/util';
import algosdk from 'algosdk';
import 'dotenv/config'

const TEST_MNEMONIC: string = process.env.TEST_MNEMONIC!

test("MIMC Constant as hex string", async () => {
  console.warn("MIMC of small text 'hello'")

  const { algod } = await getAlgokitTestkit()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);
  const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)

  await fundAccount(account.addr, 1e9)

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const dataAsBuf = Buffer.from('hello', 'utf8')
  const data = Uint8Array.from(dataAsBuf)

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data, true)
  await mimcClient.verifyMimcHash(data, true)
})

test("MIMC of large RSA signing modulus (n)", async () => {
  console.warn("MIMC of large RSA signing modulus (n)")
  const googleSigningModulus = "nzGsrziOYrMVYMpvUZOwkKNiPWcOPTYRYlDSdRW4UpAHdWPbPlyqaaphYhoMB5DXrVxI3bdvm7DOlo-sHNnulmAFQa-7TsQMxrZCvVdAbyXGID9DZYEqf8mkCV1Ohv7WY5lDUqlybIk1OSHdK7-1et0QS8nn-5LojGg8FK4ssLf3mV1APpujl27D1bDhyRb1MGumXYElwlUms7F9p9OcSp5pTevXCLmXs9MJJk4o9E1zzPpQ9Ko0lH9l_UqFpA7vwQhnw0nbh73rXOX2TUDCUqL4ThKU5Z9Pd-eZCEOatKe0mJTpQ00XGACBME_6ojCdfNIJr84Y_IpGKvkAEksn9w"

  const { algod } = await getAlgokitTestkit()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);
  const account = algosdk.mnemonicToSecretKey(TEST_MNEMONIC)
  await fundAccount(account.addr, 1e9)

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const dataAsBuf = Buffer.from(googleSigningModulus, 'base64url')
  const data = Uint8Array.from(dataAsBuf)

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data, true)
  await mimcClient.verifyMimcHash(data, true)
})

