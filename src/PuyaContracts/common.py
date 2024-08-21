from algopy import gtxn, Global, Bytes, subroutine, UInt64, urange

b254_r_prime_int: int = (
    21888242871839275222246405745257275088548364400416034343698204186575808495617
)

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
