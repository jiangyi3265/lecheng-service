<template>
  <view class="detail-page">
    <BrandHeader :title="pageTitle" />
    <template v-if="type === '0'">
      <view class="drug-hero">
        <NativeArt v-if="item.image" name="drug-detail" :width="750" />
        <view v-else class="drug-fallback">{{ item.name }}</view>
      </view>
      <view class="drug-summary">
        <view class="summary-top">
          <text class="drug-tag">药品</text>
          <view class="favorite" :class="{ saved }" @tap="toggleSave">
            {{ saved ? "★ 已收藏" : "☆ 收藏" }}
          </view>
        </view>
        <text class="detail-name">{{ item.name }} {{ item.english }}</text>
        <text class="alias">
          ❝
          {{
            item.id === "lurbinectedin"
              ? "ZEPZELCA（lurbinectedin 鲁比卡丁、芦比替定）"
              : item.name
          }}
        </text>
        <scroll-view scroll-x>
          <view class="detail-badges">
            <text>✚ {{ item.hospital || "落地医院" }}</text>
            <text v-if="item.id === 'lurbinectedin'">⛨ 春城吉祥保</text>
            <text>⛨ 龙江惠民保</text>
          </view>
        </scroll-view>
      </view>
      <view class="detail-tabs">
        <view
          v-for="(tab, index) in detailTabs"
          :key="tab"
          :class="{ selected: active === index }"
          @tap="jump(index)"
        >
          {{ tab }}
        </view>
      </view>
      <view id="section-0" class="detail-section">
        <text class="section-heading">药械信息</text>
        <view class="info-table">
          <view v-for="row in infoRows" :key="row[0]">
            <text>{{ row[0] }}</text>
            <text>{{ row[1] || "—" }}</text>
          </view>
        </view>
      </view>
      <view id="section-1" class="detail-section">
        <text class="section-heading">详情</text>
        <text class="section-copy">{{ description }}</text>
      </view>
      <view id="section-2" class="detail-section">
        <text class="section-heading">适用</text>
        <view class="section-copy">
          <text class="field-label">适应症</text>
          <text>{{ description }}</text>
          <text class="field-label">适用人群</text>
          <text>
            {{ item.id === "lurbinectedin" ? "成人" : "以药品说明书为准" }}
          </text>
        </view>
      </view>
      <view id="section-3" class="detail-section">
        <text class="section-heading">规格</text>
        <view class="info-table">
          <view>
            <text>剂型</text>
            <text>
              {{ item.id === "lurbinectedin" ? "冻干粉（静脉输注剂）" : "—" }}
            </text>
          </view>
          <view>
            <text>规格</text>
            <text>—</text>
          </view>
          <view>
            <text>包装规格</text>
            <text>{{ item.id === "lurbinectedin" ? "1瓶/盒" : "—" }}</text>
          </view>
          <view>
            <text>储存条件</text>
            <text>—</text>
          </view>
        </view>
      </view>
      <view id="section-4" class="detail-section">
        <text class="section-heading">落地医院</text>
        <view class="linked-row" @tap="hospital">
          {{ item.hospital || "查看医院" }}
          <text>›</text>
        </view>
      </view>
      <view id="section-5" class="detail-section">
        <text class="section-heading">可用商保</text>
        <view class="linked-row" @tap="insurance">
          {{ item.insurance || "查看保险" }}
          <text>›</text>
        </view>
      </view>
    </template>
    <template v-else-if="type === 'service'">
      <ServicePoster :kind="kind" :title="name" detail />
      <view class="service-consult">
        <text>详情咨询</text>
        <text>✿ 乐城管理局</text>
      </view>
      <view class="service-summary">
        <text>{{ name }}</text>
        <view v-if="kind === 'medical'">
          ☑ 全国唯一　☑ 18至50周岁　☑ 蔡司VISUMAX 800
        </view>
      </view>
      <view class="detail-section">
        <text class="section-heading">服务包详情</text>
        <text class="section-copy">{{ name }}</text>
      </view>
      <view class="detail-actions">
        <view @tap="assistant">
          ♧
          <text>客服</text>
        </view>
        <view @tap="toggleSave">
          {{ saved ? "★" : "☆" }}
          <text>收藏</text>
        </view>
        <view class="consult-button" @tap="assistant">立即咨询</view>
      </view>
    </template>
    <template v-else-if="type === 'article'">
      <view class="article">
        <text class="article-heading">{{ name }}</text>
        <text class="article-meta">{{ date }}　乐城服务</text>
        <view class="article-rule" />
        <text class="article-note">
          原文内容待接入。您可以返回动态列表查看已收录的新闻与政策标题。
        </text>
        <view class="article-favorite" @tap="toggleSave">
          {{ saved ? "★ 已收藏" : "☆ 收藏" }}
        </view>
      </view>
    </template>
    <template v-else>
      <ResourceDetail
        :type="type"
        :name="name"
        :saved="saved"
        @save="toggleSave"
      />
    </template>
  </view>
