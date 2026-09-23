import test from "node:test";
import assert from "node:assert/strict";
const memory = new Map();
const calls = [];
globalThis.uni = {
	getStorageSync: (k) => structuredClone(memory.get(k)),
	setStorageSync: (k, v) => memory.set(k, structuredClone(v)),
	removeStorageSync: (k) => memory.delete(k),
	$emit() {},
	showToast() {},
	navigateTo: (o) => {
		calls.push(["navigateTo", o.url]);
		o.complete?.();
	},
	navigateBack: (o) => {
		calls.push(["navigateBack", o.delta]);
		o.success?.();
		o.complete?.();
	},
	reLaunch: (o) => {
		calls.push(["reLaunch", o.url]);
		o.complete?.();
	},
};
let stack = [];
globalThis.getCurrentPages = () => stack;
const store = await import("../utils/demo-store.js");
const { readList, saveList, toggleFavorite, recordVisit } = await import(
	"../utils/storage.js"
);
const {
	doctors,
	resources,
	resolveSavedItem,
	upcomingDates,
	appointmentSlots,
} = await import("../data/catalog.js");
const nav = await import("../utils/navigation.js");
test.beforeEach(() => {
	memory.clear();
	calls.length = 0;
	stack = [];
});
test("seed is idempotent and preserves existing conversations", () => {
	saveList("conversations", [{ name: "已有咨询", last: "我的留言" }]);
	store.ensureDemoData();
	store.ensureDemoData();
	assert.equal(readList("conversations").length, 3);
	assert.equal(readList("conversations")[0].last, "我的留言");
});
test("hospital, resource and doctor collections resolve and deduplicate", () => {
	for (const key of [
		"international",
		"resource:" + resources[0].id,
		"doctor:" + doctors[0].id,
	]) {
		toggleFavorite(key);
		recordVisit(key);
		recordVisit(key);
		assert.ok(resolveSavedItem(key));
	}
	assert.equal(readList("favorites").length, 3);
	assert.equal(readList("history").length, 3);
	toggleFavorite("international");
	assert.equal(readList("favorites").length, 2);
});
test("chat persists both roles and updates the message list", () => {
	store.ensureDemoData();
	const result = store.sendDemoMessage("医院咨询", "我想预约");
	assert.equal(result.length, 2);
	assert.equal(result[0].role, "user");
	assert.equal(result[1].role, "assistant");
	assert.match(result[1].text, /我的预约/);
	assert.equal(readList("conversations")[0].last, result[1].text);
	assert.equal(readList("conversations")[0].unread, 0);
	assert.equal(store.sendDemoMessage("医院咨询", " ").length, 2);
});
test("notices are marked independently from chats", () => {
	store.ensureDemoData();
	store.markAllNoticesRead();
	assert.equal(store.hasUnread(), true);
	for (const t of readList("conversations")) store.markChatRead(t.name);
	assert.equal(store.hasUnread(), false);
});
const input = () => ({
	doctorId: doctors[0].id,
	name: "测试用户",
	phone: "13800002026",
	date: upcomingDates()[0].value,
	slot: appointmentSlots[0],
	note: "",
});
test("appointment creation, duplicate prevention, cancellation and notifications", () => {
	const item = store.createAppointment(input());
	assert.equal(readList("appointments")[0].status, "待就诊");
	assert.equal(store.getNotices()[0].appointmentId, item.id);
	assert.throws(() => store.createAppointment(input()), /重复/);
	assert.equal(store.cancelAppointment(item.id), true);
	assert.equal(readList("appointments")[0].status, "已取消");
	assert.equal(store.cancelAppointment(item.id), false);
	assert.equal(store.getNotices()[0].title, "模拟预约已取消");
	assert.ok(store.createAppointment(input()).id);
});
test("invalid appointment input never writes records", () => {
	for (const override of [
		{ doctorId: "missing" },
		{ name: " " },
		{ phone: "123" },
		{ date: "2000-01-01" },
		{ slot: "invalid" },
	])
		assert.throws(() =>
			store.createAppointment({ ...input(), ...override }),
		);
	assert.equal(readList("appointments").length, 0);
});
test("feedback is a persistent record with detail ID", () => {
	assert.throws(() => store.submitFeedback(" "));
	const item = store.submitFeedback("页面建议");
	assert.equal(readList("feedbacks")[0].id, item.id);
	assert.equal(readList("feedbacks")[0].text, "页面建议");
});
test("content navigation pushes instead of destroying return history", () => {
	nav.openSearch("药品");
	nav.openChat("乐城服务助手");
	assert.deepEqual(
		calls.map((c) => c[0]),
		["navigateTo", "navigateTo"],
	);
	assert.equal(nav.routeText("%E8%8D%AF%E5%93%81"), "药品");
});
test("back returns one level, isolated detail falls back, tabs reuse the stack", () => {
	stack = [
		{ route: "pages/index/index" },
		{ route: "pages/search/search" },
		{ route: "pages/hospital/detail" },
	];
	nav.goBack();
	assert.deepEqual(calls.pop(), ["navigateBack", 1]);
	nav.openTab("home");
	assert.deepEqual(calls.pop(), ["navigateBack", 2]);
	stack = [{ route: "pages/doctor/detail" }];
	nav.goBack("/pages/search/search");
	assert.deepEqual(calls.pop(), ["reLaunch", "/pages/search/search"]);
});
