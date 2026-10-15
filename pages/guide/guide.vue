<template>
  <view class="page guide-page">
    <AppHeader title="园区导航" back fallback="/pages/mine/mine" />
    <!-- #ifdef MP-WEIXIN -->
    <map class="park-map" :latitude="destination.latitude" :longitude="destination.longitude" :scale="14" :markers="markers" enable-zoom enable-scroll show-compass @error="mapError = true" />
    <text v-if="mapError" class="map-error">地图加载失败，请检查网络或点击下方按钮打开地图。</text>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <iframe class="park-map web-map" title="博鳌乐城园区地图" :src="osmEmbedUrl" />
    <!-- #endif -->
    <view class="map-content">
      <text class="map-title">{{ destination.title }}</text>
      <text v-if="destination.address" class="map-address">{{ destination.address }}</text>
      <text v-if="destination.note" class="map-note">{{ destination.note }}</text>
      <!-- #ifdef MP-WEIXIN -->
      <button class="primary-button map-navigation" @tap="openNativeMap">打开地图导航</button>
      <text class="map-note">在导航页选择手机支持的地图应用</text>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="map-links"><a class="map-provider amap" :href="amapUrl" target="_blank" rel="noopener noreferrer">高德地图</a><a class="map-provider tencent" :href="tencentUrl" target="_blank" rel="noopener noreferrer">腾讯地图</a></view>
      <!-- #endif -->
      <button class="copy-address" @tap="copyAddress">{{ destination.address ? '复制园区名称和地址' : '复制园区名称' }}</button>
    </view>
  </view>
</template>
<script setup>
import { ref, computed } from 'vue';
import AppHeader from '../../components/AppHeader.vue';
// 园区名称、地址、说明、标记文字和坐标由后台“园区导航”维护；未发布或接口不可用时用 data/park-map.js 的内置内容
import { destination, amapUrl, tencentUrl, osmEmbedUrl, placeName } from '../../data/park-map';
const mapError = ref(false);
const markers = computed(() => [{ id: 1, latitude: destination.latitude, longitude: destination.longitude, iconPath: '/static/icons/pin-blue.png', width: 32, height: 32, callout: { content: placeName(destination), display: 'ALWAYS', padding: 8, borderRadius: 8, color: '#183451', bgColor: '#ffffff' } }]);
function openNativeMap() {
  uni.openLocation({ latitude: destination.latitude, longitude: destination.longitude, name: placeName(destination), address: destination.address, scale: 15, fail: (error) => { if (!/cancel/.test(error.errMsg || '')) uni.showToast({ title: '地图暂时无法打开，请稍后重试', icon: 'none' }); } });
}
function copyAddress() { uni.setClipboardData({ data: [destination.title, destination.address].filter(Boolean).join('，') }); }
</script>
<style scoped>
.guide-page { font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif; }
.park-map { display: block; width: 100%; height: 68vh; min-height: 700rpx; }
.web-map { border: 0; }
.map-content { padding: 32rpx 32rpx 0; }
.map-title { display: block; font-size: 32rpx; font-weight: 650; line-height: 1.6; }
.map-address { display: block; font-size: 26rpx; color: #738499; margin-top: 10rpx; }
.map-note,.map-error { display: block; font-size: 23rpx; color: #8292a8; line-height: 1.7; margin-top: 18rpx; }
.map-navigation { margin-top: 28rpx; }
.map-links { display: flex; gap: 20rpx; margin-top: 28rpx; }
.map-provider { flex: 1; text-align: center; font-size: 28rpx; padding: 20rpx 10rpx; border-radius: 44rpx; text-decoration: none; color: #fff; }
.amap { background: #0785ff; }.tencent { background: #12a674; }
.copy-address { display: block; margin: 24rpx auto 0; padding: 16rpx; font-size: 25rpx; color: #0785ff; }
</style>
