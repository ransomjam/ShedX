import { api } from './client';

export const optionalApi = {
  async listMarkets() {
    try { return await api['listMarkets']?.(); } catch { return null; }
  },
  async listServices() {
    try { return await api['listServices']?.(); } catch { return null; }
  },
  async listAssets() {
    try { return await api['listAssets']?.(); } catch { return null; }
  },
  async listAuctions() {
    try { return await api['listAuctions']?.(); } catch { return null; }
  },
  async listNotifications() {
    try { return await api['listNotifications']?.(); } catch { return null; }
  },
};
