<template>
	<view class="page secondary-page"
		><AppHeader
			title="预约详情"
			back
			fallback="/pages/appointment/list"
		/><view v-if="appointment" class="detail-content"
			><view class="appointment-state"
				><view class="state-icon"
					><AppIcon
						:name="
							appointment.status === '已取消' ? 'close' : 'check'
						"
						color="blue"
						:size="67" /></view
				><text class="detail-heading">{{
					appointment.status === "已取消"
						? "预约已取消"
						: created
							? (apiBaseUrl ? "预约咨询申请已提交" : "模拟预约已保存")
							: (apiBaseUrl ? appointment.status : "等待就诊（演示）")
				}}</text
				><text class="muted small"
					>{{ apiBaseUrl ? '申请已记录，具体就诊安排需由医院确认' : '本记录为静态演示，不代表真实挂号' }}</text
				></view
			><view class="info-panel"
				><view v-for="row in rows" :key="row.label" class="info-line"
					><text>{{ row.label }}</text
					><text>{{ row.value }}</text></view
				></view
			><view class="appointment-steps"
				><text class="section-title">到院前准备</text
				><text>1. 确认医院、科室与日期</text
				><text>2. 按医院要求准备就诊资料</text
				><text>3. 提前了解院区位置与报到方式</text></view
			><view class="action-pair"
				><button
					class="outline-button"
					@tap="openGuide(appointment.hospitalId)"
				>
					到院指引</button
				><button
					class="primary-button"
					@tap="openChat(appointment.hospitalName)"
				>
					咨询医院
				</button></view
			><view class="action-pair"
				><button class="outline-button" @tap="openAppointments()">
					查看我的预约</button
				><button
					v-if="appointment.status === '待就诊' || appointment.status === '待处理'"
					class="cancel-booking"
					@tap="cancel"
				>
					取消预约</button
				><button
					v-else
					class="outline-button"
					@tap="openBooking(appointment.doctorId)"
				>
					重新预约
				</button></view
			></view
		><view v-else class="empty-state"
			><text class="empty-title">暂未找到该预约</text
			><button
				class="empty-action"
				@tap="goBack('/pages/appointment/list')"
			>
				返回预约列表
			</button></view
		></view
	>
</template>
<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import { readList, saveList } from "../../utils/storage";
import { cancelAppointment } from "../../utils/demo-store";
import { apiBaseUrl, getAppointments, cancelRequestedAppointment } from "../../utils/lecheng-api";
import {
	openGuide,
	openChat,
	openAppointments,
	openBooking,
	goBack,
} from "../../utils/navigation";
const id = ref(""),
	appointment = ref(null),
	created = ref(false);
onLoad((o) => {
	id.value = o.id;
	created.value = o.created === "1";
	refresh();
});
onShow(refresh);
async function refresh() {
	appointment.value =
		readList("appointments").find((a) => a.id === id.value) || null;
	if (apiBaseUrl) {
		try { appointment.value = (await getAppointments()).find((a) => a.id === id.value) || null; }
		catch (error) { uni.showToast({ title: "后台同步失败，显示本机缓存", icon: "none" }); }
	}
}
const rows = computed(() => {
	const a = appointment.value;
	return a
		? [
				{ label: "预约编号", value: a.id },
				{ label: "预约医院", value: a.hospitalName },
				{
					label: "科室医生",
					value: a.department + " · " + a.doctorName,
				},
				{ label: "预约日期", value: a.date },
				{ label: "预约时段", value: a.slot },
				{ label: "就诊人", value: a.name },
				{
					label: "联系电话",
					value: a.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
				},
				{ label: "备注", value: a.note || "无" },
				{ label: "当前状态", value: a.status },
			]
		: [];
});
function cancel() {
	uni.showModal({
		title: "取消这次预约？",
		content: apiBaseUrl ? "取消后后台会同步更新申请状态。" : "取消后可重新选择时段，当前操作仅修改本机模拟记录。",
		confirmText: "确认取消",
		confirmColor: "#0785ff",
		success: async (r) => {
			if (r.confirm) {
				try {
					if (apiBaseUrl) {
						await cancelRequestedAppointment(Number(id.value.slice(2)));
						saveList("appointments", readList("appointments").map((a) => a.id === id.value ? { ...a, status: "已取消" } : a));
					} else cancelAppointment(id.value);
				} catch (error) { uni.showToast({ title: error.message || "取消失败", icon: "none" }); return; }
				refresh();
			}
		},
	});
}
</script>
<style scoped>
.appointment-state {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 8rpx;
	padding: 30rpx 0;
}
.state-icon {
	width: 128rpx;
	height: 128rpx;
	background: #e7f4ff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.appointment-steps {
	display: flex;
	flex-direction: column;
	gap: 18rpx;
	color: #7f90a7;
	font-size: 27rpx;
	padding: 12rpx 0 24rpx;
}
.cancel-booking {
	height: 80rpx;
	border: 1rpx solid #e4eaf3;
	border-radius: 44rpx;
	color: #8796aa;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}
</style>
