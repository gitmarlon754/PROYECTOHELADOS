import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};

// Frontend development configuration (point to backend mocks)
export const API_BASE = (window as any)['__API_BASE__'] || 'http://localhost:8080';
export const WS_SOCKJS_ENDPOINT = (window as any)['__WS_SOCKJS_ENDPOINT__'] || '/ws-ventas';
export const WS_FULL_URL = (() => {
  const host = API_BASE.replace(/^http/, 'ws');
  return host + WS_SOCKJS_ENDPOINT;
})();