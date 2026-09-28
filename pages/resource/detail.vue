<template>
	<view class="page resource-detail-page">
		<AppHeader :title="item ? pageKind + '详情' : '资源详情'" back back-label="返回" fallback="/pages/search/search" />
		<template v-if="item">
			<view class="resource-hero">
				<ScenePhoto v-if="item.coverImage" :src="item.coverImage" :label="item.name" />
				<MedicinePackshot v-else-if="item.kind === '药品'" :label="item.name" />
				<ScenePhoto v-else :scene="heroScene" :label="item.name + ' · 示意配图'" />
			</view>
			<view class="resource-summary">
				<view class="summary-top">
					<text class="kind-label">{{ pageKind }}{{ item.contentVersion === 2 ? '' : ' · 示例资料' }}</text>
					<button class="favorite-button" :aria-label="saved ? '取消收藏' : '收藏资源'" @tap="save">
						<AppIcon :name="saved ? 'bookmark-fill' : 'bookmark'" :color="saved ? 'blue' : 'muted'" :size="28" />
						<text>{{ saved ? '已收藏' : '收藏' }}</text>
					</button>
				</view>
				<text class="resource-name">{{ item.name }}</text>
				<text class="resource-subtitle">{{ item.summary }}</text>
			</view>
			<view class="resource-section">
				<text class="section-heading">{{ pageKind }}信息</text>
				<view class="detail-table">
					<view v-for="row in informationRows" :key="row.label" class="detail-table-row">
						<text class="table-label">{{ row.label }}</text><text class="table-value">{{ row.value }}</text>
					</view>
				</view>
			</view>
			<view class="resource-section">
				<text class="section-heading">详情</text>
				<ContentBlocks v-if="item.contentBlocks?.length" :blocks="item.contentBlocks" /><text v-else class="section-copy">{{ item.summary }}</text>
			</view>
			<view v-if="item.indications || item.suitableFor || item.category || item.contentVersion !== 2" class="resource-section">
				<text class="section-heading">适用</text>
				<text class="section-copy">{{ item.indications || ((item.category ? '所属科室：' + item.category + '。' : '') + '具体适用范围与服务安排，请向落地医院核实。') }}</text><text v-if="item.suitableFor" class="section-copy">适用人群：{{ item.suitableFor }}</text>
			</view>
			<view v-if="specificationRows.length" class="resource-section">
				<text class="section-heading">规格</text>
				<view class="detail-table">
					<view v-for="row in specificationRows" :key="row.label" class="detail-table-row"><text class="table-label">{{ row.label }}</text><text class="table-value">{{ row.value }}</text></view>
				</view>
			</view>
			<text v-if="item.contentVersion !== 2" class="resource-disclaimer">本页为静态示例，实际项目、药械信息及使用方式请以医院和正式资料为准。</text>
			<view class="resource-section landing-section">
				<text class="section-heading">落地医院</text>
				<HospitalCard v-for="hospital in related" :key="hospital.id" :hospital="hospital" cover />
				<text v-if="!related.length" class="empty-copy">落地医院资料待补充</text>
			</view>
		</template>
		<view v-else class="empty-state">
			<text class="empty-title">暂未找到这项资料</text>
			<button class="empty-action" @tap="goBack('/pages/search/search')">返回查询</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import HospitalCard from "../../components/HospitalCard.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import ContentBlocks from "../../components/ContentBlocks.vue";
import MedicinePackshot from "../../components/MedicinePackshot.vue";
import { resources, approvedProjects } from "../../data/catalog";
import { hospitals } from "../../data/medical";
import { readList, toggleFavorite, recordVisit } from "../../utils/storage";
import { goBack, routeText } from "../../utils/navigation";

