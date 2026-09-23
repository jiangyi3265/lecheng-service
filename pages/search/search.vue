<template>
	<view class="page search-page">
		<view class="search-controls">
		<AppHeader :back="canGoBack" />
		<view class="content-pad">
			<view class="search-input"
				><AppIcon name="search" color="muted" :size="35" /><input
					v-model="keyword"
					@focus="closeFilters"
					placeholder="搜索疾病、药品、项目"
					placeholder-class="search-placeholder"
					confirm-type="search"
					aria-label="搜索疾病、药品、项目" /><button
					v-if="keyword"
					class="clear-search"
					aria-label="清除搜索"
					@tap="keyword = ''"
				>
					<AppIcon name="close" color="muted" :size="30" /></button
			></view>
			<view class="category-tabs" role="tablist" aria-label="查询分类"
				><button
					v-for="item in categories"
					:key="item.value"
					class="category" role="tab" :aria-selected="category === item.value"
					:class="{ active: category === item.value }"
					@tap="selectCategory(item.value)"
				>
					{{ item.label }}
			</button></view
			>
		</view>
		<SearchFilters v-model:department="department" v-model:disease="disease" v-model:open="activeFilter" />
		</view>
		<view v-if="activeFilter" class="filter-mask" role="button" aria-label="关闭筛选" @tap="activeFilter = ''" @touchmove.stop.prevent />
		<view class="content-pad">
			<view v-if="department || disease" class="filter-summary between">
				<view class="filter-selection"><text class="small">{{ [department, disease].filter(Boolean).join(' / ') }}</text></view>
				<button class="link" @tap="clearFilters">重置筛选</button>
			</view>
			<template v-if="category === '医院'">
				<view class="result-heading between"
					><text>{{
						filtering
							? `找到 ${results.length} 家医院`
							: `共 ${directoryTotal} 家医院`
					}}</text></view>
				<ArticleList v-if="results.length" :items="projectArticles" @select="openResource($event.id)" />
				<view v-if="!results.length" class="empty-state"
					><AppIcon name="search" color="muted" :size="76" /><text
						class="empty-title"
						>没有找到相关医院</text
					><text class="small">试试其他疾病、药品或项目关键词</text
					><button class="empty-action" @tap="reset">
						重置查询
					</button></view
				>
			</template>
			<view v-else class="resource-results">
				<view class="between"
					><text
						>共 {{ resourceResults.length }} 条{{
							categoryLabel
						}}资料</text
					></view
				>
				<template v-if="category === '药品'">
					<ResourceCard v-for="item in resourceResults" :key="item.id" :item="item" medicine-layout />
				</template>
				<ArticleList v-else-if="resourceResults.length" :items="healthArticles" @select="openResource($event.id)" />
				<view v-if="!resourceResults.length" class="empty-state"
					><AppIcon name="search" color="muted" :size="76" /><text
						class="empty-title"
						>没有找到相关{{ categoryLabel }}</text
					><text class="small">试试其他关键词或分类</text
					><button class="empty-action" @tap="reset">
						重置查询
					</button></view
				>
			</view>
			<view class="search-support"><SupportBanner /></view>
		</view>
		<AppTabBar active="search" />
	</view>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { onLoad, onHide, onPageScroll, onResize, onBackPress } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppTabBar from "../../components/AppTabBar.vue";
import AppIcon from "../../components/AppIcon.vue";
import ArticleList from "../../components/ArticleList.vue";
import SupportBanner from "../../components/SupportBanner.vue";
import ResourceCard from "../../components/ResourceCard.vue";
import SearchFilters from "../../components/SearchFilters.vue";
import { resources } from "../../data/catalog";
import { hospitals, directoryTotal } from "../../data/medical";
import { departmentOptions, diseaseOptions, normalizeDepartment, matchesSearchFilters } from "../../data/search-filters";
import { routeText, openResource } from "../../utils/navigation";
const categories = [
	{ value: "医院", label: "批复项目" },
	{ value: "药品", label: "特许药械" },
	{ value: "器械", label: "亚健康项目" },
];
const category = ref("医院"),
	keyword = ref(""),
	canGoBack = ref(false),
	department = ref(''),
	disease = ref(''),
	activeFilter = ref('');
