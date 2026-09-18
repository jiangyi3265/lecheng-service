<template>
  <view
    class="brand-header"
    :class="{ compact, back: !!title, imageBrand: !title }"
  >
    <NativeArt
      v-if="!title"
      class="brand-art"
      :name="skin === 'profile' ? 'header-profile' : 'header-primary'"
      :width="750"
    />
    <view v-if="title" class="back-control" @tap="goBack">
      <AppIcon name="back" :size="36" />
      <text>返回</text>
    </view>
    <template v-else>
      <text class="brand-name">乐城服务</text>
      <view v-if="search" class="brand-search" @tap="openSearch">
        <AppIcon name="search" :size="30" />
      </view>
    </template>
    <text v-if="title" class="page-heading">{{ title }}</text>
    <!-- #ifndef MP-WEIXIN -->
    <view class="capsule">
      <view class="capsule-dots">
        <text>•</text>
        <text>●</text>
        <text>•</text>
      </view>
      <view class="capsule-divider" />
      <view class="capsule-minus" />
      <view class="capsule-divider" />
      <view class="capsule-circle"><view /></view>
    </view>
    <!-- #endif -->
  </view>
</template>
<script>
import NativeArt from "./NativeArt.vue";
import AppIcon from "./AppIcon.vue";
export default {
  components: { AppIcon, NativeArt },
  props: { title: String, compact: Boolean, search: Boolean, skin: String },
  methods: {
    openSearch() {
      uni.navigateTo({ url: "/pages/catalog/catalog?focus=1" });
    },
    goBack() {
      const pages = getCurrentPages();
      pages.length > 1
        ? uni.navigateBack()
        : uni.reLaunch({ url: "/pages/index/index" });
    },
  },
};
</script>
<style scoped>
.brand-header {
  height: 138rpx;
  display: flex;
  align-items: center;
  position: relative;
  padding: 12rpx 10rpx 0 30rpx;
  box-sizing: border-box;
  color: #fff;
  gap: 29rpx;
}
.brand-header.compact {
  height: 108rpx;
  padding-top: 44rpx;
}
.brand-name {
  font-size: 36rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  white-space: nowrap;
}
.brand-search {
  width: 53rpx;
  height: 53rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #91c7ff;
}
.capsule {
  margin-left: auto;
  width: 216rpx;
  height: 58rpx;
  border-radius: 40rpx;
  background: rgba(235, 246, 255, 0.67);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: #14202a;
}
.capsule-dots {
  display: flex;
  align-items: center;
  gap: 2rpx;
  font-size: 22rpx;
}
.capsule-dots text:nth-child(2) {
  font-size: 23rpx;
}
.capsule-divider {
  height: 30rpx;
  width: 1rpx;
  background: rgba(66, 97, 128, 0.24);
}
.capsule-minus {
  width: 26rpx;
  height: 5rpx;
  background: #14202a;
  border-radius: 8rpx;
}
.capsule-circle {
  width: 31rpx;
  height: 31rpx;
  border: 4rpx solid #14202a;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.capsule-circle view {
  width: 12rpx;
  height: 12rpx;
  background: #14202a;
  border-radius: 50%;
}
.back-control {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  gap: 5rpx;
  color: #263d54;
}
.page-heading {
  max-width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #22374d;
  font-size: 30rpx;
}
.back .capsule {
  width: 216rpx;
}
.back {
  background: #c3e0ff;
  padding-top: 36rpx;
}
.brand-art {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
.imageBrand > .brand-name,
.imageBrand > .brand-search,
.imageBrand > .capsule {
  opacity: 0;
}
.imageBrand > .brand-search {
  position: relative;
  z-index: 1;
}
</style>
