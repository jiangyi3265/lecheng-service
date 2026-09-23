export function readList(key) {
	const value = uni.getStorageSync(`lecheng-${key}`);
	return Array.isArray(value) ? value : [];
}
export function saveList(key, list) {
	uni.setStorageSync(`lecheng-${key}`, list);
	uni.$emit("lecheng:data");
}
export function toggleFavorite(id) {
	const list = readList("favorites");
	const next = list.includes(id)
		? list.filter((item) => item !== id)
		: [id, ...list];
	saveList("favorites", next);
	return next.includes(id);
}
export function recordVisit(id) {
	saveList(
		"history",
		[id, ...readList("history").filter((item) => item !== id)].slice(0, 50),
	);
}
export function readProfile() {
	return (
		uni.getStorageSync("lecheng-profile") || {
			name: "乐城用户",
			phone: "",
			city: "海南 · 博鳌乐城",
		}
	);
}
