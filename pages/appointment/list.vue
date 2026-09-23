<template>
	<view class="page secondary-page"
		><AppHeader title="我的预约" back fallback="/pages/mine/mine" /><view
			class="detail-content"
			><view class="segmented"
				><button
					v-for="item in tabs"
					:key="item"
					class="segment"
					:class="{ 'is-active': tab === item }"
					@tap="tab = item"
				>
					{{ item }}
				</button></view
			><text class="demo-label">{{ syncError || (apiBaseUrl ? '预约咨询申请记录由乐城后台同步；实际号源需医院确认' : '预约记录为本机模拟数据') }}</text
			><button
				v-for="item in filtered"
				:key="item.id"
				class="appointment-card"
				@tap="openAppointment(item.id)"
			>
				<view class="between"
					><text class="section-title">{{ item.hospitalName }}</text
					><text
						class="status-pill"
						:class="{ cancelled: item.status === '已取消' }"
						>{{ item.status }}</text
					></view
				><text class="appointment-doctor"
					>{{ item.doctorName }} · {{ item.department }}</text
				><view class="row appointment-time"
					><AppIcon name="calendar" color="blue" :size="33" /><text
						>{{ item.date }} {{ item.slot }}</text
					></view
				><view class="between muted small"
					><text>就诊人：{{ item.name }}</text
					><text class="link">查看详情 ›</text></view
				></button
			><view v-if="!filtered.length" class="empty-state"
				><AppIcon name="calendar" color="muted" :size="90" /><text
					class="empty-title"
					>{{
						tab === "全部"
							? "还没有预约记录"
							: "暂无" + tab + "的预约"
					}}</text
				><text class="small">选择医院和医生，即可体验预约流程</text
				><button class="empty-action" @tap="openSearch('医院')">
					去选择医院
				</button></view
			></view
		></view
	>
</template>
<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AppHeader from "../../components/AppHeader.vue";
import AppIcon from "../../components/AppIcon.vue";
import { readList } from "../../utils/storage";
import { apiBaseUrl, getAppointments } from "../../utils/lecheng-api";
import { openAppointment, openSearch } from "../../utils/navigation";
const tabs = ["全部", "待处理", "已联系", "已取消"],
	tab = ref("全部"),
	items = ref([]), syncError = ref("");
onShow(async () => {
	items.value = readList("appointments");
	if (apiBaseUrl) {
		try { items.value = await getAppointments(); syncError.value = ""; }
		catch (error) { syncError.value = "后台同步失败，当前显示本机缓存"; }
	}
});
const filtered = computed(() =>
	items.value.filter((a) => tab.value === "全部" || a.status === tab.value),
);
</script>
<style scoped>
.appointment-card {
	width: 100%;
	text-align: left;
	border: 1rpx solid #e3edf8;
	border-radius: 24rpx;
	padding: 27rpx;
	margin: 24rpx 0;
	background: #fff;
	display: flex;
	flex-direction: column;
	gap: 23rpx;
}
.appointment-card .section-title {
	font-size: 28rpx;
}
.appointment-doctor {
	font-size: 29rpx;
}
.appointment-time {
	color: #5c799c;
	font-size: 26rpx;
	gap: 13rpx;
}
</style>
