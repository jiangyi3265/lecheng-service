import { reactive, computed } from "vue";

// 客服页头像、顶部标题、开场白和在线时间；后台“客服设置”发布后由 loadExtras 覆盖
export const DEFAULT_SUPPORT_AVATAR = "/static/images/customer-service-avatar.jpg";
export const DEFAULT_SUPPORT_SETTINGS = Object.freeze({
	avatar: "",
	caption: "乐城服务为您服务",
	greeting: "您好：我是人工客服，我可以为您提供博鳌乐城：项目介绍、预约评估、陪诊服务咨询、预约流程相关信息。",
	hours: "人工在线时间：早8：00-晚22：00",
});
export const supportSettings = reactive({ ...DEFAULT_SUPPORT_SETTINGS });
export const supportAvatar = computed(() => supportSettings.avatar || DEFAULT_SUPPORT_AVATAR);
