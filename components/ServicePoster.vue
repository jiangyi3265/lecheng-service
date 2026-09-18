<template>
  <view class="service-poster" :class="[kind, { detail }]">
    <view v-if="kind === 'conference'" class="conference-art">
      <view class="light-beam" /><view class="light-beam second" />
      <text class="conference-en">Conference Center</text>
      <text class="conference-title">综合会务中心</text>
      <text class="conference-note">国际会务 · 万象共生</text>
    </view>
    <view v-else-if="kind === 'biotech'" class="biotech-art">
      <text class="biotech-en">New Biotechnology Project</text>
      <text class="biotech-title">{{ title || '自体NK细胞辅助免疫药物治疗实体瘤技术' }}</text>
      <text class="biotech-label">生 物 医 学 新 技 术</text>
    </view>
    <template v-else>
      <NativeArt :name="detail && kind === 'medical' ? 'medical-detail' : kind" :width="width || (detail ? 750 : 660)" />
      <view v-if="title && !detail" class="poster-caption">{{ title }}</view>
    </template>
  </view>
</template>
<script>
import NativeArt from './NativeArt.vue';
export default { components:{NativeArt}, props:{kind:{type:String,default:'biotech'},title:String,detail:Boolean,width:Number} };
</script>
<style scoped>
.service-poster { overflow:hidden; border-radius:20rpx; width:100%; line-height:0; position:relative; }
.conference-art { height:252rpx; position:relative; display:flex; align-items:center; justify-content:center; flex-direction:column; overflow:hidden; background:linear-gradient(145deg,#9dcdff,#4c9cf4 55%,#467cef); color:#fff; line-height:1.3; }
.conference-en { font-size:20rpx; letter-spacing:7rpx; z-index:1; }
.conference-title { font-size:60rpx; font-weight:900; font-style:italic; letter-spacing:5rpx; margin:10rpx 0; text-shadow:2rpx 4rpx #3482d0; z-index:1; }
.conference-note { font-size:24rpx; letter-spacing:6rpx; background:linear-gradient(90deg,transparent,#68dbef,transparent); padding:4rpx 30rpx; z-index:1; }
.light-beam { position:absolute; width:125%; height:55rpx; background:linear-gradient(180deg,#d1edff77,transparent); transform:rotate(-20deg); top:30rpx; left:-30rpx; }
.light-beam.second { top:190rpx; transform:rotate(-14deg); }
.biotech-art { height:366rpx; padding:30rpx 40rpx; display:flex; align-items:center; justify-content:center; flex-direction:column; line-height:1.4; background:linear-gradient(130deg,#afd4e7,#f5fdff 48%,#bce8ff); border:2rpx solid #b7d5ec; }
.biotech-en { color:#6e9eae; font-size:19rpx; letter-spacing:5rpx; }
.biotech-title { color:#326bcc; font-size:44rpx; font-weight:900; font-style:italic; line-height:1.35; margin:26rpx 0; text-align:center; }
.biotech-label { color:#327aad; background:linear-gradient(90deg,transparent,#a1d9e9,transparent); font-size:25rpx; padding:2rpx 20rpx; }
.poster-caption { position:absolute; left:0; right:0; bottom:0; min-height:55rpx; padding:10rpx 20rpx; background:linear-gradient(90deg,#4190fb,#7fb9ff); color:#fff; font-size:27rpx; font-weight:600; line-height:1.35; }
.detail .biotech-art { height:750rpx; }
</style>
