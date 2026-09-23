<template>
	<view class="page secondary-page" :class="{ 'settings-page': isSettingsPage }">
		<AppHeader :title="title" back :back-label="type === '资讯详情' || isSettingsPage ? '返回' : ''" :fallback="fallback" />
		<SettingsPanel v-if="isSettingsPage" :page="type" />
		<NewsArticle v-else-if="type === '资讯详情' && article" :article="article" />
		<NewsArticle v-else-if="serviceArticle" :article="serviceArticle" :show-favorite="false" />
		<view v-else class="detail-content">
			<template v-if="type === '我的收藏' || type === '浏览记录'">
				<view class="between"
					><text class="muted small"
						>共 {{ savedItems.length }} 条记录</text
					><button
						v-if="type === '浏览记录' && savedItems.length"
						class="link"
						@tap="clearHistory"
					>
						清空记录
					</button></view
				>
				<view class="selection-chips"
					><button
						v-for="group in groups"
						:key="group"
						class="selection-chip"
						:class="{ selected: filter === group }"
						@tap="filter = group"
					>
						{{ group }}
					</button></view
				>
				<view
					v-for="item in filteredItems"
					:key="item.key"
					class="saved-entry"
					><HospitalCard
						v-if="item.itemType === 'hospital'"
						:hospital="item"
						compact
					/><ResourceCard
						v-else-if="item.itemType === 'resource'"
						:item="item"
						/><button v-else-if="item.itemType === 'news'" class="saved-news" @tap="openService('资讯详情', { id: item.id })">
							<view class="saved-news-cover"><ScenePhoto :scene="item.scene" :label="item.title" /></view>
							<view class="flex-1"><text class="section-title">{{ item.title }}</text><text class="muted small preview">{{ item.date }} · 示例</text></view>
						</button><DoctorCard v-else :doctor="item" /><button
						v-if="type === '我的收藏'"
						class="remove-favorite"
						@tap="removeFavorite(item.key)"
					>
						移除收藏
					</button></view
				>
				<view v-if="!filteredItems.length" class="empty-state"
					><AppIcon
						:name="type === '我的收藏' ? 'star' : 'clock'"
						color="muted"
						:size="84"
					/><text class="empty-title">{{
						type === "我的收藏"
							? "还没有相关收藏"
							: "还没有相关浏览记录"
					}}</text
					><text class="small"
						>医院、药械、医生和资讯的记录都会保存在这里</text
					><button class="empty-action" @tap="openSearch()">
						去查看医疗资源
					</button></view
				>
			</template>
			<ArticleList v-else-if="type === '福利活动' || type === '服务流程'" :items="serviceArticlesFor(type)" :empty-text="type === '福利活动' ? '暂无福利活动' : '暂无服务流程'" @select="openService(type + '详情', { id: $event.id })" />
			<template v-else-if="type === '我的咨询'">
				<button
					v-for="chat in conversations"
					:key="chat.name"
					class="list-row conversation-link"
					@tap="openChat(chat.name)"
				>
					<AppIcon name="chat" color="blue" :size="53" /><view
						class="flex-1"
						><text class="section-title">{{ chat.name }}</text
						><text class="muted small preview">{{
							chat.last
						}}</text></view
					><AppIcon name="chevron" color="muted" :size="26" />
				</button>
				<button class="outline-button section-space" @tap="openChat()">
					咨询服务助手
				</button>
			</template>
			<template v-else-if="type === '帮助与反馈'">
				<text class="section-title">常见问题</text
				><view v-for="(faq, index) in faqs" :key="faq.q" class="faq"
					><button
						class="faq-question"
						@tap="expanded = expanded === index ? -1 : index"
					>
						<text>{{ faq.q }}</text
						><AppIcon
							name="down"
							color="muted"
							:size="26"
						/></button
					><text
						v-if="expanded === index"
						class="detail-description"
						>{{ faq.a }}</text
					></view
				>
				<view class="section-space"
					><view class="between"
						><text class="section-title">意见反馈</text
						><button class="link" @tap="openService('我的反馈')">
							反馈记录 ›
						</button></view
					><textarea
						v-model="feedback"
						class="feedback-input"
						maxlength="500"
						placeholder="请描述遇到的问题或建议"
						aria-label="意见反馈"
					/><text class="demo-label">{{ apiBaseUrl ? '反馈会提交至乐城后台处理。' : '演示提交，仅保存在本机。' }}</text
					><text v-if="feedbackError" class="inline-error">{{
						feedbackError
					}}</text
					><button class="primary-button" @tap="saveFeedback">
						{{ apiBaseUrl ? '提交反馈' : '提交反馈（演示）' }}
					</button></view
				>
			</template>
			<template v-else-if="type === '我的反馈'">
				<button
					v-for="item in feedbacks"
					:key="item.id"
					class="feedback-record"
					@tap="openService('反馈详情', { id: item.id })"
				>
					<view class="between"
						><text class="section-title">意见反馈</text
						><text class="pill">{{ item.status }}</text></view
					><text class="detail-description">{{ item.text }}</text
					><text class="link">查看详情 ›</text>
				</button>
				<view v-if="!feedbacks.length" class="empty-state"
					><text class="empty-title">还没有反馈记录</text
					><button
						class="empty-action"
						@tap="openService('帮助与反馈')"
					>
						填写反馈
					</button></view
				>
			</template>
			<template v-else-if="type === '联系医院' && contactHospital">
				<view class="contact-symbol"
					><AppIcon name="headset" color="blue" :size="84" /></view
				><text class="detail-heading">{{ contactHospital.name }}</text
				><text class="detail-description"
					>您可以通过在线咨询体验服务流程，也可以查看科室和到院指引。</text
				><view class="info-panel"
					><view class="info-line"
						><text>服务时间</text
						><text>09:00–17:00（示例）</text></view
					><view class="info-line"
						><text>联系电话</text><text>未配置真实电话</text></view
					><view class="info-line"
						><text>院区位置</text
						><text>{{ contactHospital.address }}</text></view
					></view
				><view class="action-pair"
					><button
						class="outline-button"
						@tap="openGuide(contactHospital.id)"
					>
						到院指引</button
					><button
						class="primary-button"
						@tap="openChat(contactHospital.name)"
					>
						在线咨询
					</button></view
				>
			</template>
			<template v-else-if="article">
				<view v-if="article.image !== undefined" class="article-image"
					><ScenePhoto :scene="article.image" /></view
				><view class="article-head"
					><AppIcon
						:name="article.icon || 'document'"
						color="blue"
						:size="57"
					/><text class="detail-heading">{{ article.title }}</text
					><text v-if="article.time" class="muted small">{{
						article.time
					}}</text></view
				><view
					v-for="(paragraph, index) in article.paragraphs"
					:key="index"
					class="article-paragraph"
					><text v-if="paragraph.title" class="section-title">{{
						paragraph.title
					}}</text
					><text class="detail-description">{{
						paragraph.text || paragraph
					}}</text></view
				>
				<button
					v-if="article.appointmentId"
					class="primary-button"
					@tap="openAppointment(article.appointmentId)"
				>
					查看预约记录</button
				><button
					v-if="article.action"
					class="primary-button"
					@tap="runAction(article.action)"
				>
					{{
						article.action === "选择医院"
							? "选择医院，开始预约"
							: article.action === "健康管理"
								? "查看健康管理医院"
								: "查看" + article.action
					}}</button
				><button
					v-if="type === '反馈详情'"
					class="outline-button"
					@tap="openService('我的反馈')"
				>
					查看全部反馈
				</button>
			</template>
			<view v-else class="empty-state"
				><text class="empty-title">暂未找到该内容</text
				><button class="empty-action" @tap="goBack(fallback)">
					返回上一页
				</button></view
			>
		</view>
	</view>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import HospitalCard from "../../components/HospitalCard.vue";
