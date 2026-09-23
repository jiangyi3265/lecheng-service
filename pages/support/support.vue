<template>
  <view class="page support-page" :style="keyboardHeight > 0 ? { paddingBottom: keyboardHeight + 'px' } : {}">
    <view class="support-header"><AppHeader title="客服" back back-label="返回" /></view>
    <view class="support-chat">
      <InlineConsultation @keyboard-height-change="keyboardHeight = $event" />
    </view>
    <AppTabBar v-if="!keyboardHeight" active="support" />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onHide } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppTabBar from "../../components/AppTabBar.vue";
import InlineConsultation from "../../components/InlineConsultation.vue";

const keyboardHeight = ref(0);
onHide(() => { keyboardHeight.value = 0; });
</script>

<style scoped>
.support-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  padding-bottom: calc(116rpx + env(safe-area-inset-bottom));
  background: #ededed;
}
.support-header { flex-shrink: 0; }
.support-chat { position: relative; flex: 1; min-height: 0; overflow: hidden; }
</style>
