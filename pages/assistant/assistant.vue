<template>
  <view class="assistant-page">
    <BrandHeader title="乐小二" />
    <scroll-view scroll-y class="conversation" :scroll-into-view="scrollTarget">
      <view class="chat-time">
        {{ time }}
        <text @tap="more">更多消息</text>
      </view>
      <view class="welcome">
        <NativeArt name="assistant-mascot" :width="168" />
        <view class="welcome-bubble">
          <text>您好，我是乐小二</text>
          <text>您的乐城服务管家</text>
        </view>
      </view>
      <view class="suggestion-panel">
        <view class="suggestion-heading">
          <text>您可以问我：</text>
          <text class="refresh" @tap="nextSuggestions">◌ 换一换</text>
        </view>
        <view
          v-for="(q, i) in suggestions"
          :key="q.label"
          class="suggestion"
          @tap="open(q)"
        >
          <text>{{ i + 1 }}.{{ q.label }}</text>
          <text>›</text>
        </view>
      </view>
      <view
        v-for="(message, index) in messages"
        :id="'message-' + index"
        :key="index"
        class="message"
        :class="message.role"
      >
        <view>{{ message.text }}</view>
        <view
          v-if="message.route"
          class="message-link"
          @tap="go(message.route)"
        >
          查看相关内容 ›
        </view>
      </view>
      <view id="conversation-end" class="conversation-end" />
    </scroll-view>
    <view class="assistant-composer">
      <view class="assistant-tools">
        <view @tap="customer">
          <NativeArt name="assistant-customer" :width="32" />
          人工客服
        </view>
        <view @tap="hotline">
          <NativeArt name="assistant-phone" :width="34" />
          客服热线
        </view>
        <view @tap="go('/pages/service/service')">
          <NativeArt name="assistant-bag" :width="32" />
          服务包购买
        </view>
      </view>
      <view class="composer-field">
        <AppIcon name="mic" :size="32" />
        <input
          v-model="message"
          placeholder="请输入"
          confirm-type="send"
          @confirm="send"
        />
        <view class="send" @tap="send">发送</view>
      </view>
    </view>
  </view>
