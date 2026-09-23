<template>
	<view class="app-header" :class="{ 'header-tint': tint }">
		<view class="status-space" :style="{ height: statusHeight + 'px' }">
			<!-- #ifdef H5 -->
			<text class="demo-time">9:41</text
			><view class="demo-signals"
				><view class="signal"><view /><view /><view /><view /></view
				><AppIcon name="wifi" :size="28" /><view class="battery"
					><view /></view
			></view>
			<!-- #endif -->
		</view>
		<view
			class="toolbar"
			:style="{
				height: navHeight + 'px',
				paddingRight: menuSpace + 'px',
			}"
		>
			<view v-if="home" class="home-location"
				><AppIcon name="pin" color="blue" :size="27" /><text
					>海南 · 博鳌乐城</text
				></view
			>
			<button
				v-else-if="back"
				class="icon-button back-button"
				aria-label="返回"
				@tap="goBack"
			>
				<AppIcon name="back" :size="39" />
				<text v-if="backLabel" class="back-label">{{ backLabel }}</text>
			</button>
			<text class="header-title" :class="{ 'home-title': home, 'brand-title': brand }">{{
				title
			}}</text>
			<view class="header-action"><slot /></view>
		</view>
	</view>
</template>
<script setup>
import { ref } from "vue";
import AppIcon from "./AppIcon.vue";
import { goBack as returnToPrevious } from "../utils/navigation";
const props = defineProps({
	title: String,
	home: Boolean,
	back: Boolean,
	backLabel: { type: String, default: "" },
	tint: Boolean,
	brand: Boolean,
	fallback: { type: String, default: "/pages/index/index" },
});
const statusHeight = ref(28),
	navHeight = ref(46),
	menuSpace = ref(16);
// #ifndef H5
const info = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
statusHeight.value = info.statusBarHeight || 20;
// #endif
// #ifdef MP-WEIXIN
const capsule = uni.getMenuButtonBoundingClientRect();
navHeight.value = (capsule.top - statusHeight.value) * 2 + capsule.height;
menuSpace.value = info.windowWidth - capsule.left + 10;
// #endif
function goBack() {
	returnToPrevious(props.fallback);
}
</script>
<style scoped>
.app-header {
	background: #fff;
}
.header-tint {
	background: transparent;
}
.status-space {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 42rpx;
}
.demo-time {
	font-size: 24rpx;
	font-weight: 650;
	color: #102238;
}
.demo-signals {
	display: flex;
	align-items: center;
	gap: 9rpx;
}
.signal {
	display: flex;
	align-items: flex-end;
	gap: 3rpx;
	height: 22rpx;
}
.signal view {
	width: 5rpx;
	background: #142c4d;
	border-radius: 2rpx;
}
.signal view:nth-child(1) {
	height: 8rpx;
}
.signal view:nth-child(2) {
	height: 13rpx;
}
.signal view:nth-child(3) {
	height: 18rpx;
}
.signal view:nth-child(4) {
	height: 22rpx;
}
.battery {
	width: 34rpx;
	height: 17rpx;
	border: 2rpx solid #142c4d;
	border-radius: 4rpx;
	padding: 2rpx;
	margin-left: 2rpx;
}
.battery view {
	height: 100%;
	background: #142c4d;
	border-radius: 1rpx;
}
.toolbar {
	position: relative;
	display: flex;
	align-items: center;
	padding-left: 32rpx;
}
.header-title {
	max-width: calc(100% - 180rpx);
	overflow: hidden;
	text-overflow: ellipsis;
	pointer-events: none;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	font-size: 32rpx;
	font-weight: 650;
	white-space: nowrap;
}
.home-location {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 21rpx;
	color: #63778e;
}
.home-title {
	left: 54%;
	font-size: 32rpx;
}
.header-action {
	margin-left: auto;
	display: flex;
	align-items: center;
	z-index: 1;
}
.back-button {
	width: auto;
	gap: 8rpx;
	margin-left: -22rpx;
	position: relative;
	z-index: 3;
}
.back-label { font-size: 28rpx; white-space: nowrap; }
.header-action:empty {
	display: none;
}
/* #ifdef MP-WEIXIN */
.home-location {
	max-width: 235rpx;
	white-space: nowrap;
	font-size: 18rpx;
}
.home-title {
	left: 47%;
	font-size: 28rpx;
}
.header-title {
	left: 43%;
}
/* #endif */
.header-title.brand-title { left: 30rpx; transform: none; color: #fff; font-size: 39rpx; font-weight: 700; }
</style>
