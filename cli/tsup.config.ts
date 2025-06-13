import { defineConfig } from 'tsup';
import { platform } from 'node:os';

// Only use chmod on Unix-like systems
const isWindows = platform() === 'win32';
const onSuccessCommand = isWindows ? undefined : 'chmod +x dist/zopio.js';

export default defineConfig({
  entry: ['src/zopio.ts'],
  format: ['esm'],
  target: 'node16',
  clean: true,
  dts: false, // Disable declaration file generation
  sourcemap: true,
  splitting: false,
  minify: false,
  bundle: true,
  shims: true,
  external: ['commander', 'chalk', 'inquirer', 'ora'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  outDir: 'dist',
  onSuccess: onSuccessCommand,
});
