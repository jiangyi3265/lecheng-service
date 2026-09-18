<template>
  <view class="search-field" :class="{ small }">
    <view class="mic" @tap="voice">
      <AppIcon name="mic" :size="small ? 30 : 39" />
    </view>
    <input
      :aria-label="placeholder"
      :value="modelValue"
      :placeholder="placeholder"
      confirm-type="search"
      :focus="focus"
      @input="$emit('update:modelValue', $event.detail.value)"
      @confirm="$emit('search')"
    />
    <view class="search-action" @tap="$emit('search')">
      <AppIcon name="search" :size="small ? 25 : 31" />
      <text>搜索</text>
    </view>
  </view>
</template>
<script>
import AppIcon from "./AppIcon.vue";
export default {
  components: { AppIcon },
  props: {
    modelValue: String,
    placeholder: { type: String, default: "请输入关键字" },
    small: Boolean,
    focus: Boolean,
  },
  emits: ["update:modelValue", "search"],
  methods: {
    voice() {
      uni.showToast({ title: "请使用键盘输入搜索内容", icon: "none" });
    },
  },
};
</script>
<style scoped>
.search-field {
  height: 80rpx;
  border: 2rpx solid #4b95ff;
  border-radius: 21rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
}
.mic {
  color: #b0b9c5;
  margin-left: 22rpx;
  margin-right: 10rpx;
  display: flex;
}
.search-field input {
  min-width: 0;
  flex: 1;
  font-size: 29rpx;
  height: 100%;
  color: #353b42;
}
.search-field input::placeholder {
  color: #a7a7a7;
}
.search-action {
  height: 100%;
  width: 149rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  background: linear-gradient(#3a84f6, #80baff);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  position: relative;
  padding-left: 12rpx;
  box-sizing: border-box;
  clip-path: polygon(16% 0, 100% 0, 100% 100%, 0 100%, 6% 83%);
}
.search-field.small {
  height: 72rpx;
  border-radius: 44rpx;
  border-color: #b9ddff;
}
.small .mic {
  margin-left: 23rpx;
}
.small input {
  font-size: 25rpx;
}
.small .search-action {
  width: 148rpx;
  font-size: 24rpx;
  font-weight: 400;
  gap: 5rpx;
  clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%);
  background: linear-gradient(135deg, #3a86f4, #83c0ff);
}
</style>
