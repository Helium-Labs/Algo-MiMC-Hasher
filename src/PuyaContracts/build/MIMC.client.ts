/* eslint-disable */
// @ts-nocheck
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  ABIAppCallArg,
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  AppCompilationResult,
  AppReference,
  AppState,
  AppStorageSchema,
  CoreAppCallArgs,
  RawAppCallArgs,
  TealTemplateParams,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom, SendTransactionParams } from '@algorandfoundation/algokit-utils/types/transaction'
import type { ABIResult, TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer, modelsv2 } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "create()void": {
      "call_config": {
        "no_op": "CREATE"
      }
    },
    "initialize()void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "multimimc7()void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "verify_hash(byte[],byte[])void": {
      "call_config": {
        "no_op": "CALL"
      }
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpQdXlhQ29udHJhY3RzLk1JTUMuY29udHJhY3QuTUlNQy5hcHByb3ZhbF9wcm9ncmFtOgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weToxOQogICAgLy8gY2xhc3MgTUlNQyhBUkM0Q29udHJhY3QpOgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWV0aG9kICJjcmVhdGUoKXZvaWQiCiAgICBtZXRob2QgImluaXRpYWxpemUoKXZvaWQiCiAgICBtZXRob2QgIm11bHRpbWltYzcoKXZvaWQiCiAgICBtZXRob2QgInZlcmlmeV9oYXNoKGJ5dGVbXSxieXRlW10pdm9pZCIKICAgIHVuY292ZXIgNAogICAgbWF0Y2ggbWFpbl9jcmVhdGVfcm91dGVAMSBtYWluX2luaXRpYWxpemVfcm91dGVAMiBtYWluX211bHRpbWltYzdfcm91dGVAMyBtYWluX3ZlcmlmeV9oYXNoX3JvdXRlQDQKICAgIGIgbWFpbl9zd2l0Y2hfY2FzZV9kZWZhdWx0QDUKCm1haW5fY3JlYXRlX3JvdXRlQDE6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjIwCiAgICAvLyBAYXJjNC5hYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIGludCBOb09wCiAgICA9PQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgYXNzZXJ0IC8vIGlzIGNyZWF0aW5nCiAgICBjYWxsc3ViIGNyZWF0ZQogICAgaW50IDEKICAgIHJldHVybgoKbWFpbl9pbml0aWFsaXplX3JvdXRlQDI6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjI0CiAgICAvLyBAYXJjNC5hYmltZXRob2QoKQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgaW50IE5vT3AKICAgID09CiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gaXMgbm90IGNyZWF0aW5nCiAgICBjYWxsc3ViIGluaXRpYWxpemUKICAgIGludCAxCiAgICByZXR1cm4KCm1haW5fbXVsdGltaW1jN19yb3V0ZUAzOgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo0NQogICAgLy8gQGFyYzQuYWJpbWV0aG9kKCkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIGludCBOb09wCiAgICA9PQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGlzIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiBtdWx0aW1pbWM3CiAgICBpbnQgMQogICAgcmV0dXJuCgptYWluX3ZlcmlmeV9oYXNoX3JvdXRlQDQ6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojg5CiAgICAvLyBAYXJjNC5hYmltZXRob2QoKQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgaW50IE5vT3AKICAgID09CiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gaXMgbm90IGNyZWF0aW5nCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjE5CiAgICAvLyBjbGFzcyBNSU1DKEFSQzRDb250cmFjdCk6CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6ODkKICAgIC8vIEBhcmM0LmFiaW1ldGhvZCgpCiAgICBjYWxsc3ViIHZlcmlmeV9oYXNoCiAgICBpbnQgMQogICAgcmV0dXJuCgptYWluX3N3aXRjaF9jYXNlX2RlZmF1bHRANToKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6MTkKICAgIC8vIGNsYXNzIE1JTUMoQVJDNENvbnRyYWN0KToKICAgIGVyciAvLyByZWplY3QgdHJhbnNhY3Rpb24KCgovLyBQdXlhQ29udHJhY3RzLk1JTUMuY29udHJhY3QuTUlNQy5jcmVhdGUoKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjIwLTIxCiAgICAvLyBAYXJjNC5hYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIC8vIGRlZiBjcmVhdGUoc2VsZikgLT4gTm9uZToKICAgIHByb3RvIDAgMAogICAgcmV0c3ViCgoKLy8gUHV5YUNvbnRyYWN0cy5NSU1DLmNvbnRyYWN0Lk1JTUMuaW5pdGlhbGl6ZSgpIC0+IHZvaWQ6CmluaXRpYWxpemU6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjI0LTI1CiAgICAvLyBAYXJjNC5hYmltZXRob2QoKQogICAgLy8gZGVmIGluaXRpYWxpemUoc2VsZikgLT4gTm9uZToKICAgIHByb3RvIDAgMAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weToyNi0yNwogICAgLy8gIyBSZWFkIGRhdGEgdG8gaGFzaCBmcm9tIG5vdGVzCiAgICAvLyBndHhuX25vdGVzOiBCeXRlcyA9IGFnZ3JlZ2F0ZV9ndHhuX25vdGVzKCkKICAgIGNhbGxzdWIgYWdncmVnYXRlX2d0eG5fbm90ZXMKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6MzAKICAgIC8vIG1pbWNfcGF5bG9hZC5taW1jX2hhc2hfcHJlaW1hZ2UuYnl0ZXMKICAgIGR1cAogICAgaW50IDgyCiAgICBleHRyYWN0X3VpbnQxNgogICAgY292ZXIgMQogICAgZHVwCiAgICBsZW4KICAgIGNvdmVyIDEKICAgIHVuY292ZXIgMgogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjI5LTMxCiAgICAvLyBtaW1jX2hhc2hfcHJlaW1hZ2U6IEJ5dGVzID0gZGVjb2RlX2R5bmFtaWNfYnl0ZXMoCiAgICAvLyAgICAgbWltY19wYXlsb2FkLm1pbWNfaGFzaF9wcmVpbWFnZS5ieXRlcwogICAgLy8gKQogICAgY2FsbHN1YiBkZWNvZGVfZHluYW1pY19ieXRlcwogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTozMgogICAgLy8gc2hhMjU2X2lkOiBCeXRlcyA9IHNoYTI1NihtaW1jX2hhc2hfcHJlaW1hZ2UpCiAgICBkdXAKICAgIHNoYTI1NgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTozNC0zNQogICAgLy8gIyBTZXQgdGhlIHIgdmFsdWUKICAgIC8vIHJfYm94ID0gQm94KEJpZ1VJbnQsIGtleT1jb25jYXQoYiJyIiwgc2hhMjU2X2lkKSkKICAgIGJ5dGUgMHg3MgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTozNgogICAgLy8gcl9ib3gudmFsdWUgPSBCaWdVSW50KDApCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgYnl0ZSAweAogICAgYm94X3B1dAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTozOC0zOQogICAgLy8gIyBTZXQgdGhlIGNvdW50ZXJzCiAgICAvLyBudW1fY2h1bmtzX2JveCA9IEJveChVSW50NjQsIGtleT1jb25jYXQoYiJudW1fY2h1bmtzIiwgc2hhMjU2X2lkKSkKICAgIGJ5dGUgMHg2ZTc1NmQ1ZjYzNjg3NTZlNmI3MwogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo0MAogICAgLy8gbnVtX2NodW5rc19ib3gudmFsdWUgPSBtaW1jX2hhc2hfcHJlaW1hZ2UubGVuZ3RoIC8vIDMyCiAgICB1bmNvdmVyIDIKICAgIGxlbgogICAgaW50IDMyCiAgICAvCiAgICBpdG9iCiAgICBib3hfcHV0CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjQyCiAgICAvLyBudW1fY29tcGxldGVkX2JveCA9IEJveChVSW50NjQsIGtleT1jb25jYXQoYiJudW1fY29tcGxldGVkIiwgc2hhMjU2X2lkKSkKICAgIGJ5dGUgMHg2ZTc1NmQ1ZjYzNmY2ZDcwNmM2NTc0NjU2NAogICAgdW5jb3ZlciAxCiAgICBjb25jYXQKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6NDMKICAgIC8vIG51bV9jb21wbGV0ZWRfYm94LnZhbHVlID0gVUludDY0KDApCiAgICBpbnQgMAogICAgaXRvYgogICAgYm94X3B1dAogICAgcmV0c3ViCgoKLy8gUHV5YUNvbnRyYWN0cy5jb21tb24uYWdncmVnYXRlX2d0eG5fbm90ZXMoKSAtPiBieXRlczoKYWdncmVnYXRlX2d0eG5fbm90ZXM6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9jb21tb24ucHk6MjctMjgKICAgIC8vIEBzdWJyb3V0aW5lCiAgICAvLyBkZWYgYWdncmVnYXRlX2d0eG5fbm90ZXMoKSAtPiBCeXRlczoKICAgIHByb3RvIDAgMQogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvY29tbW9uLnB5OjI5CiAgICAvLyBkYXRhOiBCeXRlcyA9IEJ5dGVzKGIiIikKICAgIGJ5dGUgMHgKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL2NvbW1vbi5weTozMAogICAgLy8gZ3JvdXBfc2l6ZTogVUludDY0ID0gR2xvYmFsLmdyb3VwX3NpemUKICAgIGdsb2JhbCBHcm91cFNpemUKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL2NvbW1vbi5weTozMQogICAgLy8gZm9yIGkgaW4gdXJhbmdlKGdyb3VwX3NpemUpOgogICAgaW50IDEKICAgIGFzc2VydCAvLyBTdGVwIGNhbm5vdCBiZSB6ZXJvCiAgICBpbnQgMAoKYWdncmVnYXRlX2d0eG5fbm90ZXNfZm9yX2hlYWRlckAxOgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvY29tbW9uLnB5OjMxCiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UoZ3JvdXBfc2l6ZSk6CiAgICBmcmFtZV9kaWcgMgogICAgZnJhbWVfZGlnIDEKICAgIDwKICAgIGJ6IGFnZ3JlZ2F0ZV9ndHhuX25vdGVzX2FmdGVyX2ZvckA1CiAgICBmcmFtZV9kaWcgMgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvY29tbW9uLnB5OjMyCiAgICAvLyBub3RlOiBCeXRlcyA9IGd0eG4uVHJhbnNhY3Rpb24oaSkubm90ZQogICAgZ3R4bnMgTm90ZQogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvY29tbW9uLnB5OjMzCiAgICAvLyBkYXRhICs9IG5vdGUKICAgIGZyYW1lX2RpZyAwCiAgICB1bmNvdmVyIDEKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSAwCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9jb21tb24ucHk6MzEKICAgIC8vIGZvciBpIGluIHVyYW5nZShncm91cF9zaXplKToKICAgIGZyYW1lX2RpZyAyCiAgICBpbnQgMQogICAgKwogICAgZnJhbWVfYnVyeSAyCiAgICBiIGFnZ3JlZ2F0ZV9ndHhuX25vdGVzX2Zvcl9oZWFkZXJAMQoKYWdncmVnYXRlX2d0eG5fbm90ZXNfYWZ0ZXJfZm9yQDU6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9jb21tb24ucHk6MzQKICAgIC8vIHJldHVybiBkYXRhCiAgICBmcmFtZV9kaWcgMAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCgovLyBQdXlhQ29udHJhY3RzLmNvbW1vbi5kZWNvZGVfZHluYW1pY19ieXRlcyh2YWx1ZTogYnl0ZXMpIC0+IGJ5dGVzOgpkZWNvZGVfZHluYW1pY19ieXRlczoKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL2NvbW1vbi5weToyMy0yNAogICAgLy8gQHN1YnJvdXRpbmUKICAgIC8vIGRlZiBkZWNvZGVfZHluYW1pY19ieXRlcyh2YWx1ZTogQnl0ZXMpIC0+IEJ5dGVzOgogICAgcHJvdG8gMSAxCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9jb21tb24ucHk6MjUKICAgIC8vIHJldHVybiBzdWJzdHJpbmcodmFsdWUsIDIsIHZhbHVlLmxlbmd0aCkKICAgIGZyYW1lX2RpZyAtMQogICAgbGVuCiAgICBmcmFtZV9kaWcgLTEKICAgIGludCAyCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIHJldHN1YgoKCi8vIFB1eWFDb250cmFjdHMuTUlNQy5jb250cmFjdC5NSU1DLm11bHRpbWltYzcoKSAtPiB2b2lkOgptdWx0aW1pbWM3OgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo0NS00NgogICAgLy8gQGFyYzQuYWJpbWV0aG9kKCkKICAgIC8vIGRlZiBtdWx0aW1pbWM3KHNlbGYpIC0+IE5vbmU6CiAgICBwcm90byAwIDAKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6NDcKICAgIC8vIGd0eG5fbm90ZXM6IEJ5dGVzID0gYWdncmVnYXRlX2d0eG5fbm90ZXMoKQogICAgY2FsbHN1YiBhZ2dyZWdhdGVfZ3R4bl9ub3RlcwogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo0OQogICAgLy8gc3RhcnRfaWR4OiBVSW50NjQgPSBidG9pKG1pbWNfcGF5bG9hZC5jb21wdXRlX3N0YXJ0X2lkeC5ieXRlcykKICAgIGR1cAogICAgaW50IDY0CiAgICBpbnQgOAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IEluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBidG9pCiAgICBjb3ZlciAxCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjUwCiAgICAvLyBlbmRfaWR4OiBVSW50NjQgPSBidG9pKG1pbWNfcGF5bG9hZC5jb21wdXRlX2VuZF9pZHguYnl0ZXMpCiAgICBkdXAKICAgIGludCA3MgogICAgaW50IDgKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBJbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgYnRvaQogICAgY292ZXIgMQogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo1MgogICAgLy8gbWltY19oYXNoOiBCeXRlcyA9IG1pbWNfcGF5bG9hZC5taW1jX2hhc2guYnl0ZXMKICAgIGR1cAogICAgaW50IDAKICAgIGludCAzMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IEluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBjb3ZlciAzCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjUzLTU1CiAgICAvLyBwcmV2aW91c19yX3ZhbHVlOiBCaWdVSW50ID0gQmlnVUludC5mcm9tX2J5dGVzKAogICAgLy8gICAgIG1pbWNfcGF5bG9hZC5wcmV2aW91c19yX3ZhbHVlLmJ5dGVzCiAgICAvLyApCiAgICBkdXAKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6NTQKICAgIC8vIG1pbWNfcGF5bG9hZC5wcmV2aW91c19yX3ZhbHVlLmJ5dGVzCiAgICBpbnQgMzIKICAgIGludCAzMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IEluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjUzLTU1CiAgICAvLyBwcmV2aW91c19yX3ZhbHVlOiBCaWdVSW50ID0gQmlnVUludC5mcm9tX2J5dGVzKAogICAgLy8gICAgIG1pbWNfcGF5bG9hZC5wcmV2aW91c19yX3ZhbHVlLmJ5dGVzCiAgICAvLyApCiAgICBjb3ZlciAxCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjU3CiAgICAvLyBtaW1jX3BheWxvYWQubWltY19oYXNoX3ByZWltYWdlLmJ5dGVzCiAgICBkdXAKICAgIGludCA4MgogICAgZXh0cmFjdF91aW50MTYKICAgIGNvdmVyIDEKICAgIGR1cAogICAgbGVuCiAgICBjb3ZlciAxCiAgICB1bmNvdmVyIDIKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo1Ni01OAogICAgLy8gbWltY19oYXNoX3ByZWltYWdlOiBCeXRlcyA9IGRlY29kZV9keW5hbWljX2J5dGVzKAogICAgLy8gICAgIG1pbWNfcGF5bG9hZC5taW1jX2hhc2hfcHJlaW1hZ2UuYnl0ZXMKICAgIC8vICkKICAgIGNhbGxzdWIgZGVjb2RlX2R5bmFtaWNfYnl0ZXMKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6NTkKICAgIC8vIHNoYTI1Nl9pZDogQnl0ZXMgPSBzaGEyNTYobWltY19oYXNoX3ByZWltYWdlKQogICAgc2hhMjU2CiAgICBkdXAKICAgIGNvdmVyIDUKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6NjEKICAgIC8vIG51bV9jaHVua3NfYm94ID0gQm94KFVJbnQ2NCwga2V5PWNvbmNhdChiIm51bV9jaHVua3MiLCBzaGEyNTZfaWQpKQogICAgYnl0ZSAweDZlNzU2ZDVmNjM2ODc1NmU2YjczCiAgICBkaWcgMQogICAgY29uY2F0CiAgICBjb3ZlciAyCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjYzLTY0CiAgICAvLyAjIHIgdmFsdWUgaW50ZWdyaXR5CiAgICAvLyByX2JveCA9IEJveChCaWdVSW50LCBrZXk9Y29uY2F0KGIiciIsIHNoYTI1Nl9pZCkpCiAgICBieXRlIDB4NzIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGR1cAogICAgY292ZXIgNwogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo2NwogICAgLy8gcHJldmlvdXNfcl92YWx1ZSA9PSByX2JveC52YWx1ZQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gY2hlY2sgQm94IGV4aXN0cwogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDEKICAgIGI9PQogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo2Ni02OAogICAgLy8gYXNzZXJ0ICgKICAgIC8vICAgICBwcmV2aW91c19yX3ZhbHVlID09IHJfYm94LnZhbHVlCiAgICAvLyApLCAiUHJldmlvdXMgciB2YWx1ZSBtdXN0IG1hdGNoIHRoYXQgcHJldmlvdXNseSBjb21wdXRlZCBsYXN0IHJvdW5kIgogICAgYXNzZXJ0IC8vIFByZXZpb3VzIHIgdmFsdWUgbXVzdCBtYXRjaCB0aGF0IHByZXZpb3VzbHkgY29tcHV0ZWQgbGFzdCByb3VuZAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo3MC03MQogICAgLy8gIyBzdGFydCBpbmRleCBpbnRlZ3JpdHkKICAgIC8vIG51bV9jb21wbGV0ZWRfYm94ID0gQm94KFVJbnQ2NCwga2V5PWNvbmNhdChiIm51bV9jb21wbGV0ZWQiLCBzaGEyNTZfaWQpKQogICAgYnl0ZSAweDZlNzU2ZDVmNjM2ZjZkNzA2YzY1NzQ2NTY0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo3MgogICAgLy8gYXNzZXJ0IG51bV9jb21wbGV0ZWRfYm94LnZhbHVlID09IHN0YXJ0X2lkeCwgIlN0YXJ0IGluZGV4IG11c3QgYmUgY29udGlndW91cyIKICAgIGR1cAogICAgYm94X2dldAogICAgY292ZXIgMQogICAgYnRvaQogICAgdW5jb3ZlciAxCiAgICBhc3NlcnQgLy8gY2hlY2sgQm94IGV4aXN0cwogICAgZGlnIDUKICAgID09CiAgICBhc3NlcnQgLy8gU3RhcnQgaW5kZXggbXVzdCBiZSBjb250aWd1b3VzCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojc0LTc1CiAgICAvLyAjIGVuZCBpbmR4IGludGVncml0eQogICAgLy8gYXNzZXJ0IHN0YXJ0X2lkeCA8IGVuZF9pZHgsICJTdGFydCBpZHggbXVzdCBiZSBsZXNzIHRoYW4gZW5kIGlkeCIKICAgIHVuY292ZXIgNAogICAgZGlnIDQKICAgIDwKICAgIGFzc2VydCAvLyBTdGFydCBpZHggbXVzdCBiZSBsZXNzIHRoYW4gZW5kIGlkeAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo3NgogICAgLy8gYXNzZXJ0IGVuZF9pZHggPD0gbnVtX2NodW5rc19ib3gudmFsdWUKICAgIGRpZyAyCiAgICBib3hfZ2V0CiAgICBjb3ZlciAxCiAgICBidG9pCiAgICB1bmNvdmVyIDEKICAgIGFzc2VydCAvLyBjaGVjayBCb3ggZXhpc3RzCiAgICBkaWcgNAogICAgdW5jb3ZlciAxCiAgICA8PQogICAgYXNzZXJ0CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojc4LTc5CiAgICAvLyAjIFVwZGF0ZSByIHZhbHVlCiAgICAvLyByX2JveC52YWx1ZSA9IEJpZ1VJbnQuZnJvbV9ieXRlcyhtaW1jX2hhc2gpCiAgICB1bmNvdmVyIDQKICAgIGRpZyAyCiAgICBib3hfZGVsCiAgICBwb3AKICAgIHVuY292ZXIgMgogICAgdW5jb3ZlciAxCiAgICBib3hfcHV0CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5OjgxLTgyCiAgICAvLyAjIFVwZGF0ZSBudW1iZXIgb2YgaGFzaGVkIGNodW5rcwogICAgLy8gbnVtX2NvbXBsZXRlZF9ib3gudmFsdWUgPSBlbmRfaWR4CiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGRpZyAxCiAgICB1bmNvdmVyIDEKICAgIGJveF9wdXQKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6ODQtODUKICAgIC8vICMgUmVjb3JkIGhhc2ggcmVzdWx0IG9uY2UgYWxsIGNodW5rcyBoYXNoZWQKICAgIC8vIGlmIG51bV9jb21wbGV0ZWRfYm94LnZhbHVlID49IG51bV9jaHVua3NfYm94LnZhbHVlOgogICAgYm94X2dldAogICAgY292ZXIgMQogICAgYnRvaQogICAgY292ZXIgMQogICAgYXNzZXJ0IC8vIGNoZWNrIEJveCBleGlzdHMKICAgIHVuY292ZXIgMQogICAgYm94X2dldAogICAgY292ZXIgMQogICAgYnRvaQogICAgdW5jb3ZlciAxCiAgICBhc3NlcnQgLy8gY2hlY2sgQm94IGV4aXN0cwogICAgPj0KICAgIGJ6IG11bHRpbWltYzdfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojg2CiAgICAvLyByZXN1bHRfYm94ID0gQm94KEJ5dGVzLCBrZXk9Y29uY2F0KGIicmVzdWx0Iiwgc2hhMjU2X2lkKSkKICAgIGJ5dGUgMHg3MjY1NzM3NTZjNzQKICAgIGZyYW1lX2RpZyAwCiAgICBjb25jYXQKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6ODcKICAgIC8vIHJlc3VsdF9ib3gudmFsdWUgPSByX2JveC52YWx1ZS5ieXRlcwogICAgZnJhbWVfZGlnIDEKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBjaGVjayBCb3ggZXhpc3RzCiAgICBkaWcgMQogICAgYm94X2RlbAogICAgcG9wCiAgICBib3hfcHV0CgptdWx0aW1pbWM3X2FmdGVyX2lmX2Vsc2VAMjoKICAgIHJldHN1YgoKCi8vIFB1eWFDb250cmFjdHMuTUlNQy5jb250cmFjdC5NSU1DLnZlcmlmeV9oYXNoKGRhdGFfc2hhMjU2OiBieXRlcywgZGF0YV9taW1jOiBieXRlcykgLT4gdm9pZDoKdmVyaWZ5X2hhc2g6CiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojg5LTkwCiAgICAvLyBAYXJjNC5hYmltZXRob2QoKQogICAgLy8gZGVmIHZlcmlmeV9oYXNoKHNlbGYsIGRhdGFfc2hhMjU2OiBCeXRlcywgZGF0YV9taW1jOiBCeXRlcykgLT4gTm9uZToKICAgIHByb3RvIDIgMAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo5MS05MgogICAgLy8gIyBBc3NlcnQgdGhlIGNvbXB1dGF0aW9uIGlzIGNvbXBsZXRlCiAgICAvLyBudW1fY2h1bmtzX2JveCA9IEJveChVSW50NjQsIGtleT1jb25jYXQoYiJudW1fY2h1bmtzIiwgZGF0YV9zaGEyNTYpKQogICAgYnl0ZSAweDZlNzU2ZDVmNjM2ODc1NmU2YjczCiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo5MwogICAgLy8gbnVtX2NvbXBsZXRlZF9ib3ggPSBCb3goVUludDY0LCBrZXk9Y29uY2F0KGIibnVtX2NvbXBsZXRlZCIsIGRhdGFfc2hhMjU2KSkKICAgIGJ5dGUgMHg2ZTc1NmQ1ZjYzNmY2ZDcwNmM2NTc0NjU2NAogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIC8vIHNyYy9QdXlhQ29udHJhY3RzL01JTUMvY29udHJhY3QucHk6OTUKICAgIC8vIG51bV9jb21wbGV0ZWRfYm94LnZhbHVlID49IG51bV9jaHVua3NfYm94LnZhbHVlCiAgICBib3hfZ2V0CiAgICBjb3ZlciAxCiAgICBidG9pCiAgICBjb3ZlciAxCiAgICBhc3NlcnQgLy8gY2hlY2sgQm94IGV4aXN0cwogICAgdW5jb3ZlciAxCiAgICBib3hfZ2V0CiAgICBjb3ZlciAxCiAgICBidG9pCiAgICB1bmNvdmVyIDEKICAgIGFzc2VydCAvLyBjaGVjayBCb3ggZXhpc3RzCiAgICA+PQogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo5NC05NgogICAgLy8gYXNzZXJ0ICgKICAgIC8vICAgICBudW1fY29tcGxldGVkX2JveC52YWx1ZSA+PSBudW1fY2h1bmtzX2JveC52YWx1ZQogICAgLy8gKSwgIk51bWJlciBvZiBjb21wdXRlIGl0ZXJhdGlvbnMgbXVzdCBhdCBsZWFzdCBleGNlZWQgbnVtYmVyIG9mIDMyIGJ5dGUgY2h1bmtzIgogICAgYXNzZXJ0IC8vIE51bWJlciBvZiBjb21wdXRlIGl0ZXJhdGlvbnMgbXVzdCBhdCBsZWFzdCBleGNlZWQgbnVtYmVyIG9mIDMyIGJ5dGUgY2h1bmtzCiAgICAvLyBzcmMvUHV5YUNvbnRyYWN0cy9NSU1DL2NvbnRyYWN0LnB5Ojk3LTk4CiAgICAvLyAjIEFzc2VydHMgdGhlIGhhc2hlcyBhcmUgc2hhMjU2L21pbWMgb2YgdGhlIGRhdGEKICAgIC8vIHJlc3VsdF9ib3ggPSBCb3goQnl0ZXMsIGtleT1jb25jYXQoYiJyZXN1bHQiLCBkYXRhX3NoYTI1NikpCiAgICBieXRlIDB4NzI2NTczNzU2Yzc0CiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weTo5OQogICAgLy8gYXNzZXJ0IHJlc3VsdF9ib3gudmFsdWUgPT0gZGF0YV9taW1jLCAiTUlNQyBoYXNoIG1hdGNoZXMgY29tcHV0ZWQgdmFsdWUiCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gY2hlY2sgQm94IGV4aXN0cwogICAgZnJhbWVfZGlnIC0xCiAgICA9PQogICAgYXNzZXJ0IC8vIE1JTUMgaGFzaCBtYXRjaGVzIGNvbXB1dGVkIHZhbHVlCiAgICByZXRzdWIK",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpQdXlhQ29udHJhY3RzLk1JTUMuY29udHJhY3QuTUlNQy5jbGVhcl9zdGF0ZV9wcm9ncmFtOgogICAgLy8gc3JjL1B1eWFDb250cmFjdHMvTUlNQy9jb250cmFjdC5weToxOQogICAgLy8gY2xhc3MgTUlNQyhBUkM0Q29udHJhY3QpOgogICAgaW50IDEKICAgIHJldHVybgo="
  },
  "state": {
    "global": {
      "num_byte_slices": 0,
      "num_uints": 0
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 0
    }
  },
  "schema": {
    "global": {
      "declared": {},
      "reserved": {}
    },
    "local": {
      "declared": {},
      "reserved": {}
    }
  },
  "contract": {
    "name": "MIMC",
    "methods": [
      {
        "name": "create",
        "args": [],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "initialize",
        "args": [],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "multimimc7",
        "args": [],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "verify_hash",
        "args": [
          {
            "type": "byte[]",
            "name": "data_sha256"
          },
          {
            "type": "byte[]",
            "name": "data_mimc"
          }
        ],
        "returns": {
          "type": "void"
        }
      }
    ],
    "networks": {}
  },
  "bare_call_config": {}
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt.
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

