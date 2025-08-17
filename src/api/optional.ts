import { api } from './client';

export const optionalApi = {
  async listMarkets() {
    try { return await (api as any).listMarkets?.(); } catch { return null; }
  },
  async listServices() {
    try { return await (api as any).listServices?.(); } catch { return null; }
  },
  async listAssets() {
    try { return await (api as any).listAssets?.(); } catch { return null; }
  },
  async listAuctions() {
    try { return await (api as any).listAuctions?.(); } catch { return null; }
  },
  async listNotifications() {
    try { return await (api as any).listNotifications?.(); } catch { return null; }
  },
};
