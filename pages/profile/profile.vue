<template>
	<view class="page profile-page">
		<AppHeader title="个人资料" back fallback="/pages/mine/mine" />
		<view class="content-pad"
			><view class="profile-avatar-wrap"
				><image
					class="profile-avatar"
					src="/static/images/avatar.png"
				/><text class="muted small">完善资料，让服务更贴心</text></view
			><view class="profile-form"
				><label class="field"
					><text>昵称</text
					><input
						v-model="name"
						maxlength="16"
						placeholder="请输入昵称"
						aria-label="昵称" /></label
				><label class="field"
					><text>手机号码</text
					><input
						v-model="phone"
						:disabled="true"
						type="number"
						maxlength="11"
						placeholder="微信授权后显示"
						aria-label="手机号码" /></label
				><label class="field"
					><text>所在城市</text
					><input
						v-model="city"
						maxlength="30"
						placeholder="请输入所在城市"
						aria-label="所在城市" /></label></view
			><text v-if="error" class="form-error">{{ error }}</text
			><text class="profile-note"
				>昵称同步至账号；所在城市保存在本机。手机号仅通过微信授权获取。</text
			><button class="primary-button" @tap="save">保存资料</button
			><text v-if="saved" class="saved-label">资料已保存</text></view
		>
	</view>
</template>
<script setup>
import { ref } from "vue";
import AppHeader from "../../components/AppHeader.vue";
import { readProfile } from "../../utils/storage";
import { auth, updateAccountName } from "../../utils/auth";
const profile = readProfile(),
	name = ref(auth.session()?.user?.name || profile.name),
	phone = ref(auth.session()?.user?.phone || ''),
	city = ref(profile.city),
	error = ref(""),
	saved = ref(false);
async function save() {
	error.value = "";
	saved.value = false;
	if (!name.value.trim()) {
		error.value = "请输入昵称";
		return;
	}
	try { await updateAccountName(name.value.trim()); }
	catch (e) { error.value = e.message; return; }
	uni.setStorageSync("lecheng-profile", {
		name: name.value.trim(),
		phone: phone.value,
		city: city.value.trim(),
	});
	saved.value = true;
	uni.showToast({ title: "资料已保存", icon: "success" });
}
</script>
<style scoped>
.profile-page {
	background: #f7fafe;
}
.profile-avatar-wrap {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 20rpx;
	padding: 48rpx 0;
}
.profile-avatar {
	width: 170rpx;
	height: 170rpx;
}
.profile-form {
	background: #fff;
	border-radius: 24rpx;
	padding: 0 30rpx;
}
.field {
	display: flex;
	align-items: center;
	gap: 20rpx;
	min-height: 120rpx;
	border-bottom: 1rpx solid #edf1f7;
}
.field:last-child {
	border: 0;
}
.field > text {
	width: 155rpx;
	font-size: 28rpx;
	flex-shrink: 0;
}
.field input {
	flex: 1;
	min-width: 0;
	font-size: 27rpx;
	height: 80rpx;
}
.profile-note {
	display: block;
	color: #8a9ab0;
	font-size: 23rpx;
	margin: 22rpx 0 38rpx;
}
.form-error {
	display: block;
	color: #d85c57;
	margin-top: 20rpx;
	font-size: 25rpx;
}
.saved-label {
	display: block;
	text-align: center;
	color: #0785ff;
	margin-top: 25rpx;
}
</style>
