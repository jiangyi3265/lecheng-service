<template>
	<view class="page secondary-page"
		><AppHeader
			title="科室详情"
			back
			fallback="/pages/search/search"
		/><view v-if="hospital && feature" class="detail-content"
			><view class="department-hero"
				><view class="department-symbol"
					><AppIcon
						:name="feature.icon"
						color="blue"
						:size="79" /></view
				><text class="detail-heading">{{ feature.name }}</text
				><button class="row link" @tap="openHospital(hospital.id)">
					{{ hospital.name
					}}<AppIcon
						name="chevron"
						color="blue"
						:size="25"
					/></button></view
			><text class="section-title">科室介绍</text
			><text class="detail-description"
				>{{
					feature.name
				}}提供就诊咨询、资料准备与就诊流程指引。您可以查看医生资料和演示排班，选择合适的时段体验预约。</text
			><view class="info-panel"
				><view class="info-line"
					><text>门诊时间</text
					><text>09:00–17:00（示例）</text></view
				><view class="info-line"
					><text>所在院区</text
					><text>{{ hospital.name }} · 门诊区</text></view
				></view
			><text class="section-title">科室医生</text
			><DoctorCard
				v-for="doctor in members"
				:key="doctor.id"
				:doctor="doctor"
			/><text class="demo-label"
				>科室、医生及排班为静态示例，不代表真实接诊安排。</text
			><view class="action-pair"
				><button class="outline-button" @tap="openGuide(hospital.id)">
					到院指引</button
				><button
					class="primary-button"
					@tap="openChat(hospital.name + ' · ' + feature.name)"
				>
					咨询科室
				</button></view
			></view
		><view v-else class="empty-state"
			><text class="empty-title">暂未找到该科室</text
			><button class="empty-action" @tap="goBack('/pages/search/search')">
				返回上一页
			</button></view
		></view
	>
</template>
<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import DoctorCard from "../../components/DoctorCard.vue";
import { hospitals } from "../../data/medical";
import { doctors } from "../../data/catalog";
import {
	routeText,
	openHospital,
	openGuide,
	openChat,
	goBack,
} from "../../utils/navigation";
const hospital = ref(null),
	feature = ref(null);
const members = computed(() =>
	doctors.filter(
		(d) =>
			d.hospitalId === hospital.value?.id &&
			d.department === feature.value?.name,
	),
);
onLoad((o) => {
	hospital.value = hospitals.find((h) => h.id === o.hospitalId);
	feature.value = hospital.value?.features.find(
		(f) => f.name === routeText(o.name),
	);
});
</script>
<style scoped>
.department-hero {
	padding: 25rpx 0 46rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 9rpx;
}
.department-symbol {
	width: 138rpx;
	height: 138rpx;
	background: #e8f5ff;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
