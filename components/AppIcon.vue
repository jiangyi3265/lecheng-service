<template>
  <view
    class="app-icon"
    :class="['icon-' + name, { selected: active }]"
    :style="{ width: size + 'rpx', height: size + 'rpx' }"
  >
    <view v-if="name === 'search'" class="search-ring" />
    <template v-else-if="name === 'mic'">
      <view class="mic-pill" />
      <view class="mic-cup" />
      <view class="mic-foot" />
    </template>
    <template v-else-if="name === 'home'">
      <view class="house" />
      <view class="house-front" />
    </template>
    <template v-else-if="name === 'heart'">
      <view class="heart-one" />
      <view class="heart-two" />
    </template>
    <template v-else-if="name === 'news'">
      <view class="news-box"><view class="news-dot" /><view class="news-dot second" /></view>
    </template>
    <template v-else-if="name === 'user'">
      <view class="user-head" />
      <view class="user-body" />
    </template>
    <text v-else class="symbol">{{ symbols[name] || "＋" }}</text>
  </view>
</template>
<script>
export default {
  props: { name: String, active: Boolean, size: { type: Number, default: 44 } },
  data() {
    return {
      symbols: {
        back: "‹",
        arrow: "›",
        shield: "✚",
        hospital: "✚",
        order: "▤",
        wallet: "▣",
        card: "▰",
        star: "★",
        phone: "♧",
        filter: "▽",
        close: "×",
      },
    };
  },
};
</script>
<style scoped>
.app-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
}
.search-ring {
  width: 57%;
  height: 57%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  position: absolute;
  left: 12%;
  top: 9%;
}
.search-ring:after {
  content: "";
  position: absolute;
  width: 45%;
  height: 3rpx;
  background: currentColor;
  right: -30%;
  bottom: -15%;
  transform: rotate(48deg);
  border-radius: 4rpx;
}
.mic-pill {
  position: absolute;
  width: 32%;
  height: 60%;
  border-radius: 30rpx;
  background: currentColor;
  top: 0;
  left: 34%;
}
.mic-cup {
  position: absolute;
  top: 27%;
  left: 17%;
  width: 58%;
  height: 46%;
  border: 3rpx solid currentColor;
  border-top: 0;
  border-radius: 0 0 30rpx 30rpx;
}
.mic-foot {
  position: absolute;
  bottom: 0;
  left: 35%;
  width: 30%;
  height: 3rpx;
  background: currentColor;
}
.mic-foot:before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 45%;
  height: 12rpx;
  width: 3rpx;
  background: currentColor;
}
.house {
  position: absolute;
  inset: 21% 9% 3% 22%;
  background: #73b7ff;
  clip-path: polygon(50% 0, 100% 44%, 100% 100%, 0 100%, 0 44%);
  border-radius: 2rpx;
}
.house-front {
  position: absolute;
  inset: 12% 39% 20% 4%;
  background: #a0d8ff;
  clip-path: polygon(50% 0, 100% 44%, 100% 100%, 0 100%, 0 44%);
  opacity: 0.8;
}
.selected .house-front {
  background: #1684ed;
}
.icon-home:not(.selected) .house {
  background: #c5d3df;
}
.icon-home:not(.selected) .house-front {
  background: #d7e0e7;
}
.heart-one,
.heart-two {
  position: absolute;
  width: 52%;
  height: 52%;
  background: #c9d5df;
  border-radius: 10%;
  transform: rotate(-45deg);
}
.heart-one:before, .heart-one:after,
.heart-two:before, .heart-two:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: 50%;
}
.heart-one:before, .heart-two:before { top: -50%; left: 0; }
.heart-one:after, .heart-two:after { left: 50%; top: 0; }
.heart-one { left: 35%; top: 29%; }
.heart-two { width: 37%; height: 37%; left: 10%; top: 47%; background: #adbfcd; opacity: .8; }
.selected .heart-one { background: #7bbcff; }
.selected .heart-two { background: #378ffa; }
.news-box {
  width: 75%;
  height: 57%;
  border: 6rpx solid #c8d5e1;
  border-radius: 2rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c8d5e1;
  font-size: 24rpx;
}
.news-dot { position: absolute; width: 32%; height: 70%; left: 21%; border-radius: 50%; background: currentColor; opacity: .55; }
.news-dot.second { left: 43%; opacity: .85; }
.news-box:after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -11rpx;
  border: 6rpx solid transparent;
  border-top-color: #c8d5e1;
}
.selected .news-box {
  border-color: #64acff;
  color: #64acff;
}
.user-head {
  position: absolute;
  width: 38%;
  height: 46%;
  border-radius: 50%;
  background: #cedbe3;
  top: 0;
}
.user-body {
  position: absolute;
  width: 84%;
  height: 49%;
  border-radius: 70% 70% 10% 10%;
  background: #c4d2df;
  bottom: 4%;
}
.selected .user-body,
.selected .user-head {
  background: #64acff;
}
.symbol {
  font-size: inherit;
  line-height: 1;
}
</style>
