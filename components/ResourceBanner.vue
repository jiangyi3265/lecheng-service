<template>
 <view class="resource-promo"><view class="promo-mark">✚</view><text class="promo-title">{{ titles[index] }}</text><view class="promo-count"><text>{{ counts[index] }}</text> {{ units[index] }}</view><view class="promo-kit"><view class="handle" /><text>✚</text></view></view>
</template>
<script>
export default {props:{index:{type:Number,default:0}},data(){return {titles:['特许药械','医疗机构','医疗专家','商业保险'],counts:['593','43','414','21'],units:['种','家','位','款']}}};
</script>
<style scoped>
.resource-promo {height:91rpx;display:flex;align-items:center;gap:14rpx;padding:0 26rpx;background:linear-gradient(115deg,#91c6ff,#3887f8);color:#fff;position:relative;overflow:hidden;}
.promo-mark {font-size:34rpx;color:#e7f5ff;}
.promo-title {font-size:32rpx;font-weight:900;font-style:italic;white-space:nowrap;text-shadow:1rpx 2rpx #4c94e8;}
.promo-count {display:flex;align-items:baseline;justify-content:center;gap:8rpx;width:160rpx;padding:3rpx 9rpx;border:2rpx solid #fff;border-radius:10rpx;background:#e5f1ff;color:#333;font-size:25rpx;}
.promo-count text {font-size:38rpx;color:#3a89fa;font-weight:800;}
.promo-kit {margin-left:auto;width:80rpx;height:66rpx;border:5rpx solid #d4f3ff;border-radius:10rpx;background:linear-gradient(120deg,#98e1ff,#338bee);box-shadow:5rpx 5rpx 0 #a3d5ff;transform:rotate(5deg);text-align:center;position:relative;}
.promo-kit text {font-size:45rpx;color:#ffd19f;line-height:53rpx;}
.handle {position:absolute;left:20rpx;top:-14rpx;width:32rpx;height:14rpx;border:5rpx solid #d4f3ff;border-bottom:0;border-radius:6rpx 6rpx 0 0;}
</style>
