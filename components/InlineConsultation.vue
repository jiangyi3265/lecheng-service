<template>
  <view class="inline-consultation">
    <scroll-view class="consultation-history" scroll-y :scroll-into-view="scrollTarget" @tap="dismissKeyboard">
      <view class="history-content">
        <text class="consultation-caption">乐城服务为您服务</text>
        <text class="consultation-note">{{ apiBaseUrl ? '客服留言 · 消息同步至乐城后台' : '演示咨询 · 消息仅保存在本机' }}</text>
        <view class="consultation-row">
          <view class="consultation-avatar"><AppIcon name="robot" color="blue" :size="48" /></view>
          <view class="consultation-bubble">
            <text selectable>您好：我是人工客服，我可以为您提供博鳌乐城：项目介绍、预约评估、陪诊服务咨询、预约流程相关信息。</text>
            <text class="consultation-hours" selectable>人工在线时间：早8：00-晚22：00</text>
          </view>
        </view>
        <view v-for="(message, index) in messages" :id="'consultation-message-' + index" :key="message.id"
          class="consultation-row" :class="{ own: message.role === 'user' }">
          <view v-if="message.role !== 'user'" class="consultation-avatar"><AppIcon name="robot" color="blue" :size="48" /></view>
          <text class="consultation-bubble" :class="{ 'user-bubble': message.role === 'user' }" selectable>{{ message.text }}</text>
          <image v-if="message.role === 'user'" class="consultation-avatar" src="/static/images/avatar.png" mode="aspectFill" aria-label="我的头像" />
        </view>
        <view id="consultation-end" class="consultation-end" />
      </view>
    </scroll-view>
    <view class="consultation-composer">
      <input v-model="draft" class="consultation-input" placeholder="请输入您想咨询的问题"
        aria-label="咨询内容" confirm-type="send" :maxlength="500" :adjust-position="false"
        :focus="inputFocused" :hold-keyboard="false" @focus="inputFocused = true" @blur="inputFocused = false"
        @keyboardheightchange="onKeyboardChange" @confirm="send" />
      <button class="consultation-send" role="button" aria-label="发送消息" :disabled="!draft.trim() || sending" @tap="send">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AppIcon from "./AppIcon.vue";
import { chatMessages, sendDemoMessage, markChatRead } from "../utils/demo-store";
import { apiBaseUrl, getMessages, sendMessage } from "../utils/lecheng-api";

defineOptions({ options: { virtualHost: true } });
const emit = defineEmits(["keyboard-height-change"]);
const name = "乐城服务助手";
const draftKey = "lecheng-draft-" + name;
const draft = ref(uni.getStorageSync(draftKey) || "");
const inputFocused = ref(false);
const messages = ref(chatMessages(name));
const sending = ref(false);
const scrollTarget = ref("");
let poller;
watch(draft, (value) => uni.setStorageSync(draftKey, value));
async function scrollToLatest() {
  scrollTarget.value = "";
  await nextTick();
  scrollTarget.value = "consultation-end";
}
async function refresh() {
  if (apiBaseUrl) {
    try { messages.value = await getMessages(); scrollToLatest(); }
    catch (error) { console.warn("客服消息同步失败", error); }
  } else {
    messages.value = chatMessages(name);
    markChatRead(name);
    scrollToLatest();
  }
}
onMounted(() => { refresh(); if (apiBaseUrl) poller = setInterval(refresh, 8000); });
onUnmounted(() => clearInterval(poller));
onShow(refresh);
function onKeyboardChange(event) {
  emit("keyboard-height-change", Math.max(0, Number(event.detail.height) || 0));
  scrollToLatest();
}
function dismissKeyboard() {
  inputFocused.value = false;
  uni.hideKeyboard();
  emit("keyboard-height-change", 0);
}
async function send() {
  const value = draft.value.trim();
  if (!value || sending.value) return;
  sending.value = true;
  try {
    if (apiBaseUrl) { await sendMessage(value); await refresh(); }
    else messages.value = sendDemoMessage(name, value);
    draft.value = "";
    scrollToLatest();
  } catch (error) { uni.showToast({ title: error.message || "发送失败", icon: "none" }); }
  finally { sending.value = false; }
}
</script>

<style scoped>
.inline-consultation { position: absolute; inset: 0; display: flex; min-height: 0; flex-direction: column; background: #ededed; }
.consultation-history { flex: 1; height: 0; min-height: 0; }
.history-content { padding: 28rpx 24rpx 16rpx; }
.consultation-caption { display: block; text-align: center; color: #889199; font-size: 25rpx; margin: 12rpx 0; }
.consultation-note { display: block; text-align: center; color: #737d87; font-size: 21rpx; margin-bottom: 38rpx; }
.consultation-row { display: flex; align-items: flex-start; gap: 20rpx; margin-bottom: 28rpx; }
.consultation-avatar { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; border-radius: 10rpx; flex-shrink: 0; background: #e1effc; }
.consultation-bubble { position: relative; display: block; min-width: 0; max-width: calc(100% - 100rpx); padding: 18rpx 22rpx; border-radius: 9rpx; background: #fff; color: #22303d; font-size: 29rpx; line-height: 1.65; word-break: break-word; white-space: pre-wrap; }
.consultation-bubble::before { content: ""; position: absolute; top: 25rpx; left: -12rpx; width: 0; height: 0; border-top: 12rpx solid transparent; border-bottom: 12rpx solid transparent; border-right: 14rpx solid #fff; }
.consultation-hours { display: block; margin-top: 18rpx; }
.own { justify-content: flex-end; }
.user-bubble { background: #a9ed78; }
.user-bubble::before { left: auto; right: -12rpx; border-right: 0; border-left: 14rpx solid #a9ed78; }
.consultation-end { height: 4rpx; }
.consultation-composer { display: flex; align-items: center; flex-shrink: 0; gap: 18rpx; padding: 18rpx 24rpx; border-top: 1rpx solid #dfe3e7; background: #f7f8fa; }
.consultation-input { flex: 1; min-width: 0; height: 78rpx; padding: 0 20rpx; border-radius: 10rpx; background: #fff; font-size: 27rpx; }
.consultation-send { flex-shrink: 0; min-width: 100rpx; padding: 17rpx 18rpx; background: #0785ff; border-radius: 10rpx; color: #fff; font-size: 26rpx; }
.consultation-send[disabled] { background: #d6e8f7; color: #647d93; opacity: 1; }
</style>
