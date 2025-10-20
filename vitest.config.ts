import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        exclude: [
            'tests/e2e/**',
            'node_modules/**',
            '.next/**',
            'tools/foundry-motion/**',
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
})

