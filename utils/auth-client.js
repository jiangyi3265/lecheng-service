// Session lifetime is issued by the server. A network failure never deletes it.
export function createAuthClient({ storage, request, baseUrl, now = Date.now, changed = () => {} }) {
  const key = 'lecheng-auth';
  let pendingRefresh = null;
  let revision = 0;
  const session = () => storage.get(key) || null;
  const configured = () => /^https:\/\//.test(baseUrl || '');
  function clear() { revision++; storage.remove(key); changed(); }
  function save(data, expectedRevision) {
    if (revision !== expectedRevision) throw new Error('登录状态已变更，请重试');
    if (!data || typeof data.accessToken !== 'string' || !data.accessToken || typeof data.refreshToken !== 'string' || !data.refreshToken || !Number.isFinite(data.expiresIn) || data.expiresIn <= 0 || !Number.isFinite(data.refreshExpiresIn) || data.refreshExpiresIn <= 0 || !data.user?.id) throw new Error('登录服务返回的信息不完整');
    const value = { accessToken: data.accessToken, refreshToken: data.refreshToken, expiresAt: now() + data.expiresIn * 1000, refreshExpiresAt: now() + data.refreshExpiresIn * 1000, user: data.user };
    storage.set(key, value); changed(); return value;
  }
  async function post(path, data) {
    if (!configured()) throw new Error('登录服务暂未开通，请稍后再试');
    return request(baseUrl.replace(/\/$/, '') + path, data);
  }
  async function login(method, payload) {
    if (!['wechat', 'phone'].includes(method)) throw new Error('不支持的登录方式');
    const current = ++revision;
    const result = await post('/auth/' + method, payload);
    return save(result, current);
  }
  async function ensureSession() {
    const current = session();
    if (!current) return null;
    if (current.expiresAt > now() + 60000) return current;
    if (pendingRefresh) return pendingRefresh;
    if (!current.refreshToken || current.refreshExpiresAt <= now()) { clear(); return null; }
    const expectedRevision = revision;
    pendingRefresh = (async () => {
      try { return save(await post('/auth/refresh', { refreshToken: current.refreshToken }), expectedRevision); }
      catch (error) { if ((error.status === 401 || error.status === 403) && revision === expectedRevision) clear(); throw error; }
      finally { pendingRefresh = null; }
    })();
    return pendingRefresh;
  }
  async function logout() {
    const current = session(); clear();
    if (current && configured()) await post('/auth/logout', { refreshToken: current.refreshToken });
  }
  return { session, configured, login, ensureSession, logout };
}
