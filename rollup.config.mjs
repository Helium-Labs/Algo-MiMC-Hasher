import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.mjs',
        format: 'es'
      }
    ],
    plugins: [
      json(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.esm.json',
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: 'dist/types'
          }
        }
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.cjs',
        format: 'cjs'
      }
    ],
    plugins: [
      json(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: 'dist/types'
          }
        }
      }),
    ]
  }
]
