<template>
	<view class="page secondary-page"
		><AppHeader title="医生详情" back fallback="/pages/search/search"
			><button
				v-if="doctor"
				class="icon-button"
				:aria-label="saved ? '取消收藏' : '收藏医生'"
				@tap="save"
			>
				<AppIcon
					:name="saved ? 'bookmark-fill' : 'bookmark'"
					:color="saved ? 'blue' : 'ink'"
					:size="40"
				/></button></AppHeader
		><view v-if="doctor" class="detail-content"
			><view class="doctor-intro"
				><view class="doctor-avatar"
					><AppIcon name="user-fill" color="blue" :size="100" /></view
				><view class="flex-1"
					><text class="detail-heading">{{ doctor.name }}</text
					><text class="muted">{{ doctor.title }}</text
					><text class="doctor-dept">{{
						doctor.department
					}}</text></view
				></view
			><button
				class="list-row hospital-link"
				@tap="openHospital(doctor.hospitalId)"
			>
				<AppIcon name="building" color="blue" :size="40" /><text
					class="flex-1"
					>{{ doctor.hospitalName }}</text
				><AppIcon name="chevron" color="muted" :size="25" /></button
			><view class="section-space"
				><text class="section-title">医生介绍</text
				><text class="detail-description">{{
					doctor.intro
				}}</text></view
			><text class="section-title">服务方向</text
			><view class="selection-chips"
				><text
					v-for="service in doctor.services"
					:key="service"
					class="pill"
					>{{ service }}</text
				></view
			><view class="info-panel"
				><text class="section-title">门诊排班</text
				><view
					v-for="date in dates.slice(0, 3)"
					:key="date.value"
					class="schedule-line"
					><text>{{ date.label }} {{ date.week }}</text
					><text class="link">上午 / 下午 · 可模拟预约</text></view
				></view
			><text class="demo-label"
				>医生和号源均为演示数据，提交不会产生真实挂号。</text
			><view class="action-pair"
				><button
					class="outline-button"
					@tap="openChat(doctor.name + ' · ' + doctor.department)"
				>
					在线咨询</button
				><button class="primary-button" @tap="openBooking(doctor.id)">
					预约门诊
				</button></view
			></view
		><view v-else class="empty-state"
			><text class="empty-title">暂未找到该医生</text
			><button class="empty-action" @tap="goBack('/pages/search/search')">
				返回上一页
			</button></view
		></view
	>
</template>
<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import { doctors, upcomingDates } from "../../data/catalog";
import { readList, toggleFavorite, recordVisit } from "../../utils/storage";
import {
	openHospital,
	openChat,
	openBooking,
	goBack,
} from "../../utils/navigation";
const doctor = ref(null),
	saved = ref(false),
	dates = upcomingDates();
onLoad((o) => {
	doctor.value = doctors.find((d) => d.id === o.id);
	if (doctor.value) {
		recordVisit("doctor:" + doctor.value.id);
		refresh();
	}
});
onShow(refresh);
function refresh() {
	saved.value = doctor.value
		? readList("favorites").includes("doctor:" + doctor.value.id)
		: false;
}
function save() {
	saved.value = toggleFavorite("doctor:" + doctor.value.id);
	uni.showToast({
		title: saved.value ? "已加入收藏" : "已取消收藏",
		icon: "none",
	});
}
</script>
<style scoped>
.doctor-intro {
	display: flex;
	align-items: center;
	gap: 30rpx;
	padding: 22rpx 0 32rpx;
}
.doctor-avatar {
	width: 168rpx;
	height: 182rpx;
	border-radius: 26rpx;
	background: #e8f5ff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.doctor-dept {
	display: block;
	color: #0785ff;
	margin-top: 9rpx;
}
.hospital-link {
	width: 100%;
	text-align: left;
}
.schedule-line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid #deebf8;
	font-size: 26rpx;
}
.schedule-line:last-child {
	border: 0;
}
.schedule-line .link {
	font-size: 23rpx;
}
</style>
