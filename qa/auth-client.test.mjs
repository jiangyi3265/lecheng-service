import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthClient } from '../utils/auth-client.js';
const response = () => ({ accessToken: 'test-access', refreshToken: 'test-refresh', expiresIn: 3600, refreshExpiresIn: 30 * 86400, user: { id: 'test-user', name: '测试用户' } });
function setup(request = async () => response(), baseUrl = 'https://auth.example.test') {
  const data = new Map(); let time = 100000;
  const storage = { get: (k) => data.get(k), set: (k, v) => data.set(k, v), remove: (k) => data.delete(k) };
  return { auth: createAuthClient({ storage, request, baseUrl, now: () => time }), storage, advance: (n) => { time += n; } };
}
test('reopening after two days refreshes once and preserves identity', async () => {
  let calls = 0; const s = setup(async () => { calls++; return response(); });
  await s.auth.login('wechat', { code: 'test-code' }); s.advance(2 * 86400000);
  const reopened = createAuthClient({ storage: s.storage, baseUrl: 'https://auth.example.test', request: async () => { calls++; return response(); }, now: () => 100000 + 2 * 86400000 });
  const [a, b] = await Promise.all([reopened.ensureSession(), reopened.ensureSession()]);
  assert.equal(calls, 2); assert.equal(a.user.id, 'test-user'); assert.equal(a, b);
});
test('network failures preserve session for retry', async () => {
  let fail = false; const s = setup(async () => { if (fail) throw new Error('offline'); return response(); });
  await s.auth.login('phone', {}); const old = s.auth.session(); s.advance(3600000); fail = true;
  await assert.rejects(s.auth.ensureSession(), /offline/); assert.equal(s.auth.session(), old);
});
test('server rejection and refresh expiry require login', async () => {
  let reject = false; const s = setup(async () => { if (reject) throw Object.assign(new Error('rejected'), { status: 401 }); return response(); });
  await s.auth.login('wechat', {}); s.advance(3600000); reject = true;
  await assert.rejects(s.auth.ensureSession()); assert.equal(s.auth.session(), null);
  reject = false; await s.auth.login('wechat', {}); s.advance(31 * 86400000);
  assert.equal(await s.auth.ensureSession(), null);
});
test('logout during refresh cannot resurrect credentials', async () => {
  let complete; const s = setup(async (url) => url.endsWith('/refresh') ? new Promise((r) => { complete = r; }) : response());
  await s.auth.login('wechat', {}); s.advance(3600000); const pending = s.auth.ensureSession();
  await s.auth.logout(); complete(response()); await assert.rejects(pending, /已变更/); assert.equal(s.auth.session(), null);
});
test('missing backend and malformed responses never create a login', async () => {
  const missing = setup(undefined, ''); await assert.rejects(missing.auth.login('wechat', {}), /暂未开通/); assert.equal(missing.auth.session(), null);
  const invalid = setup(async () => ({ user: { id: 'only-user' } })); await assert.rejects(invalid.auth.login('phone', {}), /不完整/); assert.equal(invalid.auth.session(), null);
});
