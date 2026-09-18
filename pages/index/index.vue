<template>
  <view class="home-page">
    <view class="hero">
      <BrandHeader search />
      <view class="hero-art"><ReferenceArt name="hero" :width="750" /></view>
    </view>
    <view class="home-body">
      <view class="search-panel">
        <view class="category-tabs">
          <view
            v-for="(label, index) in categories"
            :key="label"
            class="category-tab"
            :class="{ selected: category === index }"
            @tap="selectCategory(index)"
          >
            {{ label }}
          </view>
        </view>
        <view class="search-panel-body">
          <scroll-view scroll-x class="hot-keywords" :show-scrollbar="false">
            <view class="keyword-row">
              <view
                v-for="(word, index) in keywords"
                :key="word"
                class="keyword"
                :class="{ selected: index === hotIndex }"
                @tap="chooseKeyword(word, index)"
              >
                {{ word }}
              </view>
            </view>
          </scroll-view>
          <SearchField
            v-model="query"
            :placeholder="placeholders[category]"
            @search="search"
          />
        </view>
      </view>
      <view
        class="license-banner"
        role="button"
        :aria-label="
          ['全部特许药械', '全部医院', '全部专家', '全部保险'][category]
        "
        @tap="all"
      >
        <ReferenceArt v-if="category === 0" name="banner" :width="660" />
        <NativeArt
          v-else
          :name="
            ['', 'hospital-banner', 'expert-banner', 'insurance-banner'][
              category
            ]
          "
          :width="660"
        />
      </view>
      <view class="catalog-panel">
        <view class="catalog-tabs">
          <view
            v-for="(tab, index) in listTabs"
            :key="tab"
            :class="{ selected: listTab === index }"
            @tap="
              listTab = index;
              activeFilter = '全部';
            "
          >
            {{ tab }}
            <text v-if="listTab === index" class="underline" />
          </view>
          <view class="all-tab" @tap="all">
            全部
            <AppIcon name="arrow" :size="25" />
          </view>
        </view>
        <scroll-view v-if="listTab !== 0" class="filter-scroll" scroll-x>
          <view class="filter-row">
            <view
              v-for="filter in filters"
              :key="filter"
              :class="{ selected: activeFilter === filter }"
              @tap="activeFilter = filter"
            >
              {{ filter }}
            </view>
          </view>
        </scroll-view>
        <ResourceList
          v-if="category !== 0"
          :type="category"
          :filter="listTab === 0 ? '全部' : activeFilter"
        />
        <view v-else class="medicine-list">
          <MedicineCard v-for="item in filtered" :key="item.id" :item="item" />
          <view v-if="!filtered.length" class="empty-state">
            暂无匹配药械
            <text @tap="activeFilter = '全部'">查看全部药械 ›</text>
          </view>
        </view>
      </view>
    </view>
    <BottomNav current="home" />
  </view>
