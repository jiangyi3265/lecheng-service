<template>
	<view class="page detail-page">
		<AppHeader title="医院信息" back back-label="返回" />
		<template v-if="hospital">
			<view class="hospital-cover">
				<ScenePhoto :scene="hospital.scene" :label="hospital.name" />
			</view>
			<view class="hospital-category">
				<view class="hospital-type">{{ hospital.type }}</view>
				<view class="hospital-category-info">
					<view class="hospital-tags"><text v-for="tag in hospital.tags" :key="tag">{{ tag }}</text></view>
				</view>
			</view>
			<view class="content-pad">
				<view class="hospital-identity">
					<text class="hospital-title">{{ hospital.name }}</text>
					<view class="hospital-contact-row">
						<view class="hospital-contact-copy">
						<button class="hospital-address" @tap="openGuide(hospital.id)">
							<AppIcon name="pin" color="blue" :size="29" />
							<text>{{ hospital.address }}</text>
						</button>
						<button v-if="hospital.phone" class="contact-link" @tap="callHospital">
							<AppIcon name="phone" color="blue" :size="29" /><text>联系电话：{{ hospital.phone }}</text>
						</button>
						<view v-else class="contact-link contact-unavailable"><AppIcon name="phone" color="muted" :size="29" /><text>联系电话：待更新</text></view>
						</view>
						<button class="favorite-button" :aria-label="saved ? '取消收藏' : '收藏医院'" @tap="save">
							<AppIcon name="star" :color="saved ? 'blue' : 'muted'" :size="28" />
							<text>{{ saved ? '已收藏' : '收藏' }}</text>
						</button>
					</view>
				</view>
				<view class="detail-section introduction-section">
					<view class="introduction-photo">
						<ScenePhoto :scene="hospital.scene" :label="hospital.name" />
					</view>
					<text class="basics-heading">基本情况</text>
					<text class="body-copy">{{ hospital.description }}</text>
					<text class="body-copy">服务方向：{{ hospital.tags.join('、') }}。{{ hospital.subtitle }}。</text>
				</view>
				<view class="environment-section" aria-label="医疗环境">
					<view class="environment-heading">
						<AppIcon name="building" color="white" :size="42" />
						<text>医疗环境</text>
						<text class="environment-note">环境示意</text>
					</view>
					<swiper class="environment-swiper" :current="selectedEnvironment" indicator-dots
						indicator-color="rgba(255,255,255,.6)" indicator-active-color="#ffffff" circular
						@change="selectedEnvironment = $event.detail.current">
						<swiper-item v-for="scene in environmentScenes" :key="scene">
							<ScenePhoto :scene="scene" :label="'医疗环境示意图' + (scene + 1)" />
						</swiper-item>
					</swiper>
					<view class="environment-grid">
						<button v-for="(scene, index) in environmentScenes" :key="scene" class="environment-tile"
							:aria-label="'查看第' + (index + 1) + '张医疗环境示意图'" @tap="selectedEnvironment = index">
							<ScenePhoto :scene="scene" :label="'医疗环境示意图' + (index + 1)" />
						</button>
					</view>
					<button class="floating-consult" aria-label="预约问诊" @tap="openConsultation">
						<view class="floating-consult-icon"><AppIcon name="heart-pulse" color="white" :size="48" /></view>
						<text>预约问诊</text>
					</button>
				</view>
			</view>
		</template>
		<view v-else class="empty-state">
			<text class="empty-title">暂未找到这家医院</text>
			<button class="empty-action" @tap="openSearch()">返回医院查询</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import ScenePhoto from "../../components/ScenePhoto.vue";
import { hospitals } from "../../data/medical";
import { readList, toggleFavorite, recordVisit } from "../../utils/storage";
import { openSearch, openGuide, navigate } from "../../utils/navigation";

const hospital = ref(null);
const saved = ref(false);
const selectedEnvironment = ref(0);
const environmentScenes = computed(() => hospital.value
	? [hospital.value.scene, ...[0, 1, 2, 3].filter((scene) => scene !== hospital.value.scene)]
	: []);
