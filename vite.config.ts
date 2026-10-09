import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function roverProxyPlugin(): Plugin {
  return {
    name: 'resq-rover-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/rover')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const targetHost = urlObj.searchParams.get('ip') || urlObj.searchParams.get('target') || '192.168.4.1';
          const cleanHost = targetHost.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

          // 1. Status / Ping / Heartbeat route
          if (
            req.url.startsWith('/api/rover/status') ||
            req.url.startsWith('/api/rover/ping') ||
            req.url.startsWith('/api/rover/heartbeat')
          ) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            try {
              const espRes = await fetch(`http://${cleanHost}/status`, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
              });
              clearTimeout(timeout);
              const data = await espRes.text();
              res.statusCode = espRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(data);
              return;
            } catch (fetchErr: any) {
              clearTimeout(timeout);
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(
                JSON.stringify({
                  status: 'offline',
                  connected: false,
                  host: cleanHost,
                  error: fetchErr?.message || 'Unreachable',
                })
              );
              return;
            }
          }

          // 2. Buzzer control route
          if (req.url.startsWith('/api/rover/buzzer')) {
            const state = urlObj.searchParams.get('state') || 'off';
            const gpio = urlObj.searchParams.get('gpio') || '13';
            const logic = urlObj.searchParams.get('logic') || 'high';
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2200);

            try {
              const espRes = await fetch(
                `http://${cleanHost}/buzzer?state=${state}&gpio=${gpio}&logic=${logic}`,
                {
                  signal: controller.signal,
                  headers: { Accept: 'application/json' },
                }
              );
              clearTimeout(timeout);
              const data = await espRes.text();
              res.statusCode = espRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(data);
              return;
            } catch (err: any) {
              clearTimeout(timeout);
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(
                JSON.stringify({
                  status: 'error',
                  buzzer: false,
                  host: cleanHost,
                  error: err?.message || 'Failed to dispatch to rover',
                })
              );
              return;
            }
          }

          // Fallback pass-through
          next();
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), roverProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
