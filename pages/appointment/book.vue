<template>
	<view class="page secondary-page"
		><AppHeader
			title="预约门诊"
			back
			fallback="/pages/search/search"
		/><view v-if="doctor" class="detail-content"
			><view class="booking-summary"
				><AppIcon name="calendar" color="blue" :size="66" /><view
					><text class="section-title"
						>{{ doctor.name }} · {{ doctor.department }}</text
					><text class="muted small">{{
						doctor.hospitalName
					}}</text></view
				></view
			><text class="demo-label"
				>{{ apiBaseUrl ? '预约咨询申请将提交客服后台，需人工确认；不占用真实号源' : '静态预约演示 · 记录只保存在本机，不占用真实号源' }}</text
			><text class="section-title">选择日期</text
			><scroll-view scroll-x class="dates-scroll"
				><view class="dates-row"
					><button
						v-for="item in dates"
						:key="item.value"
						class="date-option"
						:class="{ selected: date === item.value }"
						@tap="date = item.value"
					>
						<text>{{ item.week }}</text
						><text>{{ item.label }}</text>
					</button></view
				></scroll-view
			><text class="section-title">选择时段</text
			><view class="selection-chips"
				><button
					v-for="time in slots"
					:key="time"
					class="selection-chip"
					:class="{ selected: slot === time }"
					@tap="slot = time"
				>
					{{ time }}
				</button></view
			><view class="section-space"
				><text class="section-title">就诊人信息</text
				><label class="form-field"
					><text>就诊人姓名</text
					><input
						v-model="name"
						maxlength="20"
						placeholder="请输入姓名"
						aria-label="就诊人姓名" /></label
				><label class="form-field"
					><text>联系电话</text
					><input
						v-model="phone"
						type="number"
						maxlength="11"
						placeholder="请输入 11 位手机号码"
						aria-label="联系电话" /></label
				><label class="form-field"
					><text>备注</text
					><input
						v-model="note"
						maxlength="100"
						placeholder="选填，请填写需沟通的事项"
						aria-label="预约备注" /></label></view
			><label class="consent-row"
				><checkbox-group
					@change="consent = $event.detail.value.includes('agree')"
					><label class="row"
						><checkbox
							value="agree"
							:checked="consent"
							color="#0785ff"
						/><text>{{ apiBaseUrl ? '我已了解这只是预约咨询申请，并非医院挂号' : '我已了解本次为静态预约演示' }}</text></label
					></checkbox-group
				></label
			><text v-if="error" class="inline-error">{{ error }}</text
			><button
				class="primary-button"
				:disabled="submitting"
				@tap="submit"
			>
				{{ submitting ? "提交中…" : apiBaseUrl ? "提交预约咨询申请" : "确认预约（演示）" }}</button
			><button class="booking-guide link" @tap="openService('预约须知')">
				查看预约须知
			</button></view
		><view v-else class="empty-state"
			><text class="empty-title">请先选择医生</text
			><button class="empty-action" @tap="goBack('/pages/search/search')">
				返回选择
			</button></view
		></view
	>
</template>
<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import {
	doctors,
	upcomingDates,
	appointmentSlots as slots,
} from "../../data/catalog";
import { readProfile, readList, saveList } from "../../utils/storage";
import { createAppointment } from "../../utils/demo-store";
import { apiBaseUrl, requestAppointment } from "../../utils/lecheng-api";
import { pageUrl, openService, goBack } from "../../utils/navigation";
const doctor = ref(null),
	dates = ref(upcomingDates()),
	date = ref(""),
	slot = ref(""),
	name = ref(""),
	phone = ref(""),
	note = ref(""),
	consent = ref(false),
	error = ref(""),
	submitting = ref(false);
onLoad((o) => {
	doctor.value = doctors.find((d) => d.id === o.doctorId);
	const p = readProfile();
	name.value = p.name === "乐城用户" ? "" : p.name;
	phone.value = p.phone || "";
	date.value = dates.value[0].value;
});
onShow(() => {
	dates.value = upcomingDates();
});
async function submit() {
	error.value = "";
	if (submitting.value) return;
	if (!consent.value) {
		error.value = "请先勾选申请说明";
		return;
	}
	submitting.value = true;
	try {
		const input = {
			doctorId: doctor.value.id,
			date: date.value,
			slot: slot.value,
			name: name.value,
			phone: phone.value,
			note: note.value.trim(),
		};
		let item;
		if (apiBaseUrl) {
			if (!input.name.trim()) throw Error("请填写就诊人姓名");
			if (!/^1\d{10}$/.test(input.phone)) throw Error("请输入正确的 11 位手机号码");
			if (!dates.value.some((d) => d.value === input.date) || !slots.includes(input.slot)) throw Error("请选择有效日期和时段");
			item = await requestAppointment(input);
			saveList("appointments", [item, ...readList("appointments").filter((a) => a.id !== item.id)]);
		} else item = createAppointment(input);
		uni.redirectTo({
			url: pageUrl("/pages/appointment/detail", {
				id: item.id,
				created: "1",
			}),
			complete: () => (submitting.value = false),
		});
	} catch (e) {
		error.value = e.message;
		submitting.value = false;
	}
}
</script>
<style scoped>
.booking-summary {
	display: flex;
	align-items: center;
	gap: 23rpx;
	padding: 22rpx 0;
}
.booking-summary > view {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}
.dates-scroll {
	width: 100%;
	margin: 22rpx 0 30rpx;
	white-space: nowrap;
}
.dates-row {
	display: inline-flex;
	gap: 16rpx;
	padding-bottom: 8rpx;
}
.date-option {
	width: 126rpx;
	padding: 20rpx 0;
	border: 1rpx solid #e0e9f4;
	background: #f6f9fe;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 9rpx;
	font-size: 26rpx;
	color: #768ba5;
	flex-shrink: 0;
}
.date-option.selected {
	color: #0785ff;
	background: #eaf5ff;
	border-color: #0785ff;
}
.consent-row {
	display: block;
	margin: 32rpx 0;
	font-size: 24rpx;
	color: #7890aa;
}
.consent-row checkbox {
	transform: scale(0.8);
}
.booking-guide {
	padding: 26rpx;
}
</style>
