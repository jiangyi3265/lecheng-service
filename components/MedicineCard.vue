<template>
  <view
    class="medicine-card"
    role="button"
    :aria-label="item.name + '详情'"
    @tap="open"
  >
    <view class="medicine-heading">
      <text class="medicine-title">{{ item.name }} {{ item.english }}</text>
      <text class="approval">{{ item.date }} 获批</text>
    </view>
    <view class="medicine-content">
      <view class="medicine-photo">
        <ReferenceArt v-if="item.image" name="medicine" :width="158" />
        <NativeArt v-else :name="'drug-' + item.id" :width="158" />
      </view>
      <view class="medicine-info">
        <view class="insurance">
          <text class="insured">
            <text class="shield">✚</text>
            可用商保
          </text>
          <text class="insurance-label">{{ item.insurance }}</text>
        </view>
        <view class="facts">
          <text>落地医院：{{ item.hospital }}</text>
          <text>所属科室：{{ item.department }}</text>
          <text>生产厂家：{{ item.manufacturer }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import NativeArt from "./NativeArt.vue";
import ReferenceArt from "./ReferenceArt.vue";
import { openDetail } from "../data/catalog";
export default {
  components: { ReferenceArt, NativeArt },
  props: { item: Object },
  methods: {
    open() {
      openDetail(this.item);
    },
  },
};
</script>
<style scoped>
.medicine-card {
  padding: 24rpx 0 39rpx;
  border-bottom: 1rpx solid #d7d7d7;
}
.medicine-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15rpx;
  margin-bottom: 30rpx;
}
.medicine-title {
  font-size: 29rpx;
  line-height: 1.3;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  letter-spacing: -0.8rpx;
}
.approval {
  font-size: 23rpx;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: -0.8rpx;
}
.medicine-content {
  display: flex;
  gap: 17rpx;
}
.medicine-photo {
  border-radius: 21rpx;
  overflow: hidden;
  border: 2rpx solid #e4e4e4;
  flex-shrink: 0;
  height: 164rpx;
}
.medicine-info {
  min-width: 0;
  flex: 1;
}
.insurance {
  height: 36rpx;
  display: flex;
  align-items: center;
  border-radius: 12rpx;
  background: linear-gradient(90deg, #cfefef, #f6fcfc);
  color: #00a6ae;
  white-space: nowrap;
  overflow: hidden;
  font-size: 23rpx;
  gap: 11rpx;
}
.insured {
  height: 36rpx;
  background: #16b9b9;
  color: #fff;
  font-weight: 600;
  border-radius: 11rpx;
  display: flex;
  align-items: center;
  padding: 0 11rpx 0 4rpx;
  gap: 7rpx;
}
.shield {
  font-size: 27rpx;
  background: #d8ffff;
  color: #00abb4;
  border-radius: 7rpx;
  padding: 0 3rpx;
  line-height: 29rpx;
}
.facts {
  display: flex;
  flex-direction: column;
  color: #929292;
  font-size: 24rpx;
  line-height: 38rpx;
  margin-top: 17rpx;
  white-space: nowrap;
}
.second-preview {
  display: flex;
  gap: 20rpx;
  align-items: center;
}
.drug-placeholder {
  background: #e8f3fc;
  border: 1rpx solid #d2e8fa;
  border-radius: 16rpx;
  width: 158rpx;
  height: 158rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 44rpx;
  color: #6fa3cd;
}
.drug-placeholder text {
  font-size: 18rpx;
  margin-top: 10rpx;
}
.block {
  display: block;
  margin-top: 15rpx;
}
.muted {
  color: #929ba5;
  font-size: 24rpx;
}
</style>