</template>
<script>
import NativeArt from "../../components/NativeArt.vue";
import BrandHeader from "../../components/BrandHeader.vue";
import ReferenceArt from "../../components/ReferenceArt.vue";
import AppIcon from "../../components/AppIcon.vue";
export default {
  components: { NativeArt, BrandHeader, ReferenceArt, AppIcon },
  data() {
    return { time: "", message: "", messages: [], scrollTarget: "", page: 0 };
  },
  onLoad() {
    this.time = new Date()
      .toLocaleString("zh-CN", { hour12: false })
      .replaceAll("/", "-");
  },
  computed: {
    suggestions() {
      return this.page % 2 === 0
        ? [
            { label: "乐城特许药械", route: "/pages/catalog/catalog?type=0" },
            { label: "乐城医院", route: "/pages/catalog/catalog?type=1" },
            { label: "乐城专家", route: "/pages/catalog/catalog?type=2" },
            { label: "乐城保险", route: "/pages/catalog/catalog?type=3" },
            { label: "乐城政策", route: "/pages/news/news?tab=1" },
          ]
        : [
            { label: "医疗服务", route: "/pages/service/service?tab=1" },
            { label: "新生物技术", route: "/pages/service/service?tab=2" },
            {
              label: "我的收藏",
              route: "/pages/profile/profile?section=collections",
            },
            { label: "新闻动态", route: "/pages/news/news" },
            { label: "全部药械", route: "/pages/catalog/catalog" },
          ];
    },
  },
  methods: {
    nextSuggestions() {
      this.page++;
    },
    open(q) {
      this.go(q.route);
    },
    go(url) {
      uni.navigateTo({ url });
    },
    more() {
      uni.showToast({ title: "暂无更早消息", icon: "none" });
    },
    customer() {
      this.messages.push({
        role: "bot",
        text: "人工客服尚未接入。您可以先查看药械、医院、专家和服务信息。",
      });
      this.bottom();
    },
    hotline() {
      uni.showModal({
        title: "客服热线",
        content: "当前复刻版本暂未配置官方客服电话。",
        showCancel: false,
      });
    },
    send() {
      const input = this.message.trim();
      if (!input) return;
      this.messages.push({ role: "user", text: input });
      const type = /医院/.test(input)
        ? 1
        : /专家|医生/.test(input)
          ? 2
          : /保险/.test(input)
            ? 3
            : 0;
      this.messages.push({
        role: "bot",
        text:
          "您可以在" +
          ["药械", "医院", "专家", "保险"][type] +
          "列表中查看相关信息。当前为本地页面导航助手，暂未接入在线问答。",
        route: "/pages/catalog/catalog?type=" + type,
      });
      this.message = "";
      this.bottom();
    },
    bottom() {
      this.scrollTarget = "";
      this.$nextTick(() => (this.scrollTarget = "conversation-end"));
    },
  },
};
</script>
<style scoped>
.assistant-page {
  height: 100vh;
  background: linear-gradient(#bedcfc 0%, #ddf1fc 27%, #fff 55%);
  display: flex;
  flex-direction: column;
}
.assistant-page :deep(.brand-header) {
  height: 110rpx;
  flex-shrink: 0;
  background: transparent;
}
.conversation {
  height: calc(100vh - 310rpx);
}
.chat-time {
  padding: 30rpx 20rpx;
  font-size: 23rpx;
  color: #9daab9;
  text-align: center;
  position: relative;
}
.chat-time text {
  position: absolute;
  right: 20rpx;
}
.welcome {
  display: flex;
  align-items: center;
  padding: 0 50rpx;
  gap: 27rpx;
}
.welcome-bubble {
  background: #ffffffde;
  border-radius: 30rpx;
  width: 319rpx;
  min-height: 130rpx;
  padding: 24rpx 22rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  font-size: 25rpx;
  font-weight: 600;
}
.welcome-bubble text + text {
  font-size: 22rpx;
  color: #a0a8b1;
  font-weight: 400;
}
.suggestion-panel {
  margin: 3rpx 30rpx 30rpx;
  width: 600rpx;
  background: linear-gradient(130deg, #e1f6f9, #cfdef5);
  border: 1rpx solid #effaff;
  border-radius: 30rpx;
  padding: 23rpx 18rpx 28rpx;
}
.suggestion-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 17rpx 19rpx;
  font-size: 24rpx;
}
.refresh {
  font-size: 20rpx;
  padding: 7rpx 15rpx;
  background: #fff;
  border-radius: 15rpx;
  color: #858c9b;
}
.suggestion {
  padding: 14rpx 20rpx;
  margin-bottom: 7rpx;
  background: #ffffffd6;
  border-radius: 14rpx;
  display: flex;
  justify-content: space-between;
  font-size: 25rpx;
  line-height: 40rpx;
}
.suggestion > text + text {
  color: #a5aebb;
  font-size: 38rpx;
}
.assistant-composer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 22rpx 28rpx;
  background: #fff;
  border-top: 1rpx solid #e7e7ef;
}
.assistant-tools {
  display: flex;
  justify-content: space-around;
  height: 88rpx;
  align-items: center;
  font-size: 26rpx;
}
.assistant-tools text {
  color: #69b5e3;
  margin-right: 5rpx;
}
.composer-field {
  display: flex;
  height: 77rpx;
  align-items: center;
  background: #f3f3f3;
  border-radius: 45rpx;
  padding: 0 5rpx 0 24rpx;
  gap: 17rpx;
  color: #b3bdc7;
}
.composer-field input {
  flex: 1;
  font-size: 25rpx;
  color: #333;
}
.send {
  background: linear-gradient(#3488fc, #88bfff);
  color: #fff;
  padding: 13rpx 31rpx;
  border-radius: 40rpx;
  font-size: 27rpx;
}
.message {
  padding: 15rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 26rpx;
  line-height: 1.7;
}
.message > view {
  max-width: 85%;
  padding: 20rpx 26rpx;
  border-radius: 20rpx;
  background: #edf3fb;
}
.message.user {
  align-items: flex-end;
}
.message.user > view {
  background: #438fff;
  color: #fff;
}
.message .message-link {
  color: #3487f5;
  background: #f1f7ff;
  margin-top: 8rpx;
}
.conversation-end {
  height: 60rpx;
}
.assistant-tools > view {
  display: flex;
  align-items: center;
  gap: 7rpx;
}
</style>
