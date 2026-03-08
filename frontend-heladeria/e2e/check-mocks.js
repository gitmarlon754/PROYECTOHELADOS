const { chromium } = require('playwright');

(async () => {
  const timeout = 15000;
  const result = { productos: false, inventario: false, ventas: false, sockjs: false };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Start navigation to frontend
    await page.goto('http://localhost:4200', { timeout, waitUntil: 'load' });
    // Track responses to detect calls that may happen before waits
    const observed = new Set();
    page.on('response', resp => {
      try {
        const u = resp.url();
        if (u.includes('/api/mock') || u.includes('/ventas')) {
          observed.add(u);
          console.log('Observed response:', u, resp.status());
        }
      } catch (e) {}
    });

    // Wait a short time for the frontend to issue requests
    await page.waitForTimeout(1500);

    // Helper to fetch sample if observed or wait for future response
    async function fetchSample(pathOrPaths) {
      const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

      for (const path of paths) {
        const full = `http://localhost:8080${path}`;
        if (observed.has(full)) {
          const resp = await page.request.get(full).catch(() => null);
          if (resp && resp.ok()) return await resp.json().catch(() => null);
        }
      }

      const resp = await page.waitForResponse(
        r => paths.some(path => r.url().includes(path)) && r.status() === 200,
        { timeout }
      ).catch(() => null);
      if (resp) return await resp.json().catch(() => null);

      // Final fallback: call endpoints directly even if frontend request was too fast to observe.
      for (const path of paths) {
        const direct = await page.request.get(`http://localhost:8080${path}`).catch(() => null);
        if (direct && direct.ok()) {
          return await direct.json().catch(() => null);
        }
      }

      return null;
    }

    const prodJson = await fetchSample('/api/mock/productos');
    if (prodJson) {
      console.log('productos response sample:', Array.isArray(prodJson) ? prodJson.slice(0,2) : prodJson);
      result.productos = true;
    }

    const invJson = await fetchSample('/api/mock/inventario');
    if (invJson) {
      console.log('inventario response sample:', invJson);
      result.inventario = true;
    }

    const ventasJson = await fetchSample(['/ventas', '/api/mock/ventas/recent']);
    if (ventasJson) {
      console.log('ventas response sample:', ventasJson);
      result.ventas = true;
    }

    // Check SockJS info endpoint directly (same-origin)
    const sockjs = await page.request.get('http://localhost:8080/ws-ventas/info', { timeout }).catch(() => null);
    if (sockjs && sockjs.ok()) {
      const j = await sockjs.json().catch(() => null);
      console.log('/ws-ventas/info:', j);
      result.sockjs = true;
    }

    const allOk = Object.values(result).every(Boolean);
    console.log('E2E result:', result);
    await browser.close();
    process.exit(allOk ? 0 : 2);
  } catch (err) {
    console.error('E2E error:', err && err.message ? err.message : err);
    await browser.close();
    process.exit(3);
  }
})();
