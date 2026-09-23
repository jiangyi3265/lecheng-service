<template>
  <view class="article-list">
    <button v-for="article in items" :key="article.id" class="article-list-item" @tap="$emit('select', article)">
      <view class="article-list-cover"><ScenePhoto :scene="article.scene" :label="article.title" /></view>
      <view class="article-list-body">
        <text class="article-list-title">{{ article.title }}</text>
        <view v-if="article.tags?.length || article.category" class="article-list-tags">
          <text v-for="tag in article.tags?.length ? article.tags : [article.category]" :key="tag" class="article-list-tag">{{ tag }}</text>
        </view>
        <text v-if="article.summary || article.paragraphs?.length" class="article-list-summary">{{ article.summary || article.paragraphs[0] }}</text>
        <text class="article-list-link">查看详情 ›</text>
      </view>
    </button>
    <view v-if="!items.length" class="empty-state"><text class="empty-title">{{ emptyText }}</text></view>
  </view>
</template>
<script setup>
import ScenePhoto from './ScenePhoto.vue';
defineProps({ items: { type: Array, default: () => [] }, emptyText: { type: String, default: '暂无内容' } });
defineEmits(['select']);
</script>
<style scoped>
.article-list-item { display: flex; align-items: stretch; gap: 22rpx; width: 100%; padding: 25rpx 0; text-align: left; border-bottom: 1rpx solid #eaf0f7; }
.article-list-item:last-child { border-bottom: 0; }
.article-list-cover { width: 40%; min-height: 188rpx; flex-shrink: 0; border-radius: 14rpx; overflow: hidden; }
.article-list-body { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6rpx; }
.article-list-title { display: block; width: 100%; font-size: 27rpx; line-height: 1.32; font-weight: 650; color: #172a3c; overflow-wrap: anywhere; }
.article-list-tags { display: flex; gap: 6rpx; flex-wrap: wrap; }
.article-list-tag { padding: 2rpx 8rpx; border-radius: 5rpx; background: #eef7ff; color: #3384bd; font-size: 21rpx; line-height: 1.3; }
.article-list-summary { display: -webkit-box; width: 100%; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; color: #82909e; font-size: 22rpx; line-height: 1.4; }
.article-list-link { color: #2283be; font-size: 22rpx; font-weight: 600; }
</style>
