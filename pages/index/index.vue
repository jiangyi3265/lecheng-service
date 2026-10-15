<template>
	<view class="page home-page">
		<AppHeader title="乐城服务" home />
		<swiper
			class="hero-swiper"
			:autoplay="false"
			:circular="banners.length > 1"
			:indicator-dots="banners.length > 1"
			indicator-color="rgba(255,255,255,.5)"
			indicator-active-color="#ffffff"
		>
			<swiper-item v-for="slide in banners" :key="slide.id"
				><view class="hero-slide" @tap="openAbout"
					><ScenePhoto :src="slide.coverImage" :scene="slide.scene"
						><view class="hero-shade" /><view class="hero-copy"
							><text v-if="slide.title" class="hero-title">{{ slide.title }}</text
							><text v-if="slide.subtitle" class="hero-subtitle">{{
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
import AppTabBar from "../../components/AppTabBar.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import HospitalCard from "../../components/HospitalCard.vue";
import HospitalDirectoryBanner from "../../components/HospitalDirectoryBanner.vue";
import LechengIntro from "../../components/LechengIntro.vue";
import { hospitals, directoryTotal } from "../../data/medical";
// 轮播内容由后台“首页轮播”维护；上传了图片显示图片，否则显示示意配图
import { banners } from "../../data/banners";
const activeIntro = ref("hospitals");
function openAbout() {
	activeIntro.value = "about";
}
</script>
<style scoped>
.hero-swiper {
	height: 310rpx;
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
	right: 44rpx;
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
	margin: 20rpx 0 0;
}
.home-switch .segment {
	font-weight: 700;
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
