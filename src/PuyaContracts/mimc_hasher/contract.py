from algopy import logicsig, subroutine, Bytes, urange, BigUInt, UInt64, Txn, Global
from algopy.op import extract, sha256, substring, btoi
from ..common import (
    b254_r_prime_int,
    aggregate_gtxn_notes,
    MIMCPayload,
    decode_dynamic_bytes,
)

# Constants
mimc7_constants_sha256_hash: str = "w14x2USkTeC2FqzT08l1Mub5hic3iA9MUkJDZpp5hp0="

@subroutine
def mimc7(x: BigUInt, k: BigUInt, C: Bytes) -> BigUInt:
    # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    P: BigUInt = BigUInt(b254_r_prime_int)
    tMul: BigUInt = BigUInt(0)
    t: BigUInt = x + k
    for i in urange(91):
        if i > 0:
            const: Bytes = extract(C, 32 * i, 32)
            const_bigUint = BigUInt.from_bytes(const)
            t = t + const_bigUint + k
        tMul = t * t
        tMul = tMul % P
        tMul = tMul * t
        tMul = tMul % P
        tMul = tMul * t
        tMul = tMul % P
        tMul = tMul * t
        tMul = tMul % P
        tMul = tMul * t
        tMul = tMul % P
        tMul = tMul * t
        t = tMul % P

    result: BigUInt = (t + k) % P

    return result


@subroutine
def multimimc7(arr: Bytes, C: Bytes, r: BigUInt) -> BigUInt:
    P: BigUInt = BigUInt(b254_r_prime_int)
    h: BigUInt = BigUInt(0)
    n_inputs: UInt64 = arr.length // 32
    input: BigUInt = BigUInt(0)
    for i in urange(n_inputs):
        arr_i_bytes: Bytes = extract(arr, 32 * i, 32)
        arr_i: BigUInt = BigUInt.from_bytes(arr_i_bytes)
        input = arr_i % P
        h = mimc7(input, r, C)
        r = (r + input + h) % P
    return r


@logicsig
def mimc_hasher() -> bool:
    # Prevent rekey
    assert Txn.rekey_to == Global.zero_address, "There is no ability to rekey"

    # Unpack input
    gtxn_notes: Bytes = aggregate_gtxn_notes()
    mimc_payload: MIMCPayload = MIMCPayload.from_bytes(gtxn_notes)

    start_idx: UInt64 = btoi(mimc_payload.compute_start_idx.bytes)
    end_idx: UInt64 = btoi(mimc_payload.compute_end_idx.bytes)

    mimc_hash: BigUInt = BigUInt.from_bytes(mimc_payload.mimc_hash.bytes)
    previous_r_value: BigUInt = BigUInt.from_bytes(mimc_payload.previous_r_value.bytes)
    mimc_hash_preimage: Bytes = decode_dynamic_bytes(
        mimc_payload.mimc_hash_preimage.bytes
    )
    constants: Bytes = decode_dynamic_bytes(mimc_payload.constants.bytes)

    # Validate MIMC constants
    assert sha256(constants) == Bytes.from_base64(
        mimc7_constants_sha256_hash
    ), "MIMC Hash constants must be untampered"

    mimc_hash_preimage_segment: Bytes = substring(
        mimc_hash_preimage, start_idx * UInt64(32), end_idx * UInt64(32)
    )

    # Compute hash
    assert (
        multimimc7(mimc_hash_preimage_segment, constants, previous_r_value) == mimc_hash
    ), "MIMC hash must match"

    return True
