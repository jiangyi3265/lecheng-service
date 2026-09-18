<template>
  <view class="account-page">
    <BrandHeader :title="title" />
    <template v-if="section === 'login'">
      <view class="login-brand">乐城服务</view>
      <text class="login-subtitle">欢迎使用乐城服务</text>
      <view class="login-info">当前为本地复刻演示，尚未连接官方账号服务。</view>
      <button class="primary-button" @tap="back">返回浏览</button>
    </template>
    <template v-else>
      <view v-if="section === 'orders'" class="account-tabs">
        <view
          v-for="(t, i) in tabs"
          :key="t"
          :class="{ selected: tab === i }"
          @tap="tab = i"
        >
          {{ t }}
        </view>
      </view>
      <view
        v-if="section === 'collections' && (saved.length || otherSaved.length)"
        class="saved-list"
      >
        <MedicineCard v-for="item in saved" :key="item.id" :item="item" />
        <view
          v-for="item in otherSaved"
          :key="item.key"
          class="saved-resource"
          @tap="openSaved(item)"
        >
          <text>{{ item.name }}</text>
          <text>›</text>
        </view>
      </view>
      <view v-else class="account-empty">
        <view class="empty-sheet">
          {{ section === "collections" ? "☆" : "▤" }}
        </view>
        <text>{{ emptyLabel }}</text>
        <text class="account-hint">
          {{
            section === "collections"
              ? "在详情页点击收藏，即可在这里查看"
              : "登录及业务数据接口尚未接入"
          }}
        </text>
        <view class="browse" @tap="browse">去逛逛</view>
      </view>
    </template>
  </view>
</template>
<script>
import BrandHeader from "../../components/BrandHeader.vue";
import MedicineCard from "../../components/MedicineCard.vue";
import { medicines } from "../../data/catalog";
export default {
  components: { BrandHeader, MedicineCard },
  data() {
    return {
      section: "orders",
      tab: 0,
      tabs: ["全部", "待付款", "待使用", "退款售后"],
      saved: [],
      otherSaved: [],
    };
  },
  onLoad(p) {
    this.section = p.section || "orders";
    this.tab = Number(p.tab || 0);
  },
  onShow() {
    const ids = uni.getStorageSync("lecheng-favorites") || [];
    this.saved = medicines.filter((x) => ids.includes(x.id));
    this.otherSaved = (
      uni.getStorageSync("lecheng-favorite-records") || []
    ).filter((x) => x.type !== "0" && ids.includes(x.key));
  },
  computed: {
    title() {
      return (
        {
          orders: "我的订单",
          collections: "我的收藏",
          follows: "药械关注",
          cards: "我的卡包",
          packages: "我的便民服务包",
          login: "登录",
        }[this.section] || "我的"
      );
    },
    emptyLabel() {
      return {
        orders: "暂无相关订单",
        collections: "暂无收藏",
        follows: "暂无关注药械",
        cards: "暂无卡券",
        packages: "暂无便民服务包",
      }[this.section];
    },
  },
  methods: {
    openSaved(item) {
      uni.navigateTo({
        url:
          "/pages/detail/detail?type=" +
          item.type +
          "&id=" +
          item.id +
          "&name=" +
          encodeURIComponent(item.name) +
          "&kind=" +
          item.kind +
          "&date=" +
          item.date,
      });
    },
    browse() {
      uni.reLaunch({ url: "/pages/index/index" });
    },
    back() {
      uni.navigateBack();
    },
  },
};
</script>
<style scoped>
.account-page {
  min-height: 100vh;
}
.account-page :deep(.brand-header) {
  height: 108rpx;
  background: #fff;
}
.account-tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 90rpx;
  background: #fff;
  font-size: 26rpx;
}
.account-tabs .selected {
  color: #398bf5;
  position: relative;
}
.selected:after {
  content: "";
  position: absolute;
  bottom: -25rpx;
  width: 35rpx;
  height: 5rpx;
  border-radius: 5rpx;
  background: #398bf5;
  left: 50%;
  transform: translateX(-50%);
}
.account-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 180rpx;
  color: #8b98a6;
  font-size: 28rpx;
  gap: 25rpx;
}
.empty-sheet {
  font-size: 130rpx;
  color: #c8dbee;
}
.account-hint {
  font-size: 23rpx;
  color: #a6afb9;
}
.browse {
  margin-top: 16rpx;
  color: #3f91ff;
  border: 1rpx solid #3f91ff;
  padding: 15rpx 45rpx;
  border-radius: 35rpx;
}
.saved-list {
  padding: 0 25rpx;
  background: #fff;
}
.login-brand {
  font-size: 60rpx;
  font-weight: 800;
  color: #3e93ff;
  text-align: center;
  padding-top: 180rpx;
}
.login-subtitle {
  display: block;
  text-align: center;
  margin-top: 35rpx;
  font-size: 33rpx;
}
.login-info {
  padding: 65rpx 55rpx;
  text-align: center;
  color: #8c99a7;
  font-size: 25rpx;
  line-height: 1.8;
}
.primary-button {
  margin: 0 55rpx;
}
.saved-resource {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 25rpx;
  font-size: 28rpx;
  line-height: 1.6;
}
.saved-resource > text + text {
  color: #aaa;
}
</style>
