import { createAuthClient } from './auth-client';
export const auth = createAuthClient({
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL || '',
  storage: { get: (key) => uni.getStorageSync(key), set: (key, value) => uni.setStorageSync(key, value), remove: (key) => uni.removeStorageSync(key) },
  changed: () => uni.$emit('lecheng:auth'),
  request: (url, data) => new Promise((resolve, reject) => uni.request({
    url, method: 'POST', data, timeout: 15000,
    success: (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) resolve(response.data);
      else reject(Object.assign(new Error(response.statusCode === 401 || response.statusCode === 403 ? '登录已失效，请重新登录' : '登录服务暂不可用，请稍后再试'), { status: response.statusCode }));
    },
    fail: () => reject(new Error('网络连接失败，请检查网络后重试')),
  })),
});
export function wechatCode() {
  return new Promise((resolve, reject) => uni.login({ provider: 'weixin', success: (result) => result.code ? resolve(result.code) : reject(new Error('未获取到微信登录凭证，请重试')), fail: () => reject(new Error('微信登录未完成，请重试')) }));
}
export async function updateAccountName(name) {
  const current = await auth.ensureSession();
  if (!current) throw new Error('请先登录');
  if (!auth.configured()) throw new Error('登录服务暂未开通');
  return new Promise((resolve, reject) => uni.request({
    url: import.meta.env.VITE_AUTH_BASE_URL.replace(/\/$/, '') + '/auth/me',
    method: 'PUT', data: { name }, timeout: 15000,
    header: { 'X-Lecheng-Access': current.accessToken },
    success: (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        auth.updateUser(response.data); resolve(response.data);
      } else reject(new Error(response.data?.message || '资料同步失败，请稍后重试'));
    },
    fail: () => reject(new Error('网络连接失败，请稍后重试')),
  }));
}
