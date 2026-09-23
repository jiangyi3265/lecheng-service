<template>
	<view class="page about-page">
		<AppHeader title="乐城介绍" back />
		<view class="about-hero"
			><ScenePhoto :scene="3"
				><view class="about-hero-shade" /><view class="about-hero-copy"
					><text class="hello-title">你好，乐城</text
					><text>在这里，遇见健康新可能</text></view
				></ScenePhoto
			></view
		>
		<view class="content-pad"><LechengIntro /></view>
		<AppTabBar active="home" />
	</view>
</template>
<script setup>
import AppHeader from "../../components/AppHeader.vue";
import AppTabBar from "../../components/AppTabBar.vue";
import LechengIntro from "../../components/LechengIntro.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
</script>
<style scoped>
.about-hero {
	height: 535rpx;
}
.about-hero-shade {
	position: absolute;
	inset: 0;
	background: linear-gradient(
		180deg,
		rgba(226, 244, 255, 0.65),
		transparent 62%
	);
}
.about-hero-copy {
	position: absolute;
	top: 44rpx;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	flex-direction: column;
	color: #143450;
	font-size: 29rpx;
	letter-spacing: 3rpx;
	gap: 4rpx;
}
.hello-title {
	font-family: KaiTi, STKaiti, "Songti SC", serif;
	font-size: 68rpx;
	font-weight: 700;
	letter-spacing: 7rpx;
}
</style>
