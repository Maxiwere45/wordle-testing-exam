import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: [
                'public/**',
                'vitest.config.ts',
                'src/vite-env.d.ts',
                'src/modules/repositories/**',
                'src/main.ts',
            ],
        },
    },
});