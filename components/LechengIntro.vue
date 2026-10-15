<template>
  <view class="lecheng-intro">
    <view class="about-features" role="group" aria-label="乐城资讯分类">
      <button v-for="feature in features" :key="feature.id" class="about-feature" role="button" hover-class="none"
        :class="{ 'is-active': activeTopic === feature.id }"
        :aria-pressed="activeTopic === feature.id" @tap="selectTopic(feature.id)">
        <view class="feature-icon">
          <AppIcon :name="feature.icon" :color="activeTopic === feature.id ? 'blue' : 'teal'" :size="56" />
        </view>
        <text class="feature-title">{{ feature.title }}</text>
        <view class="feature-indicator" />
      </button>
    </view>
    <view class="topic-content" role="region" :aria-label="activeTitle">
      <view v-if="activeTopic === 'about'" class="about-article">
        <text class="content-title">了解乐城</text>
        <text class="about-byline">博鳌乐城 · 图文介绍</text>
        <view v-if="!aboutSections.length" class="content-empty">
          <AppIcon name="building" color="blue" :size="56" />
          <text class="empty-title">暂无了解乐城内容</text>
          <text class="empty-copy">相关内容发布后将在这里展示</text>
        </view>
        <view v-for="section in aboutSections" :key="section.id" class="about-section">
          <view class="about-photo"><ScenePhoto :src="section.coverImage" :scene="section.scene" :label="section.caption || section.title" /></view>
          <text v-if="section.caption" class="about-caption">{{ section.caption }}</text>
          <text v-if="section.title" class="about-section-title">{{ section.title }}</text>
          <!-- 后台图文内容：文字块按换行分段、沿用原正文样式；图片块整宽圆角 + 居中小字说明 -->
          <template v-if="section.contentBlocks && section.contentBlocks.length">
            <view v-for="(block, index) in section.contentBlocks" :key="index" class="about-block">
              <template v-if="block.type === 'image'">
                <image class="block-image" :src="block.url" mode="widthFix" :aria-label="block.caption || section.title" @tap="previewImage(section.contentBlocks, block.url)" />
                <text v-if="block.caption" class="block-caption">{{ block.caption }}</text>
              </template>
              <template v-else>
                <text v-if="block.title" class="about-block-title">{{ block.title }}</text>
                <text v-for="(line, lineIndex) in block.lines" :key="lineIndex" class="about-copy" selectable>{{ line }}</text>
              </template>
            </view>
          </template>
          <template v-else>
            <text v-for="(paragraph, index) in section.paragraphs" :key="index" class="about-copy" selectable>{{ paragraph }}</text>
          </template>
        </view>
      </view>
      <view v-else-if="activeTopic === 'news'" class="news-list">
        <text class="content-title">乐城动态</text>
        <ArticleList :items="news" layout="stacked" empty-text="暂无乐城动态内容" @select="openService('资讯详情', { id: $event.id })" />
      </view>
      <template v-else>
        <text class="content-title">{{ activeTitle }}</text>
        <view v-if="!visibleArticles.length" class="content-empty">
          <AppIcon name="document" color="blue" :size="56" />
          <text class="empty-title">暂无{{ activeTitle }}内容</text>
          <text class="empty-copy">相关内容发布后将在这里展示</text>
        </view>
        <view v-for="article in visibleArticles" :key="article.id" class="article">
          <button class="article-toggle" role="button" hover-class="none" :aria-expanded="expandedArticle === article.id" @tap="toggleArticle(article.id)">
            <view class="article-preview">
              <view class="article-cover"><ScenePhoto :src="article.coverImage" :scene="article.scene" :label="article.title + ' · 园区配图'" /></view>
              <view class="article-info">
                <text class="article-title">{{ article.title }}</text>
                <view class="article-tags">
                  <text v-for="tag in (article.tags || [article.category, '资讯示例'])" :key="tag" class="pill">{{ tag }}</text>
                </view>
                <text class="article-summary">{{ article.summary }}</text>
              </view>
            </view>
          </button>
          <view v-if="expandedArticle === article.id" class="article-body">
            <text v-if="article.fullTitle" class="article-title">{{ article.fullTitle }}</text>
            <text v-if="article.date" class="article-meta">成文日期 · {{ article.date }}</text>
            <template v-if="article.contentBlocks && article.contentBlocks.length">
              <view v-for="(block, index) in article.contentBlocks" :key="index" class="article-block">
                <template v-if="block.type === 'image'">
                  <image class="block-image" :src="block.url" mode="widthFix" :aria-label="block.caption || article.title" @tap="previewImage(article.contentBlocks, block.url)" />
                  <text v-if="block.caption" class="block-caption">{{ block.caption }}</text>
                </template>
                <template v-else>
                  <text v-if="block.title" class="article-block-title">{{ block.title }}</text>
                  <text v-for="(line, lineIndex) in block.lines" :key="lineIndex">{{ line }}</text>
                </template>
              </view>
            </template>
            <template v-else>
              <text v-for="(paragraph, index) in article.paragraphs" :key="index">{{ paragraph }}</text>
            </template>
            <view v-if="article.source" class="article-source">
              <text v-if="article.source.name">来源：{{ article.source.name }}</text>
              <text v-if="article.source.url" selectable>{{ article.source.url }}</text>
              <text>历史文件资料，具体适用以官方现行规定为准。</text>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import AppIcon from "./AppIcon.vue";
