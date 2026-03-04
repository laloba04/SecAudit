import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        allowedHosts: [
            'localhost',
            'jorge-nonimbricating-kolton.ngrok-free.dev'
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            },
        },
    },
})