export type AppCreateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult> & AppReference
export type AppUpdateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult>

export type AppClientComposeCallCoreParams = Omit<AppClientCallCoreParams, 'sendParams'> & {
  sendParams?: Omit<SendTransactionParams, 'skipSending' | 'atc' | 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources'>
}
export type AppClientComposeExecuteParams = Pick<SendTransactionParams, 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources' | 'suppressLog'>

export type IncludeSchema = {
  /**
   * Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.
   */
  schema?: Partial<AppStorageSchema>
}

/**
 * Defines the types of available calls and state of the Mimc smart contract.
 */
export type Mimc = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'create()void' | 'create', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
    & Record<'initialize()void' | 'initialize', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
    & Record<'multimimc7()void' | 'multimimc7', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
    & Record<'verify_hash(byte[],byte[])void' | 'verify_hash', {
      argsObj: {
        dataSha256: Uint8Array
        dataMimc: Uint8Array
      }
      argsTuple: [dataSha256: Uint8Array, dataMimc: Uint8Array]
      returns: void
    }>
}
/**
 * Defines the possible abi call signatures
 */
export type MimcSig = keyof Mimc['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends MimcSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the Mimc smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends MimcSig> = Mimc['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the Mimc smart contract to the method's return type
 */
export type MethodReturn<TSignature extends MimcSig> = Mimc['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type MimcCreateCalls = (typeof MimcCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type MimcCreateCallParams =
  | (TypedCallParams<'create()void'> & (OnCompleteNoOp))
/**
 * Defines arguments required for the deploy method.
 */
export type MimcDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: MimcCreateCalls) => MimcCreateCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class MimcCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the MIMC smart contract using the create()void ABI method
       *
       * @param args Any args for the contract call
       * @param params Any additional parameters for the call
       * @returns A TypedCallParams object for the call
       */
      create(args: MethodArgs<'create()void'>, params: AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
        return {
          method: 'create()void' as const,
          methodArgs: Array.isArray(args) ? args : [],
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the initialize()void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static initialize(args: MethodArgs<'initialize()void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'initialize()void' as const,
      methodArgs: Array.isArray(args) ? args : [],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the multimimc7()void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static multimimc7(args: MethodArgs<'multimimc7()void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'multimimc7()void' as const,
      methodArgs: Array.isArray(args) ? args : [],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the verify_hash(byte[],byte[])void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static verifyHash(args: MethodArgs<'verify_hash(byte[],byte[])void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'verify_hash(byte[],byte[])void' as const,
      methodArgs: Array.isArray(args) ? args : [args.dataSha256, args.dataMimc],
      ...params,
    }
  }
}

/**
 * A client to make calls to the MIMC smart contract
 */
export class MimcClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `MimcClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn, TResult extends AppCallTransactionResult = AppCallTransactionResult>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> & TResult {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue } as AppCallTransactionResultOfType<TReturn> & TResult
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof Mimc['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the MIMC smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: MimcDeployArgs & AppClientDeployCoreParams & IncludeSchema = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(MimcCallFactory.create)
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the MIMC smart contract using the create()void ABI method.
       *
       * @param args The arguments for the smart contract call
       * @param params Any additional parameters for the call
       * @returns The create result
       */
      async create(args: MethodArgs<'create()void'>, params: AppClientCallCoreParams & AppClientCompilationParams & IncludeSchema & CoreAppCallArgs & (OnCompleteNoOp) = {}) {
        return $this.mapReturnValue<MethodReturn<'create()void'>, AppCreateCallTransactionResult>(await $this.appClient.create(MimcCallFactory.create.create(args, params)))
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the MIMC smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the initialize()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public initialize(args: MethodArgs<'initialize()void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(MimcCallFactory.initialize(args, params))
  }

  /**
   * Calls the multimimc7()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public multimimc7(args: MethodArgs<'multimimc7()void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(MimcCallFactory.multimimc7(args, params))
  }

  /**
   * Calls the verify_hash(byte[],byte[])void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public verifyHash(args: MethodArgs<'verify_hash(byte[],byte[])void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(MimcCallFactory.verifyHash(args, params))
  }

  public compose(): MimcComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      initialize(args: MethodArgs<'initialize()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.initialize(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      multimimc7(args: MethodArgs<'multimimc7()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.multimimc7(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      verifyHash(args: MethodArgs<'verify_hash(byte[],byte[])void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.verifyHash(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async simulate(options?: SimulateOptions) {
        await promiseChain
        const result = await atc.simulate(client.algod, new modelsv2.SimulateRequest({ txnGroups: [], ...options }))
        return {
          ...result,
          returns: result.methodResults?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      },
      async execute(sendParams?: AppClientComposeExecuteParams) {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as MimcComposer
  }
}
export type MimcComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the initialize()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  initialize(args: MethodArgs<'initialize()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): MimcComposer<[...TReturns, MethodReturn<'initialize()void'>]>

  /**
   * Calls the multimimc7()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  multimimc7(args: MethodArgs<'multimimc7()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): MimcComposer<[...TReturns, MethodReturn<'multimimc7()void'>]>

  /**
   * Calls the verify_hash(byte[],byte[])void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  verifyHash(args: MethodArgs<'verify_hash(byte[],byte[])void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): MimcComposer<[...TReturns, MethodReturn<'verify_hash(byte[],byte[])void'>]>

  /**
   * Makes a clear_state call to an existing instance of the MIMC smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs): MimcComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): MimcComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(options?: SimulateOptions): Promise<MimcComposerSimulateResult<TReturns>>
  /**
   * Executes the transaction group and returns the results
   */
  execute(sendParams?: AppClientComposeExecuteParams): Promise<MimcComposerResults<TReturns>>
}
export type SimulateOptions = Omit<ConstructorParameters<typeof modelsv2.SimulateRequest>[0], 'txnGroups'>
export type MimcComposerSimulateResult<TReturns extends [...any[]]> = {
  returns: TReturns
  methodResults: ABIResult[]
  simulateResponse: modelsv2.SimulateResponse
}
export type MimcComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
