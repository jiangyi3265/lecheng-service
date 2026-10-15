// 后台内容（国家政策、了解乐城、客服设置）转换为小程序展示结构。
// 纯函数，不依赖 uni / vue，便于在 Node 中单独测试（qa/content-mapping.test.mjs）。

export const SUPPORT_SETTINGS_ID = "support-settings";

const text = (value) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");
const strings = (list) => (Array.isArray(list) ? list.map(text).filter(Boolean) : []);

// 文本块按换行拆成多段，每段沿用原正文样式（首行缩进等），保留后台填写的换行
export function textLines(value) {
	return typeof value === "string"
		? value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
		: [];
}

// 图文块：文本块 {type:'text', title, text}；图片块 {type:'image', url, caption}；空块丢弃
export function normalizeBlocks(list) {
	if (!Array.isArray(list)) return [];
	const blocks = [];
	for (const block of list) {
		if (!block || typeof block !== "object") continue;
		if (block.type === "image") {
			const url = text(block.url);
			if (url) blocks.push({ type: "image", url, caption: text(block.caption) });
		} else if (block.type === "text") {
			const title = text(block.title), body = typeof block.text === "string" ? block.text.trim() : "";
			if (title || body) blocks.push({ type: "text", title, text: body, lines: textLines(body) });
		}
	}
	return blocks;
}

// 示意配图编号 0–3；后台未填或填错时按顺序轮换
export function sceneOf(value, index) {
	const number = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
	return Number.isInteger(number) && number >= 0 && number <= 3 ? number : index % 4;
}

const firstText = (paragraphs, blocks) =>
	paragraphs[0] || (blocks.find((block) => block.type === "text" && block.text) || {}).text || "";

export function mapPolicy(item = {}, index = 0) {
	const paragraphs = strings(item.paragraphs);
	const contentBlocks = normalizeBlocks(item.contentBlocks);
	const sourceName = text(item.sourceName), sourceUrl = text(item.sourceUrl);
	return {
		id: text(item.id) || `policy-${index + 1}`,
		title: text(item.title),
		fullTitle: text(item.fullTitle),
		category: "国家政策",
		date: text(item.date),
		scene: sceneOf(item.scene, index),
		coverImage: text(item.coverImage),
		tags: strings(item.tags),
		// 摘要未填写时取正文第一段前 60 字
		summary: text(item.summary) || firstText(paragraphs, contentBlocks).replace(/\s+/g, " ").slice(0, 60),
		paragraphs,
		contentBlocks,
		source: sourceName || sourceUrl ? { name: sourceName, url: sourceUrl } : null,
	};
}

export function mapAboutSection(item = {}, index = 0) {
	return {
		id: text(item.id) || `about-${index + 1}`,
		title: text(item.title),
		caption: text(item.caption),
		coverImage: text(item.coverImage),
		scene: sceneOf(item.scene, index),
		paragraphs: strings(item.paragraphs),
		contentBlocks: normalizeBlocks(item.contentBlocks),
	};
}

// 头像：http(s) 原样使用；/static/ 为小程序包内图片；其他以 / 开头的路径是后台上传文件，拼接接口地址
export function resolveMediaUrl(value, apiBaseUrl = "") {
	const url = text(value);
	if (!url) return "";
	if (/^https?:\/\//i.test(url) || url.startsWith("/static/")) return url;
	if (url.startsWith("/") && !url.startsWith("//")) return apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") + url : "";
	return "";
}

// 客服设置：先恢复默认，再用后台非空内容覆盖。
// 头像为空时显示默认头像；在线时间按后台为准，清空后不显示这一行。
export function mapSupportSettings(list, defaults, apiBaseUrl = "") {
	const result = { ...defaults };
	const items = Array.isArray(list) ? list.filter((item) => item && typeof item === "object") : [];
	const record = items.find((item) => item.id === SUPPORT_SETTINGS_ID) || items[0];
	if (!record) return result;
	result.avatar = resolveMediaUrl(record.avatar, apiBaseUrl);
	if (text(record.caption)) result.caption = text(record.caption);
	if (typeof record.greeting === "string" && record.greeting.trim()) result.greeting = record.greeting.trim();
	if (typeof record.hours === "string") result.hours = record.hours.trim();
	return result;
}