const categoryLabel = computed(() => categories.find(item => item.value === category.value).label);
const categoryValue = (value) => categories.find(item => item.value === value || item.label === value)?.value;
const queryFilters = computed(() => ({ keyword: keyword.value, department: department.value, disease: disease.value }));
const resourceResults = computed(() =>
	resources.filter(
		(item) =>
			item.kind === category.value &&
			matchesSearchFilters(item, queryFilters.value),
	),
);
onLoad((options) => {
	canGoBack.value = getCurrentPages().length > 1;
	const state = uni.getStorageSync("lecheng-search-state");
	if (state) {
		category.value = categoryValue(state.category) || "医院";
		keyword.value = typeof state.keyword === 'string' ? state.keyword : '';
		department.value = normalizeDepartment(state.department);
		disease.value = diseaseOptions.some(item => item.name === state.disease) ? state.disease : '';
		if (department.value && !departmentOptions.includes(state.department) && !keyword.value) keyword.value = state.department;
	}
	const initial = categoryValue(routeText(options.category));
	if (initial) {
		category.value = initial;
		reset();
	}
	const initialDepartment = routeText(options.department);
	const initialDisease = routeText(options.disease);
	if (normalizeDepartment(initialDepartment)) {
		department.value = normalizeDepartment(initialDepartment);
		if (!departmentOptions.includes(initialDepartment)) keyword.value = initialDepartment;
	}
	if (diseaseOptions.some(item => item.name === initialDisease)) disease.value = initialDisease;
	// 旧医院类型入口仍通过可见关键词联动，不把医院类型当作疾病。
	const initialType = routeText(options.type);
	if (initialType) keyword.value = initialType;
});
watch(
	[
		category,
		keyword,
		department,
		disease,
	],
	() =>
		uni.setStorageSync("lecheng-search-state", {
			category: category.value,
			keyword: keyword.value,
			department: department.value,
			disease: disease.value,
		}),
);
const filtering = computed(() =>
	Boolean(keyword.value.trim() || department.value || disease.value),
);
const results = computed(() => hospitals.filter(item => matchesSearchFilters(item, queryFilters.value)));
const projectArticles = computed(() => results.value.map(item => ({
	id: `project:${item.id}`,
	title: item.name,
	scene: item.scene,
	tags: item.tags,
	summary: item.subtitle,
})));
const healthArticles = computed(() => resourceResults.value.map(item => ({
	id: item.id,
	title: item.name,
	scene: hospitals.find(hospital => hospital.id === item.hospitalIds[0])?.scene ?? 0,
	tags: [item.category, '亚健康项目'],
	summary: item.summary,
})));
const closeFilters = () => { activeFilter.value = ''; };
onHide(closeFilters);
onPageScroll(closeFilters);
onResize(closeFilters);
onBackPress(() => {
	if (!activeFilter.value) return false;
	closeFilters();
	return true;
});
function selectCategory(value) {
	category.value = value;
	closeFilters();
}
function reset() {
	keyword.value = "";
	clearFilters();
}
function clearFilters() {
	department.value = '';
	disease.value = '';
	closeFilters();
}
</script>
<style scoped>
.search-controls { position: relative; z-index: 70; background: #fff; }
.filter-mask { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, 0.5); }
.search-input {
	display: flex;
	align-items: center;
	gap: 18rpx;
	height: 91rpx;
	padding: 0 28rpx;
	border: 2rpx solid #e8eef6;
	border-radius: 60rpx;
	box-shadow: 0 5rpx 16rpx rgba(28, 78, 122, 0.08);
}
.search-input input {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	height: 82rpx;
}
.search-placeholder {
	color: #8c9bb0;
}
.clear-search {
	display: flex;
	align-items: center;
	padding: 15rpx;
}
.category-tabs {
	display: flex;
	border-bottom: 1rpx solid #edf1f7;
	margin-top: 28rpx;
}
.category {
	flex: 1;
	height: 85rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	font-size: 31rpx;
}
.category.active {
	color: #0785ff;
	font-weight: 600;
}
.category.active::after {
	content: "";
	position: absolute;
	bottom: 0;
	width: 124rpx;
	height: 5rpx;
	border-radius: 4rpx;
	background: #0785ff;
}
.filter-summary { margin: 4rpx 0 22rpx; gap: 16rpx; }
.filter-selection { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6rpx; }
.filter-summary .link { flex-shrink: 0; padding: 8rpx 0 8rpx 16rpx; }
.result-heading {
	font-size: 28rpx;
	margin: 0 0 3rpx;
}
.search-support {
	margin-top: 17rpx;
}
.resource-results { padding-top: 0; }
</style>
