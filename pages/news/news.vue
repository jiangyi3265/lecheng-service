<template>
  <view class="news-page">
    <view class="news-top">
      <BrandHeader compact />
      <view class="news-search">
        <SearchField v-model="query" small @search="submitted = query.trim()" />
      </view>
      <view class="travel-banner">
        <NativeArt name="travel" :width="700" />
      </view>
    </view>
    <view class="news-main">
      <scroll-view scroll-x class="news-tabs">
        <view class="news-tab-row">
          <view
            v-for="(tab, i) in tabs"
            :key="tab"
            :class="{ selected: current === i }"
            @tap="
              current = i;
              filterOpen = false;
            "
          >
            {{ tab }}
          </view>
        </view>
      </scroll-view>
      <view class="sort-row">
        <view
          v-for="(sort, i) in sorts"
          :key="sort"
          :class="{ selected: sortBy === i }"
          @tap="
            sortBy = i;
            ascending = !ascending;
          "
        >
          {{ sort }}
          <text>{{ sortBy === i ? (ascending ? "▴" : "▾") : "▴" }}</text>
        </view>
        <view @tap="filterOpen = !filterOpen">▽ 筛选</view>
      </view>
      <view v-if="filterOpen" class="news-filter">
        <view>类型</view>
        <view>
          <text
            v-for="(tab, i) in tabs"
            :key="tab"
            @tap="
              current = i;
              filterOpen = false;
            "
          >
            {{ tab }}
          </text>
        </view>
      </view>
      <template v-else>
        <view
          v-for="item in items"
          :key="item.title"
          class="news-card"
          @tap="open(item)"
        >
          <view class="article-cover">
            <NativeArt
              :name="current === 1 ? 'policy-photo' : 'news-photo'"
              :width="650"
            />
          </view>
          <text class="article-title">{{ item.title }}</text>
        </view>
        <view v-if="!items.length" class="empty-state">
          暂无内容
          <text
            @tap="
              current = 0;
              query = '';
              submitted = '';
            "
          >
            查看新闻动态
          </text>
        </view>
        <text class="end-note">到底啦~</text>
      </template>
    </view>
    <BottomNav current="news" />
  </view>
