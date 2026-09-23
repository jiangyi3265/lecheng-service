<template>
  <view class="page login-page">
    <AppHeader title="登录" back fallback="/pages/mine/mine" />
    <view class="login-content">
      <view class="login-symbol"><AppIcon name="building" color="blue" :size="90" /></view>
      <text class="login-title">欢迎使用乐城服务</text>
      <text class="login-subtitle">登录后，继续您的健康之旅</text>
      <button class="login-button wechat-login" :disabled="busy" :loading="busy" @tap="loginWechat">微信一键登录</button>
      <!-- #ifdef MP-WEIXIN -->
      <button v-if="agreed && auth.configured()" class="login-button phone-login" open-type="getPhoneNumber" :disabled="busy" @getphonenumber="loginPhone">手机号快捷登录</button>
      <button v-else class="login-button phone-login" :disabled="busy" @tap="preparePhone">手机号快捷登录</button>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <button class="login-button phone-login" @tap="previewHint">手机号快捷登录</button>
      <!-- #endif -->
      <view class="login-consent">
        <checkbox-group @change="agreed = $event.detail.value.includes('agree')"><label class="consent-check"><checkbox value="agree" :checked="agreed" color="#0785ff" /><text>我已阅读并同意</text></label></checkbox-group>
        <button class="privacy-link" @tap="openService('隐私说明')">隐私说明</button>
      </view>
      <text v-if="error" class="login-error" role="alert">{{ error }}</text>
      <button class="browse-button" @tap="goBack('/pages/mine/mine')">暂不登录，先看看</button>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import AppIcon from '../../components/AppIcon.vue';
import { auth, wechatCode } from '../../utils/auth';
import { openService, goBack } from '../../utils/navigation';
const agreed = ref(false), busy = ref(false), error = ref('');
onShow(() => { if (auth.session()?.expiresAt > Date.now()) goBack('/pages/mine/mine'); });
function ready() {
  error.value = '';
  if (!agreed.value) { error.value = '请先阅读并同意隐私说明'; return false; }
  if (!auth.configured()) { error.value = '登录服务暂未开通，请稍后再试'; return false; }
  return !busy.value;
}
function previewHint() { error.value = '请在微信小程序中使用快捷登录'; }
function preparePhone() { ready(); }
async function perform(method, phoneCode) {
  if (!ready()) return;
  busy.value = true;
  try { await auth.login(method, { code: await wechatCode(), ...(phoneCode ? { phoneCode } : {}) }); goBack('/pages/mine/mine'); }
  catch (e) { error.value = e.message; }
  finally { busy.value = false; }
}
function loginWechat() {
  // #ifdef MP-WEIXIN
  perform('wechat');
  // #endif
  // #ifndef MP-WEIXIN
  previewHint();
  // #endif
}
function loginPhone(event) {
  if (!event.detail?.code) { error.value = '未授权手机号，可选择微信登录或稍后重试'; return; }
  perform('phone', event.detail.code);
}
</script>
<style scoped>
.login-page { font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif; }
.login-content { padding: 84rpx 54rpx 40rpx; }
.login-symbol { display: flex; align-items: center; justify-content: center; width: 144rpx; height: 144rpx; margin: 0 auto 36rpx; background: #edf6ff; border-radius: 36rpx; }
.login-title { display: block; text-align: center; font-size: 40rpx; font-weight: 650; }
.login-subtitle { display: block; text-align: center; color: #8292a8; font-size: 26rpx; margin: 18rpx 0 76rpx; }
.login-button { width: 100%; min-height: 92rpx; line-height: 92rpx; border-radius: 48rpx; font-size: 29rpx; margin-bottom: 24rpx; }
.wechat-login { background: #07b566; color: #fff; }
.phone-login { background: #edf6ff; color: #0785ff; }
.login-consent { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; font-size: 23rpx; color: #7b899a; margin-top: 36rpx; }
.consent-check { display: flex; align-items: center; }
.consent-check checkbox { transform: scale(.75); }
.privacy-link { color: #0785ff; font-size: 23rpx; padding: 12rpx 4rpx; }
.login-error { display: block; color: #be534e; font-size: 24rpx; text-align: center; margin-top: 24rpx; line-height: 1.6; }
.browse-button { margin: 38rpx auto 0; color: #8292a8; font-size: 25rpx; padding: 16rpx; }
</style>
