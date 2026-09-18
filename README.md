# 乐城服务 · UniApp 界面复刻

基于 UniApp / Vue 3。保留原有 HBuilderX 项目目录，另补充 Vite CLI，可在 H5 和微信小程序运行。

## 运行

```bash
npm install
npm run dev:h5
npm run build:h5
npm run build:mp-weixin
```

H5 开发地址由终端输出，默认 `http://127.0.0.1:5173/`。
H5 构建输出：`dist/build/h5`。
微信小程序输出：`dist/build/mp-weixin`，使用微信开发者工具导入，并填写你自己的小程序 AppID。
HBuilderX 也可直接打开本项目运行。

## 页面及交互

- 首页：找药械、找医院、找专家、找保险原位切换；横向热词、搜索、分类筛选、全部入口。
- 搜索列表：关键词、科室/疾病筛选、药品/器械切换与空结果状态。
- 药械详情：信息表、详情、适用、规格、医院和商保；点击标签滚动到对应章节。
- 医院详情：医院头图区域、机构信息、介绍/药械/专家等标签、预约咨询入口。
- 专家详情：专家名片、简介、动态日期的坐诊表、预约入口。
- 保险详情：产品头图区域、版本、覆盖数、保险简介/覆盖特药/说明书。
- 服务：综合会务横幅、医疗、新生物技术、产品、餐饮、住宿、出行、旅游、商务、会议分类、服务项目卡片、服务详情与咨询入口。
- 动态：新闻/政策等分类、排序状态、筛选面板、文章详情结构。
- 乐小二：欢迎信息、可切换的快捷提问、输入与本地导航答复。
- 我的：订单入口、收藏、关注、卡包、便民服务包；本地收藏可跨页持久化。

## 还原依据与边界

2026-09-16 通过用户提供的首页截图及用户电脑上的“乐城服务”小程序查看公开页面。首页以截图的 414 × 780 等比窗口为基准实现。

这是**前端复刻版本，不是原站全量代码或数据备份，也未达到全站像素级 1:1**：

1. 首页插画、药械横幅、芦比替定缩略图及乐小二使用用户截图中的局部素材。`ReferenceArt.vue` 按原始参考图区域展示无损打包素材，其余布局、文字、输入、导航和列表都是独立组件。
2. 已从原小程序公开页面采集服务九个分类宣传图、新闻/政策图片、医院头图、专家头像、保险卡片及个人中心图标。`NativeArt.vue` 展示原截图或经过像素一致性校验的局部素材；部分其他条目和详情仍缺少独立参考，尚未完成逐页像素级验收。
3. 药械、医院、专家、保险和新闻仅收录浏览中能确认的少量示例。593/43/414/21 为参考界面的展示总数，不代表本地已有对应数量数据。没有抓取原系统接口。
4. 小程序个人中心仍显示未登录。登录后订单、卡包、支付、退款、预约业务等页面未完整观察；本地页面仅实现已知入口和空状态，不能声称已还原这些未知页面。
5. 官方登录、订单、支付、预约提交、电话及语音识别未接入。乐小二是本地导航助手，没有连接原客服或医疗问答服务，不会向原系统发送消息、提交订单或发起支付。
6. 未观察到的医院介绍、文章全文及保险说明书明确标记待接入，不编造完整原文。

## 文件组织

- `pages/index/index.vue`：首页及四个分类
- `pages/catalog/catalog.vue`：搜索列表
- `pages/detail/detail.vue`：药械、服务、文章详情
- `components/ResourceDetail.vue`：医院、专家、保险详情
- `pages/service`、`pages/news`、`pages/profile`、`pages/assistant`：主页面
- `pages/account/account.vue`：订单/收藏/卡包等入口
- `components`：导航、搜索、图标、卡片与素材组件
- `data/catalog.js`：已确认的药械示例

## 验证

H5 和微信小程序均完成编译。使用内置浏览器对首页比例、分类切换、详情打开、收藏持久化与底部导航进行实际检查。微信开发者工具已实际打开首页，确认路径错误修复；尚未进行真机、授权登录、支付及服务端联调验证。

## 微信开发者工具路径错误

如果出现 `The "path" argument must be of type string. Received undefined`，本项目已在 `manifest.json` 的 `mp-weixin` 中设置 `"miniprogramRoot": "./"`，让 UniApp 在每次编译时写入生成的 `project.config.json`。已有开发者工具窗口可能缓存旧配置，需要关闭该项目后重新打开。HBuilderX 输出目录为 `unpackage/dist/dev/mp-weixin`，CLI 输出目录为 `dist/build/mp-weixin`。

## 包体优化

原始参考图保留在 `art-source/`，不会进入小程序包。`npm run pack:art` 仅对实际展示区域进行无损编码，并逐像素核对；每组素材会选择体积更小的原图或局部 PNG。产物为 `static/art/` 和 `data/art-manifest.json`；包内仅使用 PNG/JPEG，避免本地 WebP 在部分手机的解码差异。修改参考素材后重新运行该命令。

`npm run build:mp-weixin` 会检查图片文件是否齐全、整个主包是否低于 2 MiB。`npm run check:package -- unpackage/dist/dev/mp-weixin` 可检查 HBuilderX 输出。

编译目录必须隔离：npm CLI 只写 `dist/build/mp-weixin`，HBuilderX 独占 `unpackage/dist/dev/mp-weixin`。不要用 CLI 覆盖正在运行的 HBuilderX 输出，否则增量编译会混用不同的模板/样式标识。出现无样式页面时，在 HBuilderX 中点击“重新运行”完整重编译。包体检查同时核对模板与 WXSS 的 scoped 标识。

图片目录已加入 `packOptions.include`，上传时保留动态引用素材。修改本地项目后需要重新上传并将新版本设为体验版；已发布的体验包不会随本地编译自动更新。

## 在另一台电脑同步

仓库为私有仓库，需要登录有权限的 GitHub 账号。

```bash
git clone https://github.com/jiangyi3265/lecheng-service.git
cd lecheng-service
npm ci
```

使用 HBuilderX 打开克隆后的目录，即可运行到微信开发者工具。macOS/Linux 也可使用 `npm run dev:h5` 或 `npm run build:mp-weixin`；目前 npm 中的环境变量写法面向 macOS/Linux，Windows 可直接使用 HBuilderX。源码、锁定的依赖清单、原始素材与优化素材均已纳入版本管理，依赖及编译目录不会同步。

每次开始工作前执行 `git pull --ff-only`；修改完成后执行：

```bash
git add .
git commit -m "更新页面"
git push
```
