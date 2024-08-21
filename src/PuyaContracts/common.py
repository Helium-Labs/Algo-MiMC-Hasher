import algopy
from algopy import gtxn, Txn, Global, arc4, Bytes, subroutine, BigUInt, UInt64, urange
from algopy.op import substring, bzero, concat, err

import typing as t

Bytes32: t.TypeAlias = arc4.StaticArray[arc4.Byte, t.Literal[32]]
Bytes64: t.TypeAlias = arc4.StaticArray[arc4.Byte, t.Literal[64]]
Bytes128: t.TypeAlias = arc4.StaticArray[arc4.Byte, t.Literal[128]]

b254_q_prime_int: int = (
    21888242871839275222246405745257275088696311157297823662689037894645226208583
)

b254_r_prime_int: int = (
    21888242871839275222246405745257275088548364400416034343698204186575808495617
)


class PublicInputParams(arc4.Struct):
    sub_poseidon_hash: Bytes32
    nonce: Bytes32
    iss_poseidon_hash: Bytes32
    aud_poseidon_hash: Bytes32
    exp_ascii: Bytes32
    mod_mimc7_hash: Bytes32


class VerifierParams(arc4.Struct):
    alpha: Bytes64
    beta: Bytes128
    gamma: Bytes128
    delta: Bytes128
    ic: arc4.DynamicBytes


class ContractAccountParams(arc4.Struct):
    eph_pk: Bytes32
    exp_validity_rounds: arc4.UInt64
    public_input: arc4.DynamicBytes


@subroutine
def decode_dynamic_bytes(value: Bytes) -> Bytes:
    return substring(value, 2, value.length)


@subroutine
def pad(value: Bytes, width: UInt64) -> Bytes:
    assert value.length <= width, "Width must be wider than value"
    pad_length: UInt64 = width - value.length
    padding: Bytes = bzero(pad_length)
    padded: Bytes = concat(padding, value)
    return padded


@subroutine
def get_value_from_bytes_mod_bn254_r(bytes_value: Bytes) -> Bytes:
    assert bytes_value.length <= 32, "Must be at most 256 bits"
    value: BigUInt = BigUInt.from_bytes(bytes_value)
    b254_r_prime: BigUInt = BigUInt(b254_r_prime_int)
    value %= b254_r_prime
    # Pad to be 32 length, with padding on the left
    value_bytes_padded_width32: Bytes = pad(value.bytes, UInt64(32))
    return value_bytes_padded_width32


@subroutine
def get_uint64_from_ascii_number(char_byte: Bytes) -> UInt64:
    if char_byte == Bytes.from_hex("30"):
        return UInt64(0)
    if char_byte == Bytes.from_hex("31"):
        return UInt64(1)
    if char_byte == Bytes.from_hex("32"):
        return UInt64(2)
    if char_byte == Bytes.from_hex("33"):
        return UInt64(3)
    if char_byte == Bytes.from_hex("34"):
        return UInt64(4)
    if char_byte == Bytes.from_hex("35"):
        return UInt64(5)
    if char_byte == Bytes.from_hex("36"):
        return UInt64(6)
    if char_byte == Bytes.from_hex("37"):
        return UInt64(7)
    if char_byte == Bytes.from_hex("38"):
        return UInt64(8)
    if char_byte == Bytes.from_hex("39"):
        return UInt64(9)
    err()


@subroutine
def get_uint64_from_little_endian_ascii(ascii: Bytes) -> UInt64:
    pow: UInt64 = UInt64(0)
    zero_byte: Bytes = bzero(1)
    value: UInt64 = UInt64(0)
    for i in urange(ascii.length):
        char_byte: Bytes = ascii[i]
        if char_byte == zero_byte:
            assert pow == 0, "Power must be equal to zero"
            continue
        c: UInt64 = get_uint64_from_ascii_number(char_byte)
        term: UInt64 = c * (UInt64(10) ** pow)
        value += term
        pow += 1
    return value


@subroutine
def aggregate_gtxn_notes() -> Bytes:
    data: Bytes = Bytes(b"")
    group_size: UInt64 = Global.group_size
    for i in urange(group_size):
        note: Bytes = gtxn.Transaction(i).note
        data += note
    return data


@subroutine
def min_value(a: UInt64, b: UInt64) -> UInt64:
    if a <= b:
        return a
    return b


@subroutine
def assert_sender_is_creator() -> None:
    assert Txn.sender == Global.creator_address, "Only the creator can call this method"


@subroutine
def assert_no_rekey() -> None:
    assert Txn.rekey_to == Global.zero_address, "There is no ability to rekey"
