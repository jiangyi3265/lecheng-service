// Only disposable UI state and the dedicated cache namespace may be cleared.
// Authentication, favorites, conversations, drafts and business records are not caches.
const disposableKeys = new Set(['lecheng-search-state', 'lecheng-message-tab']);
export function clearDisplayCache(storage = uni) {
  const keys = storage.getStorageInfoSync().keys;
  const removable = keys.filter((key) => disposableKeys.has(key) || key.startsWith('lecheng-cache:'));
  for (const key of removable) storage.removeStorageSync(key);
  return removable.length;
}
export function maskAccountPhone(phone) {
  return typeof phone === 'string' && /^1\d{10}$/.test(phone) ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定';
}
