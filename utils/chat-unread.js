import { ref } from "vue";
import { apiBaseUrl, getUnreadCount, markMessagesRead } from "./lecheng-api";
import { badgeText, createUnreadTracker } from "./unread-tracker";

// 客服回复未读数：底部导航“客服”和“我的 → 在线客服”的红色角标共用
export const unreadCount = ref(0);
export { badgeText };

const tracker = createUnreadTracker({
	fetchUnread: getUnreadCount,
	sendRead: markMessagesRead,
	onChange: (count) => { unreadCount.value = count; },
});
let timer;

export function refreshUnread() {
	// 断网等失败时保留上次的未读数，下次轮询再试
	return tracker.refresh().catch((error) => {
		console.warn("客服未读数同步失败", error);
		return unreadCount.value;
	});
}
export function stopUnreadPolling() {
	clearInterval(timer);
	timer = undefined;
}
// 小程序在前台时每 10 秒查一次；未配置后台接口（本机演示）时不轮询
export function startUnreadPolling() {
	stopUnreadPolling();
	if (!apiBaseUrl) return;
	refreshUnread();
	timer = setInterval(refreshUnread, 10000);
}
// 聊天界面刷新到消息后调用：角标立即清零，有新的客服回复时通知后台已读
export function markRead(messages) {
	return tracker.markRead(messages);
}
