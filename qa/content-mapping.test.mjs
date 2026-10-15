import test from 'node:test';
import assert from 'node:assert/strict';
import { policies } from '../data/policies.js';
import { aboutSections } from '../data/about.js';
import { DEFAULT_SUPPORT_SETTINGS } from '../data/support.js';
import { mapPolicy, mapAboutSection, mapSupportSettings, normalizeBlocks, resolveMediaUrl, sceneOf, textLines } from '../utils/content-mapping.js';

const API = 'https://api.example.test/prod-api';
const plain = (value) => JSON.parse(JSON.stringify(value));
const textBlocks = (paragraphs) => paragraphs.map((text) => ({ type: 'text', title: '', text }));

// 与 sql/lecheng_support_20261015.sql 的初始化数据同一结构
const policySeed = (item, index) => ({
  id: item.id, kindCode: 'policy', title: item.title, fullTitle: item.fullTitle, date: item.date, tags: [...item.tags],
  summary: item.summary, coverImage: '', scene: item.scene, sourceName: item.source.name, sourceUrl: item.source.url,
  paragraphs: [...item.paragraphs], contentBlocks: textBlocks(item.paragraphs), status: '1', sortOrder: index, contentVersion: 2,
});
const aboutSeed = (item, index) => ({
  id: item.id, kindCode: 'about', title: item.title, caption: item.caption, coverImage: '', scene: item.scene,
  paragraphs: [...item.paragraphs], contentBlocks: textBlocks(item.paragraphs), status: '1', sortOrder: index, contentVersion: 2,
});

test('后台初始化的国家政策映射后与小程序内置内容一致', () => {
  const mapped = plain(policies).map(policySeed).map(mapPolicy);
  assert.equal(mapped.length, 2);
  plain(policies).forEach((original, index) => {
    const item = mapped[index];
    for (const key of ['id', 'title', 'fullTitle', 'category', 'date', 'scene', 'tags', 'summary', 'paragraphs', 'source'])
      assert.deepEqual(item[key], original[key], key);
    assert.equal(item.coverImage, '');
    assert.deepEqual(item.contentBlocks.map((block) => block.lines), original.paragraphs.map((paragraph) => [paragraph]));
  });
});

test('国家政策缺字段时给出安全默认值，摘要取正文前 60 字，无来源不显示来源', () => {
  const long = '第一段'.repeat(30);
  const item = mapPolicy({ id: 'p-new', title: '  新政策  ', scene: '9', tags: ['医疗', '', 3, null], contentBlocks: [
    { type: 'text', title: '', text: '' },
    { type: 'image', url: '', caption: '没有图片' },
    { type: 'text', title: '要点', text: `${long}\n第二行` },
    { type: 'image', url: 'https://img.example.test/a.jpg', caption: ' 图注 ' },
    { type: 'video', url: 'x' }, null,
  ] }, 5);
  assert.equal(item.title, '新政策');
  assert.equal(item.category, '国家政策');
  assert.equal(item.scene, 1);
  assert.deepEqual(item.tags, ['医疗', '3']);
  assert.equal(item.summary, long.slice(0, 60));
  assert.equal(item.source, null);
  assert.deepEqual(item.paragraphs, []);
  assert.deepEqual(item.contentBlocks, [
    { type: 'text', title: '要点', text: `${long}\n第二行`, lines: [long, '第二行'] },
    { type: 'image', url: 'https://img.example.test/a.jpg', caption: '图注' },
  ]);
  assert.deepEqual(mapPolicy({ sourceUrl: 'https://gov.example.test/x' }, 0).source, { name: '', url: 'https://gov.example.test/x' });
  assert.equal(mapPolicy({ summary: '', paragraphs: ['  段落一  '] }).summary, '段落一');
  assert.equal(mapPolicy({}, 2).id, 'policy-3');
});

