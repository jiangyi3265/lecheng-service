<template>
	<view class="chat-page">
		<AppHeader :title="name" back fallback="/pages/messages/messages" />
		<view class="demo-note">静态演示助手 · 消息仅保存在本机</view>
		<view class="chat-content"
			><view class="chat-date">服务咨询</view
			><view class="chat-row"
				><view class="chat-avatar"
					><AppIcon name="robot" color="blue" :size="51" /></view
				><view class="chat-bubble">{{ greeting(name) }}</view></view
			>
			<view class="quick-questions"
				><button @tap="openSearch()">查询医院</button
				><button @tap="openService('预约须知')">就医指南</button
				><button @tap="openAppointments()">我的预约</button></view
			>
			<view
				v-for="message in messages"
				:key="message.id"
				class="chat-row"
				:class="{ own: message.role === 'user' }"
				><view v-if="message.role !== 'user'" class="chat-avatar"
					><AppIcon name="robot" color="blue" :size="51" /></view
				><view
					:class="
						message.role === 'user' ? 'own-bubble' : 'chat-bubble'
					"
					>{{ message.text }}</view
				><image
					v-if="message.role === 'user'"
					class="chat-user-avatar"
					src="/static/images/avatar.png" /></view
			><view id="chat-end" />
		</view>
		<view class="composer"
			><input
				v-model="draft"
				placeholder="请输入您想咨询的问题"
				confirm-type="send"
				maxlength="500"
				aria-label="咨询内容"
				@confirm="send" /><button
				:disabled="!draft.trim()"
				aria-label="发送消息"
				@tap="send"
			>
				<AppIcon name="send" color="white" :size="36" /></button
		></view>
	</view>
</template>
<script setup>
import { ref, nextTick, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import {
	chatMessages,
	sendDemoMessage,
	markChatRead,
	greeting,
} from "../../utils/demo-store";
import {
	openSearch,
	openService,
	openAppointments,
	routeText,
} from "../../utils/navigation";
const name = ref("乐城服务助手"),
	draft = ref(""),
	messages = ref([]);
onLoad((o) => {
	name.value = routeText(o.name, "乐城服务助手");
	draft.value = uni.getStorageSync("lecheng-draft-" + name.value) || "";
	refresh();
});
onShow(refresh);
watch(draft, (value) =>
	uni.setStorageSync("lecheng-draft-" + name.value, value),
);
function refresh() {
	messages.value = chatMessages(name.value);
	markChatRead(name.value);
}
async function send() {
	const text = draft.value.trim();
	if (!text) return;
	messages.value = sendDemoMessage(name.value, text);
	draft.value = "";
	await nextTick();
	uni.pageScrollTo({ selector: "#chat-end", duration: 180 });
}
</script>
<style scoped>
.chat-page {
	min-height: 100vh;
	background: #f3f7fc;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}
.demo-note {
	text-align: center;
	background: #e9f3ff;
	color: #6992bd;
	padding: 15rpx;
	font-size: 23rpx;
}
.chat-content {
	padding: 30rpx;
}
.chat-date {
	text-align: center;
	color: #99a6b9;
	font-size: 24rpx;
	margin: 10rpx 0 40rpx;
}
.chat-row {
	display: flex;
	align-items: flex-start;
	gap: 19rpx;
	margin-bottom: 30rpx;
}
.chat-avatar {
	background: #dceeff;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 84rpx;
	height: 84rpx;
	border-radius: 50%;
	flex-shrink: 0;
}
.chat-bubble,
.own-bubble {
	background: #fff;
	padding: 25rpx;
	border-radius: 4rpx 24rpx 24rpx 24rpx;
	font-size: 28rpx;
	line-height: 1.8;
	max-width: 530rpx;
	word-break: break-word;
}
.quick-questions {
	display: flex;
	gap: 20rpx;
	margin: 0 0 40rpx 103rpx;
}
.quick-questions button {
	border: 1rpx solid #cfe4f9;
	background: #fff;
	color: #0785ff;
	font-size: 25rpx;
	border-radius: 40rpx;
	padding: 12rpx 24rpx;
}
.own {
	justify-content: flex-end;
}
.own-bubble {
	background: #0785ff;
	color: #fff;
	border-radius: 24rpx 4rpx 24rpx 24rpx;
}
.chat-user-avatar {
	width: 84rpx;
	height: 84rpx;
	flex-shrink: 0;
}
.composer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	border-top: 1rpx solid #e5ecf5;
	padding: 23rpx 28rpx calc(23rpx + env(safe-area-inset-bottom));
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.composer input {
	flex: 1;
	height: 86rpx;
	padding: 0 24rpx;
	background: #f2f6fc;
	border-radius: 44rpx;
	font-size: 27rpx;
}
.composer button {
	width: 82rpx;
	height: 82rpx;
	border-radius: 50%;
	background: #0785ff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.composer button[disabled] {
	background: #a6cef4;
}
/* #ifdef H5 */
@media (min-width: 600px) {
	.composer {
		max-width: 480px;
		margin: 0 auto;
	}
}
/* #endif */
</style>

<style scoped>
.quick-questions {
	flex-wrap: wrap;
	margin-left: 0;
	margin-bottom: 30rpx;
	gap: 12rpx;
}
.quick-questions button {
	font-size: 24rpx;
	padding: 10rpx 24rpx;
}
.chat-bubble,
.own-bubble {
	flex: 0 1 auto;
	min-width: 0;
	max-width: calc(100% - 105rpx);
}
</style>
