from algopy import arc4, gtxn, Global, Bytes, subroutine, UInt64, urange
from algopy.op import substring


import typing as t

Bytes32: t.TypeAlias = arc4.StaticArray[arc4.Byte, t.Literal[32]]


class MIMCPayload(arc4.Struct):
    mimc_hash: Bytes32
    previous_r_value: Bytes32
    compute_start_idx: arc4.UInt64
    compute_end_idx: arc4.UInt64
    constants: arc4.DynamicBytes
    mimc_hash_preimage: arc4.DynamicBytes


b254_r_prime_int: int = (
    21888242871839275222246405745257275088548364400416034343698204186575808495617
)

@subroutine
def decode_dynamic_bytes(value: Bytes) -> Bytes:
    return substring(value, 2, value.length)

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
