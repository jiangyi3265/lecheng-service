<template>
  <view class="native-art" :class="'art-' + name" :style="frameStyle">
    <image
      class="native-art-image"
      :src="packed.src"
      mode="scaleToFill"
      :style="imageStyle"
    />
  </view>
</template>
<script>
import packedArt from "../data/art-manifest.json";
import hdArt from "../data/hd-art-manifest.json";
// Layout dimensions refer to the unchanged original captures.
// art-manifest selects the smallest lossless representation for each image.
const assets = {
  "header-primary": ["service-biotech", 0, 0, 414, 59],
  "header-profile": ["profile", 0, 0, 414, 59],
  "expert-wanghongyang": ["expert-list-lower", 24, 240, 70, 82],
  "drug-detail": ["detail-drug", 0, 59, 414, 294],
  "drug-vosoritide": ["catalog-drug", 18, 423, 87, 88],
  "drug-durvalumab": ["catalog-drug", 18, 589, 87, 88],
  conference: ["service-biotech", 14, 126, 386, 139],
  biotech: ["service-biotech", 25, 338, 364, 202],
  medical: ["service-medical", 25, 338, 364, 202],
  product: ["service-product", 25, 338, 364, 202],
  dining: ["service-dining", 25, 338, 364, 202],
  stay: ["service-stay", 25, 338, 364, 202],
  transport: ["service-transport", 25, 338, 364, 202],
  tourism: ["service-tourism", 25, 338, 364, 202],
  business: ["service-business", 25, 338, 364, 202],
  meeting: ["service-meeting", 25, 338, 364, 202],
  "medical-detail": ["detail-medical", 0, 59, 414, 415],
  travel: ["news", 14, 124, 386, 138],
  "news-photo": ["news", 28, 397, 358, 160],
  "policy-photo": ["news-policy", 28, 397, 358, 160],
  "hospital-banner": ["home-hospital", 25, 360, 364, 50],
  "expert-banner": ["home-expert", 25, 358, 364, 53],
  "insurance-banner": ["home-insurance", 25, 360, 364, 52],
  "hospital-photo": ["home-hospital", 24, 486, 366, 158],
  "hospital-detail": ["detail-hospital", 0, 59, 414, 242],
  "expert-wang": ["home-expert", 26, 477, 66, 81],
  "expert-avatar": ["detail-expert", 30, 91, 76, 76],
  "insurance-lecheng": ["home-insurance", 31, 483, 170, 141],
  "insurance-wuxi": ["home-insurance", 212, 483, 171, 141],
  avatar: ["profile", 13, 81, 69, 68],
  "order-all": ["profile", 39, 175, 44, 46],
  "order-pay": ["profile", 134, 175, 46, 46],
  "order-use": ["profile", 231, 175, 45, 46],
  "order-refund": ["profile", 326, 175, 46, 46],
  "collect-banner": ["profile", 13, 279, 187, 89],
  "follow-banner": ["profile", 213, 279, 188, 89],
  wallet: ["profile", 38, 392, 46, 46],
  "empty-box": ["profile-bottom", 145, 304, 135, 106],
  mascot: ["profile-bottom", 174, 654, 69, 74],
  "assistant-mascot": ["assistant", 28, 105, 93, 104],
  "assistant-customer": ["assistant", 23, 679, 18, 19],
  "assistant-phone": ["assistant", 143, 679, 19, 19],
  "assistant-bag": ["assistant", 264, 679, 18, 19],
  "nav-home-on": ["home-insurance", 29, 698, 24, 26],
  "nav-home": ["service-biotech", 29, 697, 24, 26],
  "nav-service-on": ["service-biotech", 110, 697, 25, 25],
  "nav-service": ["home-drug", 110, 697, 25, 25],
  "nav-news-on": ["news-policy", 279, 697, 25, 25],
  "nav-news": ["home-drug", 279, 697, 25, 25],
  "nav-profile-on": ["profile-bottom", 361, 697, 25, 25],
  "nav-profile": ["home-drug", 361, 697, 25, 25],
  mic: ["home-drug", 40, 294, 17, 23],
  provider: ["service-biotech", 27, 611, 25, 25],
};
export default {
  props: { name: String, width: { type: Number, default: 100 } },
  computed: {
    packed() { return hdArt["native-" + this.name] || packedArt["native-" + this.name]; },
    asset() {
      return assets[this.name] || assets.biotech;
    },
    ratio() {
      return this.width / this.asset[3];
    },
    frameStyle() {
      return {
        width: this.width + "rpx",
        height: this.asset[4] * this.ratio + "rpx",
      };
    },
    imageStyle() {
      if (hdArt["native-" + this.name]) return {width:"100%",height:"100%",left:0,top:0};
      return { width: this.packed.width * this.ratio + "rpx", height: this.packed.height * this.ratio + "rpx", left: -this.packed.x * this.ratio + "rpx", top: -this.packed.y * this.ratio + "rpx" };
    },
  },
};
</script>
<style scoped>
.native-art {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  pointer-events: none;
}
.native-art-image {
  position: absolute;
  max-width: none;
}
.art-expert-avatar {
  border-radius: 50%;
}
.art-mascot {
  clip-path: polygon(
    48% 1%,
    65% 4%,
    81% 11%,
    91% 22%,
    95% 37%,
    95% 49%,
    100% 55%,
    94% 67%,
    81% 76%,
    73% 84%,
    71% 96%,
    62% 99%,
    54% 94%,
    53% 88%,
    41% 88%,
    40% 97%,
    31% 99%,
    26% 94%,
    29% 82%,
    16% 75%,
    5% 66%,
    0 54%,
    5% 45%,
    6% 30%,
    15% 16%,
    29% 6%
  );
}
</style>
