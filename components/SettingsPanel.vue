<template>
  <view class="settings-content">
    <view v-if="page === '设置'" class="settings-card">
      <button class="settings-item" @tap="openService('账户与安全')"><text>账户与安全</text><AppIcon name="chevron" :size="26" /></button>
      <button class="settings-item" @tap="openService('隐私协议')"><text>隐私协议</text></button>
      <button class="settings-item" :disabled="clearing" @tap="clearCache"><text>清除缓存</text></button>
      <button class="settings-item" :disabled="loggingOut" @tap="logout"><text>退出登录</text></button>
    </view>
    <template v-else-if="page === '账户与安全'">
      <view class="settings-card">
        <view class="settings-item"><text>登录状态</text><text class="settings-value">{{ session ? '已登录' : '未登录' }}</text></view>
        <view v-if="session" class="settings-item"><text>手机号码</text><text class="settings-value">{{ maskAccountPhone(session.user?.phone) }}</text></view>
        <button v-else class="settings-item" @tap="navigate('/pages/login/login')"><text>微信 / 手机号登录</text><AppIcon name="chevron" :size="26" /></button>
      </view>
      <text class="settings-note">{{ session ? '登录状态会自动续期。退出登录后，下次使用账号需重新登录。' : '登录后可查看账号状态与绑定手机号。' }}</text>
    </template>
    <text v-if="status" class="settings-status" role="status">{{ status }}</text>
  </view>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppIcon from './AppIcon.vue';
import { auth } from '../utils/auth';
import { openService, navigate } from '../utils/navigation';
import { clearDisplayCache, maskAccountPhone } from '../utils/settings';
defineProps({ page: { type: String, default: '设置' } });
const session = ref(auth.session()), status = ref(''), clearing = ref(false), loggingOut = ref(false);
function refresh() { session.value = auth.session(); }
onShow(refresh);
onMounted(() => uni.$on('lecheng:auth', refresh));
onUnmounted(() => uni.$off('lecheng:auth', refresh));
function clearCache() {
  if (clearing.value) return;
  clearing.value = true;
  try {
    const count = clearDisplayCache();
    status.value = count ? '缓存已清除' : '暂无可清理缓存';
    uni.showToast({ title: status.value, icon: 'none' });
  } catch { status.value = '缓存清理失败，请重试'; }
  finally { clearing.value = false; }
}
function logout() {
  if (loggingOut.value) return;
  if (!auth.session()) { status.value = '当前未登录'; uni.showToast({ title: status.value, icon: 'none' }); return; }
  uni.showModal({ title: '退出登录', content: '确定退出当前账号吗？', success: async (result) => {
    if (!result.confirm) return;
    loggingOut.value = true;
    try { await auth.logout(); status.value = '已退出登录'; }
    catch { status.value = '本机已退出，服务端退出未确认'; }
    finally { loggingOut.value = false; refresh(); }
    uni.showToast({ title: status.value, icon: 'none' });
  } });
}
</script>
<style scoped>
.settings-content { padding: 24rpx; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.settings-card { background: #fff; border-radius: 22rpx; padding: 0 26rpx; overflow: hidden; }
.settings-item { display: flex; align-items: center; justify-content: space-between; gap: 24rpx; width: 100%; min-height: 84rpx; padding: 22rpx 0; text-align: left; color: #202429; border-bottom: 1rpx solid #e8e8e8; font-size: 28rpx; line-height: 1.4; }
.settings-item:last-child { border-bottom: 0; }
.settings-value { color: #a6a8aa; font-size: 26rpx; }
.settings-note { display: block; font-size: 24rpx; line-height: 1.7; color: #86919e; padding: 24rpx 12rpx; }
.settings-status { display: block; font-size: 24rpx; line-height: 1.7; color: #667991; padding: 24rpx 12rpx; }
</style>
