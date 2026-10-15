// 后台内容（国家政策、了解乐城、客服设置、首页轮播、福利活动、服务流程、园区导航）转换为小程序展示结构。
// 纯函数，不依赖 uni / vue，便于在 Node 中单独测试（qa/content-mapping.test.mjs）。

export const SUPPORT_SETTINGS_ID = "support-settings";
export const PARK_GUIDE_ID = "park-guide";

const text = (value) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");
const strings = (list) => (Array.isArray(list) ? list.map(text).filter(Boolean) : []);
const objects = (list) => (Array.isArray(list) ? list.filter((item) => item && typeof item === "object") : []);
// 单条设置类内容（客服设置、园区导航）：按编号取，旧数据编号不符时取第一条
const singleRecord = (list, id) => {
	const items = objects(list);
	return items.find((item) => item.id === id) || items[0] || null;
};

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
	const record = singleRecord(list, SUPPORT_SETTINGS_ID);
	if (!record) return result;
	result.avatar = resolveMediaUrl(record.avatar, apiBaseUrl);
	if (text(record.caption)) result.caption = text(record.caption);
	if (typeof record.greeting === "string" && record.greeting.trim()) result.greeting = record.greeting.trim();
	if (typeof record.hours === "string") result.hours = record.hours.trim();
	return result;
}

// “我的”页联系方式（存在客服设置记录里）：后台填写了才覆盖，未填写的项沿用默认值；电话为空时页面显示“待更新”
export function mapServiceContact(list, defaults) {
	const result = { ...defaults };
	const record = singleRecord(list, SUPPORT_SETTINGS_ID);
	if (!record) return result;
	if (text(record.contactHours)) result.hours = text(record.contactHours);
	if (text(record.contactAddress)) result.address = text(record.contactAddress);
	if (text(record.contactPhone)) result.phone = text(record.contactPhone);
	return result;
}

// 拨号用号码：分机（“转”之后）不能直接拨，去掉空格、括号、短横线，只保留数字和开头的 +
export function dialNumber(phone) {
	const main = text(phone).split("转")[0];
	const digits = main.replace(/[^\d]/g, "");
	return digits ? (main.trim().startsWith("+") ? "+" : "") + digits : "";
}

// 首页轮播：图片为空时显示示意配图 scene；后台一张都没有（全部下架或删除）时保留内置轮播，首页不出现空白
export function mapBanner(item = {}, index = 0) {
	return {
		id: text(item.id) || `banner-${index + 1}`,
		title: text(item.title),
		subtitle: text(item.subtitle),
		coverImage: text(item.coverImage),
		scene: sceneOf(item.scene, index),
	};
}

export function mapBanners(list, defaults) {
	const slides = objects(list).map(mapBanner).filter((slide) => slide.title || slide.coverImage);
	return slides.length ? slides : defaults.map((slide) => ({ ...slide }));
}

// 福利活动、服务流程：列表左图右文，详情为大图 + 图文正文；摘要未填写时取正文第一段前 60 字
function mapServiceArticle(item, index, prefix) {
	const source = item && typeof item === "object" ? item : {};
	const paragraphs = strings(source.paragraphs);
	const contentBlocks = normalizeBlocks(source.contentBlocks);
	return {
		id: text(source.id) || `${prefix}-${index + 1}`,
		title: text(source.title),
		scene: sceneOf(source.scene, index),
		coverImage: text(source.coverImage),
		summary: text(source.summary) || firstText(paragraphs, contentBlocks).replace(/\s+/g, " ").slice(0, 60),
		paragraphs,
		contentBlocks,
	};
}

// 活动时间为自由填写的文字（如“2026-11-01 至 2026-11-30”），未填写时详情页不显示
export function mapBenefit(item = {}, index = 0) {
	return { ...mapServiceArticle(item, index, "benefit"), period: text(item && item.period) };
}

export function mapProcess(item = {}, index = 0) {
	return mapServiceArticle(item, index, "process");
}

// 经纬度可能是数字或数字字符串；超出范围（国内 GCJ-02 坐标）或无法识别时返回 null
export function parseCoordinate(value, min, max) {
	const number = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
	return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

// 园区导航：先恢复默认，再用后台内容覆盖。
// 园区名称、地图标记文字为空时用默认；地址、说明按后台为准，清空后不显示这一行。
// 经纬度必须两项都有效才替换，避免标记落到错误位置。
export function mapParkGuide(list, defaults) {
	const result = { ...defaults };
	const record = singleRecord(list, PARK_GUIDE_ID);
	if (!record) return result;
	if (text(record.title)) result.title = text(record.title);
	if (text(record.markerName)) result.markerName = text(record.markerName);
	if (typeof record.address === "string") result.address = record.address.trim();
	if (typeof record.note === "string") result.note = record.note.trim();
	const latitude = parseCoordinate(record.latitude, 3, 54);
	const longitude = parseCoordinate(record.longitude, 73, 136);
	if (latitude !== null && longitude !== null) Object.assign(result, { latitude, longitude });
	return result;
}
