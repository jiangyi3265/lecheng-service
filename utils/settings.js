// Only disposable UI state and the dedicated cache namespace may be cleared.
// Authentication, favorites, conversations, drafts and business records are not caches.
const disposableKeys = new Set(['lecheng-search-state', 'lecheng-message-tab']);
// H5 正式包里全局 uni 是空对象，只有直接写 uni.xxx() 的调用会被编译成真实接口，所以这里包一层
const uniStorage = {
  getStorageInfoSync: () => uni.getStorageInfoSync(),
  removeStorageSync: (key) => uni.removeStorageSync(key),
};
export function clearDisplayCache(storage = uniStorage) {
  const keys = storage.getStorageInfoSync().keys;
  const removable = keys.filter((key) => disposableKeys.has(key) || key.startsWith('lecheng-cache:'));
  for (const key of removable) storage.removeStorageSync(key);
  return removable.length;
}
export function maskAccountPhone(phone) {
  return typeof phone === 'string' && /^1\d{10}$/.test(phone) ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定';
}
