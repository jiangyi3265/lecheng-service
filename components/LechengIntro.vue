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
        <view v-for="section in aboutSections" :key="section.title" class="about-section">
          <view class="about-photo"><ScenePhoto :scene="section.scene" :label="section.caption" /></view>
          <text class="about-caption">{{ section.caption }}</text>
          <text class="about-section-title">{{ section.title }}</text>
          <text v-for="paragraph in section.paragraphs" :key="paragraph" class="about-copy" selectable>{{ paragraph }}</text>
        </view>
      </view>
      <view v-else-if="activeTopic === 'news'" class="news-list">
        <text class="content-title">乐城动态</text>
        <button v-for="article in news" :key="article.id" class="news-card" hover-class="none"
          :aria-label="'查看详情：' + article.title" @tap="openService('资讯详情', { id: article.id })">
          <view class="news-card-photo"><ScenePhoto :scene="article.scene" :label="article.title" /></view>
          <view class="news-card-copy">
            <text class="news-card-title">{{ article.title }}</text>
            <view class="article-tags"><text class="pill">{{ article.category }}</text><text class="pill">资讯示例</text></view>
            <text class="news-card-summary">{{ article.summary }}</text>
            <text class="article-action">查看详情 <AppIcon name="chevron" color="blue" :size="22" /></text>
          </view>
        </button>
        <text v-if="!news.length" class="content-empty">暂无乐城动态内容</text>
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
              <view class="article-cover"><ScenePhoto :scene="article.scene" :label="article.title + ' · 园区配图'" /></view>
              <view class="article-info">
                <text class="article-title">{{ article.title }}</text>
                <view class="article-tags">
                  <text v-for="tag in (article.tags || [article.category, '资讯示例'])" :key="tag" class="pill">{{ tag }}</text>
                </view>
                <text class="article-summary">{{ article.summary }}</text>
                <text class="article-action">{{ expandedArticle === article.id ? '收起详情' : '查看详情' }}<AppIcon name="chevron" color="blue" :size="22" :class="{ 'is-expanded': expandedArticle === article.id }" /></text>
              </view>
            </view>
          </button>
          <view v-if="expandedArticle === article.id" class="article-body">
            <text v-if="article.fullTitle" class="article-title">{{ article.fullTitle }}</text>
            <text class="article-meta">{{ article.source ? '成文日期' : '示例资讯' }} · {{ article.date }}</text>
            <text v-for="paragraph in article.paragraphs" :key="paragraph">{{ paragraph }}</text>
            <view v-if="article.source" class="article-source">
              <text>来源：{{ article.source.name }}</text>
              <text selectable>{{ article.source.url }}</text>
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
import { news } from "../data/catalog";
import { policies } from "../data/policies";
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
const aboutSections = [
  {
    title: "走进乐城，了解身边的医疗资源",
    scene: 3,
    caption: "园区风貌 · 示意配图",
    paragraphs: [
      "从医疗资源到园区生活，认识乐城，可以从一所医院、一段行程开始。在这里，我们将医院信息、就医服务与园区动态放在一起，让每一位来访者在出发之前，对乐城多一份了解。",
      "浏览医院介绍，了解科室与服务特色；阅读园区动态，关注生活与服务资讯。无论是为自己做准备，还是陪伴家人出行，都可以从这些信息开始规划。",
    ],
  },
  {
    title: "了解就医服务，从容安排行程",
    scene: 0,
    caption: "医疗建筑 · 示意配图",
    paragraphs: [
      "就医之前，先了解意向医院的科室设置、接诊安排和资料要求，可以让行程准备更有条理。将需要咨询的问题、既往就诊资料和出行安排提前整理，也方便与医院进一步沟通。",
      "您可以在医院介绍中浏览相关信息，收藏关注的医院，方便再次查找。具体接诊时间、预约要求与服务安排，请通过医院官方渠道确认。",
    ],
  },
  {
    title: "发现园区生活中的片刻闲适",
    scene: 2,
    caption: "园区绿意 · 示意配图",
    paragraphs: [
      "了解乐城，也是在了解一段行程中的日常。除了医院与就医服务，园区环境、交通和休憩安排，同样是出行前可以关注的内容。给行程留出适当余量，让每一步更加从容。",
      "在乐城动态中，您可以继续阅读园区生活与服务资讯；在国家政策中，可以查看相关政策文件与来源，逐步认识乐城的更多方面。",
    ],
  },
];
function selectTopic(id) {
  if (activeTopic.value === id) return;
  activeTopic.value = id;
  expandedArticle.value = "";
}
function toggleArticle(id) {
  expandedArticle.value = expandedArticle.value === id ? "" : id;
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
.news-card { display: flex; align-items: center; gap: 25rpx; width: 100%; padding: 24rpx 0; border-bottom: 1rpx solid var(--line); text-align: left; }
.news-card:last-of-type { border-bottom: 0; }
.news-card-photo { width: 290rpx; height: 205rpx; flex-shrink: 0; overflow: hidden; border-radius: 14rpx; }
.news-card-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: flex-start; gap: 9rpx; }
.news-card-title { display: block; font-size: 27rpx; line-height: 1.35; font-weight: 650; color: #142c4d; overflow-wrap: anywhere; }
.news-card-summary { display: block; color: #65788f; font-size: 23rpx; line-height: 1.5; }
.news-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.news-card:active { opacity: 0.85; }
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
.content-empty { display: flex; align-items: center; flex-direction: column; padding: 55rpx 0; gap: 14rpx; }
.empty-title { font-size: 28rpx; }
.empty-copy { color: #65788f; font-size: 25rpx; text-align: center; }
</style>