</template>
<script>
import NativeArt from "../../components/NativeArt.vue";
import BrandHeader from "../../components/BrandHeader.vue";
import BottomNav from "../../components/BottomNav.vue";
import SearchField from "../../components/SearchField.vue";
const articles = [
  {
    title: "乐城鹏博医院与香港安康医疗签约，BNCT再扩跨境医疗“朋友圈”",
    date: "2026-09-14",
    type: 0,
  },
  {
    title: "《乐十条》政策问答②丨人才入职后，乐城有哪些服务保障与培育计划？",
    date: "2026-07-20",
    type: 1,
  },
];
export default {
  components: { NativeArt, BrandHeader, BottomNav, SearchField },
  data() {
    return {
      query: "",
      submitted: "",
      current: 0,
      tabs: ["新闻动态", "政策信息", "学术教育", "特许药械"],
      sorts: ["发布时间", "热度", "收藏量"],
      sortBy: 0,
      ascending: false,
      filterOpen: false,
    };
  },
  onLoad(p) {
    this.current = Number(p.tab || 0);
  },
  computed: {
    items() {
      const items = articles.filter(
        (x) => x.type === this.current && x.title.includes(this.submitted),
      );
      return this.ascending ? items.reverse() : items;
    },
  },
  methods: {
    open(item) {
      uni.navigateTo({
        url:
          "/pages/detail/detail?type=article&name=" +
          encodeURIComponent(item.title) +
          "&date=" +
          item.date,
      });
    },
  },
};
</script>
<style scoped>
.news-page {
  min-height: 100vh;
  padding-bottom: 185rpx;
}
.news-top {
  background: linear-gradient(#4396ff, #66a6f8 70%, #f6f6f6);
  padding-bottom: 24rpx;
}
.news-search {
  padding: 24rpx 24rpx 21rpx;
}
.travel-banner {
  height: 250rpx;
  background: #fff;
  position: relative;
  margin: 0 24rpx;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.travel-scenery {
  height: 100%;
  width: 40%;
  background: linear-gradient(
    #4fc9e1,
    #c5f4f0 50%,
    #1ca5b7 51%,
    #52d5d3 80%,
    #f4dcae
  );
  border-radius: 0 0 80% 0;
  position: relative;
  overflow: hidden;
}
.sun {
  width: 52rpx;
  height: 52rpx;
  background: #ffefd0;
  border-radius: 50%;
  position: absolute;
  right: 30rpx;
  top: 28rpx;
}
.island {
  position: absolute;
  right: 0;
  bottom: 55rpx;
  background: #54966f;
  width: 170rpx;
  height: 85rpx;
  border-radius: 100% 0 0 0;
  transform: rotate(6deg);
}
.palm {
  font-size: 135rpx;
  color: #197f7f;
  position: absolute;
  left: 10rpx;
  bottom: 20rpx;
  transform: rotate(-20deg);
}
.travel-copy {
  flex: 1;
  text-align: center;
  color: #0c8e9d;
}
.travel-copy > text:first-child {
  font-size: 63rpx;
  font-weight: 900;
  letter-spacing: 7rpx;
  display: block;
  transform: rotate(-3deg);
  margin-bottom: 20rpx;
}
.travel-copy > text + text {
  background: #32a4b0;
  border-radius: 25rpx;
  color: #dafafb;
  font-size: 19rpx;
  padding: 6rpx 10rpx;
  white-space: nowrap;
}
.travel-copy > text + text text {
  color: #edff4a;
  font-size: 26rpx;
  font-weight: 700;
}
.plane {
  position: absolute;
  top: -8rpx;
  right: 22rpx;
  color: #299eac;
  font-size: 60rpx;
  transform: rotate(15deg);
}
.news-main {
  margin: 0 24rpx;
  background: #fff;
  border-radius: 22rpx 22rpx 0 0;
  overflow: hidden;
}
.news-tabs {
  height: 88rpx;
}
.news-tab-row {
  display: flex;
  width: max-content;
  min-width: 100%;
  justify-content: space-between;
  height: 88rpx;
  align-items: center;
}
.news-tab-row view {
  padding: 0 29rpx;
  white-space: nowrap;
  font-size: 27rpx;
}
.selected {
  color: #4a96e9;
  font-weight: 600;
}
.sort-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 84rpx;
  background: #f0f7ff;
  font-size: 26rpx;
}
.sort-row view {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.sort-row text {
  color: #b2c8df;
  font-size: 19rpx;
}
.news-card {
  padding: 28rpx 25rpx 43rpx;
  border-bottom: 1rpx solid #eee;
}
.article-cover {
  height: 290rpx;
  background: linear-gradient(135deg, #d7f3fb, #8fd3dc, #d5e9f2);
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 40rpx;
  color: #fff;
}
.article-date {
  position: absolute;
  top: 9rpx;
  right: 10rpx;
  background: #687c9080;
  border-radius: 9rpx;
  padding: 3rpx 10rpx;
  font-size: 22rpx;
  color: #fff;
}
.article-title {
  font-size: 29rpx;
  line-height: 1.5;
  font-weight: 600;
  display: block;
  margin-top: 31rpx;
}
.news-cover-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  width: 100%;
}
.news-cover-copy > text:first-child {
  font-size: 52rpx;
  font-weight: 800;
  letter-spacing: 4rpx;
}
.news-cover-copy > text + text {
  font-size: 23rpx;
  letter-spacing: 3rpx;
}
.hospital-mark {
  position: absolute;
  right: 0;
  top: -3rpx;
  font-size: 120rpx;
  line-height: 1;
  color: #ecffffa6;
}
.policy {
  background: linear-gradient(135deg, #c5edff, #eefcff, #91bff4);
}
.policy-copy {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.policy-copy > text:first-child {
  font-size: 72rpx;
  color: #408afe;
  font-weight: 900;
  letter-spacing: 6rpx;
}
.policy-copy > text + text {
  background: #508eff;
  color: #fff;
  font-size: 21rpx;
  letter-spacing: 3rpx;
  padding: 3rpx 12rpx;
  border-radius: 22rpx;
}
.end-note {
  display: block;
  padding: 24rpx;
  text-align: center;
  background: #f6f6f6;
  color: #ccc;
  font-size: 25rpx;
}
.news-filter {
  height: 550rpx;
  display: flex;
}
.news-filter > view:first-child {
  width: 36%;
  background: #f5f7fc;
  text-align: center;
  padding-top: 30rpx;
}
.news-filter > view + view {
  display: flex;
  flex-direction: column;
  padding: 25rpx 30rpx;
  gap: 30rpx;
  color: #788ca1;
}
.travel-banner {
  height: auto;
  background: transparent;
}
.article-cover {
  height: auto;
  padding: 0;
  background: none;
}
.news-top {
  padding-bottom: 24rpx;
}
.article-title {
  font-size: 29rpx;
  letter-spacing: -0.3rpx;
}
.news-top {
  background: linear-gradient(
    180deg,
    #5796f7 0,
    #5e99f7 108rpx,
    #74a7f8 217rpx,
    #b1ccf7 290rpx,
    #f6f6f6 380rpx,
    #f6f6f6 100%
  );
}
</style>
