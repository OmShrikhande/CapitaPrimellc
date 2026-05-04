const STORAGE_KEY = 'capita_asset_unlocks_v1';

export function readStoredUnlocks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : {};
  } catch {
    return {};
  }
}

/** Valid Stripe Checkout session id for asset-viewing unlock. */
export function getStoredUnlockSession(assetId) {
  if (!assetId) return null;
  const sid = readStoredUnlocks()[String(assetId)];
  if (!sid || typeof sid !== 'string') return null;
  const t = sid.trim();
  return t.startsWith('cs_') ? t : null;
}

export function rememberUnlockSession(assetId, sessionId) {
  if (!assetId || !sessionId) return;
  const t = String(sessionId).trim();
  if (!t.startsWith('cs_')) return;
  try {
    const next = { ...readStoredUnlocks(), [String(assetId)]: t };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

export function forgetUnlockSession(assetId) {
  if (!assetId) return;
  try {
    const next = readStoredUnlocks();
    delete next[String(assetId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
