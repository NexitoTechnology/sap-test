import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sap': {
        target: 'https://vhtdsds4ci.hec.tmgrupoinmobiliario.com:44300',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            const credentials = Buffer.from('APP_COMPRAS:f*K5%Hh%lD@73f4Qbmf46A&wQ').toString('base64');
            proxyReq.setHeader('Authorization', `Basic ${credentials}`);
          });
        }
      }
    }
  }
});