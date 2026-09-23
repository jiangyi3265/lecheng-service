import test from 'node:test';
import assert from 'node:assert/strict';
import { clearDisplayCache, maskAccountPhone } from '../utils/settings.js';
test('cache clearing preserves login and all user records', () => {
  const protectedKeys = ['lecheng-auth', 'lecheng-favorites', 'lecheng-profile', 'lecheng-appointments', 'lecheng-conversations', 'lecheng-chat-乐城服务助手', 'lecheng-draft-乐城服务助手', 'lecheng-feedback', 'lecheng-history', 'lecheng-feedbacks', 'lecheng-language', 'lecheng-notification-enabled', 'unrelated-cache'];
  const entries = new Map([...protectedKeys, 'lecheng-cache:articles', 'lecheng-message-tab', 'lecheng-search-state'].map((key) => [key, { retained: true }]));
  const storage = { getStorageInfoSync: () => ({ keys: [...entries.keys()] }), removeStorageSync: (key) => entries.delete(key) };
  assert.equal(clearDisplayCache(storage), 3);
  assert.deepEqual([...entries.keys()], protectedKeys);
  assert.equal(clearDisplayCache(storage), 0);
});
test('account security masks a verified phone and handles missing values', () => {
  assert.equal(maskAccountPhone('13812345678'), '138****5678');
  assert.equal(maskAccountPhone(undefined), '未绑定');
  assert.equal(maskAccountPhone(''), '未绑定');
});
