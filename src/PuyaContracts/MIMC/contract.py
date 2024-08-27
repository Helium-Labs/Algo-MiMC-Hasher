from algopy import (
    ARC4Contract,
    arc4,
    Bytes,
    UInt64,
    BigUInt,
    Box,
)
from algopy.op import sha256, concat, btoi
from ..common import (
    aggregate_gtxn_notes,
    decode_dynamic_bytes,
    MIMCPayload,
)

# Constants
mimc7_constants_sha256_hash: str = "w14x2USkTeC2FqzT08l1Mub5hic3iA9MUkJDZpp5hp0="

class MIMC(ARC4Contract):
    @arc4.abimethod(create="require")
    def create(self) -> None:
        pass

    @arc4.abimethod()
    def initialize(self) -> None:
        # Read data to hash from notes
        gtxn_notes: Bytes = aggregate_gtxn_notes()
        mimc_payload: MIMCPayload = MIMCPayload.from_bytes(gtxn_notes)
        mimc_hash_preimage: Bytes = decode_dynamic_bytes(
            mimc_payload.mimc_hash_preimage.bytes
        )
        sha256_id: Bytes = sha256(mimc_hash_preimage)

        # Set the r value
        r_box = Box(BigUInt, key=concat(b"r", sha256_id))
        r_box.value = BigUInt(0)

        # Set the counters
        num_chunks_box = Box(UInt64, key=concat(b"num_chunks", sha256_id))
        num_chunks_box.value = mimc_hash_preimage.length // 32

        num_completed_box = Box(UInt64, key=concat(b"num_completed", sha256_id))
        num_completed_box.value = UInt64(0)

    @arc4.abimethod()
    def multimimc7(self) -> None:
        gtxn_notes: Bytes = aggregate_gtxn_notes()
        mimc_payload: MIMCPayload = MIMCPayload.from_bytes(gtxn_notes)
        start_idx: UInt64 = btoi(mimc_payload.compute_start_idx.bytes)
        end_idx: UInt64 = btoi(mimc_payload.compute_end_idx.bytes)

        mimc_hash: Bytes = mimc_payload.mimc_hash.bytes
        previous_r_value: BigUInt = BigUInt.from_bytes(
            mimc_payload.previous_r_value.bytes
        )
        mimc_hash_preimage: Bytes = decode_dynamic_bytes(
            mimc_payload.mimc_hash_preimage.bytes
        )
        sha256_id: Bytes = sha256(mimc_hash_preimage)

        num_chunks_box = Box(UInt64, key=concat(b"num_chunks", sha256_id))

        # r value integrity
        r_box = Box(BigUInt, key=concat(b"r", sha256_id))

        assert (
            previous_r_value == r_box.value
        ), "Previous r value must match that previously computed last round"

        # start index integrity
        num_completed_box = Box(UInt64, key=concat(b"num_completed", sha256_id))
        assert num_completed_box.value == start_idx, "Start index must be contiguous"

        # end indx integrity
        assert start_idx < end_idx, "Start idx must be less than end idx"
        assert end_idx <= num_chunks_box.value

        # Update r value
        r_box.value = BigUInt.from_bytes(mimc_hash)

        # Update number of hashed chunks
        num_completed_box.value = end_idx

        # Record hash result once all chunks hashed
        if num_completed_box.value >= num_chunks_box.value:
            result_box = Box(Bytes, key=concat(b"result", sha256_id))
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
