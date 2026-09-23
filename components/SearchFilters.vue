<template>
  <view class="search-filters">
    <view class="filters" aria-label="查询筛选">
      <button class="filter-trigger department-filter" hover-class="none" :class="{ selected: department, expanded: open === 'department' }" :aria-expanded="open === 'department'" aria-controls="department-panel" @tap="toggle('department')">
        <text>按科室</text><view class="filter-arrow" />
      </button>
      <button class="filter-trigger disease-filter" hover-class="none" :class="{ selected: disease, expanded: open === 'disease' }" :aria-expanded="open === 'disease'" aria-controls="disease-panel" @tap="toggle('disease')">
        <text>按疾病</text><view class="filter-arrow" />
      </button>
    </view>
    <view v-if="open" class="filter-panel" :style="{ height: panelHeight + 'px' }" @touchmove.stop>
      <view v-if="open === 'department'" id="department-panel" class="department-panel">
        <scroll-view scroll-y class="department-options" role="listbox" aria-label="按科室选择">
          <button v-for="name in ['', ...departmentOptions]" :key="name || 'all'" class="department-option" hover-class="none" :class="{ chosen: department === name }" role="option" :aria-selected="department === name" @tap="select('department', name)">{{ name || '全部' }}</button>
        </scroll-view>
        <view class="department-space" aria-hidden="true" />
      </view>
      <scroll-view v-else id="disease-panel" scroll-y class="disease-options" role="listbox" aria-label="按疾病选择">
        <view class="disease-list">
          <button v-for="name in ['', ...diseaseOptions.map(item => item.name)]" :key="name || 'all'" class="disease-option" hover-class="none" :class="{ chosen: disease === name }" role="option" :aria-selected="disease === name" @tap="select('disease', name)">{{ name || '全部' }}</button>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script setup>
import { getCurrentInstance, nextTick, ref } from 'vue';
import { departmentOptions, diseaseOptions } from '../data/search-filters';

const props = defineProps({ department: String, disease: String, open: String });
const emit = defineEmits(['update:department', 'update:disease', 'update:open']);
const instance = getCurrentInstance();
const panelHeight = ref(340);
async function toggle(type) {
  if (props.open === type) return emit('update:open', '');
  uni.hideKeyboard();
  await nextTick();
  uni.createSelectorQuery().in(instance.proxy).select('.filters').boundingClientRect(rect => {
    const info = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
    panelHeight.value = Math.min((rect?.width || info.windowWidth) * 660 / 750, Math.max(100, info.windowHeight - (rect?.bottom || 200) - 16));
    emit('update:open', type);
  }).exec();
}
function select(type, value) {
  emit('update:' + type, value);
  emit('update:open', '');
}
</script>
<style scoped>
.search-filters { position: relative; }
.filters { display: flex; align-items: center; padding: 0 36rpx; background: #fff; }
.filter-trigger { flex: 1; min-width: 0; min-height: 98rpx; display: flex; align-items: center; justify-content: center; gap: 12rpx; font-size: 28rpx; color: #273744; }
.filter-trigger.expanded { font-weight: 650; }
.filter-arrow { width: 0; height: 0; border-left: 6rpx solid transparent; border-right: 6rpx solid transparent; border-top: 8rpx solid currentColor; }
.filter-trigger.selected .filter-arrow, .filter-trigger.expanded .filter-arrow { color: #109bd0; }
.filter-trigger.expanded .filter-arrow { transform: rotate(180deg); }
.filter-panel { position: absolute; top: 100%; left: 0; right: 0; overflow: hidden; background: #fff; border-radius: 0 0 36rpx 36rpx; }
.department-panel { display: flex; height: 100%; }
.department-options { width: 38.3%; height: 100%; background: #f6f7fa; flex-shrink: 0; }
.department-option { width: 100%; min-height: 80rpx; display: flex; align-items: center; padding: 18rpx 24rpx 18rpx 48rpx; text-align: left; border-bottom: 1rpx solid #e7e9ee; font-size: 28rpx; line-height: 1.5; color: #30343a; }
.department-option.chosen { color: #0785ff; background: #edf6ff; }
.department-space { flex: 1; background: #fff; }
.disease-options { height: 100%; }
.disease-list { display: flex; flex-direction: column; gap: 20rpx; padding: 20rpx 24rpx; }
.disease-option { width: 100%; min-height: 80rpx; padding: 20rpx 44rpx; border-radius: 16rpx; background: #f5f5f9; text-align: left; font-size: 28rpx; line-height: 1.5; color: #30343a; }
.disease-option.chosen { color: #0785ff; background: #edf6ff; }
</style>