const resourceId = ref('');
const item = computed(() => [...resources, ...approvedProjects].find(resource => resource.id === resourceId.value));
const saved = ref(false);
const related = computed(() => hospitals.filter(hospital => item.value?.hospitalIds?.includes(hospital.id)));
const heroScene = computed(() => item.value?.scene ?? related.value[0]?.scene ?? 0);
const pageKind = computed(() => item.value?.kind === "药品" ? "特许药械" : item.value?.kind === "器械" ? "亚健康项目" : "批复项目");
const informationRows = computed(() => item.value ? [
	{ label: item.value.kind === "药品" ? "药械名称" : "项目名称", value: item.value.name },
	{ label: "所属科室", value: item.value.category },
	{ label: "获批地区 / 国家", value: item.value.approvalRegion },
 { label: "获批时间", value: item.value.approvalDate },
 { label: "生产企业", value: item.value.manufacturer },
 { label: "别名", value: item.value.aliases },
	{ label: "资料类别", value: pageKind.value },
].filter(row => row.value) : []);

const specificationRows = computed(() => item.value ? [
 { label: '剂型', value: item.value.dosageForm }, { label: '规格 / 项目说明', value: item.value.spec },
 { label: '包装规格', value: item.value.packaging }, { label: '储存条件', value: item.value.storage },
 { label: '资料来源', value: item.value.brand }
].filter(row => row.value) : []);
onLoad(options => { resourceId.value = routeText(options.id); });
watch(item, value => { if (value) { recordVisit('resource:' + value.id); refresh(); } }, { immediate: true });
onShow(refresh);
function refresh() {
	saved.value = item.value ? readList("favorites").includes("resource:" + item.value.id) : false;
}
function save() {
	if (!item.value) return;
	saved.value = toggleFavorite("resource:" + item.value.id);
	uni.showToast({ title: saved.value ? "已加入收藏" : "已取消收藏", icon: "none" });
}
</script>

<style scoped>
.resource-detail-page { padding-bottom: calc(42rpx + env(safe-area-inset-bottom)); background: #f6f8fa; }
.resource-hero { width: 100%; height: 460rpx; overflow: hidden; background: #eaf4fb; }
.resource-summary { position: relative; margin-top: -16rpx; padding: 26rpx 32rpx 34rpx; border-radius: 22rpx 22rpx 0 0; background: #fff; }
.summary-top { display: flex; align-items: center; justify-content: space-between; gap: 14rpx; }
.kind-label { padding: 5rpx 12rpx; border-radius: 7rpx; background: #2388d9; color: #fff; font-size: 22rpx; }
.favorite-button { display: flex; align-items: center; gap: 7rpx; padding: 7rpx 17rpx; border: 1rpx solid #d8e2eb; border-radius: 32rpx; color: #53677a; font-size: 23rpx; }
.resource-name { display: block; margin-top: 20rpx; color: #172c41; font-size: 34rpx; line-height: 1.42; font-weight: 700; overflow-wrap: anywhere; }
.resource-subtitle { display: block; margin-top: 10rpx; color: #8595a4; font-size: 25rpx; line-height: 1.5; }
.resource-section { margin-top: 18rpx; padding: 24rpx 28rpx 32rpx; background: #fff; }
.section-heading { display: block; padding-bottom: 17rpx; border-bottom: 1rpx solid #e7ecf1; color: #19344b; font-size: 30rpx; font-weight: 650; }
.section-copy { display: block; padding-top: 20rpx; color: #3e5266; font-size: 27rpx; line-height: 1.7; }
.detail-table { margin-top: 23rpx; overflow: hidden; border: 1rpx solid #e2eaf3; border-radius: 14rpx; }
.detail-table-row { display: flex; min-height: 76rpx; border-bottom: 1rpx solid #e2eaf3; }
.detail-table-row:last-child { border-bottom: 0; }
.detail-table-row:nth-child(odd) { background: #f2f7fd; }
.table-label { display: flex; align-items: center; width: 32%; flex-shrink: 0; padding: 13rpx 15rpx; border-right: 1rpx solid #e2eaf3; color: #214562; font-size: 24rpx; font-weight: 650; }
.table-value { display: flex; align-items: center; flex: 1; min-width: 0; padding: 13rpx 16rpx; color: #53677a; font-size: 24rpx; overflow-wrap: anywhere; }
.landing-section .hospital-row { margin-top: 24rpx; }
.empty-copy { display: block; padding-top: 24rpx; color: #8a9aaa; font-size: 25rpx; }
.resource-disclaimer { display: block; padding: 26rpx 28rpx 0; color: #8a9aaa; font-size: 22rpx; line-height: 1.5; }
</style>
