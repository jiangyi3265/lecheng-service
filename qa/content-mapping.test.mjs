import test from 'node:test';
import assert from 'node:assert/strict';
import { policies } from '../data/policies.js';
import { aboutSections } from '../data/about.js';
import { DEFAULT_SUPPORT_SETTINGS } from '../data/support.js';
import { DEFAULT_BANNERS, banners } from '../data/banners.js';
import { benefitArticles, processArticles, serviceArticlesFor } from '../data/service-articles.js';
import { DEFAULT_SERVICE_CONTACT, serviceContact } from '../data/service-contact.js';
import {
  DEFAULT_PARK_GUIDE, destination, amapUrlFor, gcj02ToWgs84, osmEmbedUrl, osmEmbedUrlFor, placeName, tencentUrlFor, wgs84ToGcj02,
} from '../data/park-map.js';
import {
  mapPolicy, mapAboutSection, mapSupportSettings, normalizeBlocks, resolveMediaUrl, sceneOf, textLines,
  mapBanner, mapBanners, mapBenefit, mapProcess, mapParkGuide, parseCoordinate, mapServiceContact, dialNumber,
} from '../utils/content-mapping.js';

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

// ---- 首页轮播、福利活动、服务流程、园区导航、“我的”页联系方式（sql/lecheng_mine_content_20261016.sql） ----

test('首页轮播：后台初始化数据与内置两张一致；后台为空或格式不对时保留内置轮播', () => {
  const seeds = plain(DEFAULT_BANNERS).map((slide, index) => ({
    id: slide.id, kindCode: 'banner', title: slide.title, subtitle: slide.subtitle, coverImage: '', scene: slide.scene,
    status: '1', sortOrder: index, contentVersion: 2,
  }));
  assert.deepEqual(mapBanners(seeds, DEFAULT_BANNERS), plain(DEFAULT_BANNERS));
  assert.deepEqual(plain(banners), plain(DEFAULT_BANNERS), '内置轮播与默认值相同');
  assert.deepEqual(plain(banners).map(({ scene, title, subtitle }) => ({ scene, title, subtitle })), [
    { scene: 0, title: '走进乐城', subtitle: '发现身边的优质医疗' },
    { scene: 3, title: '你好，乐城', subtitle: '让优质医疗，更近一步' },
  ], '与原首页写死的两张轮播相同');
  for (const empty of [[], undefined, null, 'x', [null, 3, {}, { title: '  ', coverImage: '' }]]) {
    const slides = mapBanners(empty, DEFAULT_BANNERS);
    assert.deepEqual(slides, plain(DEFAULT_BANNERS));
    assert.notEqual(slides[0], DEFAULT_BANNERS[0], '返回副本，不直接引用冻结的默认值');
  }
  const custom = mapBanners([
    { id: 'b-new', title: ' 新春义诊 ', subtitle: '', coverImage: ' https://img.example.test/b.jpg ', scene: '' },
    { title: '', coverImage: 'https://img.example.test/only-image.jpg', scene: 2 },
    { id: 'b-empty', title: '', coverImage: '' },
  ], DEFAULT_BANNERS);
  assert.deepEqual(custom, [
    { id: 'b-new', title: '新春义诊', subtitle: '', coverImage: 'https://img.example.test/b.jpg', scene: 0 },
    { id: 'banner-2', title: '', subtitle: '', coverImage: 'https://img.example.test/only-image.jpg', scene: 2 },
  ]);
  assert.equal(mapBanner({ title: '第四张' }, 3).scene, 3);
  assert.equal(mapBanner({ title: '第六张', scene: 7 }, 5).scene, 1);
});

const serviceSeed = (kindCode) => (item, index) => ({
  id: item.id, kindCode, title: item.title, summary: '', coverImage: '', scene: item.scene,
  paragraphs: [...item.paragraphs], contentBlocks: textBlocks(item.paragraphs), status: '1', sortOrder: index, contentVersion: 2,
});