</template>
<script>
import NativeArt from "../../components/NativeArt.vue";
import ResourceDetail from "../../components/ResourceDetail.vue";
import BrandHeader from "../../components/BrandHeader.vue";
import ReferenceArt from "../../components/ReferenceArt.vue";
import ServicePoster from "../../components/ServicePoster.vue";
import AppIcon from "../../components/AppIcon.vue";
import { medicines } from "../../data/catalog";
export default {
  components: {
    NativeArt,
    ResourceDetail,
    BrandHeader,
    ReferenceArt,
    ServicePoster,
    AppIcon,
  },
  data() {
    return {
      type: "0",
      id: "lurbinectedin",
      name: "",
      date: "",
      kind: "biotech",
      active: 0,
      saved: false,
      detailTabs: ["药械信息", "详情", "适用", "规格", "医院", "商保"],
    };
  },
  onLoad(p) {
    this.type = p.type || "0";
    this.id = p.id || "lurbinectedin";
    this.name = p.name || "";
    this.kind = p.kind || "biotech";
    this.date = p.date || "";
    this.saved = (uni.getStorageSync("lecheng-favorites") || []).includes(
      this.saveKey,
    );
  },
  computed: {
    item() {
      return medicines.find((x) => x.id === this.id) || medicines[0];
    },
    pageTitle() {
      return this.type === "0"
        ? "药械详情"
        : this.type === "service"
          ? this.name
          : this.type === "article"
            ? "资讯详情"
            : this.type === "1"
              ? "医院信息"
              : this.type === "2"
                ? "专家信息"
                : "保险产品信息";
    },
    saveKey() {
      return this.type === "0"
        ? this.id
        : this.type + ":" + (this.name || this.id);
    },
    infoRows() {
      return [
        ["药品名称", this.item.name + " " + this.item.english],
        ["科室", this.item.department],
        ["生产厂家", this.item.manufacturer],
        ["获批时间", this.item.date],
        ["别名", this.item.id === "lurbinectedin" ? "芦比替定,鲁比卡丁" : ""],
      ];
    },
    description() {
      return this.item.id === "lurbinectedin"
        ? "适用于治疗在铂类药物化疗期间或之后出现疾病进展的转移性小细胞肺癌（SCLC）成人患者。"
        : "详细信息以正式药品说明书为准。";
    },
  },
  methods: {
    toggleSave() {
      let ids = uni.getStorageSync("lecheng-favorites") || [];
      this.saved = !this.saved;
      ids = this.saved
        ? [...new Set([...ids, this.saveKey])]
        : ids.filter((x) => x !== this.saveKey);
      uni.setStorageSync("lecheng-favorites", ids);
      let records = uni.getStorageSync("lecheng-favorite-records") || [];
      records = records.filter((x) => x.key !== this.saveKey);
      if (this.saved)
        records.push({
          key: this.saveKey,
          type: this.type,
          id: this.id,
          name: this.type === "0" ? this.item.name : this.name,
          kind: this.kind,
          date: this.date,
        });
      uni.setStorageSync("lecheng-favorite-records", records);
      uni.showToast({
        title: this.saved ? "已收藏" : "已取消收藏",
        icon: "none",
      });
    },
    jump(index) {
      this.active = index;
      uni.pageScrollTo({
        selector: "#section-" + index,
        offsetTop: -100,
        duration: 220,
      });
    },
    hospital() {
      uni.navigateTo({ url: "/pages/catalog/catalog?type=1" });
    },
    insurance() {
      uni.navigateTo({ url: "/pages/catalog/catalog?type=3" });
    },
    assistant() {
      uni.navigateTo({ url: "/pages/assistant/assistant" });
    },
  },
};
</script>
<style scoped>
.detail-page {
  min-height: 100vh;
  padding-bottom: 60rpx;
}
.detail-page :deep(.brand-header) {
  height: 108rpx;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.drug-hero {
  height: 533rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e7eeef;
  overflow: hidden;
}
.drug-hero .reference-art {
  transform: scale(1.38);
  transform-origin: center;
}
.drug-summary {
  background: #fff;
  border-radius: 23rpx 23rpx 0 0;
  padding: 35rpx 28rpx 28rpx;
  position: relative;
  margin-top: -7rpx;
}
.summary-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 23rpx;
}
.drug-tag {
  background: #4189f5;
  color: white;
  border-radius: 5rpx;
  padding: 4rpx 6rpx;
  font-size: 24rpx;
}
.favorite {
  padding: 8rpx 15rpx;
  border: 1rpx solid #ddd;
  border-radius: 30rpx;
  font-size: 23rpx;
}
.favorite.saved {
  color: #3d8bfb;
  border-color: #9dc6ff;
}
.detail-name {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.5;
  display: block;
}
.alias {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 14rpx;
  line-height: 1.5;
}
.detail-badges {
  display: flex;
  gap: 20rpx;
  white-space: nowrap;
  margin-top: 43rpx;
}
.detail-badges text {
  font-size: 24rpx;
  padding: 7rpx 15rpx;
  border-radius: 30rpx;
  background: #ffbc7e;
  color: #fff;
}
.detail-badges text:first-child {
  background: #4fc2b9;
}
.detail-tabs {
  margin-top: 57rpx;
  background: #fff;
  height: 102rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: sticky;
  top: 108rpx;
  z-index: 8;
  border-bottom: 1rpx solid #eee;
}
.detail-tabs > view {
  font-size: 27rpx;
  position: relative;
  white-space: nowrap;
}
.detail-tabs .selected {
  color: #4a92e2;
  font-weight: 600;
}
.selected:after {
  content: "";
  position: absolute;
  bottom: -25rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 39rpx;
  height: 6rpx;
  border-radius: 4rpx;
  background: #458cf2;
}
.detail-section {
  margin-top: 23rpx;
  background: #fff;
  padding-bottom: 28rpx;
  scroll-margin-top: 210rpx;
}
.section-heading {
  display: block;
  padding: 24rpx 28rpx;
  font-size: 29rpx;
  font-weight: 600;
  border-bottom: 1rpx solid #eee;
}
.info-table {
  margin: 25rpx 28rpx 0;
  border: 1rpx solid #eee;
  border-radius: 19rpx;
  overflow: hidden;
}
.info-table > view {
  display: flex;
  font-size: 25rpx;
  line-height: 1.8;
  border-bottom: 1rpx solid #e6e8ef;
  background: #f3f6ff;
}
.info-table > view:nth-child(even) {
  background: #fff;
}
.info-table > view:last-child {
  border: 0;
}
.info-table text {
  padding: 12rpx 25rpx;
  flex: 1;
  color: #727e89;
}
.info-table text:first-child {
  font-weight: 600;
  color: #36506b;
  width: 40%;
  flex: none;
  border-right: 1rpx solid #e6e8ef;
  text-align: center;
}
.section-copy {
  font-size: 26rpx;
  line-height: 1.7;
  padding: 20rpx 28rpx;
  display: block;
}
.field-label {
  display: block;
  font-weight: 700;
  margin-bottom: 9rpx;
}
.field-label:not(:first-child) {
  margin-top: 12rpx;
}
.linked-row {
  display: flex;
  justify-content: space-between;
  padding: 25rpx 30rpx;
  color: #5099e8;
  font-size: 26rpx;
}
.drug-fallback {
  font-size: 50rpx;
  color: #6399ca;
}
.detail-page > :deep(.service-poster) {
  height: 750rpx;
  border-radius: 0 0 22rpx 22rpx;
}
.service-consult {
  background: #66a6ff;
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding: 23rpx 28rpx;
  font-size: 27rpx;
  font-weight: 600;
}
.service-summary {
  background: #fff;
  padding: 36rpx 29rpx 72rpx;
  font-size: 28rpx;
  font-weight: 600;
}
.service-summary > view {
  font-size: 23rpx;
  font-weight: 400;
  margin-top: 24rpx;
}
.detail-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20rpx 35rpx 35rpx;
  gap: 33rpx;
}
.detail-actions > view {
  font-size: 45rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6rpx;
}
.detail-actions text {
  font-size: 23rpx;
}
.detail-actions .consult-button {
  font-size: 32rpx;
  background: linear-gradient(#3987f5, #83bdff);
  color: #fff;
  border-radius: 50rpx;
  flex: 1;
  padding: 20rpx 15rpx;
}
.article {
  padding: 35rpx 30rpx;
  background: #fff;
  min-height: 80vh;
}
.article-heading {
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.6;
  display: block;
}
.article-meta {
  display: block;
  font-size: 23rpx;
  color: #999;
  margin-top: 30rpx;
}
.article-rule {
  height: 1rpx;
  background: #edf0f3;
  margin: 40rpx 0;
}
.article-note {
  font-size: 28rpx;
  line-height: 1.8;
  color: #8b99a6;
}
.article-favorite {
  margin: 55rpx auto;
  text-align: center;
  color: #5c96da;
  font-size: 26rpx;
}
.resource-detail-head {
  background: linear-gradient(#d5eaff, #f7fbff);
  padding: 80rpx 25rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30rpx;
  color: #4e91d7;
  font-size: 38rpx;
}
.resource-detail-head > text {
  font-weight: 700;
}
.resource-note {
  padding: 20rpx 28rpx;
  color: #98a4b0;
  font-size: 25rpx;
}
.resource-buttons {
  padding: 30rpx;
}
</style>
