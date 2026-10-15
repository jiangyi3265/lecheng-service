// 客服未读数的纯逻辑（不依赖 uni / vue），界面绑定见 chat-unread.js，测试见 qa/chat-unread.test.mjs。

// 客服（非用户）消息里最大的编号；没有客服回复时为 0
export function latestReplyId(messages) {
	let max = 0;
	for (const message of Array.isArray(messages) ? messages : []) {
		if (!message || message.role === "user") continue;
		const id = Number(message.id);
		if (Number.isFinite(id) && id > max) max = id;
	}
	return max;
}

// 角标文字：0 不显示，超过 99 显示 99+
export function badgeText(count) {
	const value = Math.floor(Number(count) || 0);
	return value <= 0 ? "" : value > 99 ? "99+" : String(value);
}

// 轮询结果换算成未读数：本机已标记读到 lastId（已读请求可能还没落库）时按 0 处理，避免角标闪回
export function unreadAfterPoll(result, readId) {
	const lastId = Number(result && result.lastId) || 0;
	if (lastId > 0 && lastId <= readId) return 0;
	return Math.max(0, Math.floor(Number(result && result.count) || 0));
}

/**
 * fetchUnread() → Promise<{count, lastId}>；sendRead(lastId) → Promise；onChange(count) 在未读数变化时调用。
 */
export function createUnreadTracker({ fetchUnread, sendRead, onChange = () => {} }) {
	let count = 0, readId = 0, polling = null;
	function set(value) {
		if (value === count) return;
		count = value;
		onChange(count);
	}
	function refresh() {
		// 上一次请求未返回时不重复发起
		if (polling) return polling;
		polling = Promise.resolve()
			.then(fetchUnread)
			.then((result) => { set(unreadAfterPoll(result, readId)); return count; })
			.finally(() => { polling = null; });
		return polling;
	}
	// 打开聊天看到消息：立即清零角标；只在出现更新的客服回复时才通知后台
	function markRead(messages) {
		set(0);
		const id = latestReplyId(messages);
		if (id <= readId) return Promise.resolve(false);
		const previous = readId;
		readId = id;
		return Promise.resolve()
			.then(() => sendRead(id))
			.then(() => true, () => {
				// 发送失败（如断网）：退回，下次刷新再试
				if (readId === id) readId = previous;
				return false;
			});
	}
	return {
		refresh,
		markRead,
		get count() { return count; },
		get readId() { return readId; },
	};
}
