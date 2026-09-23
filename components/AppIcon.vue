<template>
	<image
		class="app-icon"
		:src="`/static/icons/${name}-${color}.png`"
		:style="{ width: size + 'rpx', height: size + 'rpx' }"
		mode="aspectFit"
		:aria-label="label || name"
	/>
</template>
<script setup>
defineProps({
	name: { type: String, default: "chevron" },
	color: { type: String, default: "ink" },
	size: { type: [Number, String], default: 40 },
	label: String,
});
</script>
<style scoped>
.app-icon {
	display: inline-block;
	flex-shrink: 0;
	vertical-align: middle;
}
</style>
