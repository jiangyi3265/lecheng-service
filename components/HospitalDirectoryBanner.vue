<template>
	<view class="directory-banner">
		<view class="directory-brand">
			<AppIcon name="building" color="white" :size="40" />
			<text>乐城医院</text>
		</view>
		<view class="directory-count"><text class="directory-number">{{ total }}</text><text>家</text></view>
		<view class="directory-landmarks">
			<button v-for="item in landmarks" :key="item.id" class="directory-landmark" :aria-label="item.name" @tap="openHospital(item.id)">
				<image :src="`/static/images/hospital-${item.art}.png`" mode="aspectFit" class="landmark-image" />
				<text class="landmark-label">{{ item.label }}</text>
			</button>
		</view>
	</view>
</template>
<script setup>
import AppIcon from "./AppIcon.vue";
import { openHospital } from "../utils/navigation";
defineProps({ total: { type: Number, required: true } });
const landmarks = [
	{ id: "international", name: "乐城国际医学中心", label: "国际医学", art: "general" },
	{ id: "specialist", name: "乐城专科医疗中心", label: "专科医疗", art: "specialist" },
];
</script>
<style scoped>
.directory-banner {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14rpx;
	height: 112rpx;
	margin-top: 32rpx;
	padding: 0 16rpx;
	border-radius: 28rpx 28rpx 0 0;
	background: linear-gradient(118deg, rgba(255,255,255,.16) 0 13%, transparent 13% 20%, rgba(255,255,255,.10) 20% 31%, transparent 31%), linear-gradient(180deg, #8dc6fc, #398bea);
	box-shadow: inset 0 2rpx 0 #c1e0ff;
}
.directory-brand {
	display: flex;
	align-items: center;
	gap: 8rpx;
	color: #f5fbff;
	font-size: 35rpx;
	font-weight: 750;
	font-style: italic;
	white-space: nowrap;
	text-shadow: 0 3rpx 3rpx rgba(31,91,173,.26);
}
.directory-count {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 9rpx;
	flex: 1;
	height: 66rpx;
	min-width: 100rpx;
	max-width: 166rpx;
	border: 2rpx solid #f5fbff;
	border-radius: 12rpx;
	background: #e5f2ff;
	color: #233e52;
	font-size: 24rpx;
	line-height: 60rpx;
}
.directory-number {
	color: #327fd7;
	font-size: 44rpx;
	font-weight: 750;
}
.directory-landmarks {
	display: flex;
	align-self: flex-end;
	gap: 8rpx;
	margin-bottom: 7rpx;
}
.directory-landmark {
	position: relative;
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100rpx;
	overflow: visible;
}
.landmark-image {
	width: 88rpx;
	height: 85rpx;
	margin-bottom: -13rpx;
}
.landmark-label {
	position: relative;
	width: 100%;
	border: 2rpx solid #a5e1ee;
	border-radius: 26rpx;
	background: #2799ad;
	color: #f3fcff;
	font-size: 20rpx;
	line-height: 30rpx;
	white-space: nowrap;
}
</style>
