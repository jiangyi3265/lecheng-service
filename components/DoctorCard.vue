<template>
	<button class="doctor-card" @tap="openDoctor(doctor.id)">
		<view class="doctor-face"
			><AppIcon name="user-fill" color="blue" :size="72" /></view
		><view class="doctor-copy"
			><view class="row"
				><text class="doctor-name">{{ doctor.name }}</text
				><text class="pill">{{ doctor.department }}</text></view
			><text class="muted small">{{ doctor.title }}</text
			><text class="muted small">{{ doctor.hospitalName }}</text></view
		><AppIcon name="chevron" color="muted" :size="26" />
	</button>
</template>
<script setup>
import AppIcon from "./AppIcon.vue";
import { openDoctor } from "../utils/navigation";
defineProps({ doctor: { type: Object, required: true } });
</script>
<style scoped>
.doctor-card {
	display: flex;
	align-items: center;
	gap: 22rpx;
	width: 100%;
	padding: 28rpx 0;
	border-bottom: 1rpx solid #eaf0f7;
	text-align: left;
}
.doctor-face {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 118rpx;
	height: 128rpx;
	border-radius: 24rpx;
	background: #eaf5ff;
	flex-shrink: 0;
}
.doctor-copy {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
	min-width: 0;
}
.doctor-copy .row {
	gap: 14rpx;
	flex-wrap: wrap;
}
.doctor-name {
	font-size: 32rpx;
	font-weight: 600;
}
</style>
