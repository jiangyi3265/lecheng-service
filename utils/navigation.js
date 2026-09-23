const roots = {
	home: "/pages/index/index",
	search: "/pages/search/search",
	support: "/pages/support/support",
	messages: "/pages/messages/messages",
	mine: "/pages/mine/mine",
};
let navigating = false;
export function pageUrl(path, params = {}) {
	const query = Object.entries(params)
		.filter(([, v]) => v !== undefined && v !== null)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join("&");
	return path + (query ? "?" + query : "");
}
export function navigate(path, params = {}) {
	if (navigating) return;
	navigating = true;
	uni.navigateTo({
		url: pageUrl(path, params),
		complete: () => {
			navigating = false;
		},
		fail: () =>
			uni.showToast({
				title: "页面打开失败，请返回后重试",
				icon: "none",
			}),
	});
}
export function goBack(fallback = "/pages/index/index") {
	if (navigating) return;
	navigating = true;
	const recover = () =>
		uni.reLaunch({
			url: fallback,
			complete: () => {
				navigating = false;
			},
		});
	if (getCurrentPages().length > 1)
		uni.navigateBack({
			delta: 1,
			success: () => {
				navigating = false;
			},
			fail: recover,
		});
	else recover();
}
export function openTab(key) {
	const url = roots[key] || roots.home,
		stack = getCurrentPages();
	const index = stack.map((p) => "/" + p.route).lastIndexOf(url);
	if (index === stack.length - 1) return;
	if (index >= 0) {
		uni.navigateBack({ delta: stack.length - 1 - index });
		return;
	}
	uni.reLaunch({ url });
}
export function openHospital(id) {
	navigate("/pages/hospital/detail", { id });
}
export function openSearch(category, filters = {}) {
	navigate("/pages/search/search", { category, ...filters });
}
export function openChat(name = "乐城服务助手") {
	navigate("/pages/chat/chat", { name });
}
export function openResource(id) {
	navigate("/pages/resource/detail", { id });
}
export function openDepartment(hospitalId, name) {
	navigate("/pages/department/detail", { hospitalId, name });
}
export function openDoctor(id) {
	navigate("/pages/doctor/detail", { id });
}
export function openBooking(doctorId) {
	navigate("/pages/appointment/book", { doctorId });
}
export function openAppointments() {
	const stack = getCurrentPages();
	const index = stack
		.map((p) => p.route)
		.lastIndexOf("pages/appointment/list");
	if (index === stack.length - 1) return;
	if (index >= 0) {
		uni.navigateBack({ delta: stack.length - 1 - index });
		return;
	}
	navigate("/pages/appointment/list");
}
export function openAppointment(id) {
	navigate("/pages/appointment/detail", { id });
}
export function openGuide(hospitalId) {
	navigate("/pages/guide/guide", { hospitalId });
}
export function openService(type, params = {}) {
	if (type === "园区导览" || type === "交通指引")
		return openGuide(params.hospitalId);
	if (type === "我的预约") return openAppointments();
	if (type === "乐城新动态") return navigate("/pages/news/news");
	navigate("/pages/service/service", { type, ...params });
}
export function routeText(value, fallback = "") {
	if (typeof value !== "string") return fallback;
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
