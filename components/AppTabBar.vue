<template>
	<view class="app-tabbar"
		><button
			v-for="tab in tabs"
			:key="tab.key"
			class="tab-item"
			:class="{ 'is-active': active === tab.key, 'is-support': tab.key === 'support' }"
			:aria-label="tab.title"
			@tap="open(tab)"
		>
			<view class="tab-icon-wrap" :class="{ 'mascot-wrap': tab.key === 'support' }"
				><image v-if="tab.key === 'support'" class="support-mascot" src="/static/images/customer-service-mascot.png" mode="aspectFit" aria-label="客服形象" /><AppIcon v-else
					:name="active === tab.key ? tab.activeIcon : tab.icon"
					:color="active === tab.key ? 'blue' : 'ink'"
					:size="43" /><view
					v-if="tab.key === 'support' && unread"
					class="tab-dot" /></view
			><text>{{ tab.title }}</text>
		</button></view
	>
</template>
<script setup>
import AppIcon from "./AppIcon.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { openTab } from "../utils/navigation";
import { hasUnread } from "../utils/demo-store";
const props = defineProps({ active: { type: String, default: "home" } });
const unread = ref(hasUnread());
const refresh = () => {
	unread.value = hasUnread();
};
onShow(refresh);
onMounted(() => uni.$on("lecheng:data", refresh));
onUnmounted(() => uni.$off("lecheng:data", refresh));
const tabs = [
	{
		key: "home",
		title: "首页",
		icon: "home",
		activeIcon: "home-fill",
		url: "/pages/index/index",
	},
	{
		key: "search",
		title: "查询",
		icon: "search",
		activeIcon: "search",
		url: "/pages/search/search",
	},
	{
		key: "support",
		title: "客服",
		url: "/pages/support/support",
	},
	{
		key: "messages",
		title: "动态",
		icon: "message",
		activeIcon: "message-fill",
		url: "/pages/messages/messages",
	},
	{
		key: "mine",
		title: "我的",
		icon: "user",
		activeIcon: "user-fill",
		url: "/pages/mine/mine",
	},
];
function open(tab) {
	openTab(tab.key);
}
</script>
<style scoped>
.app-tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	display: flex;
	justify-content: space-around;
	height: calc(116rpx + env(safe-area-inset-bottom));
	padding: 12rpx 16rpx calc(8rpx + env(safe-area-inset-bottom));
	background: #fff;
	border-top: 1rpx solid #e7edf5;
}
.tab-item {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3rpx;
	font-size: 22rpx;
	color: #7d8da4;
}
.tab-item.is-active {
	color: #0785ff;
	font-weight: 600;
}
.tab-icon-wrap {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 47rpx;
}
.mascot-wrap { height: 118rpx; margin-top: -53rpx; }
.support-mascot { width: 112rpx; height: 118rpx; }
.tab-item.is-support { overflow: visible; }
.tab-dot {
	position: absolute;
	width: 10rpx;
	height: 10rpx;
	background: #ff7474;
	border-radius: 50%;
	right: -7rpx;
	top: 0;
}
/* #ifdef H5 */
@media (min-width: 600px) {
	.app-tabbar {
		max-width: 480px;
		margin: 0 auto;
	}
}
/* #endif */
</style>
