<template>
  <view class="service-poster" :class="kind">
    <NativeArt
      :name="detail && kind === 'medical' ? 'medical-detail' : kind"
      :width="width || (detail ? 750 : kind === 'conference' ? 700 : 660)"
    />
  </view>
</template>
<script>
import NativeArt from "./NativeArt.vue";
export default {
  components: { NativeArt },
  props: {
    kind: { type: String, default: "biotech" },
    title: String,
    detail: Boolean,
    width: Number,
  },
};
</script>
<style scoped>
.service-poster {
  overflow: hidden;
  border-radius: 20rpx;
  width: 100%;
  line-height: 0;
}
.service-poster.conference {
  border-radius: 20rpx;
}
</style>
