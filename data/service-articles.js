// 尚未发布真实福利活动。发布时填写真实标题、配图 scene 和 paragraphs。
export const benefitArticles = [];
export const processArticles = [
  { id: 'find-care', title: '浏览与查询：找到需要的医疗信息', scene: 0, paragraphs: [
    '从首页浏览医院介绍，或进入查询页面，按医院、药品、器械查找相关信息。',
    '打开条目可查看详情，感兴趣的医院、药械和资讯可以收藏，之后从“我的收藏”继续查看。',
  ] },
  { id: 'consult', title: '在线咨询：在客服页面沟通', scene: 1, paragraphs: [
    '点击底部“客服”入口，直接在输入框中填写问题。',
    '当前咨询为本地演示聊天，消息保存在本机，尚未接入真实医生或客服。',
  ] },
  { id: 'visit', title: '预约与出行：做好到院准备', scene: 3, paragraphs: [
    '在医院详情中查看医疗环境，并使用“预约问诊”进入客服页面咨询。',
    '通过“园区导航”查看博鳌乐城地图，使用地图应用查找实际接诊医院并规划路线。出发前请通过医院官方渠道确认接诊安排。',
  ] },
];
export function serviceArticlesFor(type) { return type === '福利活动' ? benefitArticles : type === '服务流程' ? processArticles : []; }
