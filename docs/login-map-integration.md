# 登录与地图接入状态

后台现已提供独立的小程序登录接口，微信临时 code 仅在服务端交换，不作为业务登录态。接口在本机通过模拟微信服务验证；正式微信登录仍需运营方配置小程序凭据、HTTPS 服务地址和 request 合法域名。

## 已实现的登录接口

构建环境变量 `VITE_AUTH_BASE_URL` 指定认证服务地址，默认空；正式小程序必须使用 HTTPS，本地开发可指向 `http://127.0.0.1:8080`。此变量为公开接口地址，不得填密钥。后端需要配置 `LECHENG_WECHAT_APP_ID` 和 `LECHENG_WECHAT_APP_SECRET`：

| POST 路径 | 请求 | 用途 |
| --- | --- | --- |
| `/auth/wechat` | `{code}` | 服务端通过微信 code2Session 校验身份，签发业务登录态 |
| `/auth/phone` | `{code,phoneCode}` | 微信登录 code 加手机号授权 code，服务端向微信校验手机号并关联账号 |
| `/auth/refresh` | `{refreshToken}` | 轮换短期访问凭证与刷新凭证 |
| `/auth/logout` | `{refreshToken}` | 撤销当前刷新凭证及所属会话 |
| `GET /auth/me` | 请求头 `X-Lecheng-Access` | 读取当前账号 |
| `PUT /auth/me` | 请求头及 `{name}` | 更新昵称 |

前三个接口 HTTP 2xx 返回：`{accessToken,refreshToken,expiresIn,refreshExpiresIn,user:{id,name,phone}}`。有效期以秒计，由服务端决定；错误使用 HTTP 401/403 等状态。刷新凭证应由服务端安全签发、存储摘要、轮换并支持撤销。客户端没有固定两天清理任务；每次进入前台调用 `ensureSession()`，业务授权请求接入时也必须先调用它。网络故障保留凭证以便重试；服务器拒绝或刷新凭证过期才清理登录态。禁止只修改前端日期绕过服务端过期。

微信 AppSecret、微信 session_key 不发送到小程序。手机号快捷登录使用微信 `getPhoneNumber`，不是未验证手机号登录，也未接入短信服务。微信主体资格/接口权限、request 合法域名、真实隐私协议仍需运营方配置；未配置时页面提示服务未开通，不能真实登录。客服、预约咨询申请和反馈使用独立的本机游客会话，当前不会在不同手机之间按微信账号合并。

参考：[uni.login](https://uniapp.dcloud.net.cn/api/plugins/login.html)。

## 地图

微信使用原生 map 显示真实底图，`uni.openLocation` 打开导航页，由微信和手机决定可用地图应用，不承诺强制拉起指定第三方 App。H5 使用 OpenStreetMap 嵌入图，并提供高德、腾讯官方地图 URI 链接。仍须在真机核验地图展示、权限提示与外部 App 调起。

园区综合服务中心坐标源：[OSM way 1117890318](https://www.openstreetmap.org/way/1117890318)。四个建筑节点的 WGS84 质心为 `(19.15094955,110.494251225)`，转换 GCJ-02 后为 `(19.149250,110.498542)`。仅为综合服务中心，不是医院入口；具体医院应在地图中再次选择。旧静态院区示意图已移除。

参考：[map 组件](https://uniapp.dcloud.net.cn/component/map.html)、[openLocation](https://en.uniapp.dcloud.io/api/location/open-location.html)、[高德 URI](https://lbs.amap.com/api/uri-api/guide/search/search)。

## 尚缺内容

- 设置保留账户与安全、隐私协议、清除缓存、退出登录四项。按用户允许移除语言选择，界面统一使用简体中文。
- 真实福利活动标题、图片、正文，目前不虚构活动，发布后可填入 data/service-articles.js。
- 真实客服电话，底部电话仍为待更新。