import ScenePhoto from "./ScenePhoto.vue";
import ArticleList from "./ArticleList.vue";
import { news } from "../data/catalog";
import { policies } from "../data/policies";
import { aboutSections } from "../data/about";
import { openService } from "../utils/navigation";

const features = [
  { id: "news", title: "乐城动态", icon: "message" },
  { id: "policy", title: "国家政策", icon: "document" },
  { id: "about", title: "了解乐城", icon: "building" },
];
const activeTopic = ref("news");
const expandedArticle = ref("");
const activeTitle = computed(() => features.find((feature) => feature.id === activeTopic.value).title);
const visibleArticles = computed(() => activeTopic.value === "policy" ? policies : news);
function selectTopic(id) {
  if (activeTopic.value === id) return;
  activeTopic.value = id;
  expandedArticle.value = "";
}
function toggleArticle(id) {
  expandedArticle.value = expandedArticle.value === id ? "" : id;
}
function previewImage(blocks, current) {
  uni.previewImage({ current, urls: blocks.filter((block) => block.type === "image" && block.url).map((block) => block.url) });
}
</script>

<style scoped>
.about-features { display: flex; gap: 12rpx; padding-top: 14rpx; border-bottom: 1rpx solid var(--line); }
.about-feature { flex: 1; min-width: 0; display: flex; align-items: center; flex-direction: column; gap: 12rpx; }
.feature-icon { display: flex; align-items: center; justify-content: center; width: 114rpx; height: 114rpx; border-radius: 50%; background: #dff5f7; }
.is-active .feature-icon { background: #e3f2ff; }
.feature-title { font-size: 29rpx; font-weight: 600; }
.is-active .feature-title { color: var(--primary); }
.feature-indicator { width: 40rpx; height: 5rpx; margin-top: 3rpx; border-radius: 5rpx; background: transparent; }
.is-active .feature-indicator { background: var(--primary); }
.about-feature:focus-visible, .article-toggle:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.about-feature:active, .article-toggle:active { opacity: 0.75; }
.topic-content { padding: 30rpx 0 20rpx; }
.content-title { display: block; font-size: 35rpx; font-weight: 600; }
.news-list { display: flex; flex-direction: column; }
.article { padding: 24rpx 0; border-bottom: 1rpx solid var(--line); }
.article:last-child { border-bottom: 0; }
.article-toggle { display: block; width: 100%; text-align: left; }
.article-preview { display: flex; gap: 26rpx; align-items: center; }
.article-info { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: flex-start; gap: 9rpx; }
.article-meta { display: block; color: #65788f; font-size: 22rpx; }
.article-title { display: block; font-size: 27rpx; font-weight: 650; line-height: 1.35; overflow-wrap: anywhere; }
.article-tags { display: flex; flex-wrap: wrap; gap: 8rpx; }
.article-summary { display: block; color: #65788f; font-size: 23rpx; line-height: 1.5; }
.article-cover { width: 290rpx; height: 205rpx; flex-shrink: 0; border-radius: 14rpx; overflow: hidden; }
.article-action { display: flex; align-items: center; color: var(--primary); font-size: 24rpx; font-weight: 500; margin-top: 2rpx; }
.article-action .is-expanded { transform: rotate(-90deg); }
.article-source { display: flex; flex-direction: column; gap: 10rpx; color: #65788f; font-size: 22rpx; overflow-wrap: anywhere; word-break: break-word; }
.article-body { display: flex; flex-direction: column; gap: 16rpx; padding-top: 22rpx; font-size: 27rpx; line-height: 1.85; }
.about-byline { display: block; margin-top: 10rpx; color: #65788f; font-size: 23rpx; }
.about-section { padding-top: 30rpx; }
.about-photo { width: 100%; height: 390rpx; overflow: hidden; border-radius: 10rpx; }
.about-caption { display: block; margin-top: 10rpx; color: #65788f; font-size: 22rpx; text-align: center; }
.about-section-title { display: block; margin-top: 28rpx; font-size: 31rpx; font-weight: 650; line-height: 1.6; }
.about-copy { display: block; margin-top: 18rpx; color: #344b63; font-size: 29rpx; line-height: 2; text-indent: 2em; }
.about-block-title { display: block; margin-top: 24rpx; font-size: 29rpx; font-weight: 650; line-height: 1.8; }
.about-block .block-image { margin-top: 24rpx; }
.article-block { display: flex; flex-direction: column; gap: 16rpx; }
.article-block-title { display: block; font-weight: 650; }
.block-image { display: block; width: 100%; border-radius: 12rpx; }
.block-caption { display: block; margin-top: 10rpx; color: #65788f; font-size: 22rpx; line-height: 1.5; text-align: center; }
.article-block .block-caption { margin-top: 0; }
.content-empty { display: flex; align-items: center; flex-direction: column; padding: 55rpx 0; gap: 14rpx; }
.empty-title { font-size: 28rpx; }
.empty-copy { color: #65788f; font-size: 25rpx; text-align: center; }
</style>
