# lecheng-service

乐城服务 UniApp 用户端，提供医疗资源浏览、综合服务与资讯展示的微信小程序 / H5 界面。

## 项目简介

根据公开参考页面实现的前端复刻项目，保留 HBuilderX 项目布局并提供 Vite CLI。当前功能包括：

- 首页找药械、找医院、找专家、找保险分类切换与关键词筛选。
- 药械、医院、专家、保险详情及相关资源展示。
- 综合服务分类、服务详情、新闻与政策列表和详情入口。
- 个人中心、收藏与关注入口；本地收藏跨页持久化。
- “乐小二”快捷提问与本地导航答复。

当前数据来自 `data/catalog.js` 等本地示例及页面内数据，没有调用原系统接口，也尚未接入关联后端。登录、预约提交、订单、支付、退款、语音识别及官方客服均未接入；未知详情和正文保留待接入状态。页面展示总数并不等于本地数据量。本项目不能视为官方完整产品或全站数据备份。

## 技术栈

- UniApp（`@dcloudio/uni-app` 3.0.0-4060620250520001）
- Vue 3.4.21、JavaScript、Vite 5.2.8、Sass
- 微信小程序、H5；HBuilderX 项目配置
- Node.js / Sharp：参考素材无损裁剪与包体检查脚本

## 关联仓库

| 项目 | 说明 | GitHub |
| --- | --- | --- |
| lecheng-service-backend | 后端服务与权限基础框架 | [lecheng-service-backend](https://github.com/jiangyi3265/lecheng-service-backend) |
| lecheng-service-admin | Web 管理后台 | [lecheng-service-admin](https://github.com/jiangyi3265/lecheng-service-admin) |
| lecheng-service | UniApp 用户端 / 微信小程序 / H5 | [lecheng-service](https://github.com/jiangyi3265/lecheng-service) |

三个仓库同属乐城服务项目。管理后台采用后端的若依接口约定；用户端当前使用本地示例数据，尚未接入该后端。仓库关联不代表医疗、订单、支付或预约接口已实现。用户端保留原有仓库名称和地址。

## 快速启动

准备 Node.js 20.19+ 或 22.12+、npm；微信小程序调试需安装微信开发者工具。

### macOS / Linux

```bash
npm ci
npm run dev:h5
```

现有 npm 脚本使用 POSIX 环境变量语法。H5 通常在 `http://127.0.0.1:5173/` 启动，以终端输出为准。

```bash
npm run build:h5
npm run build:mp-weixin
```

H5 输出为 `dist/build/h5`，微信输出为 `dist/build/mp-weixin`。后者自动执行包体检查。

### Windows PowerShell

可直接用 HBuilderX 打开项目并选择“运行到浏览器”或“运行到微信开发者工具”。使用 CLI 时需先安装依赖，再通过 PowerShell 设置输入目录：

```powershell
npm ci
$env:UNI_INPUT_DIR = (Get-Location).Path
npx uni --host 127.0.0.1
```

微信构建使用：

```powershell
$env:UNI_INPUT_DIR = (Get-Location).Path
npx uni build -p mp-weixin
npm run check:package
```

将 CLI 产物导入微信开发者工具，在 `manifest.json` 中配置你自己的小程序 AppID。AppID 是公开标识，不是 AppSecret；不要在客户端配置服务端密钥。

本版本无需数据库或 Redis即可运行页面。`manifest.json` 的 `miniprogramRoot: "./"` 用于生成正确的开发者工具配置。HBuilderX 使用 `unpackage/dist/dev/mp-weixin`，CLI 使用 `dist/build/mp-weixin`，两者应分别构建。

## 项目结构

```text
pages/index/      首页与资源分类
pages/catalog/    搜索列表
pages/detail/     药械、服务、资讯详情
pages/service/    综合服务
pages/news/       新闻与政策
pages/profile/    个人中心
pages/account/    收藏、订单和卡包等入口
pages/assistant/  乐小二本地导航助手
components/      导航、卡片、资源详情与素材组件
data/            示例数据和素材索引
art-source/      原始参考素材，不进入运行包
static/art/      优化后的运行素材
scripts/         素材打包与小程序包体校验
manifest.json    UniApp 平台配置
pages.json       页面注册与全局样式
```

## 素材与包体检查

```bash
npm run pack:art
npm run check:package
```

`pack:art` 对实际展示区域无损处理并逐像素核对，输出 PNG/JPEG 和素材索引。`check:package` 检查动态引用图片、2 MiB 主包限制及模板/WXSS 的 scoped 标识。检查 HBuilderX 产物可执行 `npm run check:package -- unpackage/dist/dev/mp-weixin`。

部分图片来自原小程序公开页面及参考截图，来源并不代表已获得再分发或商用授权。发布或商用前需确认相关素材权利。本地原始素材和优化素材均保留，依赖、编译产物、环境文件和开发者工具私有配置不提交。

## 简历描述示例

使用 UniApp、Vue 3 与 Vite 实现乐城服务跨端界面，完成医疗资源分类检索、详情导航、综合服务展示及本地收藏交互，并通过素材无损处理和自动包体检查适配微信小程序发布限制。当前成果为前端演示，未包含真实订单、支付或医疗业务后端。
