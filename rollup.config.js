import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

const external = ['stream', 'util', 'events', 'buffer'];

const entries = [
  'src/index.ts',
  'src/guards/index.ts',
  'src/converters/index.ts',
  'src/validators/index.ts',
];

const plugins = [
  esbuild({
    target: 'es2020',
    minify: false,
    sourcemap: true,
  }),
];

export default defineConfig([
  // ESM builds
  ...entries.map((input) => ({
    input,
    output: {
      file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
      format: 'es',
      sourcemap: true,
    },
    external,
    plugins,
  })),
  // CJS builds
  ...entries.map((input) => ({
    input,
    output: {
      file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins,
  })),
  // UMD build for main entry
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/kindof.umd.js',
      format: 'umd',
      name: 'kindOf',
      sourcemap: true,
    },
    external,
    plugins: [
      esbuild({
        target: 'es2015',
        minify: false,
        sourcemap: true,
      }),
    ],
  },
  // Minified UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/kindof.umd.min.js',
      format: 'umd',
      name: 'kindOf',
      sourcemap: true,
    },
    external,
    plugins: [
      esbuild({
        target: 'es2015',
        minify: true,
        sourcemap: true,
      }),
    ],
  },
  // TypeScript declarations
  ...entries.map((input) => ({
    input,
    output: {
      file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
    },
    plugins: [dts()],
  })),
]);