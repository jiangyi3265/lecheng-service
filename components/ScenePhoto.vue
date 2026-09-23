<template>
	<view class="scene-photo"
		><image
			class="photo-atlas"
			src="/static/images/medical-atlas.jpg"
			mode="scaleToFill"
			:style="position"
			:aria-label="label" /><view class="photo-content"><slot /></view
	></view>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
	scene: { type: [Number, String], default: 0 },
	label: { type: String, default: "乐城医疗园区" },
});
const position = computed(() => ({
	left: Number(props.scene) % 2 ? "-100%" : "0",
	top: Number(props.scene) > 1 ? "-100%" : "0",
}));
</script>
<style scoped>
.scene-photo {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: #dfedf7;
}
.photo-atlas {
	position: absolute;
	width: 200%;
	height: 200%;
	max-width: none;
}
.photo-content {
	position: absolute;
	inset: 0;
}
</style>