import ResourceCard from "../../components/ResourceCard.vue";
import DoctorCard from "../../components/DoctorCard.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import NewsArticle from "../../components/NewsArticle.vue";
import ArticleList from "../../components/ArticleList.vue";
import SettingsPanel from "../../components/SettingsPanel.vue";
import { serviceArticlesFor } from "../../data/service-articles";
import { hospitals } from "../../data/medical";
import { resolveSavedItem, news } from "../../data/catalog";
import { faqs, articles } from "../../data/content";
import { readList, saveList, toggleFavorite, recordVisit } from "../../utils/storage";
import { apiBaseUrl, getFeedback, sendFeedback } from "../../utils/lecheng-api";
import {
	getNotices,
	markNoticeRead,
	submitFeedback,
} from "../../utils/demo-store";
import {
	routeText,
	openSearch,
	openChat,
	openService,
	openGuide,
	openAppointment,
	navigate,
	goBack,
} from "../../utils/navigation";
const type = ref("我的收藏"),
	itemId = ref(""),
	hospitalId = ref(""),
	savedItems = ref([]),
	conversations = ref([]),
	feedbacks = ref([]),
	notifications = ref([]),
	filter = ref("全部"),
	expanded = ref(0),
	feedback = ref(""),
	feedbackError = ref("");
