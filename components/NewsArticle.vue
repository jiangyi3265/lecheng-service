<template>
	<view class="news-article">
		<view class="news-hero"><ScenePhoto :src="article.coverImage" :scene="article.scene" :label="article.title" /></view>
		<view class="news-sheet">
			<view v-if="showFavorite" class="news-actions">
				<button class="news-favorite" :class="{ selected: favorite }" :aria-label="favorite ? '取消收藏' : '收藏文章'" @tap="toggleSaved">
					<AppIcon name="star" :color="favorite ? 'blue' : 'muted'" :size="30" />
					<text>{{ favorite ? '已收藏' : '收藏' }}</text>
				</button>
			</view>
			<text class="news-title">{{ article.title }}</text>
			<text v-if="article.period" class="news-date">活动时间：{{ article.period }}</text>
			<text v-else-if="article.date" class="news-date">发布日期：{{ article.date }}{{ article.contentVersion === 2 ? '' : ' · 示例' }}</text>
			<!-- 福利活动、服务流程：文字块按换行分段、沿用下方段落样式（与内置内容显示一致）；图片块整宽圆角 + 居中小字说明 -->
			<view v-if="paragraphBlocks && article.contentBlocks?.length" class="news-body">
				<view v-for="(block, index) in article.contentBlocks" :key="index" class="news-paragraph">
					<template v-if="block.type === 'image'">
						<image class="news-image" :src="block.url" mode="widthFix" :aria-label="block.caption || article.title" @tap="previewImage(block.url)" />
						<text v-if="block.caption" class="news-caption">{{ block.caption }}</text>
					</template>
					<template v-else>
						<text v-if="block.title" class="news-subheading">{{ block.title }}</text>
						<text v-for="(line, lineIndex) in block.lines" :key="lineIndex" class="news-copy" selectable>{{ line }}</text>
					</template>
				</view>
			</view>
			<ContentBlocks v-else-if="article.contentBlocks?.length" :blocks="article.contentBlocks" />
			<view v-else class="news-body">
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
import ContentBlocks from './ContentBlocks.vue';
import AppIcon from './AppIcon.vue';
import { readList, toggleFavorite } from '../utils/storage';
// paragraphBlocks：图文块用正文段落样式显示（福利活动、服务流程）；不传时沿用 ContentBlocks（乐城动态）
const props = defineProps({ article: { type: Object, required: true }, showFavorite: { type: Boolean, default: true }, paragraphBlocks: { type: Boolean, default: false } });
const favorite = ref(false);
function refresh() { favorite.value = readList('favorites').includes('news:' + props.article.id); }
watch(() => props.article.id, refresh, { immediate: true });
onShow(refresh);
function toggleSaved() { favorite.value = toggleFavorite('news:' + props.article.id); }
function previewImage(current) { uni.previewImage({ current, urls: props.article.contentBlocks.filter((block) => block.type === 'image' && block.url).map((block) => block.url) }); }
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
.news-copy + .news-copy { margin-top: 40rpx; }
.news-image { display: block; width: 100%; border-radius: 12rpx; }
.news-caption { display: block; margin-top: 12rpx; text-align: center; font-size: 24rpx; line-height: 1.5; color: #969ba0; }
</style>
