<template>
	<button class="resource-card" :class="{ 'resource-card--medicine': medicineLayout }" @tap="openResource(item.id)">
		<template v-if="medicineLayout">
			<view class="medicine-heading"><text class="medicine-name">{{ item.name }}</text><text class="medicine-state">示例资料</text></view>
			<view class="medicine-body">
				<view class="medicine-thumb"><MedicinePackshot :label="item.name" compact /></view>
				<view class="medicine-meta">
					<text class="medicine-badge">特许药械 · 示例</text>
					<text>落地医院：{{ landingHospital?.name || '待补充' }}</text>
					<text>所属科室：{{ item.category }}</text>
					<text>资料来源：{{ item.brand }}</text>
					<text class="link">查看详情 ›</text>
				</view>
			</view>
		</template>
		<template v-else>
			<view v-if="photoLayout" class="resource-photo"><ScenePhoto :scene="scene" :label="item.name + ' · 示意配图'" /></view>
			<view v-else class="resource-picture"><AppIcon :name="item.icon" color="blue" :size="66" /><text>{{ item.kind }}</text></view>
			<view class="resource-copy">
				<text class="resource-name">{{ item.name }}</text>
				<view><text class="pill">{{ item.category }}</text><text class="resource-demo">示例资料</text></view>
				<text class="muted small">{{ item.summary }}</text>
				<text class="link">查看详情 ›</text>
			</view>
		</template>
	</button>
</template>

<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import ScenePhoto from "./ScenePhoto.vue";
import MedicinePackshot from "./MedicinePackshot.vue";
import { hospitals } from "../data/medical";
import { openResource } from "../utils/navigation";
const props = defineProps({ item: { type: Object, required: true }, photoLayout: Boolean, medicineLayout: Boolean, scene: { type: Number, default: 0 } });
const landingHospital = computed(() => hospitals.find(hospital => hospital.id === props.item.hospitalIds?.[0]));
</script>

<style scoped>
.resource-card { display: flex; align-items: center; gap: 24rpx; width: 100%; padding: 26rpx 0; border-bottom: 1rpx solid #eaf0f7; text-align: left; }
.resource-picture { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10rpx; width: 174rpx; height: 176rpx; flex-shrink: 0; border-radius: 20rpx; background: #eef7ff; color: #76a2ca; font-size: 23rpx; }
.resource-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 10rpx; }
.resource-name { font-size: 29rpx; font-weight: 600; }
.resource-demo { margin-left: 12rpx; color: #90a0b2; font-size: 22rpx; }
.resource-photo { width: 262rpx; height: 180rpx; flex-shrink: 0; overflow: hidden; border-radius: 14rpx; }
.resource-card--medicine { display: block; padding: 30rpx 0; }
.medicine-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12rpx; margin-bottom: 20rpx; }
.medicine-name { flex: 1; min-width: 0; color: #142c4d; font-size: 30rpx; line-height: 1.38; font-weight: 650; overflow-wrap: anywhere; }
.medicine-state { flex-shrink: 0; color: #8b9aaa; font-size: 22rpx; }
.medicine-body { display: flex; align-items: stretch; gap: 20rpx; }
.medicine-thumb { width: 174rpx; height: 174rpx; flex-shrink: 0; overflow: hidden; border: 1rpx solid #e1eaf0; border-radius: 15rpx; }
.medicine-meta { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: flex-start; gap: 5rpx; color: #78899a; font-size: 23rpx; line-height: 1.45; }
.medicine-meta text { overflow-wrap: anywhere; }
.medicine-badge { margin-bottom: 4rpx; padding: 3rpx 10rpx; border-radius: 8rpx; background: #e4f5f4; color: #149493; font-size: 22rpx; font-weight: 650; }
.medicine-meta .link { margin-top: 3rpx; }
</style>
