import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/User/',
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@components': path.resolve(__dirname, './src/components'),
        },
    },
});
