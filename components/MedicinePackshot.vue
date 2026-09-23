<template>
	<view class="packshot" :class="{ 'is-compact': compact }" role="img" :aria-label="label + '示意包装图'">
		<view class="pack-box">
			<text class="pack-brand">MEDICAL SAMPLE</text>
			<view class="pack-band"><text>示例药械</text></view>
			<text class="pack-mark">{{ label }}</text>
			<text class="pack-foot">仅用于界面演示</text>
		</view>
		<view class="bottle">
			<view class="bottle-cap" />
			<view class="bottle-neck" />
			<view class="bottle-body"><view class="bottle-label"><text>示例</text></view></view>
		</view>
	</view>
</template>

<script setup>
defineProps({ label: { type: String, default: "药械资料" }, compact: Boolean });
</script>

<style scoped>
.packshot { position: relative; width: 100%; height: 100%; overflow: hidden; background: radial-gradient(circle at 25% 8%, #ffffff, #edf5fb 66%, #dceaf5); }
.packshot::after { position: absolute; content: ""; left: 8%; right: 6%; bottom: 7%; height: 8%; border-radius: 50%; background: rgba(50, 84, 112, .12); filter: blur(8rpx); }
.pack-box { position: absolute; z-index: 1; left: 33%; top: 12%; width: 57%; height: 76%; padding: 5% 4%; overflow: hidden; border-radius: 7rpx; background: linear-gradient(90deg, #dce9ef, #fff 13%, #fff 87%, #dae8ee); box-shadow: 10rpx 14rpx 22rpx rgba(50, 82, 108, .16); transform: perspective(580px) rotateY(-8deg); }
.pack-brand { display: block; color: #5f8395; font-size: 18rpx; letter-spacing: 1rpx; white-space: nowrap; }
.pack-band { display: flex; align-items: center; height: 27%; margin: 15% -8% 8%; padding-left: 18%; background: linear-gradient(100deg, #157e9a, #31c2bb); color: white; font-size: 26rpx; font-weight: 700; }
.pack-mark { display: block; overflow: hidden; padding-left: 12%; color: #365767; font-size: 22rpx; font-weight: 600; line-height: 1.3; white-space: nowrap; text-overflow: ellipsis; }
.pack-foot { position: absolute; left: 7%; bottom: 8%; color: #9caeb8; font-size: 17rpx; white-space: nowrap; }
.bottle { position: absolute; z-index: 2; left: 12%; bottom: 13%; width: 27%; height: 56%; }
.bottle-cap { position: absolute; z-index: 3; top: 0; left: 6%; width: 88%; height: 19%; border-radius: 12rpx 12rpx 5rpx 5rpx; background: linear-gradient(90deg, #166294, #399bd1 55%, #195e8c); box-shadow: 0 4rpx 7rpx rgba(19, 62, 94, .2); }
.bottle-neck { position: absolute; top: 15%; left: 18%; width: 64%; height: 15%; background: #dce7e9; }
.bottle-body { position: absolute; left: 0; bottom: 0; width: 100%; height: 73%; overflow: hidden; border-radius: 13rpx 13rpx 20rpx 20rpx; background: linear-gradient(90deg, #c4d5de, #fff 25%, #fff 70%, #bed0d9); box-shadow: 6rpx 8rpx 15rpx rgba(58, 81, 99, .2); }
.bottle-label { display: flex; align-items: center; justify-content: center; margin-top: 32%; height: 37%; background: #d7f5f3; color: #178e9a; font-size: 20rpx; font-weight: 700; }
.is-compact .pack-brand, .is-compact .pack-mark, .is-compact .pack-foot, .is-compact .bottle-label text { display: none; }
.is-compact .pack-band { margin-top: 40%; padding-left: 12%; font-size: 19rpx; }
</style>
