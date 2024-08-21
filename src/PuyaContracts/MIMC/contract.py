from algopy import (
    ARC4Contract,
    arc4,
    Bytes,
    UInt64,
    Global,
    subroutine,
    urange,
    BigUInt,
    Box,
)
from algopy.op import sha256, extract, concat
from ..common import b254_r_prime_int, aggregate_gtxn_notes, min_value

# Constants
mimc7_constants_sha256_hash: str = "w14x2USkTeC2FqzT08l1Mub5hic3iA9MUkJDZpp5hp0="

"""
Cost of mimc7 for one 32 byte input:
Per loop:
b%: 7 * 20 = 140
b*: 6 * 20 = 120
b+: 2 * 10 = 20
extract: 1
Total: 281

Across all 91 loops:
91 loops: 281*91
Total: ~26,000
"""
# 32 byte constants, concatenated side by side, with width 32 (left padding)
mimc_constants: str = (
    "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"
)


class MIMC(ARC4Contract):
    @arc4.abimethod(create="require")
    def create(self) -> None:
        pass

    @arc4.abimethod()
    def initialize(self) -> None:
        # Read data to hash from notes
        data_to_hash: Bytes = aggregate_gtxn_notes()
        data_sha256: Bytes = sha256(data_to_hash)
        data_box = Box(Bytes, key=concat(b"data", data_sha256))
        data_box.value = data_to_hash
        # Set the r value
        r_box = Box(BigUInt, key=concat(b"r", data_sha256))
        r_box.value = BigUInt(0)
        # Set the counters
        num_chunks_box = Box(UInt64, key=concat(b"num_chunks", data_sha256))
        num_chunks_box.value = (data_to_hash.length // 32) + 1

        num_completed_box = Box(UInt64, key=concat(b"num_completed", data_sha256))
        num_completed_box.value = UInt64(0)

    @subroutine
    def mimc7(self, x: BigUInt, k: BigUInt) -> BigUInt:
        C: Bytes = Bytes.from_base64(mimc_constants)
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

    @arc4.abimethod()
    def multimimc7(self, data_sha256: Bytes) -> None:
        P: BigUInt = BigUInt(b254_r_prime_int)
        r_box = Box(BigUInt, key=concat(b"r", data_sha256))

        # As many hash rounds as permitted by the compute budget
        available_budget: UInt64 = (Global.group_size - 1) * 20_000
        n_loops: UInt64 = available_budget // 27_000
        input: BigUInt = BigUInt(0)

        num_chunks_box = Box(UInt64, key=concat(b"num_chunks", data_sha256))
        num_completed_box = Box(UInt64, key=concat(b"num_completed", data_sha256))

        assert (
            num_chunks_box.value >= num_completed_box.value
        ), "Hash computation must be incomplete"
        data_box = Box(Bytes, key=concat(b"data", data_sha256))
        assert data_box.value.length % 32 == UInt64(0), "Must be a multiple of 32"
        assert data_box.value.length != 0, "Must contain some data"

        start_idx: UInt64 = num_completed_box.value
        end_idx: UInt64 = min_value(start_idx + n_loops, num_chunks_box.value)
        for i in urange(start_idx, end_idx):
            arr_i: BigUInt = BigUInt.from_bytes(extract(data_box.value, 32 * i, 32))
            input = arr_i % P
            h: BigUInt = self.mimc7(input, r_box.value)
            r_box.value = (r_box.value + input + h) % P

        num_completed_box.value += n_loops

        # Write result to global storage when computed
        if num_completed_box.value >= num_chunks_box.value:
            result_box = Box(Bytes, key=concat(b"result", data_sha256))
            result_box.value = r_box.value.bytes

    @arc4.abimethod()
    def verify_hash(self, data_sha256: Bytes, data_mimc: Bytes) -> None:
        # Assert the computation is complete
        num_chunks_box = Box(UInt64, key=concat(b"num_chunks", data_sha256))
        num_completed_box = Box(UInt64, key=concat(b"num_completed", data_sha256))
        assert (
            num_completed_box.value >= num_chunks_box.value
        ), "Number of compute iterations must at least exceed number of 32 byte chunks"
        # Asserts the hashes are sha256/mimc of the data
        result_box = Box(Bytes, key=concat(b"result", data_sha256))
        assert result_box.value == data_mimc, "MIMC hash matches computed value"
