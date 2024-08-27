export default `#pragma version 10

PuyaContracts.mimc_hasher.contract.mimc_hasher:
    // src/PuyaContracts/mimc_hasher/contract.py:75
    // gtxn_notes: Bytes = aggregate_gtxn_notes()
    callsub aggregate_gtxn_notes
    // src/PuyaContracts/mimc_hasher/contract.py:78
    // start_idx: UInt64 = btoi(mimc_payload.compute_start_idx.bytes)
    dup
    int 64
    int 8
    extract3 // on error: Index access is out of bounds
    btoi
    cover 1
    // src/PuyaContracts/mimc_hasher/contract.py:79
    // end_idx: UInt64 = btoi(mimc_payload.compute_end_idx.bytes)
    dup
    int 72
    int 8
    extract3 // on error: Index access is out of bounds
    btoi
    cover 1
    // src/PuyaContracts/mimc_hasher/contract.py:81
    // mimc_hash: BigUInt = BigUInt.from_bytes(mimc_payload.mimc_hash.bytes)
    dup
    int 0
    int 32
    extract3 // on error: Index access is out of bounds
    cover 3
    // src/PuyaContracts/mimc_hasher/contract.py:82
    // previous_r_value: BigUInt = BigUInt.from_bytes(mimc_payload.previous_r_value.bytes)
    dup
    int 32
    int 32
    extract3 // on error: Index access is out of bounds
    cover 1
    // src/PuyaContracts/mimc_hasher/contract.py:84
    // mimc_payload.mimc_hash_preimage.bytes
    dup
    int 82
    extract_uint16
    cover 1
    dup
    len
    cover 1
    dup
    uncover 3
    uncover 3
    substring3
    // src/PuyaContracts/mimc_hasher/contract.py:83-85
    // mimc_hash_preimage: Bytes = decode_dynamic_bytes(
    //     mimc_payload.mimc_hash_preimage.bytes
    // )
    callsub decode_dynamic_bytes
    cover 1
    // src/PuyaContracts/mimc_hasher/contract.py:86
    // constants: Bytes = decode_dynamic_bytes(mimc_payload.constants.bytes)
    dup
    int 80
    extract_uint16
    cover 1
    dup
    int 82
    extract_uint16
    uncover 1
    uncover 2
    uncover 2
    substring3
    callsub decode_dynamic_bytes
    // src/PuyaContracts/mimc_hasher/contract.py:88
    // assert sha256(constants) == Bytes.from_base64(
    dup
    sha256
    // src/PuyaContracts/mimc_hasher/contract.py:88-90
    // assert sha256(constants) == Bytes.from_base64(
    //     mimc7_constants_sha256_hash
    // ), "MIMC Hash constants must be untampered"
    byte base64 w14x2USkTeC2FqzT08l1Mub5hic3iA9MUkJDZpp5hp0=
    ==
    assert // MIMC Hash constants must be untampered
    // src/PuyaContracts/mimc_hasher/contract.py:93
    // mimc_hash_preimage, start_idx * UInt64(32), end_idx * UInt64(32)
    uncover 4
    int 32
    *
    uncover 4
    int 32
    *
    // src/PuyaContracts/mimc_hasher/contract.py:92-94
    // mimc_hash_preimage_segment: Bytes = substring(
    //     mimc_hash_preimage, start_idx * UInt64(32), end_idx * UInt64(32)
    // )
    uncover 3
    uncover 2
    uncover 2
    substring3
    // src/PuyaContracts/mimc_hasher/contract.py:97
    // multimimc7(mimc_hash_preimage_segment, constants, previous_r_value) == mimc_hash
    uncover 1
    uncover 2
    callsub multimimc7
    uncover 1
    b==
    // src/PuyaContracts/mimc_hasher/contract.py:96-98
    // assert (
    //     multimimc7(mimc_hash_preimage_segment, constants, previous_r_value) == mimc_hash
    // ), "MIMC hash must match"
    assert // MIMC hash must match
    // src/PuyaContracts/mimc_hasher/contract.py:100
    // return True
    int 1
    return


// PuyaContracts.common.aggregate_gtxn_notes() -> bytes:
aggregate_gtxn_notes:
    // src/PuyaContracts/common.py:27-28
    // @subroutine
    // def aggregate_gtxn_notes() -> Bytes:
    proto 0 1
    // src/PuyaContracts/common.py:29
    // data: Bytes = Bytes(b"")
    byte 0x
    // src/PuyaContracts/common.py:30
    // group_size: UInt64 = Global.group_size
    global GroupSize
    // src/PuyaContracts/common.py:31
    // for i in urange(group_size):
    int 1
    assert // Step cannot be zero
    int 0

aggregate_gtxn_notes_for_header@1:
    // src/PuyaContracts/common.py:31
    // for i in urange(group_size):
    frame_dig 2
    frame_dig 1
    <
    bz aggregate_gtxn_notes_after_for@5
    frame_dig 2
    // src/PuyaContracts/common.py:32
    // note: Bytes = gtxn.Transaction(i).note
    gtxns Note
    // src/PuyaContracts/common.py:33
    // data += note
    frame_dig 0
    uncover 1
    concat
    frame_bury 0
    // src/PuyaContracts/common.py:31
    // for i in urange(group_size):
    frame_dig 2
    int 1
    +
    frame_bury 2
    b aggregate_gtxn_notes_for_header@1

aggregate_gtxn_notes_after_for@5:
    // src/PuyaContracts/common.py:34
    // return data
    frame_dig 0
    frame_bury 0
    retsub


// PuyaContracts.common.decode_dynamic_bytes(value: bytes) -> bytes:
decode_dynamic_bytes:
    // src/PuyaContracts/common.py:23-24
    // @subroutine
    // def decode_dynamic_bytes(value: Bytes) -> Bytes:
    proto 1 1
    // src/PuyaContracts/common.py:25
    // return substring(value, 2, value.length)
    frame_dig -1
    len
    frame_dig -1
    int 2
    uncover 2
    substring3
    retsub


// PuyaContracts.mimc_hasher.contract.multimimc7(arr: bytes, C: bytes, r: bytes) -> bytes:
multimimc7:
    // src/PuyaContracts/mimc_hasher/contract.py:58-59
    // @subroutine
    // def multimimc7(arr: Bytes, C: Bytes, r: BigUInt) -> BigUInt:
    proto 3 1
    // src/PuyaContracts/mimc_hasher/contract.py:62
    // n_inputs: UInt64 = arr.length // 32
    frame_dig -3
    len
    int 32
    /
    // src/PuyaContracts/mimc_hasher/contract.py:64
    // for i in urange(n_inputs):
    int 1
    assert // Step cannot be zero
    int 0

multimimc7_for_header@1:
    // src/PuyaContracts/mimc_hasher/contract.py:64
    // for i in urange(n_inputs):
    frame_dig 1
    frame_dig 0
    <
    bz multimimc7_after_for@5
    frame_dig 1
    // src/PuyaContracts/mimc_hasher/contract.py:65
    // arr_i_bytes: Bytes = extract(arr, 32 * i, 32)
    int 32
    uncover 1
    *
    frame_dig -3
    uncover 1
    int 32
    extract3
    // src/PuyaContracts/mimc_hasher/contract.py:60
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:67
    // input = arr_i % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:68
    // h = mimc7(input, r, C)
    dup
    frame_dig -1
    frame_dig -2
    callsub mimc7
    cover 1
    // src/PuyaContracts/mimc_hasher/contract.py:69
    // r = (r + input + h) % P
    frame_dig -1
    uncover 1
    b+
    uncover 1
    b+
    // src/PuyaContracts/mimc_hasher/contract.py:60
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:69
    // r = (r + input + h) % P
    b%
    frame_bury -1
    // src/PuyaContracts/mimc_hasher/contract.py:64
    // for i in urange(n_inputs):
    frame_dig 1
    int 1
    +
    frame_bury 1
    b multimimc7_for_header@1

multimimc7_after_for@5:
    // src/PuyaContracts/mimc_hasher/contract.py:70
    // return r
    frame_dig -1
    frame_bury 0
    retsub


// PuyaContracts.mimc_hasher.contract.mimc7(x: bytes, k: bytes, C: bytes) -> bytes:
mimc7:
    // src/PuyaContracts/mimc_hasher/contract.py:29-30
    // @subroutine
    // def mimc7(x: BigUInt, k: BigUInt, C: Bytes) -> BigUInt:
    proto 3 1
    int 0
    byte ""
    // src/PuyaContracts/mimc_hasher/contract.py:34
    // t: BigUInt = x + k
    frame_dig -3
    frame_dig -2
    b+
    // src/PuyaContracts/mimc_hasher/contract.py:35
    // for i in urange(91):
    int 1
    assert // Step cannot be zero
    int 0

mimc7_for_header@1:
    // src/PuyaContracts/mimc_hasher/contract.py:35
    // for i in urange(91):
    frame_dig 3
    int 91
    <
    bz mimc7_after_for@7
    frame_dig 3
    dup
    frame_bury 1
    // src/PuyaContracts/mimc_hasher/contract.py:36
    // if i > 0:
    int 0
    >
    frame_dig 2
    frame_bury 0
    bz mimc7_after_if_else@4
    // src/PuyaContracts/mimc_hasher/contract.py:37
    // const: Bytes = extract(C, 32 * i, 32)
    int 32
    frame_dig 1
    *
    frame_dig -1
    uncover 1
    int 32
    extract3
    // src/PuyaContracts/mimc_hasher/contract.py:39
    // t = t + const_bigUint + k
    frame_dig 2
    uncover 1
    b+
    frame_dig -2
    b+
    frame_bury 0

mimc7_after_if_else@4:
    frame_dig 0
    // src/PuyaContracts/mimc_hasher/contract.py:40
    // tMul = t * t
    dup
    dig 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:41
    // tMul = tMul % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:42
    // tMul = tMul * t
    dig 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:43
    // tMul = tMul % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:44
    // tMul = tMul * t
    dig 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:45
    // tMul = tMul % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:46
    // tMul = tMul * t
    dig 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:47
    // tMul = tMul % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:48
    // tMul = tMul * t
    dig 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:49
    // tMul = tMul % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:50
    // tMul = tMul * t
    uncover 1
    b*
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:51
    // t = tMul % P
    b%
    frame_bury 2
    // src/PuyaContracts/mimc_hasher/contract.py:35
    // for i in urange(91):
    frame_dig 3
    int 1
    +
    frame_bury 3
    b mimc7_for_header@1

mimc7_after_for@7:
    // src/PuyaContracts/mimc_hasher/contract.py:53
    // result: BigUInt = (t + k) % P
    frame_dig 2
    frame_dig -2
    b+
    // src/PuyaContracts/mimc_hasher/contract.py:31-32
    // # Fact: t**n MOD P = (t**(n-1) MOD P) * t
    // P: BigUInt = BigUInt(b254_r_prime_int)
    byte 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    // src/PuyaContracts/mimc_hasher/contract.py:53
    // result: BigUInt = (t + k) % P
    b%
    // src/PuyaContracts/mimc_hasher/contract.py:55
    // return result
    frame_bury 0
    retsub`;