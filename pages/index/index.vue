<template>
	<view class="page home-page">
		<AppHeader title="乐城服务" home
			><button
				class="icon-button"
				aria-label="消息通知"
				@tap="openMessages"
			>
				<AppIcon name="bell" :size="42" /></button
		></AppHeader>
		<swiper
			class="hero-swiper"
			:autoplay="false"
			circular
			indicator-dots
			indicator-color="rgba(255,255,255,.5)"
			indicator-active-color="#ffffff"
		>
			<swiper-item v-for="slide in slides" :key="slide.title"
				><view class="hero-slide" @tap="openAbout"
					><ScenePhoto :scene="slide.scene"
						><view class="hero-shade" /><view class="hero-copy"
							><text class="hero-title">{{ slide.title }}</text
							><text class="hero-subtitle">{{
								slide.subtitle
							}}</text></view
						></ScenePhoto
					></view
				></swiper-item
			>
		</swiper>
		<view class="content-pad">
			<view class="segmented home-switch" role="tablist" aria-label="首页介绍"
				><button class="segment" :class="{ 'is-active': activeIntro === 'hospitals' }" role="tab" :aria-selected="activeIntro === 'hospitals'" aria-controls="hospital-intro" @tap="activeIntro = 'hospitals'">医院介绍</button
				><button class="segment" :class="{ 'is-active': activeIntro === 'about' }" role="tab" :aria-selected="activeIntro === 'about'" aria-controls="lecheng-intro" @tap="openAbout">
					乐城介绍
				</button></view
			>
			<view v-show="activeIntro === 'hospitals'" id="hospital-intro" role="tabpanel">
				<HospitalDirectoryBanner :total="directoryTotal" />
			<view class="home-hospitals"
				><HospitalCard
					v-for="hospital in hospitals"
					:key="hospital.id"
					:hospital="hospital"
					cover
			/></view>
			</view>
			<view v-show="activeIntro === 'about'" id="lecheng-intro" role="tabpanel"><LechengIntro /></view>
		</view>
		<AppTabBar active="home" />
	</view>
</template>
<script setup>
import { ref } from "vue";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import AppTabBar from "../../components/AppTabBar.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import HospitalCard from "../../components/HospitalCard.vue";
import HospitalDirectoryBanner from "../../components/HospitalDirectoryBanner.vue";
import LechengIntro from "../../components/LechengIntro.vue";
import { hospitals, directoryTotal } from "../../data/medical";
import { navigate } from "../../utils/navigation";
const activeIntro = ref("hospitals");
const slides = [
	{ scene: 0, title: "走进乐城", subtitle: "发现身边的优质医疗" },
	{ scene: 3, title: "你好，乐城", subtitle: "让优质医疗，更近一步" },
];
function openAbout() {
	activeIntro.value = "about";
}
function openMessages() {
	navigate("/pages/messages/messages");
}
</script>
<style scoped>
.hero-swiper {
	height: 420rpx;
}
.hero-slide {
	height: 100%;
}
.hero-shade {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, transparent 40%, rgba(8, 37, 49, 0.62));
}
.hero-copy {
	position: absolute;
	bottom: 63rpx;
	left: 44rpx;
	display: flex;
	flex-direction: column;
	gap: 3rpx;
	color: #fff;
}
.hero-title {
	font-size: 56rpx;
	font-weight: 650;
	letter-spacing: 3rpx;
}
.hero-subtitle {
	font-size: 32rpx;
	font-weight: 500;
	letter-spacing: 1rpx;
}
.home-switch {
	margin: 24rpx 0 22rpx;
}
.home-hospitals {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	padding-top: 20rpx;
}
.home-page {
	padding-bottom: calc(130rpx + env(safe-area-inset-bottom));
}
</style>
