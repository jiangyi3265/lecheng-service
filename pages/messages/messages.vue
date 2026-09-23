<template>
  <view class="page messages-page">
    <AppHeader title="动态" back back-label="返回" />
    <view class="content-pad case-content">
      <text class="case-heading">案例资讯</text>
      <ArticleList :items="news" @select="openService('资讯详情', { id: $event.id })" />
    </view>
    <AppTabBar active="messages" />
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppTabBar from "../../components/AppTabBar.vue";
import ArticleList from "../../components/ArticleList.vue";
import { news } from "../../data/catalog";
import { openService, routeText } from "../../utils/navigation";

onLoad((options) => {
  if (routeText(options?.tab) === "通知") uni.redirectTo({ url: "/pages/support/support" });
});
</script>

<style scoped>
.case-content { padding-top: 24rpx; }
.case-heading { display: block; margin-bottom: 18rpx; color: #142c4d; font-size: 34rpx; font-weight: 700; }
</style>
