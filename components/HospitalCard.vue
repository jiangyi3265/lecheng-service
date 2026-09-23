<template>
	<button class="hospital-row" :class="{ 'is-compact': compact, 'is-cover': cover }"
		:aria-label="`查看${hospital.name}详情`" @tap="openHospital(hospital.id)">
		<view v-if="cover" class="cover-photo">
			<ScenePhoto :scene="hospital.scene" :label="hospital.name">
				<view class="cover-caption">
					<text class="cover-name">{{ hospital.name }}</text>
					<AppIcon name="chevron" color="white" :size="28" />
				</view>
			</ScenePhoto>
		</view>
		<template v-else>
			<view class="hospital-photo"><ScenePhoto :scene="hospital.scene" :label="hospital.name" /></view>
			<view class="hospital-info">
				<text class="hospital-name">{{ hospital.name }}</text>
				<view class="hospital-tags"><text v-for="tag in hospital.tags" :key="tag" class="pill">{{ tag }}</text></view>
				<text class="hospital-description">{{ hospital.subtitle }}</text>
				<view class="hospital-more"><text>查看详情</text><AppIcon name="chevron" color="blue" :size="22" /></view>
			</view>
		</template>
	</button>
</template>
<script setup>
import ScenePhoto from "./ScenePhoto.vue";
import AppIcon from "./AppIcon.vue";
import { openHospital } from "../utils/navigation";
defineProps({ hospital: { type: Object, required: true }, compact: Boolean, cover: Boolean });
</script>
<style scoped>
.hospital-row {
	display: flex;
	gap: 26rpx;
	text-align: left;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #edf1f7;
	width: 100%;
}
.hospital-row:last-child {
	border-bottom: 0;
}
.hospital-photo {
	height: 205rpx;
	width: 290rpx;
	border-radius: 14rpx;
	overflow: hidden;
	flex-shrink: 0;
}
.hospital-info {
	display: flex;
	flex: 1;
	min-width: 0;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 9rpx;
}
.hospital-name {
	font-size: 27rpx;
	line-height: 1.35;
	font-weight: 650;
	white-space: nowrap;
}
.hospital-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}
.hospital-description {
	font-size: 23rpx;
	line-height: 1.5;
	color: #8292a8;
}
.hospital-more {
	display: flex;
	align-items: center;
	color: #0785ff;
	font-size: 24rpx;
	font-weight: 500;
	margin-top: 2rpx;
}
.is-compact {
	gap: 25rpx;
	padding: 20rpx 0;
}
.is-compact .hospital-photo {
	height: 180rpx;
	width: 262rpx;
}
.is-compact .hospital-info {
	gap: 8rpx;
}
.is-compact .hospital-name {
	font-size: 28rpx;
}
.hospital-row.is-cover {
	display: block;
	height: 360rpx;
	padding: 0;
	border: 0;
	border-radius: 18rpx;
	overflow: hidden;
}
.cover-photo { width: 100%; height: 100%; }
.cover-caption {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 20rpx 24rpx;
	background: rgba(17, 89, 162, .82);
	color: #f7faff;
	text-align: left;
}
.cover-name { flex: 1; min-width: 0; font-size: 29rpx; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
</style>
