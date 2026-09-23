<template>
	<view class="support-banner"
		><AppIcon name="chat" color="blue" :size="57" /><view
			class="support-copy"
			><text class="support-title">不知道如何选择？</text
			><text class="support-subtitle">专业客服为您提供建议</text></view
		><button class="support-button" @tap="navigate('/pages/support/support')">
			咨询客服
		</button></view
	>
</template>
<script setup>
import AppIcon from "./AppIcon.vue";
import { navigate } from "../utils/navigation";
</script>
<style scoped>
.support-banner {
	display: flex;
	align-items: center;
	gap: 17rpx;
	background: #e8f3ff;
	border-radius: 18rpx;
	padding: 18rpx 20rpx;
}
.support-copy {
	display: flex;
	flex: 1;
	min-width: 0;
	flex-direction: column;
}
.support-title {
	color: #0785ff;
	font-size: 26rpx;
	font-weight: 600;
}
.support-subtitle {
	color: #8292a8;
	font-size: 21rpx;
}
.support-button {
	flex-shrink: 0;
	border-radius: 40rpx;
	background: #0785ff;
	color: #fff;
	font-size: 24rpx;
	padding: 12rpx 24rpx;
}
</style>