test('服务流程：后台初始化数据映射后与内置内容显示一致（列表摘要、详情段落）', () => {
  const originals = plain(processArticles);
  const mapped = originals.map(serviceSeed('process')).map(mapProcess);
  assert.deepEqual(mapped.map((item) => item.id), ['find-care', 'consult', 'visit']);
  assert.deepEqual(mapped.map((item) => item.scene), [0, 1, 3]);
  originals.forEach((original, index) => {
    const item = mapped[index];
    for (const key of ['id', 'title', 'scene', 'paragraphs']) assert.deepEqual(item[key], original[key], key);
    assert.equal(item.coverImage, '');
    // ArticleList 显示 summary || paragraphs[0]：内置内容没有摘要，初始化数据摘要自动取第一段，显示文字相同
    assert.equal(item.summary || item.paragraphs[0], original.summary || original.paragraphs[0]);
    // 详情按文字块逐行显示，每块一段，与内置段落一一对应
    assert.deepEqual(item.contentBlocks.map((block) => block.lines), original.paragraphs.map((paragraph) => [paragraph]));
    assert.equal(item.period, undefined, '服务流程没有活动时间');
  });
  assert.equal(serviceArticlesFor('服务流程'), processArticles);
  assert.deepEqual(plain(benefitArticles), [], '尚未发布福利活动');
  assert.equal(serviceArticlesFor('福利活动'), benefitArticles);
  assert.deepEqual(serviceArticlesFor('其他'), []);
});

test('福利活动：活动时间、封面、图文块与摘要；缺字段时给出安全默认值', () => {
  const long = '活动说明'.repeat(20);
  const item = mapBenefit({
    id: 'benefit-spring', title: ' 春季体检优惠 ', period: ' 2026-11-01 至 2026-11-30 ', coverImage: 'https://img.example.test/cover.jpg',
    summary: '', paragraphs: [], contentBlocks: [
      { type: 'image', url: 'https://img.example.test/poster.jpg', caption: ' 活动海报 ' },
      { type: 'text', title: '参与方式', text: `${long}\n到院出示页面即可` },
      { type: 'text', title: '', text: '   ' },
    ],
  }, 0);
  assert.equal(item.title, '春季体检优惠');
  assert.equal(item.period, '2026-11-01 至 2026-11-30');
  assert.equal(item.coverImage, 'https://img.example.test/cover.jpg');
  assert.equal(item.summary, long.slice(0, 60));
  assert.deepEqual(item.contentBlocks, [
    { type: 'image', url: 'https://img.example.test/poster.jpg', caption: '活动海报' },
    { type: 'text', title: '参与方式', text: `${long}\n到院出示页面即可`, lines: [long, '到院出示页面即可'] },
  ]);
  const bare = mapBenefit({ title: '只有标题', scene: 'x' }, 2);
  assert.deepEqual(bare, { id: 'benefit-3', title: '只有标题', scene: 2, coverImage: '', summary: '', paragraphs: [], contentBlocks: [], period: '' });
  assert.equal(mapBenefit({ summary: ' 自定义摘要 ', paragraphs: ['正文'] }).summary, '自定义摘要');
  assert.equal(mapBenefit(null, 0).id, 'benefit-1');
  assert.equal(mapProcess(undefined, 4).id, 'process-5');
  assert.equal(mapProcess({ paragraphs: ['第一段\n  第二行'] }).summary, '第一段 第二行');
});

