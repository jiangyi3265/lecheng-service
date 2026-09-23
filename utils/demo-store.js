import { readList, saveList } from "./storage.js";
import { notices } from "../data/medical.js";
import { doctors, upcomingDates, appointmentSlots } from "../data/catalog.js";

export function ensureDemoData() {
	if (uni.getStorageSync("lecheng-demo-v2")) return;
	const threads = readList("conversations");
	for (const name of ["乐城服务助手", "医院咨询"])
		if (!threads.some((t) => t.name === name))
			threads.push({
				name,
				last:
					name === "乐城服务助手"
						? "您好，请问有什么可以帮您？"
						: "医院、科室与预约服务都可以在这里了解。",
				time: Date.now() - 3600000,
				unread: 1,
			});
	saveList("conversations", threads);
	if (uni.getStorageSync("lecheng-read"))
		saveList(
			"read-notices",
			notices.map((n) => n.id),
		);
	uni.setStorageSync("lecheng-demo-v2", true);
}
export function getNotices() {
	// 旧版默认通知不再展示，保留预约等实际操作产生的通知。
	return [...readList("generated-notices"), ...notices].filter(
		(notice) => notice.id !== "visit" && notice.id !== "guide",
	);
}
export function hasUnread() {
	if (uni.getStorageSync("lecheng-notification-enabled") === false)
		return false;
	const read = readList("read-notices");
	return (
		getNotices().some((n) => !read.includes(n.id)) ||
		readList("conversations").some((t) => t.unread > 0)
	);
}
export function markNoticeRead(id) {
	saveList("read-notices", [...new Set([...readList("read-notices"), id])]);
}
export function markAllNoticesRead() {
	saveList(
		"read-notices",
		getNotices().map((n) => n.id),
	);
}
export function markChatRead(name) {
	saveList(
		"conversations",
		readList("conversations").map((t) =>
			t.name === name ? { ...t, unread: 0 } : t,
		),
	);
}
export function greeting(name) {
	return `您好，这里是${name}。我是静态演示助手，可以帮助您了解医院查询、预约流程和园区导览。`;
}
export function chatMessages(name) {
	return readList("chat-" + name).map((m) => ({
		...m,
		role: m.role || "user",
	}));
}
export function sendDemoMessage(name, text) {
	const value = text.trim();
	if (!value) return chatMessages(name);
	const now = Date.now(),
		list = chatMessages(name);
	const reply = /预约|挂号/.test(value)
		? "您可以进入医院的特色科室，选择医生、日期和时段完成模拟预约。已保存的预约可在“我的 → 我的预约”查看或取消。"
		: /药|器械|设备/.test(value)
			? "请打开“查询”，切换药品或器械分类。每条示例资源都关联了医院，可继续查看科室并咨询。"
			: /交通|园区|路线/.test(value)
				? "您可以从医院地址进入园区导览，选择院区并查看步行、公共交通或自驾指引。园区图为交互示意图。"
				: "已收到您的留言。您可以继续查看医院、预约须知或园区导览。本回复为静态演示，不提供诊断、处方或真实预约服务。";
	list.push(
		{ id: `${now}-user`, role: "user", text: value, time: now },
		{
			id: `${now}-assistant`,
			role: "assistant",
			text: reply,
			time: now + 1,
		},
	);
	saveList("chat-" + name, list);
	saveList("conversations", [
		{ name, last: reply, time: now, unread: 0 },
		...readList("conversations").filter((t) => t.name !== name),
	]);
	return list;
}
function addNotice(notice) {
	saveList("generated-notices", [
		{ ...notice, time: "刚刚", createdAt: Date.now() },
		...readList("generated-notices"),
	]);
}
export function createAppointment(input) {
	const doctor = doctors.find((d) => d.id === input.doctorId);
	if (!doctor) throw Error("请选择医生");
	if (!input.name?.trim()) throw Error("请填写就诊人姓名");
	if (!/^1\d{10}$/.test(input.phone || ""))
		throw Error("请输入正确的 11 位手机号码");
	if (
		!upcomingDates().some((d) => d.value === input.date) ||
		!appointmentSlots.includes(input.slot)
	)
		throw Error("请选择有效的预约日期和时段");
	const list = readList("appointments");
	if (
		list.some(
			(a) =>
				a.status === "待就诊" &&
				a.doctorId === doctor.id &&
				a.date === input.date &&
				a.slot === input.slot &&
				a.phone === input.phone,
		)
	)
		throw Error("该时段已有预约，请勿重复提交");
	const item = {
		...input,
		name: input.name.trim(),
		id: `LC${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
		hospitalId: doctor.hospitalId,
		hospitalName: doctor.hospitalName,
		department: doctor.department,
		doctorName: doctor.name,
		status: "待就诊",
		createdAt: Date.now(),
	};
	saveList("appointments", [item, ...list]);
	addNotice({
		id: "appointment-" + item.id,
		title: "模拟预约已保存",
		summary: `${item.doctorName} · ${item.date} ${item.slot}`,
		body: "您的模拟预约已保存在本机，可查看预约信息或取消。本记录不代表医院真实号源或预约结果。",
		appointmentId: item.id,
	});
	return item;
}
export function cancelAppointment(id) {
	const item = readList("appointments").find((a) => a.id === id);
	if (!item || item.status !== "待就诊") return false;
	saveList(
		"appointments",
		readList("appointments").map((a) =>
			a.id === id
				? { ...a, status: "已取消", cancelledAt: Date.now() }
				: a,
		),
	);
	addNotice({
		id: `cancel-${id}`,
		title: "模拟预约已取消",
		summary: `${item.doctorName} · ${item.date}`,
		body: "该模拟预约已取消，您可以重新选择日期与时段。",
		appointmentId: id,
	});
	return true;
}
export function submitFeedback(text) {
	if (!text.trim()) throw Error("请填写反馈内容");
	const item = {
		id: `FB${Date.now()}`,
		text: text.trim(),
		time: Date.now(),
		status: "已记录（演示）",
	};
	saveList("feedbacks", [item, ...readList("feedbacks")]);
	uni.removeStorageSync("lecheng-feedback");
	return item;
}
export function shortTime(time) {
	if (!time) return "刚刚";
	const d = new Date(time);
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
