import { getRandomBytes, getTransactionSignerFromMnemonic } from '../src/util';
import algosdk from 'algosdk';
import 'dotenv/config'
import { MIMCClient } from '../src'
import { expectFailure } from './util';
import { getAlgokitTestkit, fundAccount } from 'algokit-testkit'
const TEST_MNEMONIC: string = process.env.TEST_MNEMONIC!

type Network = 'devnet' | 'testnet';
let ENV: Network = 'devnet' as Network
const getAlgod = async () => {
  if (ENV === 'testnet') {  // Type-safe comparison
    // Define the Algorand node connection parameters
    const algodToken = '' // free service does not require tokens
    const algodServer = 'https://testnet-api.algonode.cloud'
    const algodPort = 443

    // Create an instance of the algod client
    return new algosdk.Algodv2(algodToken, algodServer, algodPort)
  } else {
    const { algod } = await getAlgokitTestkit()
    const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);
    await fundAccount(signer.addr, 100e6)
    return algod
  }
}

test("MIMC of small value", async () => {
  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const data = Buffer.from('hello', 'utf8')

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data)
  await mimcClient.verifyMimcHash(data)
}, 120_000)

test("MIMC of large chunked RSA signing modulus (n)", async () => {
  const chunkedMod = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3cDhS7lBAXcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsq57HVp5JAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHsCu9D3Hw61AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAfE/Ikcy8kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGgMEuORREqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPr8n/sfSurLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXMYAs2ygVBYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfIRuQZ0+euAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK2ZrYpIvXfzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwRkLIbhNT1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHip5MrqmuswAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJPWOcwplPTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3OnICBMCxGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzIORT6yJW/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANnsvgxDRElPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQ3NfqSaI9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSHHu7IXbZ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEl3VtXnubXrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATQburlx+s5EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXeS0eB9CpqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH9ePO/7DvINAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWtKI/UKKapIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg3hVI9sAwYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADi7Xu0leevuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5nhVlLe74AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACY9V10RtTtUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVzRt2TzaNjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjIbGjRyarNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABshSWYBhi4+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALqun9x20hEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA35DOjMFKgrYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACidXm3NRurIw=="
  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const data = Uint8Array.from(Buffer.from(chunkedMod, 'base64'))

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data)
  await mimcClient.verifyMimcHash(data)
}, 120_000)

test("MIMC of large RSA signing modulus (n)", async () => {
  const googleSigningModulus = "nzGsrziOYrMVYMpvUZOwkKNiPWcOPTYRYlDSdRW4UpAHdWPbPlyqaaphYhoMB5DXrVxI3bdvm7DOlo-sHNnulmAFQa-7TsQMxrZCvVdAbyXGID9DZYEqf8mkCV1Ohv7WY5lDUqlybIk1OSHdK7-1et0QS8nn-5LojGg8FK4ssLf3mV1APpujl27D1bDhyRb1MGumXYElwlUms7F9p9OcSp5pTevXCLmXs9MJJk4o9E1zzPpQ9Ko0lH9l_UqFpA7vwQhnw0nbh73rXOX2TUDCUqL4ThKU5Z9Pd-eZCEOatKe0mJTpQ00XGACBME_6ojCdfNIJr84Y_IpGKvkAEksn9w"

  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const data = Buffer.from(googleSigningModulus, 'base64url')

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data)
  await mimcClient.verifyMimcHash(data)
}, 120_000)

test("MIMC of OIDC issuer", async () => {
  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const data = Buffer.from("https://accounts.google.com", 'utf8')

  await mimcClient.initialize(data)
  await mimcClient.multimimc7(data)
  await mimcClient.verifyMimcHash(data)
}, 120_000)

test("Expect failure: invalid MIMC hash should fail", async () => {
  const algod = await getAlgod()
  const signer = getTransactionSignerFromMnemonic(TEST_MNEMONIC);

  const mimcClient = new MIMCClient(algod, signer)

  await mimcClient.createMimcApp()
  const data = Buffer.from("https://accounts.google.com", 'utf8')

  const invalidMIMC: Uint8Array = await getRandomBytes(32)

  await mimcClient.initialize(data)
  await expectFailure(async () => {
    // expected to fail because the MIMC hasher LSIG won't be present
    await mimcClient.multimimc7(data, false, invalidMIMC)
  })
  await expectFailure(async () => {
    // expected to fail because the MIMC hash will be invalid
    await mimcClient.verifyMimcHash(data, false, invalidMIMC)
  })
}, 120_000)

