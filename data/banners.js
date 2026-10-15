import { reactive } from "vue";

// 首页最上方的大图轮播。coverImage 为空时显示示意配图（scene 0–3）。
// 后台“首页轮播”发布后由 loadExtras 替换；后台一张都没有或接口不可用时显示这里的内置两张。
export const DEFAULT_BANNERS = Object.freeze([
	Object.freeze({ id: "banner-1", title: "走进乐城", subtitle: "发现身边的优质医疗", coverImage: "", scene: 0 }),
	Object.freeze({ id: "banner-2", title: "你好，乐城", subtitle: "让优质医疗，更近一步", coverImage: "", scene: 3 }),
]);
export const banners = reactive(DEFAULT_BANNERS.map((slide) => ({ ...slide })));