onLoad((options) => {
	hospital.value = hospitals.find((item) => item.id === (options.id || "international"));
	if (hospital.value) {
		recordVisit(hospital.value.id);
		saved.value = readList("favorites").includes(hospital.value.id);
	}
});
onShow(() => {
	if (hospital.value) saved.value = readList("favorites").includes(hospital.value.id);
});
function save() {
	if (!hospital.value) return;
	saved.value = toggleFavorite(hospital.value.id);
	uni.showToast({ title: saved.value ? "已加入我的收藏" : "已取消收藏", icon: "none" });
}
function callHospital() {
	if (hospital.value?.phone) uni.makePhoneCall({ phoneNumber: hospital.value.phone });
}
function openConsultation() {
	navigate("/pages/support/support");
}
</script>

<style scoped>
.detail-page { padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); }
.hospital-cover { height: 438rpx; }
.hospital-category {
	display: flex;
	align-items: center;
	gap: 24rpx;
	min-height: 110rpx;
	padding: 0 26rpx 0 0;
	background: #2f80df;
	color: #f5faff;
	font-size: 24rpx;
}
.hospital-type { align-self: stretch; display: flex; align-items: center; justify-content: center; width: 168rpx; flex-shrink: 0; padding: 20rpx 12rpx; border-radius: 0 36rpx 0 0; background: #4e9bef; font-size: 34rpx; font-weight: 700; line-height: 1.3; text-align: center; }
.hospital-category-info { flex: 1; min-width: 0; padding: 16rpx 0; }
.hospital-tags { display: flex; flex-wrap: wrap; gap: 8rpx; }
.hospital-tags text { padding: 3rpx 12rpx; border-radius: 7rpx; background: #e8f5ff; color: #267dbb; }
.hospital-identity { padding: 38rpx 0 34rpx; }
.hospital-title { display: block; font-size: 37rpx; font-weight: 700; line-height: 1.4; }
.hospital-contact-row { display: flex; align-items: flex-start; gap: 16rpx; margin-top: 19rpx; }
.hospital-contact-copy { flex: 1; min-width: 0; }
.hospital-address { display: flex; align-items: flex-start; flex: 1; min-width: 0; gap: 8rpx; color: #596b7e; text-align: left; font-size: 25rpx; }
.hospital-address text { flex: 1; }
.favorite-button { display: flex; align-items: center; gap: 7rpx; flex-shrink: 0; min-width: 106rpx; padding: 7rpx 14rpx; border: 1rpx solid #dbe4ed; border-radius: 30rpx; font-size: 22rpx; }
.contact-link { display: flex; align-items: flex-start; gap: 8rpx; margin-top: 16rpx; color: #2685d8; font-size: 25rpx; text-align: left; overflow-wrap: anywhere; }
.contact-unavailable { color: #8191a3; }
.detail-section { padding-top: 36rpx; }
.introduction-section { border-top: 12rpx solid #f5f7fa; margin: 0 -36rpx; padding: 26rpx 26rpx 0; }
.introduction-photo { position: relative; height: 350rpx; overflow: hidden; border-radius: 16rpx; }
.basics-heading { display: block; margin: 44rpx 0 20rpx; text-align: center; color: #162a3d; font-size: 47rpx; font-weight: 700; }
.body-copy { display: block; margin: 0 0 18rpx; color: #4b5e72; font-size: 27rpx; line-height: 1.75; }
.environment-section { position: relative; margin: 46rpx 0 0; overflow: hidden; border-radius: 22rpx 22rpx 0 0; }
.environment-heading { display: flex; align-items: center; gap: 18rpx; min-height: 88rpx; padding: 0 28rpx; background: #368be5; color: #f7fbff; font-size: 32rpx; font-weight: 700; }
.environment-note { margin-left: auto; color: #e4f2ff; font-size: 22rpx; font-weight: 400; }
.environment-swiper { height: 350rpx; background: #dcecf8; }
.environment-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20rpx; padding: 20rpx 4rpx 4rpx; }
.environment-tile { width: 100%; height: 190rpx; overflow: hidden; border-radius: 16rpx; }
.floating-consult { position: absolute; z-index: 2; right: 2rpx; bottom: 64rpx; display: flex; flex-direction: column; align-items: center; width: 204rpx; padding: 0 0 16rpx; color: #fff; filter: drop-shadow(0 8rpx 14rpx rgba(21, 104, 197, .24)); }
.floating-consult-icon { display: flex; align-items: center; justify-content: center; width: 104rpx; height: 104rpx; margin-bottom: -18rpx; border: 7rpx solid #d5edff; border-radius: 50%; background: #5fa9f4; }
.floating-consult text { display: block; width: 100%; padding: 17rpx 0; border-radius: 40rpx; background: #2387e9; font-size: 27rpx; font-weight: 650; text-align: center; }
</style>
