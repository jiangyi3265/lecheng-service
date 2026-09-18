<template>
  <view class="profile-page">
    <view class="profile-head">
      <BrandHeader compact skin="profile" />
      <view class="account" @tap="login">
        <NativeArt name="avatar" :width="125" />
        <text>点击登录</text>
      </view>
    </view>
    <view class="profile-body">
      <view class="orders">
        <view
          v-for="(item, index) in orders"
          :key="item.label"
          @tap="open('orders', index)"
        >
          <NativeArt
            :name="
              ['order-all', 'order-pay', 'order-use', 'order-refund'][index]
            "
            :width="80"
          />
          <text>{{ item.label }}</text>
        </view>
      </view>
      <view class="profile-banners">
        <view
          class="collection-banner"
          role="button"
          aria-label="我的收藏"
          @tap="open('collections')"
        >
          <NativeArt name="collect-banner" :width="339" />
        </view>
        <view
          class="follow-banner"
          role="button"
          aria-label="药械关注"
          @tap="open('follows')"
        >
          <NativeArt name="follow-banner" :width="339" />
        </view>
      </view>
      <view class="wallet" @tap="open('cards')">
        <NativeArt name="wallet" :width="83" />
        <text>我的卡包</text>
      </view>
      <view class="my-services">
        <view class="my-service-heading">
          <text>我的便民服务包</text>
          <view @tap="open('packages')">查看全部 ›</view>
        </view>
        <view class="package-empty">
          <NativeArt name="empty-box" :width="245" />
          <text>暂无未使用的便民服务包</text>
          <view class="browse-services" @tap="browseServices">
            浏览便民服务包
          </view>
        </view>
      </view>
    </view>
    <BottomNav current="profile" />
  </view>
