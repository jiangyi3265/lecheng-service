<template>
  <view class="reference-art" :class="name" :style="box">
    <image
      :src="packed.src"
      class="reference-source"
      :style="source"
      mode="scaleToFill"
    />
  </view>
</template>
<script>
import packedArt from "../data/art-manifest.json";
const regions = {
  hero: [75, 9, 826, 348],
  banner: [124, 734, 728, 100],
  medicine: [126, 1053, 176, 184],
  mascot: [421, 1317, 135, 144],
};
export default {
  props: { name: String, width: { type: Number, default: 100 } },
  computed: {
    packed() { return packedArt["reference-" + this.name]; },
    region() {
      return regions[this.name] || regions.medicine;
    },
    scale() {
      return this.width / this.region[2];
    },
    box() {
      return {
        width: this.width + "rpx",
        height: this.region[3] * this.scale + "rpx",
      };
    },
    source() {
      return { width: this.packed.width * this.scale + "rpx", height: this.packed.height * this.scale + "rpx", left: -this.packed.x * this.scale + "rpx", top: -this.packed.y * this.scale + "rpx" };
    },
  },
};
</script>
<style scoped>
.reference-art {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  pointer-events: none;
}
.reference-source {
  position: absolute;
  max-width: none;
}
.mascot {
  clip-path: polygon(
    49% 2%,
    63% 3%,
    77% 9%,
    87% 17%,
    93% 27%,
    96% 40%,
    96% 48%,
    100% 53%,
    97% 64%,
    89% 70%,
    82% 78%,
    73% 84%,
    72% 95%,
    65% 99%,
    56% 98%,
    53% 88%,
    40% 88%,
    39% 98%,
    30% 99%,
    27% 94%,
    29% 83%,
    16% 75%,
    8% 69%,
    1% 60%,
    0 52%,
    5% 47%,
    6% 40%,
    8% 27%,
    14% 17%,
    24% 9%,
    36% 3%
  );
}
</style>
