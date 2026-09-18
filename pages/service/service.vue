<template>
  <view class="service-page">
    <view class="service-top">
      <BrandHeader compact />
      <view class="service-search">
        <SearchField v-model="query" small @search="submit" />
      </view>
      <view
        class="conference-banner"
        @tap="detail('综合会务中心', 'conference')"
      >
        <ServicePoster kind="conference" />
      </view>
    </view>
    <view class="service-main">
      <view class="service-categorybar">
        <view
          class="pinned-tab"
          :class="{ selected: current === 0 }"
          @tap="current = 0"
        >
          全部
        </view>
        <scroll-view
          scroll-x
          class="service-tabs"
          :scroll-into-view="'service-tab-' + current"
          scroll-with-animation
          :show-scrollbar="false"
        >
          <view class="tab-row">
            <view
              v-for="(tab, i) in tabs.slice(1)"
              :id="'service-tab-' + (i + 1)"
              :key="tab"
              :class="{ selected: current === i + 1 }"
              @tap="current = i + 1"
            >
              {{ tab }}
            </view>
          </view>
        </scroll-view>
      </view>
      <template v-if="visible">
        <view class="service-card" @tap="detail(featured.title, featured.kind)">
          <ServicePoster :kind="featured.kind" :title="featured.title" />
          <view v-if="featured.description" class="service-description">
            ❝ {{ featured.description }}
          </view>
          <view v-if="current === 1" class="service-tags">
            <text>全国唯一</text>
            <text>18至50周岁</text>
            <text>蔡司VISUMAX 800</text>
          </view>
          <view v-if="current === 4 || current === 8" class="service-tags">
            <text>{{ current === 4 ? "乐城餐饮" : "需预约" }}</text>
          </view>
          <text v-if="current !== 5 && current !== 6" class="consult">
            {{ current === 9 ? "免费" : "详情咨询" }}
          </text>
          <view v-if="current !== 5 && current !== 6" class="provider">
            <text class="provider-name">
              ✿
              {{
                featured.kind === "biotech"
                  ? "四川大学华西乐城医院（海南海控乐城医院）"
                  : "乐城管理局"
              }}
            </text>
            <text v-if="featured.kind === 'biotech'" class="available">
              已开展
            </text>
          </view>
          <view v-if="featured.kind === 'biotech'" class="provider">
            <text class="provider-name">✿ 博鳌未来医院</text>
            <text class="pending">附条件审批、暂未开展</text>
          </view>
        </view>
        <view v-if="current === 0 || current === 2" class="service-grid">
          <view
            v-for="name in technologies"
            :key="name"
            class="small-service"
            @tap="detail(name, 'biotech')"
          >
            <view class="small-poster">
              <text>生物医学新技术</text>
              <text>{{ name }}</text>
            </view>
            <text class="small-title">{{ name }}</text>
            <text class="quotation">❝</text>
            <text class="consult">详情咨询</text>
          </view>
        </view>
      </template>
      <view v-else class="empty-state">
        暂无相关服务
        <text
          @tap="
            query = '';
            submitted = '';
            current = 0;
          "
        >
          查看全部服务
        </text>
      </view>
    </view>
    <BottomNav current="service" />
  </view>
