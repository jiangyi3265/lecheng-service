import { hospitals } from "./medical.js";
import { reactive } from "vue";

// 名称、科室、排班和资源关联均为本地演示数据，不代表真实医疗机构信息。
export const resources = reactive([
	{
		id: "med-eye",
		kind: "药品",
		name: "眼科药品示例 A",
		category: "眼科",
		icon: "capsule",
		summary: "眼科资源信息展示与医院咨询",
		spec: "滴眼剂 · 示例规格",
		brand: "示例药品资料",
		hospitalIds: ["international", "specialist"],
	},
	{
		id: "med-bone",
		kind: "药品",
		name: "骨科药品示例 B",
		category: "骨科",
		icon: "capsule",
		summary: "骨科药品查询流程演示",
		spec: "片剂 · 示例规格",
		brand: "示例药品资料",
		hospitalIds: ["specialist"],
	},
	{
		id: "med-general",
		kind: "药品",
		name: "综合内科药品示例 C",
		category: "综合内科",
		icon: "capsule",
		summary: "综合内科资源与相关服务",
		spec: "胶囊 · 示例规格",
		brand: "示例药品资料",
		hospitalIds: ["international"],
	},
	{
		id: "med-health",
		kind: "药品",
		name: "健康管理药品示例 D",
		category: "健康管理",
		icon: "capsule",
		summary: "健康管理资源咨询",
		spec: "袋装 · 示例规格",
		brand: "示例药品资料",
		hospitalIds: ["wellness"],
	},
	{
		id: "device-eye",
		kind: "器械",
		name: "眼科检查设备",
		category: "眼科",
		icon: "equipment",
		summary: "查看设备资料与关联科室",
		spec: "检查设备 · 示例型号 E01",
		brand: "示例设备资料",
		hospitalIds: ["international", "specialist"],
	},
	{
		id: "device-bone",
		kind: "器械",
		name: "运动康复设备",
		category: "骨科",
		icon: "equipment",
		summary: "了解康复设备与院区服务",
		spec: "康复设备 · 示例型号 R02",
		brand: "示例设备资料",
		hospitalIds: ["specialist"],
	},
	{
		id: "device-health",
		kind: "器械",
		name: "健康检测设备",
		category: "健康管理",
		icon: "equipment",
		summary: "健康检测服务流程展示",
		spec: "检测设备 · 示例型号 H03",
		brand: "示例设备资料",
		hospitalIds: ["wellness"],
	},
	{
		id: "device-general",
		kind: "器械",
		name: "综合检查设备",
		category: "综合内科",
		icon: "equipment",
		summary: "设备查询与医院咨询",
		spec: "检查设备 · 示例型号 G04",
		brand: "示例设备资料",
		hospitalIds: ["international", "wellness"],
	},
]);
// 批复项目沿用当前医院示例条目；真实项目名称和批复资料待接入后替换。
export const approvedProjects = reactive(hospitals.map((hospital) => ({
	id: `project:${hospital.id}`,
	kind: "批复项目",
	name: hospital.name,
	category: hospital.tags[0],
	summary: hospital.description,
	spec: hospital.subtitle,
	brand: "本地静态示例",
	scene: hospital.scene,
	departments: hospital.departments,
	hospitalIds: [hospital.id],
})));
const names = [
	"林医生",
	"陈医生",
	"周医生",
	"许医生",
	"吴医生",
	"李医生",
	"郑医生",
	"王医生",
];
let doctorIndex = 0;
export const doctors = reactive(hospitals.flatMap((h) =>
	h.features.map((f, index) => ({
		id: `${h.id}-${index}`,
		hospitalId: h.id,
		hospitalName: h.name,
		department: f.name,
		name: names[doctorIndex++],
		title: "门诊医生 · 示例",
		icon: f.icon,
		intro: `本页面展示${f.name}医生资料和排班联动，可选择日期与时段体验完整预约流程。`,
		services: [`${f.name}咨询`, "就诊资料沟通", "就诊流程指引"],
	})),
));
export const news = reactive([
	{
		id: "campus",
		title: "一份园区导览，开启乐城之行",
		category: "园区生活",
		date: "09-18",
		scene: 3,
		summary: "从医院选择到院区位置，让出行准备更从容。",
		paragraphs: [
			"先在医院查询中找到意向医院，再从园区导览选择院区，查看楼栋和到院方式。",
			"本篇为静态资讯示例，园区示意图用于演示交互，不作为实际导航依据。",
		],
		action: "园区导览",
	},
	{
		id: "visit-guide",
		title: "就诊前，这份准备清单请收好",
		category: "就医指南",
		date: "09-16",
		scene: 0,
		summary: "了解预约、资料准备和到院报到流程。",
		paragraphs: [
			"确认医院、科室和预约时间，将需要沟通的问题提前整理。",
			"准备好既往就诊资料，并通过实际医院官方渠道确认接诊安排。",
			"在演示版本中，您可以体验预约填写、查看记录和取消预约的完整流程。",
		],
		action: "预约须知",
	},
	{
		id: "green",
		title: "发现乐城的绿色日常",
		category: "康养体验",
		date: "09-12",
		scene: 2,
		summary: "沿着园区步道，发现生活与自然的连接。",
		paragraphs: [
			"树荫、绿地与开阔的滨水空间，构成园区生活的日常景色。",
			"本篇及配图为静态设计示例，康养项目可在服务助手中体验咨询。",
		],
		action: "康养体验",
	},
]);
export function resolveSavedItem(key) {
	if (key.startsWith("news:")) {
		const item = news.find((n) => n.id === key.slice(5));
		return item ? { ...item, key, kind: "资讯", itemType: "news" } : null;
	}
	if (key.startsWith("resource:")) {
		const item = [...resources, ...approvedProjects].find((r) => r.id === key.slice(9));
		return item ? { ...item, key, itemType: "resource" } : null;
	}
	if (key.startsWith("doctor:")) {
		const item = doctors.find((r) => r.id === key.slice(7));
		return item ? { ...item, key, kind: "医生", itemType: "doctor" } : null;
	}
	const item = hospitals.find((h) => h.id === key);
	return item ? { ...item, key, kind: "医院", itemType: "hospital" } : null;
}
export function upcomingDates() {
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() + i + 1);
		const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		return {
			value,
			label: `${d.getMonth() + 1}月${d.getDate()}日`,
			week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
				d.getDay()
			],
		};
	});
}
export const appointmentSlots = [
	"09:00–09:30",
	"10:00–10:30",
	"14:00–14:30",
	"15:00–15:30",
];
