<template>
  <view class="resource-list">
    <template v-if="type === 1">
      <view
        v-for="item in hospitals"
        :key="item.id"
        class="hospital"
        @tap="open(item)"
      >
        <view class="hospital-image">
          <NativeArt name="hospital-photo" :width="664" />
          <view class="hospital-name">
            <text v-if="item.id === 'huaxi'">公立</text>
            {{ item.name }}
          </view>
        </view>
      </view>
    </template>
    <template v-if="type === 2">
      <view
        v-for="item in experts"
        :key="item.id"
        class="expert"
        @tap="open(item)"
      >
        <view class="expert-top">
          <view class="portrait">
            <NativeArt
              :name="
                item.id === 'wangzhenyi' ? 'expert-wang' : 'expert-wanghongyang'
              "
              :width="120"
            />
          </view>
          <view class="expert-info">
            <view>
              <text class="expert-name">{{ item.name }}</text>
              <text class="expert-rank">院士 | 其他</text>
            </view>
            <text class="expert-hospital">中国干细胞集团附属医院</text>
            <view class="expert-badges">
              <text>工程院院士</text>
              <text>
                {{ item.id === "wangzhenyi" ? "共和国勋章" : "少将" }}
              </text>
              <text>教授</text>
            </view>
          </view>
        </view>
        <view class="specialty">❝ 擅长：{{ item.specialty }}</view>
      </view>
    </template>
    <view v-if="type === 3" class="insurance-grid">
      <view
        v-for="item in insurances"
        :key="item.id"
        class="insurance-card"
        @tap="open(item)"
      >
        <view class="insurance-poster">
          <NativeArt
            :name="
              item.id === 'lecheng' ? 'insurance-lecheng' : 'insurance-wuxi'
            "
            :width="308"
          />
        </view>
        <view class="coverage">
          <text>可报特许药械</text>
          <text>{{ item.count }}种</text>
        </view>
        <text class="insurance-name">{{ item.name }}</text>
      </view>
    </view>
    <view v-if="empty" class="empty-state">暂无匹配结果</view>
  </view>
</template>
<script>
import NativeArt from "./NativeArt.vue";
import AppIcon from "./AppIcon.vue";
const hospitalData = [
    {
      id: "huaxi",
      name: "华西乐城医院",
      tags: ["公立", "综合", "肿瘤科", "神经内科"],
    },
    { id: "ruijin", name: "瑞金海南医院" },
    { id: "future", name: "博鳌未来医院" },
  ],
  expertData = [
    {
      id: "wangzhenyi",
      name: "王振义",
      specialty: "内科血液学专家",
      tags: ["内科", "血液科"],
    },
    {
      id: "wanghongyang",
      name: "王红阳",
      specialty: "医学与肿瘤分子生物学",
      tags: ["肿瘤科", "肿瘤"],
    },
  ],
  insuranceData = [
    { id: "lecheng", name: "乐城特药险", count: 74, tags: ["海南"] },
    { id: "jinhuicheng", name: "医惠锡城", count: 20, tags: ["江苏"] },
  ];
