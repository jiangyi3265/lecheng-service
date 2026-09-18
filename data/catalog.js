// 仅包含参考图可确认的展示信息；不替代药品说明书或医疗建议。
export const medicines = [
  {
    id: "lurbinectedin",
    name: "芦比替定",
    english: "Lurbinectedin(Zepzelca)",
    date: "2022-06-30",
    hospital: "博鳌未来医院",
    department: "肿瘤科",
    manufacturer: "Pharma Mar S.A.",
    insurance: "医惠锡城等 共 10 款保险",
    views: "5.3k",
    image: true,
  },
  {
    id: "vosoritide",
    name: "伏佐高",
    english: "Vosoritide(Voxzogo)",
    date: "2022-04-28",
    hospital: "瑞金海南医院",
    department: "内科",
    manufacturer: "BioMarin International Limited",
    insurance: "龙江惠民保等 共 6 款保险",
    image: false,
  },
];
export const departments = [
  "全部",
  "肿瘤科",
  "儿科",
  "眼科",
  "骨科",
  "心血管内科",
  "神经内科",
  "其他科室",
];
export const diseases = [
  "全部",
  "肿瘤",
  "罕见病",
  "眼部疾病",
  "骨科疾病",
  "心血管疾病",
];
export const categories = ["找药械", "找医院", "找专家", "找保险"];
export function openDetail(item) {
  uni.navigateTo({ url: "/pages/detail/detail?id=" + item.id });
}
