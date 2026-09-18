<template>
  <view class="resource-detail" :class="'resource-type-' + type">
    <template v-if="type === '1'">
      <view class="hospital-visual">
        <NativeArt name="hospital-detail" :width="750" />
        <view class="hospital-ribbon">
          <text>
            {{ name === "华西乐城医院" ? "公立" : "医院" }}
            <br />
            {{ name === "华西乐城医院" ? "综合" : "信息" }}
          </text>
          <view>
            <text v-if="name === '华西乐城医院'">肿瘤　神经</text>
            <text v-if="name === '华西乐城医院'">入驻时间：2024-06-08</text>
          </view>
        </view>
      </view>
      <view class="hospital-intro">
        <text class="hospital-full-name">
          {{
            name === "华西乐城医院"
              ? "四川大学华西乐城医院（海南海控乐城医院）"
              : name
          }}
        </text>
        <view class="hospital-address">
          <text>♧</text>
          <view>
            <text v-if="name === '华西乐城医院'">
              海南省琼海市博鳌乐城先行区康祥路25号
            </text>
            <text v-if="name === '华西乐城医院'" class="contact">
              联系电话：项目及公事联络：华西乐城医院王老师 0898-36860160
              患者咨询：0898-36860155
            </text>
            <text v-else class="contact" @tap="consult">联系医院　›</text>
          </view>
          <view class="save" @tap="$emit('save')">
            {{ saved ? "★ 已收藏" : "☆ 收藏" }}
          </view>
        </view>
      </view>
      <scroll-view scroll-x class="resource-tabs">
        <view class="resource-tab-row">
          <text
            v-for="(tab, i) in [
              '医院介绍',
              '特许药械',
              '名医专家',
              '医院动态',
              '就医指南',
            ]"
            :key="tab"
            :class="{ selected: active === i }"
            @tap="active = i"
          >
            {{ tab }}
          </text>
        </view>
      </scroll-view>
      <view v-if="active === 0" class="resource-content hospital-article">
        <NativeArt name="hospital-detail" :width="700" />
        <text class="section-title">医院介绍</text>
        <text class="intro-copy">四川大学华西乐城医院（海南海控乐城医院）</text>
      </view>
      <view v-else class="resource-content">
        <view
          class="browse-link"
          @tap="browse(active === 1 ? 0 : active === 2 ? 2 : 1)"
        >
          {{
            [
              "",
              "查看特许药械",
              "查看名医专家",
              "查看医院动态",
              "查看医院信息",
            ][active]
          }}
          ›
        </view>
      </view>
      <view class="floating-consult" @tap="consult">预约咨询</view>
    </template>
    <template v-else-if="type === '2'">
      <view class="expert-profile">
        <view class="expert-avatar">
          <NativeArt
            :name="name === '王振义' ? 'expert-avatar' : 'expert-wanghongyang'"
            :width="137"
          />
        </view>
        <view class="expert-titles">
          <text>工程院院士</text>
          <text v-if="name === '王振义'">共和国勋章</text>
          <text>教授</text>
          <text class="expert-save" @tap="$emit('save')">
            {{ saved ? "★" : "☆" }}
          </text>
        </view>
        <view class="expert-name">
          <text>{{ name }}</text>
          院士
        </view>
        <text class="expert-hospital">中国干细胞集团附属医院</text>
        <text class="expert-category">◆ 其他</text>
        <view class="specialty">
          <text>擅长项目</text>
          {{ name === "王振义" ? "内科血液学专家" : "肿瘤学" }}
        </view>
      </view>
      <view class="expert-bio">
        <text class="section-title">个人简介</text>
        <text class="intro-copy">
          {{
            name === "王振义"
              ? "内科血液学专家，医学家、医学教育家，中国工程院院士、法国科学院外籍院士，“共和国勋章”获得者，上海交通大学医学院附属瑞金医院终身教授、上海交通大学医学院终身教授、上海血液学研究所名誉所长。"
              : "详细专家介绍待接入。"
          }}
        </text>
      </view>
      <view class="schedule">
        <view class="schedule-heading">
          <text>♧ 最近坐诊时间安排</text>
          <text @tap="consult">预约挂号</text>
        </view>
        <view class="schedule-table">
          <view class="schedule-label">
            <text></text>
            <text>上午</text>
            <text>下午</text>
          </view>
          <view v-for="day in days" :key="day.date">
            <text>
              {{ day.week }}
              <text>{{ day.date }}</text>
            </text>
            <text></text>
            <text></text>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="insurance-hero">
        <NativeArt
          :name="name === '乐城特药险' ? 'insurance-lecheng' : 'insurance-wuxi'"
          :width="750"
        />
      </view>
      <view class="insurance-summary">
        <view class="insurance-title">
          <text>{{ name }}</text>
          <view class="save" @tap="$emit('save')">
            {{ saved ? "★ 已收藏" : "☆ 收藏" }}
          </view>
        </view>
        <view class="insurance-versions">
          <text>2025</text>
          <text>A款</text>
          <text>B款</text>
        </view>
        <view class="covered-count">
          <text>▣ 可报特许药械</text>
          <text>
            {{ name === "乐城特药险" ? 74 : 20 }}
            <text>种</text>
          </text>
        </view>
      </view>
      <view class="resource-tabs">
        <view class="resource-tab-row insurance-tabs">
          <text
            v-for="(tab, i) in ['保险简介', '覆盖特药', '保险说明书']"
            :key="tab"
            :class="{ selected: active === i }"
            @tap="active = i"
          >
            {{ tab }}
          </text>
        </view>
      </view>
      <view
        v-if="active === 0 && name === '乐城特药险'"
        class="insurance-content"
      >
        <view class="coverage-section">
          <text class="coverage-title">投保范围</text>
          <text>
            海南省户籍人员、海南省身份证持有人、海南省当地基本医疗保险参保人及其直系亲属，以及在海南居住的“新市民”和在琼外籍人士。（注：新市民是指在保单起保时持有有效海南省居住证满一年的人）
          </text>
        </view>
        <view class="coverage-section">
          <text class="coverage-title">保险责任</text>
          <text>具体保障范围及投保条件以保险公司正式保险条款为准。</text>
        </view>
      </view>
      <view v-else-if="active === 1" class="resource-content">
        <view class="browse-link" @tap="browse(0)">查看特许药械 ›</view>
      </view>
      <view v-else class="resource-content info-note">
        保险说明书文件待接入
      </view>
    </template>
  </view>
