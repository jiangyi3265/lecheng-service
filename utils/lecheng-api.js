import { ref } from "vue";
import { hospitals } from "../data/medical.js";
import { approvedProjects, doctors, news, resources } from "../data/catalog.js";

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
        else reject(new Error(response.data?.msg || `接口请求失败 (${response.statusCode})`));
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
    catalogSource.value = "remote"; return true;
  })
    .catch(error => { catalogSource.value = "demo"; throw error; })
    .finally(() => { catalogRequest = null; });
  return catalogRequest;
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
  return request(path, method, data, token);
}

export const getMessages = () => personalRequest("/open/lecheng/messages");
export const sendMessage = text => personalRequest("/open/lecheng/messages", "POST", { text });
export const getAppointments = () => personalRequest("/open/lecheng/appointments");
export const requestAppointment = data => personalRequest("/open/lecheng/appointments", "POST", data);
export const cancelRequestedAppointment = id => personalRequest(`/open/lecheng/appointments/${encodeURIComponent(id)}`, "DELETE");
const feedbackRecord = item => ({ ...item, id: `FB${item.id}` });
export const getFeedback = () => personalRequest("/open/lecheng/feedback").then(list => list.map(feedbackRecord));
export const sendFeedback = text => personalRequest("/open/lecheng/feedback", "POST", { text }).then(feedbackRecord);