</template>
<script>
import NativeArt from "../../components/NativeArt.vue";
import BrandHeader from "../../components/BrandHeader.vue";
import BottomNav from "../../components/BottomNav.vue";
import AppIcon from "../../components/AppIcon.vue";
export default {
  components: { NativeArt, BrandHeader, BottomNav, AppIcon },
  data() {
    return {
      orders: [
        { label: "全部订单", icon: "order" },
        { label: "待付款", icon: "wallet" },
        { label: "待使用", icon: "order" },
        { label: "退款售后", icon: "wallet" },
      ],
    };
  },
  onLoad(p) {
    if (p.section) this.open(p.section);
  },
  methods: {
    login() {
      uni.navigateTo({ url: "/pages/account/account?section=login" });
    },
    open(section, tab = 0) {
      uni.navigateTo({
        url: "/pages/account/account?section=" + section + "&tab=" + tab,
      });
    },
    browseServices() {
      uni.navigateTo({ url: "/pages/service/service" });
    },
    assistant() {
      uni.navigateTo({ url: "/pages/assistant/assistant" });
    },
  },
};
</script>
<style scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 183rpx;
}
.profile-head {
  height: 445rpx;
  background: linear-gradient(125deg, #318cfb, #59a0ff 75%, #d7e9ff);
  position: relative;
  overflow: hidden;
}
.profile-head:after {
  content: "";
  position: absolute;
  width: 400rpx;
  height: 700rpx;
  right: -140rpx;
  top: -130rpx;
  background: #97c6ff30;
  transform: rotate(-42deg);
  pointer-events: none;
}
.account {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin: 39rpx 30rpx;
  color: #fff;
  font-size: 39rpx;
  font-weight: 700;
}
.avatar {
  width: 115rpx;
  height: 115rpx;
  border-radius: 50%;
  border: 2rpx solid #d1e8ff;
  box-shadow: 0 0 0 7rpx #69b0ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar :deep(.user-head),
.avatar :deep(.user-body) {
  background: #fff;
}
.profile-body {
  position: relative;
  margin: -146rpx 24rpx 0;
}
.orders {
  background: #fff;
  height: 185rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.orders > view {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 21rpx;
  font-size: 25rpx;
}
.order-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf7ff;
  color: #78b3ef;
  font-size: 40rpx;
}
.tone-1 {
  background: #ffebef;
  color: #fb729b;
}
.tone-2 {
  background: #ddfbf0;
  color: #50d6b1;
}
.tone-3 {
  background: #fff4e8;
  color: #f9b448;
}
.profile-banners {
  display: flex;
  gap: 24rpx;
  margin-top: 24rpx;
}
.profile-banners > view {
  height: 160rpx;
  border-radius: 20rpx;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  color: #fff;
  gap: 7rpx;
}
.collection-banner {
  background: linear-gradient(110deg, #f99a9f, #f7617d);
}
.follow-banner {
  background: linear-gradient(110deg, #8bbafb, #438cff);
}
.profile-banners > view > view:first-child {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  white-space: nowrap;
  font-size: 28rpx;
  font-weight: 700;
}
.profile-banners > view > view:first-child text + text {
  font-size: 21rpx;
}
.star {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #e9efff;
  border-radius: 50%;
  color: #7c69d7;
  font-size: 58rpx;
  text-shadow: 3rpx 4rpx #b9a4ed;
}
.medicine-icon {
  font-size: 40rpx;
  color: #ff8e72;
  width: 72rpx;
  height: 58rpx;
  background: linear-gradient(#d2f7ff, #8cd3f9);
  border: 5rpx solid #99d7f7;
  border-radius: 6rpx;
  transform: rotate(5deg);
  position: relative;
  text-align: center;
}
.medicine-icon:before {
  content: "";
  position: absolute;
  height: 11rpx;
  top: -16rpx;
  left: 0;
  right: 0;
  background: #afe6ff;
  border-radius: 4rpx;
}
.wallet {
  background: #fff;
  border-radius: 23rpx;
  margin-top: 24rpx;
  height: 184rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 23rpx 36rpx;
  gap: 18rpx;
  font-size: 26rpx;
}
.wallet-icon {
  width: 80rpx;
  height: 80rpx;
  background: #eff8ff;
  border-radius: 50%;
  color: #8dc5f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 43rpx;
}
.my-services {
  margin-top: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  min-height: 370rpx;
}
.my-service-heading {
  height: 85rpx;
  background: linear-gradient(#d7e8ff, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20rpx;
  font-size: 33rpx;
  font-weight: 700;
}
.my-service-heading > view {
  color: #fff;
  background: #489afd;
  border-radius: 0 0 0 35rpx;
  padding: 18rpx 20rpx 18rpx 55rpx;
  font-size: 24rpx;
  font-weight: 400;
}
.package-empty {
  padding-top: 130rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  color: #b2d1f8;
  gap: 20rpx;
  font-size: 25rpx;
}
.empty-box {
  width: 130rpx;
  height: 90rpx;
  background: linear-gradient(100deg, #8bd3fa, #b9e5fc);
  transform: skewY(8deg);
  position: relative;
  color: #c8efff;
  text-align: right;
  padding: 10rpx;
  font-size: 35rpx;
}
.box-lid {
  position: absolute;
  top: -27rpx;
  width: 150rpx;
  height: 38rpx;
  left: -10rpx;
  background: #b3e9ff;
  transform: skewX(-30deg);
  clip-path: polygon(0 0, 50% 25%, 100% 0, 100% 100%, 50% 75%, 0 100%);
}
.consult-bubble {
  position: absolute;
  bottom: -4rpx;
  background: #3f98ff;
  color: #fff;
  font-size: 21rpx;
  padding: 10rpx 26rpx;
  border-radius: 32rpx;
  box-shadow: 0 5rpx 15rpx #acd5ff;
}
.account {
  margin-left: 24rpx;
  gap: 19rpx;
  font-size: 40rpx;
}
.profile-banners > view {
  padding: 0;
  background: none;
  height: auto;
  border-radius: 20rpx;
  overflow: hidden;
  display: block;
}
.package-empty {
  padding: 145rpx 0 170rpx;
  gap: 20rpx;
}
.browse-services {
  background: #3489ff;
  color: white;
  border-radius: 50rpx;
  padding: 12rpx 24rpx;
  margin-top: 35rpx;
  font-size: 29rpx;
}
.my-services {
  min-height: 650rpx;
}
</style>