</template>
<script>
import NativeArt from "./NativeArt.vue";
import AppIcon from "./AppIcon.vue";
export default {
  components: { AppIcon, NativeArt },
  props: { type: String, name: String, saved: Boolean },
  emits: ["save"],
  data() {
    return { active: 0 };
  },
  computed: {
    days() {
      return Array.from({ length: 8 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
            d.getDay()
          ],
          date:
            String(d.getMonth() + 1).padStart(2, "0") +
            "/" +
            String(d.getDate()).padStart(2, "0"),
        };
      });
    },
  },
  methods: {
    consult() {
      uni.navigateTo({ url: "/pages/assistant/assistant" });
    },
    browse(type) {
      uni.navigateTo({ url: "/pages/catalog/catalog?type=" + type });
    },
  },
};
</script>
<style scoped>
.hospital-visual {
  height: 550rpx;
  background: linear-gradient(#4398df, #a4d8ef 72%, #dbe7dc);
  position: relative;
  overflow: hidden;
}
.sun-cloud {
  position: absolute;
  width: 280rpx;
  height: 66rpx;
  border-radius: 50%;
  background: #f3fcff;
  left: 50rpx;
  top: 70rpx;
  filter: blur(13rpx);
}
.building {
  position: absolute;
  bottom: 108rpx;
  left: 80rpx;
  width: 550rpx;
  height: 275rpx;
  background: #f6f6ef;
  transform: skewY(-3deg);
  padding: 60rpx 40rpx 20rpx;
  display: flex;
  gap: 33rpx;
  border-top: 25rpx solid #e5edf0;
}
.building > text {
  position: absolute;
  top: 12rpx;
  left: 30rpx;
  font-size: 16rpx;
  color: #b7a776;
  letter-spacing: 3rpx;
}
.building > view {
  background: linear-gradient(90deg, #a0b9bd, #6796a9);
  width: 85rpx;
  height: 180rpx;
  border: 10rpx solid #fff;
}
.expert-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #ffbc46;
  border-radius: 0 0 32rpx 0;
  padding: 13rpx 33rpx 13rpx 10rpx;
  color: #fff;
  font-size: 24rpx;
}
.hospital-ribbon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #408af6;
  color: #fff;
  display: flex;
  align-items: center;
  height: 111rpx;
  gap: 42rpx;
}
.hospital-ribbon > text {
  padding: 15rpx 25rpx;
  font-size: 38rpx;
  font-weight: 800;
  font-style: italic;
  background: linear-gradient(#71ceff, #4088f2);
  line-height: 1.1;
}
.hospital-ribbon > view {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  font-size: 24rpx;
}
.hospital-ribbon > view > text:first-child {
  font-size: 21rpx;
  color: #408ff0;
  background: #eef6ff;
  border-radius: 6rpx;
  align-self: flex-start;
}
.hospital-intro {
  background: #fff;
  padding: 40rpx 25rpx 30rpx;
}
.hospital-full-name {
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.5;
}
.hospital-address {
  display: flex;
  align-items: center;
  gap: 19rpx;
  font-size: 25rpx;
  margin-top: 39rpx;
  line-height: 1.9;
}
.hospital-address > view:nth-child(2) {
  flex: 1;
}
.contact {
  display: block;
  color: #5698e7;
  margin-top: 10rpx;
}
.save {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border: 1rpx solid #ddd;
  border-radius: 25rpx;
  white-space: nowrap;
  line-height: 1.6;
  font-weight: 400;
}
.resource-tabs {
  height: 105rpx;
  background: #fff;
  margin-top: 22rpx;
  border-bottom: 1rpx solid #eee;
}
.resource-tab-row {
  display: flex;
  align-items: center;
  gap: 38rpx;
  white-space: nowrap;
  height: 105rpx;
  padding: 0 35rpx;
  min-width: max-content;
}
.resource-tab-row > text {
  font-size: 28rpx;
  position: relative;
}
.resource-tab-row > text.selected {
  color: #478edb;
  font-weight: 600;
}
.selected:after {
  position: absolute;
  content: "";
  height: 6rpx;
  width: 40rpx;
  background: #4089ec;
  bottom: -27rpx;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4rpx;
}
.resource-content {
  padding: 30rpx;
  background: #fff;
  min-height: 270rpx;
}
.section-title {
  display: block;
  font-size: 29rpx;
  margin-bottom: 18rpx;
}
.intro-copy {
  font-size: 25rpx;
  color: #8d9296;
  line-height: 1.55;
  display: block;
}
.info-note {
  padding: 30rpx 0;
  color: #98a5b1;
  font-size: 25rpx;
}
.browse-link {
  color: #448ffa;
  font-size: 28rpx;
  padding: 25rpx;
}
.floating-consult {
  position: fixed;
  bottom: 160rpx;
  right: 20rpx;
  z-index: 11;
  background: #4b9fff;
  color: #fff;
  padding: 15rpx 27rpx;
  border-radius: 35rpx;
  box-shadow: 0 0 20rpx #bdd5ff;
  font-size: 27rpx;
}
.resource-type-2 {
  background: linear-gradient(#3c91ff 0, #75b2fd 170rpx, #f6f6f6 300rpx);
  padding: 130rpx 24rpx 25rpx;
}
.expert-profile {
  position: relative;
  background: linear-gradient(#bfdbff, #fff 44%);
  border: 2rpx solid #d9eeff;
  border-radius: 22rpx;
  padding: 15rpx 22rpx 46rpx;
}
.expert-avatar {
  position: absolute;
  top: -80rpx;
  left: 28rpx;
  width: 137rpx;
  height: 137rpx;
  border-radius: 50%;
  border: 4rpx solid #d8f0ff;
  background: #e4f0fc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.expert-titles {
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 22rpx;
  margin-bottom: 9rpx;
}
.expert-titles > text {
  background: #438bec;
  border-radius: 4rpx;
  color: #fff;
  font-size: 19rpx;
  padding: 2rpx 6rpx;
}
.expert-titles .expert-save {
  background: transparent;
  color: #8198b5;
  font-size: 30rpx;
  margin-left: auto;
}
.expert-name {
  font-size: 25rpx;
}
.expert-name > text {
  font-size: 39rpx;
  font-weight: 700;
  margin-right: 22rpx;
}
.expert-hospital {
  display: block;
  margin-top: 23rpx;
  font-size: 24rpx;
}
.expert-category {
  display: block;
  margin: 35rpx 0 25rpx;
  font-size: 25rpx;
  color: #93a1b1;
}
.specialty {
  border: 3rpx solid #5799f5;
  background: #ebf4ff;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #939eaa;
}
.specialty > text {
  font-weight: 700;
  color: #5596e5;
  margin-right: 12rpx;
}
.expert-bio {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 23rpx;
  padding: 36rpx 24rpx 25rpx;
}
.schedule {
  margin-top: 23rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #fff;
}
.schedule-heading {
  height: 90rpx;
  padding: 0 25rpx;
  background: linear-gradient(120deg, #539dfa, #87c4ff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 27rpx;
  font-weight: 600;
}
.schedule-heading > text + text {
  background: #fff;
  color: #333;
  font-size: 21rpx;
  padding: 9rpx 25rpx;
  border-radius: 9rpx;
}
.schedule-table {
  display: flex;
}
.schedule-table > view {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid #eee;
  color: #666;
  font-size: 23rpx;
  display: flex;
  flex-direction: column;
}
.schedule-table > view > text {
  height: 115rpx;
  padding-top: 25rpx;
}
.schedule-table > view > text > text {
  display: block;
  font-size: 19rpx;
  color: #999;
  margin-top: 10rpx;
}
.schedule-table .schedule-label {
  color: #5599e7;
}
.insurance-hero {
  height: 470rpx;
  background: linear-gradient(135deg, #cf292b, #ed3334);
  color: #fffad9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.insurance-hero > text:first-child {
  font-size: 93rpx;
  letter-spacing: 4rpx;
  transform: rotate(-4deg);
  line-height: 1.4;
}
.insurance-hero > text + text {
  font-size: 202rpx;
  font-weight: 900;
  line-height: 1.1;
}
.insurance-summary {
  margin-top: -75rpx;
  position: relative;
  background: #fff;
  border-radius: 35rpx 35rpx 0 0;
  padding: 42rpx 30rpx 25rpx;
}
.insurance-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 33rpx;
  font-weight: 600;
}
.insurance-versions {
  display: flex;
  gap: 5rpx;
  margin-top: 38rpx;
  font-size: 21rpx;
}
.insurance-versions > text {
  background: #ddf4f2;
  color: #50a5b1;
}
.insurance-versions > text:nth-child(2) {
  background: #e2f0ff;
  color: #77a3df;
}
.insurance-versions > text:nth-child(3) {
  background: #fff0d9;
  color: #e8b65e;
}
.covered-count {
  margin-top: 40rpx;
  display: flex;
  height: 89rpx;
  border-radius: 20rpx;
  overflow: hidden;
  gap: 7rpx;
  color: #fff;
  font-size: 31rpx;
  font-weight: 600;
}
.covered-count > text {
  background: linear-gradient(90deg, #5bc1ff, #4d90f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1.7;
  transform: skew(-13deg);
  margin-left: -10rpx;
  padding-left: 10rpx;
}
.covered-count > text + text {
  flex: 1;
  background: linear-gradient(90deg, #3ec8c7, #00a2a4);
  font-size: 43rpx;
  margin-left: 0;
  margin-right: -10rpx;
  padding-left: 0;
}
.covered-count > text > text {
  font-size: 23rpx;
  margin-left: 4rpx;
}
.insurance-tabs {
  justify-content: space-between;
  gap: 10rpx;
  min-width: 0;
}
.insurance-content {
  padding: 50rpx 30rpx;
  background: #fff;
}
.coverage-section {
  position: relative;
  margin: 20rpx 0 63rpx;
  background: #f0f7ff;
  border: 2rpx solid #d4e0f0;
  border-radius: 20rpx;
  padding: 45rpx 28rpx 35rpx;
  font-size: 26rpx;
  line-height: 1.55;
}
.coverage-title {
  position: absolute;
  left: 0;
  top: -28rpx;
  background: linear-gradient(90deg, #3288f6, #79bdf8, transparent);
  color: #fff;
  font-size: 29rpx;
  padding: 3rpx 45rpx 3rpx 20rpx;
  border-radius: 16rpx;
  font-weight: 600;
}
.hospital-visual {
  height: 550rpx;
}
.hospital-address {
  margin-top: 37rpx;
}
.contact {
  display: block;
  font-size: 25rpx;
  line-height: 1.9;
  color: #548ee0;
}
.hospital-address > view:nth-child(2) {
  min-width: 0;
}
.hospital-address > .save {
  align-self: center;
}
.hospital-intro {
  padding-bottom: 29rpx;
}
.hospital-article {
  padding: 23rpx 25rpx;
}
.hospital-article > .native-art {
  border-radius: 19rpx;
  overflow: hidden;
}
.hospital-article > .section-title {
  margin-top: 28rpx;
}
.expert-avatar {
  overflow: hidden;
  border: 0;
  background: none;
}
.expert-titles {
  padding-left: 150rpx;
  gap: 23rpx;
  justify-content: flex-start;
}
.expert-titles > text {
  white-space: nowrap;
}
.expert-titles .expert-save {
  position: absolute;
  right: 23rpx;
  top: 15rpx;
}
.insurance-hero {
  height: 470rpx;
  justify-content: flex-start;
}
.insurance-hero > .native-art {
  flex-shrink: 0;
}
</style>
