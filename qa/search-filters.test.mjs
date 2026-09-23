import test from 'node:test';
import assert from 'node:assert/strict';
import { hospitals } from '../data/medical.js';
import { resources } from '../data/catalog.js';
import { departmentOptions, diseaseOptions, normalizeDepartment, matchesSearchFilters } from '../data/search-filters.js';

const metabolic = '内分泌、营养和代谢疾病及免疫疾病';

test('科室与疾病筛选取交集，且空条件保留原始医院列表', () => {
  assert.equal(hospitals.filter(item => matchesSearchFilters(item)).length, 3);
  assert.deepEqual(hospitals.filter(item => matchesSearchFilters(item, { department: '内科', disease: metabolic })).map(item => item.id), ['international', 'wellness']);
  assert.deepEqual(hospitals.filter(item => matchesSearchFilters(item, { department: '外科', disease: metabolic })).map(item => item.id), ['international']);
  assert.equal(hospitals.filter(item => matchesSearchFilters(item, { department: '内科', disease: metabolic, keyword: '专科' })).length, 0);
});

test('疾病筛选与关键词可共同匹配各资源分类，不能把医院类型当成疾病', () => {
  assert.deepEqual(resources.filter(item => matchesSearchFilters(item, { department: '内科', disease: metabolic, keyword: '综合' })).map(item => item.id), ['med-general', 'device-general']);
  assert.deepEqual(resources.filter(item => matchesSearchFilters(item, { keyword: '  骨质疏松  ' })).map(item => item.id), ['med-bone', 'device-bone']);
  assert.equal(resources.filter(item => matchesSearchFilters(item, { department: '外科', disease: metabolic })).length, 0);
  assert.equal(hospitals.filter(item => matchesSearchFilters(item, { disease: '综合医院' })).length, 0);
});

test('采用确认的16个科室和7类疾病，旧科室入口可映射到当前分类', () => {
  assert.deepEqual(departmentOptions, ['内科', '外科', '消化内科', '心内科', '神经外科', '内分泌科', '血液科', '肾病学', '泌尿外科', '肿瘤科', '呼吸科', '神经内科', '心血管内科', '全科', '肝胆外科', '男科']);
  assert.deepEqual(diseaseOptions.map(item => item.name), ['肿瘤癌症', metabolic, '血液和造血器官疾病', '循环系统疾病', '呼吸系统疾病', '消化系统疾病', '泌尿生殖系统疾病']);
  assert.equal(normalizeDepartment('眼科'), '外科');
  assert.equal(normalizeDepartment('健康管理'), '内科');
  assert.equal(normalizeDepartment('不存在'), '');
  assert.equal(hospitals.filter(item => matchesSearchFilters(item, { department: '肝胆外科' })).length, 0);
  assert.equal(resources.filter(item => matchesSearchFilters(item, { disease: '泌尿生殖系统疾病' })).length, 0);
  assert.equal(matchesSearchFilters({ departments: ['内科'] }, { department: '内科' }), true);
  assert.equal(matchesSearchFilters({ category: '心血管内科' }, { department: '心血管内科' }), true);
});

test('静态疾病选项引用的医院、药械记录都存在，原始记录不被修改', () => {
  const before = JSON.stringify({ hospitals, resources });
  for (const option of diseaseOptions) {
    assert.ok(option.hospitalIds.every(id => hospitals.some(item => item.id === id)));
    assert.ok(option.resourceIds.every(id => resources.some(item => item.id === id)));
    hospitals.filter(item => matchesSearchFilters(item, { disease: option.name }));
    resources.filter(item => matchesSearchFilters(item, { disease: option.name }));
  }
  assert.equal(JSON.stringify({ hospitals, resources }), before);
});