</template>
<script>
import NativeArt from "../../components/NativeArt.vue";
import ResourceList from "../../components/ResourceList.vue";
import BrandHeader from "../../components/BrandHeader.vue";
import BottomNav from "../../components/BottomNav.vue";
import SearchField from "../../components/SearchField.vue";
import ReferenceArt from "../../components/ReferenceArt.vue";
import MedicineCard from "../../components/MedicineCard.vue";
import AppIcon from "../../components/AppIcon.vue";
import {
  medicines,
  categories,
  departments,
  diseases,
} from "../../data/catalog";
export default {
  components: {
    NativeArt,
    ResourceList,
    BrandHeader,
    BottomNav,
    SearchField,
    ReferenceArt,
    MedicineCard,
    AppIcon,
  },
  data() {
    return {
      categories,
      category: 0,
      query: "",
      hotIndex: 0,
      listTab: 0,
      activeFilter: "全部",
      placeholders: ["芦比替定", "华西乐城医院", "心血管", "乐城特药险"],
    };
  },
  computed: {
    listTabs() {
      return this.category === 0
        ? ["热门药械", "按科室", "按疾病"]
        : this.category === 1
          ? ["热门医院", "按类型", "按科室"]
          : this.category === 2
            ? ["热门专家", "按科室", "按疾病"]
            : ["热门保险", "按地区"];
    },
    keywords() {
      return this.category === 0
        ? ["芦可替尼", "芦比替定", "醋酸艾司利卡西平", "托法替布"]
        : this.category === 1
          ? ["华西乐城医院", "瑞金医院", "博鳌一龄"]
          : this.category === 2
            ? ["心血管", "辅助生殖", "美容整形", "乳腺"]
            : ["乐城特药险", "惠琼保", "沪惠保", "北京"];
    },
    filters() {
      if (this.category === 3) return ["全部", "海南", "江苏", "北京", "浙江"];
      if (this.category === 1)
        return this.listTab === 1
          ? ["全部", "公立", "私立", "综合", "专科"]
          : departments;
      return this.listTab === 1 ? departments : diseases;
    },
    filtered() {
      if (this.listTab === 0 || this.activeFilter === "全部") return medicines;
      return medicines.filter(
        (item) =>
          item.department === this.activeFilter ||
          (this.activeFilter === "肿瘤" && item.department === "肿瘤科"),
      );
    },
  },
  methods: {
    selectCategory(index) {
      this.category = index;
      this.query = "";
      this.hotIndex = 0;
      this.listTab = 0;
      this.activeFilter = "全部";
    },
    chooseKeyword(word, index) {
      this.hotIndex = index;
      this.query = word;
    },
    search() {
      uni.navigateTo({
        url:
          "/pages/catalog/catalog?type=" +
          this.category +
          "&q=" +
          encodeURIComponent(this.query || this.placeholders[this.category]),
      });
    },
    all() {
      uni.navigateTo({ url: "/pages/catalog/catalog?type=" + this.category });
    },
  },
};
</script>
<style scoped>
.home-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 181rpx;
}
.hero {
  height: 408rpx;
  background: linear-gradient(
    180deg,
    #4498ff 0%,
    #4f9cfc 57%,
    #cbe0f7 90%,
    #f6f6f6 100%
  );
  position: relative;
  overflow: hidden;
}
.hero :deep(.brand-header) {
  position: relative;
  z-index: 2;
  opacity: 1;
}
.hero-art {
  position: absolute;
  left: 0;
  top: 174rpx;
}
.home-body {
  margin-top: -93rpx;
  position: relative;
  padding: 0 25rpx;
}
.search-panel {
  border-radius: 23rpx;
  filter: drop-shadow(0 7rpx 7rpx rgba(0, 0, 0, 0.07));
}
.category-tabs {
  height: 66rpx;
  display: flex;
  align-items: stretch;
  background: #e2eeff;
  border-radius: 22rpx 22rpx 0 0;
  margin-top: 0;
}
.category-tab {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 700;
  position: relative;
  z-index: 1;
  padding-bottom: 5rpx;
}
.category-tab.selected {
  color: #3789ff;
  background: #fff;
  border-radius: 22rpx 28rpx 0 0;
  transform: translateY(-8rpx);
  height: 74rpx;
}
.category-tab.selected:after {
  content: "";
  position: absolute;
  right: -22rpx;
  bottom: 0;
  width: 40rpx;
  height: 59rpx;
  background: #fff;
  transform: skew(24deg);
  border-radius: 0 0 0 12rpx;
  z-index: -1;
}
.search-panel-body {
  position: relative;
  z-index: 2;
  background: #fff;
  padding: 52rpx 22rpx 36rpx;
  border-radius: 0 22rpx 22rpx 22rpx;
}
.hot-keywords {
  width: 100%;
  margin-bottom: 32rpx;
  white-space: nowrap;
}
.keyword-row {
  display: flex;
  gap: 13rpx;
  min-width: max-content;
}
.keyword {
  height: 49rpx;
  box-sizing: border-box;
  line-height: 45rpx;
  padding: 0 21rpx;
  border: 2rpx solid #c1ccdb;
  border-radius: 4rpx 29rpx 29rpx 29rpx;
  font-size: 27rpx;
  color: #999;
  flex-shrink: 0;
}
.keyword.selected {
  border-color: #3c88ff;
  background: #f0f7ff;
  color: #3586fb;
}
.license-banner {
  margin: 29rpx auto 0;
  width: 660rpx;
  overflow: hidden;
  border-radius: 20rpx 20rpx 0 0;
}
.catalog-panel {
  background: #fff;
  border-radius: 23rpx 23rpx 0 0;
  position: relative;
  padding: 0 22rpx;
  min-height: 510rpx;
}
.catalog-tabs {
  height: 104rpx;
  display: flex;
  align-items: stretch;
  border-bottom: 1rpx solid #ccc;
  justify-content: space-between;
}
.catalog-tabs > view {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  white-space: nowrap;
  padding: 0 7rpx;
}
.catalog-tabs > view.selected {
  font-weight: 700;
  color: #3587fa;
  font-size: 31rpx;
}
.underline {
  position: absolute;
  bottom: 7rpx;
  left: 50%;
  transform: translateX(-50%);
  height: 5rpx;
  width: 40rpx;
  background: #3789ff;
  border-radius: 2rpx;
}
.catalog-tabs .all-tab {
  margin-left: 12rpx;
  padding-left: 27rpx;
  gap: 3rpx;
}
.all-tab:before {
  content: "";
  position: absolute;
  left: 0;
  top: 18rpx;
  bottom: 18rpx;
  width: 8rpx;
  background: linear-gradient(90deg, #f0f1f3, transparent);
  filter: blur(3rpx);
}
.all-tab .app-icon {
  color: #999;
}
.filter-scroll {
  margin-top: 20rpx;
}
.filter-row {
  display: flex;
  gap: 12rpx;
  white-space: nowrap;
}
.filter-row > view {
  font-size: 24rpx;
  padding: 10rpx 22rpx;
  background: #f4f6f8;
  border-radius: 20rpx;
  color: #78828c;
}
.filter-row > view.selected {
  color: #338bff;
  background: #e9f3ff;
}
.resource-banner {
  height: 90rpx;
  background: linear-gradient(135deg, #88c5ff, #3b88f4);
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #fff;
}
.resource-banner > text {
  font-size: 31rpx;
  font-weight: 800;
  font-style: italic;
}
.resource-banner > view {
  background: #e6f2ff;
  border: 2rpx solid #fff;
  border-radius: 9rpx;
  padding: 5rpx 35rpx;
  color: #333;
  font-size: 23rpx;
}
.resource-banner > view text {
  font-size: 34rpx;
  color: #3585f5;
  font-weight: 800;
}
</style>
