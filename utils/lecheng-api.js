import { ref } from "vue";
import { hospitals } from "../data/medical.js";
import { approvedProjects, doctors, news, resources } from "../data/catalog.js";
import { policies } from "../data/policies.js";
import { aboutSections } from "../data/about.js";
import { DEFAULT_SUPPORT_SETTINGS, supportSettings } from "../data/support.js";
import { DEFAULT_SERVICE_CONTACT, serviceContact } from "../data/service-contact.js";
import { DEFAULT_BANNERS, banners } from "../data/banners.js";
import { benefitArticles, processArticles } from "../data/service-articles.js";
import { DEFAULT_PARK_GUIDE, destination } from "../data/park-map.js";
import {
  mapAboutSection, mapBanners, mapBenefit, mapParkGuide, mapPolicy, mapProcess, mapServiceContact, mapSupportSettings,
} from "./content-mapping.js";

const configured = (import.meta.env.VITE_LECHENG_API_BASE_URL || "").trim();
export const apiBaseUrl = configured.replace(/\/$/, "") || (import.meta.env.DEV ? "http://127.0.0.1:8080" : "");
export const catalogSource = ref(apiBaseUrl ? "loading" : "demo");
const SESSION_KEY = "lecheng-client-session";

function request(path, method = "GET", data, token = "") {
  if (!apiBaseUrl) return Promise.reject(new Error("尚未配置乐城后台接口地址"));
  return new Promise((resolve, reject) => {
    uni.request({
      url: apiBaseUrl + path,
      method,
      data,
      timeout: 10000,
      header: token ? { "X-Lecheng-Session": token } : {},
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300 && response.data?.code === 200)
          resolve(response.data.data);
        // status 表示后台有响应（含旧版后台没有该接口的 404/500），区别于断网
        else reject(Object.assign(new Error(response.data?.msg || `接口请求失败 (${response.statusCode})`), { status: response.statusCode, code: response.data?.code }));
      },
      fail(error) { reject(new Error(error.errMsg || "连接后台失败")); },
    });
  });
}

let catalogRequest;
export function loadCatalog() {
  if (!apiBaseUrl) return Promise.resolve(false);
  if (catalogRequest) return catalogRequest;
  const bindings = [
    ["hospital", hospitals], ["project", approvedProjects], ["resource", resources],
    ["news", news], ["doctor", doctors],
  ];
  catalogRequest = Promise.all(bindings.map(async ([kind]) => {
    const list = await request(`/open/lecheng/content/${kind}`);
    if (!Array.isArray(list)) throw new Error(`${kind} 内容格式错误`);
    return list;
  })).then(lists => {
    bindings.forEach(([, target], index) => target.splice(0, target.length, ...lists[index]));
    // 医生资料里存的医院名可能是旧的（医院改过名），按医院编号用当前医院名显示
    for (const doctor of doctors) {
      const current = hospitals.find((item) => item.id === doctor.hospitalId);
      if (current) doctor.hospitalName = current.name;
    }
    catalogSource.value = "remote"; return true;
  })
    .catch(error => { catalogSource.value = "demo"; throw error; })
    .finally(() => { catalogRequest = null; });
  return catalogRequest;
}