test('园区导航：初始化数据与内置内容一致，坐标可为数字或数字字符串，无效坐标保留默认位置', () => {
  assert.deepEqual({ ...DEFAULT_PARK_GUIDE }, {
    title: '博鳌乐城国际医疗旅游先行区', address: '海南省琼海市博鳌镇',
    note: '地图标记为园区综合服务中心。前往医院，请在地图中确认具体院区与入口。', markerName: '乐城综合服务中心',
    latitude: 19.149250, longitude: 110.498542,
  }, '与原园区导航页写死的文字和坐标相同');
  const seed = { id: 'park-guide', kindCode: 'guide', name: '园区导航', ...DEFAULT_PARK_GUIDE, status: '1', sortOrder: 0, contentVersion: 2 };
  assert.deepEqual(mapParkGuide([seed], DEFAULT_PARK_GUIDE), { ...DEFAULT_PARK_GUIDE });
  assert.deepEqual(mapParkGuide([{ ...seed, latitude: '19.149250', longitude: '110.498542' }], DEFAULT_PARK_GUIDE), { ...DEFAULT_PARK_GUIDE });
  assert.deepEqual(plain(destination), { ...DEFAULT_PARK_GUIDE });
  assert.deepEqual(mapParkGuide([], DEFAULT_PARK_GUIDE), { ...DEFAULT_PARK_GUIDE });
  assert.deepEqual(mapParkGuide(undefined, DEFAULT_PARK_GUIDE), { ...DEFAULT_PARK_GUIDE });

  const edited = mapParkGuide([{ id: 'other', title: '不是园区导航' }, {
    id: 'park-guide', title: ' 乐城先行区 ', address: ' 琼海市博鳌镇康祥路 ', note: '', markerName: '  ',
    latitude: ' 19.153000 ', longitude: 110.5,
  }], DEFAULT_PARK_GUIDE);
  assert.deepEqual(edited, {
    title: '乐城先行区', address: '琼海市博鳌镇康祥路', note: '', markerName: DEFAULT_PARK_GUIDE.markerName, latitude: 19.153, longitude: 110.5,
  });
  const cleared = mapParkGuide([{ id: 'park-guide', title: '', address: '' }], DEFAULT_PARK_GUIDE);
  assert.equal(cleared.title, DEFAULT_PARK_GUIDE.title, '园区名称为空时用默认');
  assert.equal(cleared.address, '', '地址清空后不显示');
  assert.equal(cleared.note, DEFAULT_PARK_GUIDE.note, '缺少说明字段时用默认');

  for (const [latitude, longitude] of [[60, 110.5], [19.1, 200], ['abc', 110.5], ['', ''], [null, 110.5], [19.1, undefined], [true, 110.5], [[19.1], 110.5], [NaN, 110.5], [Infinity, 110.5]]) {
    const result = mapParkGuide([{ id: 'park-guide', latitude, longitude }], DEFAULT_PARK_GUIDE);
    assert.equal(result.latitude, DEFAULT_PARK_GUIDE.latitude, `${latitude},${longitude}`);
    assert.equal(result.longitude, DEFAULT_PARK_GUIDE.longitude, `${latitude},${longitude}`);
  }
  assert.equal(parseCoordinate('3', 3, 54), 3);
  assert.equal(parseCoordinate(54, 3, 54), 54);
  assert.equal(parseCoordinate(' 73.0 ', 73, 136), 73);
  assert.equal(parseCoordinate('2.99', 3, 54), null);
  assert.equal(parseCoordinate('19.1abc', 3, 54), null);
  assert.equal(parseCoordinate({}, 3, 54), null);
});

