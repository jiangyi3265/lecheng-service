import { reactive, computed } from "vue";

// 本地静态示例会在接口可用时由后台发布数据替换。
export const hospitals = reactive([
	{
		id: "international",
		name: "乐城国际医学中心",
		scene: 0,
		tags: ["综合医疗", "国际诊疗"],
		subtitle: "多学科诊疗 · 全程服务",
		type: "综合医院",
		departments: ["综合内科", "眼科", "骨科", "健康管理"],
		address: "博鳌乐城国际医疗旅游先行区",
		description: "以患者为中心，提供专业、便捷的医疗服务。",
		features: [
			{ name: "综合内科", caption: "专业诊疗", icon: "stethoscope" },
			{ name: "眼科中心", caption: "清晰视界", icon: "eye" },
			{ name: "骨科中心", caption: "运动健康", icon: "bone" },
			{ name: "健康管理", caption: "全程关怀", icon: "heart-pulse" },
		],
	},
	{
		id: "specialist",
		name: "乐城专科医疗中心",
		scene: 2,
		tags: ["专科诊疗", "健康管理"],
		subtitle: "专业医疗 · 用心守护",
		type: "专科医院",
		departments: ["眼科", "骨科"],
		address: "博鳌乐城国际医疗旅游先行区",
		description: "聚焦专科医疗服务，让每一份健康需求得到用心回应。",
		features: [
			{ name: "眼科中心", caption: "眼健康服务", icon: "eye" },
			{ name: "骨科中心", caption: "运动健康", icon: "bone" },
		],
	},
	{
		id: "wellness",
		name: "乐城健康管理中心",
		scene: 1,
		tags: ["健康管理", "医学检查"],
		subtitle: "科学体检 · 健康生活",
		type: "健康管理",
		departments: ["健康管理", "综合内科"],
		address: "博鳌乐城国际医疗旅游先行区",
		description: "关注日常健康管理，为您提供便捷的健康咨询与检查服务。",
		features: [
			{ name: "健康管理", caption: "全程关怀", icon: "heart-pulse" },
			{ name: "综合内科", caption: "健康咨询", icon: "stethoscope" },
		],
	},
]);
export const directoryTotal = computed(() => hospitals.length);
export const notices = [];
