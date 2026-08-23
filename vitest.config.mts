import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const rootDir = import.meta.dirname

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      // Next.js'in server-only koruması test ortamında devre dışı bırakılır.
      'server-only': path.resolve(rootDir, './tests/stubs/server-only.ts'),
      '@': path.resolve(rootDir, './src'),
    },
  },
})
