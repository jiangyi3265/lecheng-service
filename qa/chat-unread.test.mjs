import test from 'node:test';
import assert from 'node:assert/strict';
import { badgeText, createUnreadTracker, latestReplyId, unreadAfterPoll } from '../utils/unread-tracker.js';

const messages = (...list) => list.map(([id, role]) => ({ id, role, text: `消息${id}` }));

function setup(poll = { count: 0, lastId: 0 }) {
  const sent = [], changes = [];
  const state = { poll, failSend: false };
  const tracker = createUnreadTracker({
    fetchUnread: async () => state.poll,
    sendRead: async (id) => { sent.push(id); if (state.failSend) throw new Error('offline'); return { count: 0 }; },
    onChange: (count) => changes.push(count),
  });
  return { tracker, sent, changes, state };
}

test('只统计客服回复的最大编号，用户自己的消息不算', () => {
  assert.equal(latestReplyId(messages([1, 'user'], [4, 'assistant'], [9, 'user'], [7, 'assistant'])), 7);
  assert.equal(latestReplyId(messages([3, 'user'])), 0);
  assert.equal(latestReplyId([{ id: '12', role: 'assistant' }, { id: 'abc', role: 'assistant' }, null]), 12);
  assert.equal(latestReplyId(undefined), 0);
});

test('角标数字：0 不显示，超过 99 显示 99+', () => {
  assert.deepEqual([0, -2, NaN, undefined, 1, 2, 99, 100, 250].map(badgeText), ['', '', '', '', '1', '2', '99', '99+', '99+']);
});

test('轮询结果：本机已读到的回复不再计入未读', () => {
  assert.equal(unreadAfterPoll({ count: 2, lastId: 30 }, 0), 2);
  assert.equal(unreadAfterPoll({ count: 2, lastId: 30 }, 30), 0);
  assert.equal(unreadAfterPoll({ count: 1, lastId: 31 }, 30), 1);
  assert.equal(unreadAfterPoll({ count: '3', lastId: '0' }, 50), 3);
  assert.equal(unreadAfterPoll(null, 0), 0);
});

test('打开聊天立即清零角标，只在出现更新的客服回复时才通知后台', async () => {
  const s = setup({ count: 2, lastId: 8 });
  assert.equal(await s.tracker.refresh(), 2);
  assert.deepEqual(s.changes, [2]);
  assert.equal(await s.tracker.markRead(messages([5, 'assistant'], [6, 'user'], [8, 'assistant'])), true);
  assert.equal(s.tracker.count, 0);
  assert.deepEqual(s.changes, [2, 0]);
  assert.deepEqual(s.sent, [8]);
  // 每 3 秒刷新一次聊天：没有新的回复就不再请求
  assert.equal(await s.tracker.markRead(messages([5, 'assistant'], [6, 'user'], [8, 'assistant'], [9, 'user'])), false);
  assert.deepEqual(s.sent, [8]);
  assert.equal(await s.tracker.markRead(messages([8, 'assistant'], [10, 'assistant'])), true);
  assert.deepEqual(s.sent, [8, 10]);
  // 只有用户消息时不发已读
  const empty = setup();
  assert.equal(await empty.tracker.markRead(messages([1, 'user'])), false);
  assert.deepEqual(empty.sent, []);
});

test('已读请求还没落库时，旧的轮询结果不会让角标闪回', async () => {
  let release;
  const sent = [];
  const tracker = createUnreadTracker({
    fetchUnread: () => new Promise((resolve) => { release = resolve; }),
    sendRead: async (id) => { sent.push(id); },
  });
  const polling = tracker.refresh();
  await tracker.markRead(messages([20, 'assistant']));
  release({ count: 1, lastId: 20 });
  assert.equal(await polling, 0);
  assert.equal(tracker.count, 0);
  assert.deepEqual(sent, [20]);
});

test('新回复到达后重新显示未读数；并发轮询只发一次请求', async () => {
  let calls = 0;
  const tracker = createUnreadTracker({ fetchUnread: async () => { calls++; return { count: 3, lastId: 40 }; }, sendRead: async () => {} });
  await tracker.markRead(messages([30, 'assistant']));
  const [a, b] = await Promise.all([tracker.refresh(), tracker.refresh()]);
  assert.equal(calls, 1);
  assert.equal(a, 3);
  assert.equal(b, 3);
});

test('已读请求失败（断网）时退回，下次刷新聊天会重试', async () => {
  const s = setup();
  s.state.failSend = true;
  assert.equal(await s.tracker.markRead(messages([15, 'assistant'])), false);
  assert.equal(s.tracker.readId, 0);
  s.state.failSend = false;
  assert.equal(await s.tracker.markRead(messages([15, 'assistant'])), true);
  assert.deepEqual(s.sent, [15, 15]);
  assert.equal(s.tracker.readId, 15);
});

test('轮询失败时保留上次的未读数，交给调用方处理错误', async () => {
  let fail = false;
  const tracker = createUnreadTracker({ fetchUnread: async () => { if (fail) throw new Error('offline'); return { count: 2, lastId: 9 }; }, sendRead: async () => {} });
  await tracker.refresh();
  fail = true;
  await assert.rejects(tracker.refresh(), /offline/);
  assert.equal(tracker.count, 2);
});
