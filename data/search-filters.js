// 分类名称和顺序按确认的 16 个科室、7 类疾病维护。
export const departmentOptions = ['内科', '外科', '消化内科', '心内科', '神经外科', '内分泌科', '血液科', '肾病学', '泌尿外科', '肿瘤科', '呼吸科', '神经内科', '心血管内科', '全科', '肝胆外科', '男科'];
const departmentAliases = {
  内科: ['综合内科', '健康管理'],
  外科: ['眼科', '骨科'],
};

// 关联仅连接现有静态示例，不代表真实医疗服务或药械适应症。
// 暂无对应资料的分类保留空结果，不虚构或改写原医院、药械内容。
export const diseaseOptions = [
  { name: '肿瘤癌症', hospitalIds: [], resourceIds: [] },
  { name: '内分泌、营养和代谢疾病及免疫疾病', hospitalIds: ['international', 'wellness'], resourceIds: ['med-general', 'med-health', 'device-general', 'device-health'] },
  { name: '血液和造血器官疾病', hospitalIds: [], resourceIds: [] },
  { name: '循环系统疾病', hospitalIds: [], resourceIds: [] },
  { name: '呼吸系统疾病', hospitalIds: [], resourceIds: [] },
  { name: '消化系统疾病', hospitalIds: [], resourceIds: [] },
  { name: '泌尿生殖系统疾病', hospitalIds: [], resourceIds: [] },
];

// 具体疾病仍可通过搜索框查找，分类面板只显示参考图中的病种大类。
const conditionKeywords = [
  { name: '白内障', hospitalIds: ['international', 'specialist'], resourceIds: ['med-eye', 'device-eye'] },
  { name: '干眼症', hospitalIds: ['international', 'specialist'], resourceIds: ['med-eye', 'device-eye'] },
  { name: '骨关节炎', hospitalIds: ['international', 'specialist'], resourceIds: ['med-bone', 'device-bone'] },
  { name: '骨质疏松', hospitalIds: ['international', 'specialist'], resourceIds: ['med-bone', 'device-bone'] },
  { name: '高血压', hospitalIds: ['international', 'wellness'], resourceIds: ['med-general', 'device-general'] },
  { name: '糖尿病', hospitalIds: ['international', 'wellness'], resourceIds: ['med-general', 'device-general'] },
];

export function normalizeDepartment(value) {
  if (departmentOptions.includes(value)) return value;
  return Object.keys(departmentAliases).find(name => departmentAliases[name].includes(value)) || '';
}

export function matchesSearchFilters(item, { keyword = '', department = '', disease = '' } = {}) {
  const isHospital = Array.isArray(item.departments);
  const departments = isHospital ? item.departments : [item.category];
  const belongsToRecord = option =>
    (isHospital ? option.hospitalIds : option.resourceIds).includes(item.id);
  const diseases = diseaseOptions.filter(belongsToRecord).map(option => option.name);
  const conditions = conditionKeywords.filter(belongsToRecord).map(option => option.name);
  const departmentNames = departmentOptions.filter(name =>
    [name, ...(departmentAliases[name] || [])].some(alias => departments.includes(alias)),
  );
  const text = [item.name, item.subtitle, item.type, item.summary, ...(item.tags || []), ...departments, ...departmentNames, ...diseases, ...conditions].join(' ').toLowerCase();
  return (!department || departmentNames.includes(department))
    && (!disease || diseases.includes(disease))
    && text.includes(keyword.trim().toLowerCase());
}
