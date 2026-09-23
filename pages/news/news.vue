<template>
	<view class="page secondary-page"
		><AppHeader title="乐城新动态" back /><view class="detail-content"
			><text class="detail-heading">发现园区里的新变化</text
			><text class="muted">就医资讯 · 园区生活 · 康养体验</text
			><view class="selection-chips"
				><button
					v-for="item in categories"
					:key="item"
					class="selection-chip"
					:class="{ selected: category === item }"
					@tap="category = item"
				>
					{{ item }}
				</button></view
			><button
				v-for="article in filtered"
				:key="article.id"
				class="news-item"
				@tap="openService('资讯详情', { id: article.id })"
			>
				<view class="news-cover"
					><ScenePhoto :scene="article.scene" /></view
				><view class="news-info"
					><view class="between"
						><text class="pill">{{ article.category }}</text
						><text class="muted small"
							>{{ article.date }} · 示例</text
						></view
					><text class="news-title">{{ article.title }}</text
					><text class="muted small">{{ article.summary }}</text
					><text class="link">阅读全文 ›</text></view
				>
			</button></view
		></view
	>
</template>
<script setup>
import { ref, computed } from "vue";
import AppHeader from "../../components/AppHeader.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import { news } from "../../data/catalog";
import { openService } from "../../utils/navigation";
const categories = ["全部", "园区生活", "就医指南", "康养体验"],
	category = ref("全部");
const filtered = computed(() =>
	news.filter(
		(n) => category.value === "全部" || n.category === category.value,
	),
);
</script>
<style scoped>
.news-item {
	border: 1rpx solid #e5eef8;
	border-radius: 24rpx;
	overflow: hidden;
	text-align: left;
	width: 100%;
	margin-bottom: 30rpx;
}
.news-cover {
	height: 300rpx;
}
.news-info {
	padding: 26rpx;
	display: flex;
	flex-direction: column;
	gap: 17rpx;
}
.news-title {
	font-size: 33rpx;
	font-weight: 600;
}
</style>
