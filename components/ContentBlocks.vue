<template>
  <view class="content-blocks">
    <view v-for="(block, index) in blocks" :key="index" class="content-block">
      <template v-if="block.type === 'image' && block.url">
        <image class="content-image" :src="block.url" mode="widthFix" :aria-label="block.caption || '内容图片'" @tap="preview(block.url)" />
        <text v-if="block.caption" class="content-caption">{{ block.caption }}</text>
      </template>
      <template v-else-if="block.type === 'text'">
        <text v-if="block.title" class="content-heading">{{ block.title }}</text>
        <text v-if="block.text" class="content-text" selectable>{{ block.text }}</text>
      </template>
    </view>
  </view>
</template>
<script setup>
const props = defineProps({ blocks: { type: Array, default: () => [] } });
function preview(current) { uni.previewImage({ current, urls: props.blocks.filter(b => b.type === 'image' && b.url).map(b => b.url) }); }
</script>
<style scoped>
.content-block { margin:28rpx 0; }
.content-image { display:block; width:100%; border-radius:12rpx; }
.content-text { display:block; color:#34495e; font-size:29rpx; line-height:1.8; white-space:pre-wrap; overflow-wrap:anywhere; }
.content-heading { display:block; margin-bottom:14rpx; color:#19344b; font-size:32rpx; font-weight:650; line-height:1.6; }
.content-caption { display:block; margin-top:10rpx; color:#7d8fa0; font-size:23rpx; text-align:center; }
</style>
