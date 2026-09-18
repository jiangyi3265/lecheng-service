<template>
  <view class="bottom-nav">
    <view
      v-for="item in items"
      :key="item.key"
      class="nav-item"
      :class="{
        active: current === item.key,
        assistant: item.key === 'assistant',
      }"
      role="button"
      :aria-label="item.label"
      @tap="navigate(item)"
    >
      <NativeArt v-if="item.key === 'assistant'" name="mascot" :width="124" />
      <NativeArt
        v-else
        :name="'nav-' + item.key + (current === item.key ? '-on' : '')"
        :width="46"
      />
      <text>{{ item.label }}</text>
    </view>
  </view>
</template>
<script>
import AppIcon from "./AppIcon.vue";
import NativeArt from "./NativeArt.vue";
export default {
  components: { AppIcon, NativeArt },
  props: { current: { type: String, default: "home" } },
  data() {
    return {
      items: [
        { key: "home", label: "首页", icon: "home", url: "index/index" },
        {
          key: "service",
          label: "服务",
          icon: "heart",
          url: "service/service",
        },
        { key: "assistant", label: "乐小二", url: "assistant/assistant" },
        { key: "news", label: "动态", icon: "news", url: "news/news" },
        { key: "profile", label: "我的", icon: "user", url: "profile/profile" },
      ],
    };
  },
  methods: {
    navigate(item) {
      if (item.key === this.current) return;
      const url = "/pages/" + item.url;
      item.key === "assistant"
        ? uni.navigateTo({ url })
        : uni.redirectTo({ url });
    },
  },
};
</script>
<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 184rpx;
  padding: 20rpx 20rpx 54rpx;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: calc(36rpx + env(safe-area-inset-bottom));
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 103rpx;
  height: 107rpx;
  border-radius: 15rpx;
  color: #98a0aa;
  font-size: 27rpx;
  position: relative;
}
.nav-item.active {
  color: #348aff;
  background: #ecf6ff;
}
.nav-item.assistant {
  width: 136rpx;
  justify-content: flex-end;
  background: transparent;
}
.assistant .native-art {
  position: absolute;
  bottom: 40rpx;
  left: 6rpx;
}
.assistant text {
  position: relative;
  bottom: -8rpx;
}
</style>