test('园区导航地图链接：网页版内嵌地图在默认位置下与原来完全一致，标记换算为 WGS84', () => {
  assert.equal(osmEmbedUrlFor(DEFAULT_PARK_GUIDE),
    'https://www.openstreetmap.org/export/embed.html?bbox=110.461%2C19.135%2C110.515%2C19.194&layer=mapnik&marker=19.15095%2C110.49425');
  const wgs = gcj02ToWgs84(DEFAULT_PARK_GUIDE.latitude, DEFAULT_PARK_GUIDE.longitude);
  assert.ok(Math.abs(wgs.latitude - 19.15094955) < 2e-6 && Math.abs(wgs.longitude - 110.494251225) < 2e-6, JSON.stringify(wgs));
  const back = wgs84ToGcj02(wgs.latitude, wgs.longitude);
  assert.ok(Math.abs(back.latitude - DEFAULT_PARK_GUIDE.latitude) < 1e-8 && Math.abs(back.longitude - DEFAULT_PARK_GUIDE.longitude) < 1e-8);
  assert.equal(osmEmbedUrl.value, osmEmbedUrlFor(DEFAULT_PARK_GUIDE));
  assert.equal(tencentUrlFor(DEFAULT_PARK_GUIDE), 'https://apis.map.qq.com/uri/v1/marker?marker='
    + encodeURIComponent('coord:19.14925,110.498542;title:乐城综合服务中心;addr:海南省琼海市博鳌镇') + '&referer=lecheng-service');
  assert.equal(amapUrlFor(DEFAULT_PARK_GUIDE), 'https://uri.amap.com/marker?position=110.498542,19.14925&name='
    + encodeURIComponent('乐城综合服务中心') + '&src=lecheng-service&coordinate=gaode&callnative=1');
  const moved = { ...DEFAULT_PARK_GUIDE, markerName: '', latitude: 19.2, longitude: 110.6 };
  assert.equal(placeName(moved), DEFAULT_PARK_GUIDE.title, '没有标记文字时用园区名称');
  assert.ok(osmEmbedUrlFor(moved).includes('&marker=19.20'));
  assert.ok(tencentUrlFor(moved).includes(encodeURIComponent('coord:19.2,110.6;title:博鳌乐城国际医疗旅游先行区')));
});

test('“我的”页联系方式：客服设置里填写了才覆盖，未填写沿用默认（电话为空显示待更新）', () => {
  assert.deepEqual(plain(serviceContact), { ...DEFAULT_SERVICE_CONTACT });
  assert.deepEqual({ ...DEFAULT_SERVICE_CONTACT }, { hours: '8:00—22:00', phone: '', address: '海南省博鳌镇乐城医疗先行区' }, '与原默认值相同');
  assert.deepEqual(mapServiceContact([], DEFAULT_SERVICE_CONTACT), { ...DEFAULT_SERVICE_CONTACT });
  const current = { id: 'support-settings', kindCode: 'support', name: '客服设置', ...DEFAULT_SUPPORT_SETTINGS, status: '1', sortOrder: 0, contentVersion: 2 };
  assert.deepEqual(mapServiceContact([current], DEFAULT_SERVICE_CONTACT), { ...DEFAULT_SERVICE_CONTACT }, '现有客服设置没有联系方式字段');
  assert.deepEqual(mapServiceContact([{ ...current, contactHours: ' 9:00—18:00 ', contactAddress: ' 海南省琼海市博鳌镇 ', contactPhone: ' 0898-6666 8888 ' }], DEFAULT_SERVICE_CONTACT),
    { hours: '9:00—18:00', address: '海南省琼海市博鳌镇', phone: '0898-6666 8888' });
  assert.deepEqual(mapServiceContact([{ ...current, contactHours: '', contactAddress: '  ', contactPhone: '' }], DEFAULT_SERVICE_CONTACT), { ...DEFAULT_SERVICE_CONTACT });
  assert.equal(mapServiceContact([{ id: 'support-settings', contactPhone: 4008001234 }], DEFAULT_SERVICE_CONTACT).phone, '4008001234');
  // 联系方式与客服页设置同在一条记录里，两者互不影响
  const both = [{ ...current, hours: '', contactHours: '全天' }];
  assert.equal(mapSupportSettings(both, DEFAULT_SUPPORT_SETTINGS, API).hours, '');
  assert.equal(mapServiceContact(both, DEFAULT_SERVICE_CONTACT).hours, '全天');
});

test('拨号号码：去掉空格、括号、短横线和分机，保留开头的 +', () => {
  assert.equal(dialNumber('0898-6666 8888'), '089866668888');
  assert.equal(dialNumber('+86 (898) 6666-8888 转 801'), '+8689866668888');
  assert.equal(dialNumber('400-800-1234转2'), '4008001234');
  assert.equal(dialNumber(''), '');
  assert.equal(dialNumber('转 801'), '');
  assert.equal(dialNumber(undefined), '');
});