</template>
<script>
import BrandHeader from "../../components/BrandHeader.vue";
import SearchField from "../../components/SearchField.vue";
import ServicePoster from "../../components/ServicePoster.vue";
import BottomNav from "../../components/BottomNav.vue";
export default {
  components: { BrandHeader, SearchField, ServicePoster, BottomNav },
  data() {
    return {
      query: "",
      submitted: "",
      current: 0,
      tabs: [
        "全部",
        "医疗",
        "新生物技术",
        "产品",
        "餐饮",
        "住宿",
        "出行",
        "旅游",
        "商务",
        "会议",
      ],
      services: [
        {
          type: 2,
          title: "自体NK细胞辅助免疫药物治疗实体瘤技术",
          kind: "biotech",
        },
        { type: 1, title: "蔡司二代全飞秒", kind: "medical" },
        { type: 3, title: "精准体检与深度筛查", kind: "product" },
        {
          type: 4,
          title: "乐城餐饮指南",
          kind: "dining",
          description: "乐城先行区及周边餐饮、美食、小吃、推荐",
        },
        {
          type: 5,
          title: "博鳌乐城人才公寓",
          kind: "stay",
          description: "乐城先行区保租房 助力自贸港人才安居梦",
        },
        {
          type: 6,
          title: "琼海智慧出行",
          kind: "transport",
          description: "琼海市智能网联汽车应用试点项目",
        },
        { type: 7, title: "2型糖尿病干细胞治疗方案", kind: "tourism" },
        {
          type: 8,
          title: "乐城商务合作",
          kind: "business",
          description: "提供园区内多功能会议厅、会议室、宴会厅",
        },
        { type: 9, title: "中国白癜风精准诊疗与创新转化论坛", kind: "meeting" },
      ],
      technologies: [
        "溶瘤病毒M1技术（注射用VRT106）治疗局部肿瘤",
        "基因修饰自体造血干细胞治疗输血依赖型β地中海贫血",
        "人GLP1和FGF21双因子高表达脂肪干细胞技术",
      ],
    };
  },
  onLoad(p) {
    this.current = Number(p.tab || 0);
  },
  computed: {
    featured() {
      if (this.current === 0)
        return (
          (this.submitted
            ? this.services.find((x) => x.title.includes(this.submitted))
            : null) || this.services[0]
        );
      return (
        this.services.find((x) => x.type === this.current) || this.services[0]
      );
    },
    visible() {
      return !this.submitted || this.featured.title.includes(this.submitted);
    },
  },
  methods: {
    submit() {
      this.submitted = this.query.trim();
    },
    detail(name, kind) {
      uni.navigateTo({
        url:
          "/pages/detail/detail?type=service&name=" +
          encodeURIComponent(name) +
          "&kind=" +
          kind,
      });
    },
  },
};
</script>
<style scoped>
.service-page {
  min-height: 100vh;
  padding-bottom: 188rpx;
  background: #f6f6f6;
}
.service-top {
  background: linear-gradient(#3f92ff, #6daaf5 70%, #f6f6f6);
  padding-bottom: 18rpx;
}
.service-search {
  padding: 24rpx 24rpx 26rpx;
}
.conference-banner {
  margin: 0 24rpx;
}
.service-main {
  margin: 0 24rpx;
  background: #fff;
  border-radius: 22rpx 22rpx 0 0;
  overflow: hidden;
}
.service-tabs {
  height: 88rpx;
  padding: 0 12rpx;
}
.tab-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #ddd;
  height: 88rpx;
}
.tab-row view {
  font-size: 28rpx;
  font-weight: 500;
  height: 88rpx;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 12rpx;
  white-space: nowrap;
}
.tab-row .selected {
  color: #448fe3;
  font-weight: 700;
}
.selected:after {
  content: "";
  position: absolute;
  width: 42rpx;
  height: 5rpx;
  background: #458fe6;
  bottom: 15rpx;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8rpx;
}
.service-card {
  padding: 26rpx 20rpx 0;
  border-bottom: 1rpx solid #eee;
}
.consult {
  display: block;
  margin: 46rpx 0 28rpx;
  color: #ef4e43;
  font-size: 28rpx;
  font-weight: 700;
}
.provider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
  margin: 25rpx 0;
  font-size: 23rpx;
}
.provider-name {
  color: #589beb;
  background: linear-gradient(90deg, #e6f0ff, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.available {
  color: #72b249;
  white-space: nowrap;
}
.pending {
  color: #dfaa57;
  font-size: 22rpx;
  white-space: nowrap;
}
.service-tags {
  display: flex;
  gap: 15rpx;
  padding-top: 28rpx;
}
.service-tags text {
  background: #e9f1ff;
  color: #6e9eda;
  border-radius: 8rpx;
  padding: 3rpx 12rpx;
  font-size: 22rpx;
  white-space: nowrap;
  max-width: 180rpx;
  overflow: hidden;
  text-overflow: ellipsis;
}
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  background: #f6f6f6;
  padding-top: 20rpx;
}
.small-service {
  border-radius: 30rpx;
  background: #fff;
  padding: 15rpx;
  box-shadow: 0 8rpx 16rpx #00000008;
}
.small-poster {
  height: 280rpx;
  background: linear-gradient(145deg, #d6edff, #fff, #6a99ec);
  border-radius: 17rpx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 25rpx;
  padding: 20rpx;
  text-align: center;
  font-size: 23rpx;
  font-weight: 700;
  color: #537ec9;
}
.small-poster text:first-child {
  font-size: 18rpx;
  letter-spacing: 2rpx;
  color: #8aa9d5;
}
.small-title {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 18rpx 0;
}
.quotation {
  color: #cbd0d6;
}
.small-service .consult {
  margin: 65rpx 0 12rpx;
}
.service-categorybar {
  display: flex;
  height: 88rpx;
  border-bottom: 1rpx solid #eee;
}
.service-tabs {
  flex: 1;
  width: 0;
  padding: 0;
}
.pinned-tab {
  width: 86rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  position: relative;
  background: #fff;
  box-shadow: 5rpx 0 8rpx #b5bdc41a;
  z-index: 1;
}
.pinned-tab.selected {
  color: #448fe3;
  font-weight: 700;
}
.tab-row {
  width: max-content;
  justify-content: flex-start;
  gap: 5rpx;
}
.tab-row > view {
  padding: 0 24rpx;
}
.service-description {
  font-size: 26rpx;
  line-height: 1.6;
  margin: 25rpx 0 35rpx;
  color: #686f75;
}
.service-description + .consult {
  margin-top: 25rpx;
}
.service-top {
  background: linear-gradient(
    180deg,
    #5796f7 0,
    #5e99f7 108rpx,
    #74a7f8 217rpx,
    #b1ccf7 290rpx,
    #f6f6f6 380rpx,
    #f6f6f6 100%
  );
}
</style>