test('了解乐城映射保留图文块、配图与图注，旧数据只有段落时照常显示', () => {
  const mapped = plain(aboutSections).map(aboutSeed).map(mapAboutSection);
  assert.deepEqual(mapped.map((item) => item.id), ['about-1', 'about-2', 'about-3']);
  assert.deepEqual(mapped.map((item) => item.scene), [3, 0, 2]);
  plain(aboutSections).forEach((original, index) => {
    for (const key of ['title', 'caption', 'coverImage', 'paragraphs']) assert.deepEqual(mapped[index][key], original[key], key);
  });
  const custom = mapAboutSection({ title: '园区', coverImage: 'https://img.example.test/c.jpg', caption: '', paragraphs: ['旧段落'] }, 6);
  assert.equal(custom.id, 'about-7');
  assert.equal(custom.scene, 2);
  assert.equal(custom.coverImage, 'https://img.example.test/c.jpg');
  assert.deepEqual(custom.contentBlocks, []);
  assert.deepEqual(custom.paragraphs, ['旧段落']);
});

test('客服设置：未发布时用默认值，后台填写的内容覆盖默认，开场白保留换行', () => {
  assert.deepEqual(mapSupportSettings([], DEFAULT_SUPPORT_SETTINGS, API), { ...DEFAULT_SUPPORT_SETTINGS });
  assert.deepEqual(mapSupportSettings(undefined, DEFAULT_SUPPORT_SETTINGS, API), { ...DEFAULT_SUPPORT_SETTINGS });
  const seed = { id: 'support-settings', kindCode: 'support', name: '客服设置', ...DEFAULT_SUPPORT_SETTINGS, status: '1', sortOrder: 0, contentVersion: 2 };
  assert.deepEqual(mapSupportSettings([seed], DEFAULT_SUPPORT_SETTINGS, API), { ...DEFAULT_SUPPORT_SETTINGS });
  const edited = mapSupportSettings([{ id: 'other', greeting: '不是客服设置' }, {
    id: 'support-settings', avatar: 'https://img.example.test/kf.jpg', caption: '  ', greeting: '  您好！\n请留言  ', hours: '',
  }], DEFAULT_SUPPORT_SETTINGS, API);
  assert.equal(edited.avatar, 'https://img.example.test/kf.jpg');
  assert.equal(edited.caption, DEFAULT_SUPPORT_SETTINGS.caption);
  assert.equal(edited.greeting, '您好！\n请留言');
  assert.equal(edited.hours, '', '清空在线时间后不显示这一行');
  const missing = mapSupportSettings([{ id: 'support-settings', greeting: '' }], DEFAULT_SUPPORT_SETTINGS, API);
  assert.equal(missing.greeting, DEFAULT_SUPPORT_SETTINGS.greeting);
  assert.equal(missing.hours, DEFAULT_SUPPORT_SETTINGS.hours);
  assert.equal(missing.avatar, '');
});

test('头像地址：外链原样、包内图片原样、后台相对路径拼接接口地址、其他写法回退默认', () => {
  assert.equal(resolveMediaUrl('https://img.example.test/a.jpg', API), 'https://img.example.test/a.jpg');
  assert.equal(resolveMediaUrl('/static/images/customer-service-avatar.jpg', API), '/static/images/customer-service-avatar.jpg');
  assert.equal(resolveMediaUrl('/profile/upload/2026/10/15/a.jpg', API + '/'), API + '/profile/upload/2026/10/15/a.jpg');
  assert.equal(resolveMediaUrl('/profile/upload/a.jpg', ''), '');
  assert.equal(resolveMediaUrl('//evil.example.test/a.jpg', API), '');
  assert.equal(resolveMediaUrl('javascript:alert(1)', API), '');
  assert.equal(resolveMediaUrl(undefined, API), '');
  assert.equal(mapSupportSettings([{ id: 'support-settings', avatar: 'ftp://x/a.jpg' }], DEFAULT_SUPPORT_SETTINGS, API).avatar, '');
});

test('图文块与示意图编号的边界情况', () => {
  assert.deepEqual(textLines('第一段\r\n\r\n  第二段  \n'), ['第一段', '第二段']);
  assert.deepEqual(textLines(null), []);
  assert.deepEqual(normalizeBlocks('not-array'), []);
  assert.deepEqual(normalizeBlocks([{ type: 'text', title: '只有标题' }]), [{ type: 'text', title: '只有标题', text: '', lines: [] }]);
  assert.equal(sceneOf(0, 3), 0);
  assert.equal(sceneOf('2', 0), 2);
  assert.equal(sceneOf('', 5), 1);
  assert.equal(sceneOf(null, 4), 0);
  assert.equal(sceneOf(1.5, 2), 2);
  assert.equal(sceneOf(-1, 3), 3);
});
