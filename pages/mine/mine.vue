<template>
  <view class="page mine-page">
    <view class="profile-header">
      <AppHeader title="乐城服务" tint brand />
      <view class="profile-row">
        <button class="profile" aria-label="编辑个人资料" @tap="editProfile">
          <view class="user-avatar"><AppIcon name="user-fill" color="white" :size="88" /></view>
          <view class="profile-copy"><text class="user-name">{{ session ? profile.name : '点击登录' }}</text><text class="phone-number">{{ session ? maskedPhone : '微信一键登录 / 手机号快捷登录' }}</text></view>
        </button>
        <button class="profile-chat" aria-label="在线客服" @tap="openConsultation"><AppIcon name="chat" color="white" :size="36" /></button>
      </view>
    </view>
    <view class="mine-content">
      <view class="feature-cards">
        <button class="feature-card support-card" @tap="openConsultation">
          <view class="feature-copy"><text class="feature-title">在线客服</text><text class="feature-subtitle">咨询服务，贴心解答</text></view>
          <image class="feature-icon" src="/static/icons/mine-support.png" mode="aspectFit" />
        </button>
        <button class="feature-card collection-card" @tap="openService('我的收藏')">
          <view class="feature-copy"><text class="feature-title">我的收藏</text><text class="feature-subtitle">精选沉淀，心选收藏</text></view>
          <image class="feature-icon" src="/static/icons/mine-collection.png" mode="aspectFit" />
        </button>
      </view>
      <view class="shortcut-grid">
        <button v-for="item in shortcuts" :key="item.title" class="shortcut" @tap="openShortcut(item.title)">
          <image class="shortcut-icon" :src="'/static/icons/mine-' + item.icon + '.png'" mode="aspectFit" /><text>{{ item.title }}</text>
        </button>
      </view>
      <view class="contact-panel">
        <view class="contact-hours-row">
          <AppIcon name="clock" :size="38" />
          <text class="business-hours">营业时间：{{ serviceContact.hours || '待更新' }}</text>
        </view>
        <view class="contact-address-row">
          <AppIcon name="pin" :size="42" />
          <text class="address-text">{{ serviceContact.address }}</text>
          <button class="phone-button" :disabled="!serviceContact.phone" :aria-label="serviceContact.phone ? '拨打客服电话' : '客服电话待更新'" @tap="callService">
            <image class="contact-phone-icon" src="/static/icons/mine-phone.png" mode="aspectFit" /><text v-if="!serviceContact.phone" class="phone-hint">待更新</text>
          </button>
        </view>
      </view>
    </view>
    <AppTabBar active="mine" />
  </view>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import AppTabBar from '../../components/AppTabBar.vue';
import AppIcon from '../../components/AppIcon.vue';
import { readProfile } from '../../utils/storage';
import { navigate, openService, openGuide } from '../../utils/navigation';
import { serviceContact } from '../../data/service-contact';
import { auth } from '../../utils/auth';
const session = ref(auth.session());
const profile = ref(readProfile());
const maskedPhone = computed(() => profile.value.phone ? profile.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '点击完善个人资料');
const shortcuts = [{ title: '福利活动', icon: 'benefits' }, { title: '园区导航', icon: 'guide' }, { title: '服务流程', icon: 'process' }, { title: '设置', icon: 'settings' }];
function refreshProfile() { session.value = auth.session(); profile.value = session.value ? { ...readProfile(), ...session.value.user } : readProfile(); }
onShow(refreshProfile);
onMounted(() => uni.$on('lecheng:auth', refreshProfile));
onUnmounted(() => uni.$off('lecheng:auth', refreshProfile));
function editProfile() { navigate(session.value ? '/pages/profile/profile' : '/pages/login/login'); }
function openConsultation() { navigate('/pages/support/support'); }
function openShortcut(title) { title === '园区导航' ? openGuide() : openService(title); }
function callService() { if (serviceContact.phone) uni.makePhoneCall({ phoneNumber: serviceContact.phone }); }
</script>
<style scoped>
.mine-page { background: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.profile-header { background: linear-gradient(155deg, #3586ef 0%, #499bfa 60%, #a8cefa 100%); padding-bottom: 66rpx; }
.profile-row { display: flex; align-items: center; gap: 18rpx; padding: 50rpx 30rpx 36rpx; }
.profile { display: flex; align-items: center; gap: 24rpx; flex: 1; min-width: 0; text-align: left; color: #fff; }
.user-avatar { display: flex; align-items: flex-end; justify-content: center; width: 116rpx; height: 116rpx; flex-shrink: 0; border: 2rpx solid #e7f7ff; border-radius: 50%; overflow: hidden; background: #ffffff16; box-shadow: 0 0 0 7rpx #ffffff14; }
.profile-copy { display: flex; flex-direction: column; gap: 10rpx; min-width: 0; }
.user-name { font-size: 37rpx; font-weight: 650; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.phone-number { font-size: 26rpx; color: #f2f8ff; line-height: 1.5; }
.profile-chat { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; flex-shrink: 0; }
.mine-content { position: relative; margin-top: -40rpx; padding: 0 24rpx 40rpx; }
.feature-cards { display: flex; gap: 22rpx; }
.feature-card { position: relative; display: flex; align-items: center; flex: 1; min-width: 0; height: 166rpx; padding: 20rpx 18rpx; text-align: left; border-radius: 20rpx; overflow: hidden; color: #fff; }
.support-card { background: linear-gradient(110deg, #f592a1, #fa647b); }
.collection-card { background: linear-gradient(110deg, #80b5f9, #438ff2); }
.feature-copy { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12rpx; align-self: center; }
.feature-title { font-size: 28rpx; font-weight: 700; }
.feature-subtitle { font-size: 18rpx; line-height: 1.5; white-space: nowrap; }
.feature-icon { position: absolute; right: 8rpx; top: 33rpx; width: 92rpx; height: 92rpx; }
.shortcut-grid { display: flex; background: #fff; border-radius: 22rpx; margin-top: 24rpx; padding: 30rpx 8rpx; }
.shortcut { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: center; gap: 18rpx; font-size: 27rpx; line-height: 1.5; color: #272d35; white-space: nowrap; }
.shortcut-icon { width: 88rpx; height: 88rpx; }
.contact-panel { margin-top: 26rpx; background: #fff; border-radius: 20rpx; padding: 36rpx 26rpx; }
.contact-hours-row, .contact-address-row { display: flex; align-items: center; gap: 20rpx; }
.contact-hours-row { padding-bottom: 28rpx; border-bottom: 1rpx solid #f0f2f5; }
.contact-address-row { padding-top: 28rpx; }
.business-hours { display: block; color: #303944; font-size: 30rpx; line-height: 1.7; }
.address-text { display: block; flex: 1; min-width: 0; font-size: 30rpx; line-height: 1.7; color: #555f6e; }
.phone-button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6rpx; width: 104rpx; min-height: 104rpx; flex-shrink: 0; border-left: 1rpx solid #f0f2f5; }
.contact-panel .phone-button[disabled] { opacity: 1; background: transparent; }
.contact-phone-icon { width: 60rpx; height: 60rpx; }
.phone-hint { font-size: 21rpx; color: #819096; }
</style>
