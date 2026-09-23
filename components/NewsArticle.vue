<template>
	<view class="news-article">
		<view class="news-hero"><ScenePhoto :scene="article.scene" :label="article.title" /></view>
		<view class="news-sheet">
			<view v-if="showFavorite" class="news-actions">
				<button class="news-favorite" :class="{ selected: favorite }" :aria-label="favorite ? '取消收藏' : '收藏文章'" @tap="toggleSaved">
					<AppIcon name="star" :color="favorite ? 'blue' : 'muted'" :size="30" />
					<text>{{ favorite ? '已收藏' : '收藏' }}</text>
				</button>
			</view>
			<text class="news-title">{{ article.title }}</text>
			<text v-if="article.date" class="news-date">发布日期：{{ article.date }} · 示例</text>
			<view class="news-body">
				<view v-for="(paragraph, index) in article.paragraphs" :key="index" class="news-paragraph">
					<text v-if="paragraph.title" class="news-subheading">{{ paragraph.title }}</text>
					<text class="news-copy" selectable>{{ paragraph.text || paragraph }}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import ScenePhoto from './ScenePhoto.vue';
import AppIcon from './AppIcon.vue';
import { readList, toggleFavorite } from '../utils/storage';
const props = defineProps({ article: { type: Object, required: true }, showFavorite: { type: Boolean, default: true } });
const favorite = ref(false);
function refresh() { favorite.value = readList('favorites').includes('news:' + props.article.id); }
watch(() => props.article.id, refresh, { immediate: true });
onShow(refresh);
function toggleSaved() { favorite.value = toggleFavorite('news:' + props.article.id); }
</script>
<style scoped>
.news-article { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.news-hero { height: 590rpx; overflow: hidden; border-radius: 18rpx 18rpx 0 0; }
.news-sheet { position: relative; margin-top: -14rpx; padding: 28rpx 28rpx 64rpx; border-radius: 20rpx 20rpx 0 0; background: #fff; }
.news-actions { display: flex; justify-content: flex-end; margin-bottom: 26rpx; }
.news-favorite { display: flex; align-items: center; justify-content: center; gap: 12rpx; min-width: 128rpx; min-height: 68rpx; padding: 8rpx 20rpx; border: 2rpx solid #dedfe1; border-radius: 40rpx; color: #494d52; font-size: 26rpx; line-height: 1.4; }
.news-favorite.selected { border-color: #b8dfff; color: #0785ff; background: #f5faff; }
.news-title { display: block; font-size: 32rpx; font-weight: 700; line-height: 1.4; color: #24282d; overflow-wrap: anywhere; }
.news-date { display: block; margin: 36rpx 0 56rpx; text-align: right; font-size: 24rpx; color: #969ba0; }
.news-body { border-top: 1rpx solid #e9ebee; margin-top: 30rpx; padding-top: 30rpx; }
.news-paragraph + .news-paragraph { margin-top: 40rpx; }
.news-copy { display: block; font-size: 36rpx; line-height: 1.8; color: #202429; overflow-wrap: anywhere; white-space: pre-wrap; }
.news-subheading { display: block; margin-bottom: 20rpx; font-size: 36rpx; line-height: 1.5; font-weight: 700; color: #202429; }
</style>