export default {
  components: { AppIcon, NativeArt },
  props: {
    type: Number,
    query: { type: String, default: "" },
    filter: { type: String, default: "全部" },
  },
  computed: {
    hospitals() {
      return hospitalData.filter(
        (x) =>
          (x.name + (x.specialty || "")).includes(this.query) &&
          (this.filter === "全部" || (x.tags || []).includes(this.filter)),
      );
    },
    experts() {
      return expertData.filter(
        (x) =>
          (x.name + (x.specialty || "")).includes(this.query) &&
          (this.filter === "全部" || (x.tags || []).includes(this.filter)),
      );
    },
    insurances() {
      return insuranceData.filter(
        (x) =>
          (x.name + (x.specialty || "")).includes(this.query) &&
          (this.filter === "全部" || (x.tags || []).includes(this.filter)),
      );
    },
    empty() {
      return !(
        this.type === 1
          ? this.hospitals
          : this.type === 2
            ? this.experts
            : this.insurances
      ).length;
    },
  },
  methods: {
    open(item) {
      uni.navigateTo({
        url:
          "/pages/detail/detail?type=" +
          this.type +
          "&id=" +
          item.id +
          "&name=" +
          encodeURIComponent(item.name),
      });
    },
  },
};
</script>
<style scoped>
.resource-list {
  padding: 0 17rpx;
}
.hospital {
  padding: 30rpx 0;
}
.hospital-image {
  height: 350rpx;
  background: #e9f4ff;
  position: relative;
  overflow: hidden;
  border-radius: 18rpx;
}
.hospital-sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(#78b8ef, #e9f7ff 70%);
}
.hospital-building {
  position: absolute;
  bottom: 40rpx;
  left: 17%;
  width: 65%;
  height: 210rpx;
  background: #ebeff2;
  border-top: 16rpx solid #d5e1eb;
  display: flex;
  gap: 25rpx;
  align-items: flex-end;
  padding: 50rpx 30rpx 0;
}
.hospital-building > text {
  position: absolute;
  top: 4rpx;
  left: 44%;
  color: #65a7d2;
  font-size: 35rpx;
}
.hospital-building view {
  height: 125rpx;
  flex: 1;
  background: repeating-linear-gradient(#76a6c5 0 14rpx, #d2e3ee 14rpx 20rpx);
}
.entry-date {
  position: absolute;
  top: 14rpx;
  left: 15rpx;
  background: #668aaa80;
  color: #fff;
  border-radius: 20rpx;
  font-size: 20rpx;
  padding: 6rpx 18rpx;
}
.hospital-name {
  position: absolute;
  bottom: 0;
  height: 63rpx;
  left: 0;
  right: 0;
  background: #6296d6;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 27rpx;
  gap: 20rpx;
}
.hospital-name text {
  background: #469afa;
  padding: 15rpx;
  font-size: 24rpx;
}
.expert {
  padding: 20rpx 0 35rpx;
  border-bottom: 1rpx solid #ddd;
}
.expert-top {
  display: flex;
  gap: 20rpx;
}
.portrait {
  width: 130rpx;
  height: 151rpx;
  background: #f1f4fb;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.expert-info {
  padding-top: 6rpx;
  flex: 1;
}
.expert-name {
  font-size: 31rpx;
  font-weight: 600;
  margin-right: 24rpx;
}
.expert-rank {
  font-size: 22rpx;
}
.expert-hospital {
  font-size: 22rpx;
  display: block;
  margin: 16rpx 0;
}
.expert-badges {
  display: flex;
  gap: 12rpx;
  font-size: 21rpx;
  white-space: nowrap;
}
.expert-badges text {
  background: #e5f5f4;
  color: #51aaba;
  padding: 2rpx 9rpx;
  border-radius: 4rpx;
}
.expert-badges text:nth-child(2) {
  background: #fff5df;
  color: #d99d40;
}
.expert-badges text:nth-child(3) {
  background: #e7f0ff;
  color: #669ce2;
}
.specialty {
  font-size: 24rpx;
  color: #999;
  margin-top: 30rpx;
}
.insurance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  padding-top: 24rpx;
}
.insurance-poster {
  height: 257rpx;
  border-radius: 14rpx 14rpx 0 0;
  background: linear-gradient(140deg, #e13237, #b31320);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  gap: 13rpx;
  font-weight: 600;
  font-size: 31rpx;
}
.insurance-poster > text:first-child {
  font-size: 20rpx;
  letter-spacing: 10rpx;
}
.insurance-poster view {
  font-size: 18rpx;
  font-weight: 400;
  letter-spacing: 1rpx;
}
.insurance-poster.jinhuicheng {
  background: linear-gradient(130deg, #559beb, #bddffc);
}
.coverage {
  height: 54rpx;
  display: flex;
  background: #e2efff;
  font-size: 21rpx;
  color: #438aee;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}
.coverage text {
  padding: 9rpx;
}
.coverage text:first-child {
  color: white;
  background: linear-gradient(#78b5ff, #3188ee);
  border-radius: 0 10rpx 10rpx 0;
}
.insurance-name {
  display: block;
  padding-top: 13rpx;
  font-size: 26rpx;
  font-weight: 600;
}
.resource-list {
  padding: 0;
}
.portrait {
  width: 120rpx;
  height: 147rpx;
}
.insurance-poster {
  height: auto;
  background: none;
  display: block;
}
.insurance-grid {
  gap: 18rpx;
  padding: 24rpx 10rpx 0;
}
.hospital-image {
  height: 350rpx;
}
.expert-info {
  padding-top: 2rpx;
}
.expert-name {
  margin-right: 20rpx;
}
.expert-badges {
  gap: 12rpx;
}
.expert-hospital {
  margin: 16rpx 0;
}
</style>