const isSettingsPage = computed(() => ['设置', '账户与安全'].includes(type.value));
const groups = ["全部", "医院", "药品", "器械", "医生", "资讯"];
const serviceArticle = computed(() => ['福利活动详情', '服务流程详情'].includes(type.value) ? serviceArticlesFor(type.value.replace('详情', '')).find((item) => item.id === itemId.value) : null);
const title = computed(() => (type.value === "资讯详情" ? "文章详情" : type.value === "通知" ? "系统通知" : type.value));
const fallback = computed(() =>
	[
		"我的收藏",
		"浏览记录",
		"我的咨询",
		"我的反馈",
		"反馈详情",
		"设置",
		"账户与安全",
		"隐私协议",
		"帮助与反馈",
		"隐私说明",
		"关于乐城服务",
		"福利活动",
		"服务流程",
		"福利活动详情",
		"服务流程详情",
	].includes(type.value)
		? "/pages/mine/mine"
		: ["通知", "资讯详情"].includes(type.value)
			? "/pages/messages/messages"
			: "/pages/index/index",
);
const filteredItems = computed(() =>
	savedItems.value.filter(
		(i) => filter.value === "全部" || i.kind === filter.value,
	),
);
const contactHospital = computed(() =>
	hospitals.find((h) => h.id === hospitalId.value),
);
const article = computed(() => {
	if (type.value === '隐私协议') return { ...articles['隐私说明'], title: '隐私协议' };
	if (type.value === "通知") {
		const n = notifications.value.find((n) => n.id === itemId.value);
		return n ? { ...n, icon: "notice", paragraphs: [n.body] } : null;
	}
	if (type.value === "资讯详情") {
		const n = news.find((n) => n.id === itemId.value);
		return n
			? { ...n, image: n.scene, time: n.date + " · 静态资讯示例" }
			: null;
	}
	if (type.value === "反馈详情") {
		const f = feedbacks.value.find((f) => f.id === itemId.value);
		return f
			? {
					title: "您的反馈已记录",
					icon: "check",
					paragraphs: [
						{ title: "反馈内容", text: f.text },
						{ title: "当前状态", text: f.status },
						{ title: "反馈编号", text: f.id },
						"本条反馈仅保存在当前设备，未发送到真实客服。",
					],
				}
			: null;
	}
	return articles[type.value] || null;
});
onLoad((o) => {
	type.value = routeText(o.type, "我的收藏");
	itemId.value = o.id || "";
	if (type.value === "资讯详情" && news.some((n) => n.id === itemId.value)) recordVisit("news:" + itemId.value);
	hospitalId.value = o.hospitalId || "";
	feedback.value = uni.getStorageSync("lecheng-feedback") || "";
	if (
		type.value === "通知" &&
		getNotices().some((n) => n.id === itemId.value)
	)
		markNoticeRead(itemId.value);
	refresh();
});
onShow(refresh);
watch(feedback, (v) => uni.setStorageSync("lecheng-feedback", v));
async function refresh() {
	savedItems.value = readList(
		type.value === "我的收藏" ? "favorites" : "history",
	)
		.map(resolveSavedItem)
		.filter(Boolean);
	conversations.value = readList("conversations");
	feedbacks.value = readList("feedbacks");
	if (apiBaseUrl && (type.value === "我的反馈" || type.value === "反馈详情")) {
		try { feedbacks.value = await getFeedback(); saveList("feedbacks", feedbacks.value); }
		catch (error) { console.warn("反馈记录同步失败", error); }
	}
	notifications.value = getNotices();
}
function removeFavorite(key) {
	toggleFavorite(key);
	refresh();
}
function clearHistory() {
	uni.showModal({
		title: "清空浏览记录",
		content: "仅清空浏览记录，收藏和预约不会受到影响。",
		confirmColor: "#0785ff",
		success: (r) => {
			if (r.confirm) {
				saveList("history", []);
				refresh();
			}
		},
	});
}
async function saveFeedback() {
	feedbackError.value = "";
	try {
		if (!feedback.value.trim()) throw Error("请填写反馈内容");
		const item = apiBaseUrl ? await sendFeedback(feedback.value.trim()) : submitFeedback(feedback.value);
		if (apiBaseUrl) saveList("feedbacks", [item, ...readList("feedbacks").filter((f) => f.id !== item.id)]);
		feedback.value = "";
		openService("反馈详情", { id: item.id });
	} catch (e) {
		feedbackError.value = e.message;
	}
}
function runAction(action) {
	if (action === "健康管理") openSearch("医院", { type: "健康管理" });
	else if (action === "选择医院") openSearch("医院");
	else openService(action);
}
</script>
<style scoped>
.settings-page { background: #f6f6f6; }
.saved-news { display: flex; align-items: center; gap: 24rpx; width: 100%; padding: 24rpx 0; text-align: left; }
.saved-news-cover { width: 210rpx; height: 150rpx; flex-shrink: 0; border-radius: 16rpx; overflow: hidden; }
.saved-news .section-title { font-size: 28rpx; line-height: 1.5; }
.saved-entry {
	position: relative;
}
.remove-favorite {
	margin-left: auto;
	font-size: 23rpx;
	color: #8d9daf;
	padding: 10rpx 8rpx 18rpx;
}
.conversation-link {
	width: 100%;
	text-align: left;
	min-height: 150rpx;
}
.conversation-link .section-title {
	font-size: 29rpx;
}
.preview {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 10rpx;
}
.faq {
	border-bottom: 1rpx solid #eaf0f7;
}
.faq-question {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	width: 100%;
	text-align: left;
	padding: 28rpx 0;
	font-size: 29rpx;
}
.feedback-input {
	width: 100%;
	height: 270rpx;
	margin: 25rpx 0 15rpx;
	padding: 24rpx;
	background: #f3f7fc;
	border: 1rpx solid #e3edf6;
	border-radius: 22rpx;
	font-size: 27rpx;
	line-height: 1.7;
}
.feedback-record {
	width: 100%;
	padding: 25rpx;
	border: 1rpx solid #e3edf6;
	border-radius: 22rpx;
	margin-bottom: 24rpx;
	text-align: left;
}
.feedback-record .detail-description {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.settings-list button {
	width: 100%;
	text-align: left;
}
.setting-hint {
	display: block;
	color: #8e9eb2;
	font-size: 22rpx;
}
.contact-symbol {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 138rpx;
	height: 138rpx;
	border-radius: 38rpx;
	background: #e9f5ff;
	margin: 25rpx 0;
}
.article-image {
	height: 350rpx;
	border-radius: 24rpx;
	overflow: hidden;
	margin-bottom: 30rpx;
}
.article-head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10rpx;
	padding-top: 15rpx;
}
.article-paragraph {
	margin: 28rpx 0;
}
</style>