// 国家政策、了解乐城、客服设置（含“我的”页联系方式）、首页轮播、福利活动、服务流程、园区导航：各自加载，
// 任一失败（含旧版后台不认识该分类）只保留该项内置内容，不影响其他各项和 loadCatalog。
// 列表类以后台为准（后台为空就显示空状态），只有首页轮播在后台为空时保留内置两张，首页不出现空白大图
let extrasRequest;
export function loadExtras() {
  if (!apiBaseUrl) return Promise.resolve(false);
  if (extrasRequest) return extrasRequest;
  const load = (kind, apply) => request(`/open/lecheng/content/${kind}`)
    .then(list => {
      if (!Array.isArray(list)) throw new Error(`${kind} 内容格式错误`);
      apply(list); return true;
    })
    .catch(error => { console.warn(`${kind} 内容加载失败`, error); return false; });
  extrasRequest = Promise.all([
    load("policy", list => policies.splice(0, policies.length, ...list.map(mapPolicy))),
    load("about", list => aboutSections.splice(0, aboutSections.length, ...list.map(mapAboutSection))),
    load("support", list => {
      Object.assign(supportSettings, mapSupportSettings(list, DEFAULT_SUPPORT_SETTINGS, apiBaseUrl));
      Object.assign(serviceContact, mapServiceContact(list, DEFAULT_SERVICE_CONTACT));
    }),
    load("banner", list => banners.splice(0, banners.length, ...mapBanners(list, DEFAULT_BANNERS))),
    load("benefit", list => benefitArticles.splice(0, benefitArticles.length, ...list.map(mapBenefit))),
    load("process", list => processArticles.splice(0, processArticles.length, ...list.map(mapProcess))),
    load("guide", list => Object.assign(destination, mapParkGuide(list, DEFAULT_PARK_GUIDE))),
  ]).then(results => results.every(Boolean))
    .finally(() => { extrasRequest = null; });
  return extrasRequest;
}

let sessionRequest;
export async function getSessionToken() {
  const saved = uni.getStorageSync(SESSION_KEY);
  if (saved) return saved;
  if (!sessionRequest) sessionRequest = request("/open/lecheng/session", "POST")
    .then(data => { if (!data?.token) throw new Error("后台未返回会话凭证"); uni.setStorageSync(SESSION_KEY, data.token); return data.token; })
    .finally(() => { sessionRequest = null; });
  return sessionRequest;
}

async function personalRequest(path, method = "GET", data) {
  const token = await getSessionToken();
  try {
    return await request(path, method, data, token);
  } catch (error) {
    // 服务器已不认识这个会话（例如数据重置）：丢弃本机旧会话，新建后重试一次
    if (!String(error?.message || "").includes("会话已失效")) throw error;
    uni.removeStorageSync(SESSION_KEY);
    return request(path, method, data, await getSessionToken());
  }
}

export const getMessages = () => personalRequest("/open/lecheng/messages");
export const sendMessage = text => personalRequest("/open/lecheng/messages", "POST", { text });
export const getAppointments = () => personalRequest("/open/lecheng/appointments");
export const requestAppointment = data => personalRequest("/open/lecheng/appointments", "POST", data);
export const cancelRequestedAppointment = id => personalRequest(`/open/lecheng/appointments/${encodeURIComponent(id)}`, "DELETE");
const feedbackRecord = item => ({ ...item, id: `FB${item.id}` });
export const getFeedback = () => personalRequest("/open/lecheng/feedback").then(list => list.map(feedbackRecord));
export const sendFeedback = text => personalRequest("/open/lecheng/feedback", "POST", { text }).then(feedbackRecord);

// 客服未读数：只用本机已保存的会话凭证查询，从不为了轮询新建会话。
// 旧版后台没有这两个接口（404/500）时按 0 处理且不提示；断网时抛出，由调用方保留上次结果
const savedSessionToken = () => (apiBaseUrl ? uni.getStorageSync(SESSION_KEY) || "" : "");
export async function getUnreadCount() {
  const token = savedSessionToken();
  if (!token) return { count: 0, lastId: 0 };
  try {
    const data = await request("/open/lecheng/messages/unread", "GET", undefined, token);
    return { count: Math.max(0, Number(data?.count) || 0), lastId: Number(data?.lastId) || 0 };
  } catch (error) {
    if (error.status) return { count: 0, lastId: 0 };
    throw error;
  }
}
export async function markMessagesRead(lastId) {
  const token = savedSessionToken();
  if (!token) return { count: 0 };
  try {
    const data = await request("/open/lecheng/messages/read", "POST", { lastId: Number(lastId) || 0 }, token);
    return { count: Math.max(0, Number(data?.count) || 0) };
  } catch (error) {
    if (error.status) return { count: 0 };
    throw error;
  }
}
