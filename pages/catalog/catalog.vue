<template>
  <view class="catalog-page">
    <BrandHeader :title="titles[type]" />
    <view class="search-wrap">
      <SearchField
        v-model="query"
        small
        :focus="focus"
        placeholder="请输入"
        @search="runSearch"
      />
    </view>
    <view class="catalog-filters">
      <view :class="{ active: filterMode === 0 }" @tap="filterMode = 0">
        {{ type === 0 ? "特许药械" : titles[type].replace("搜索", "") }}
      </view>
      <view @tap="toggleFilter(1)">
        {{ type === 3 ? "按地区" : "按科室" }}
        <text class="triangle">⌃</text>
      </view>
      <view v-if="type !== 3" @tap="toggleFilter(2)">
        {{ type === 1 ? "按类型" : "按病种" }}
        <text class="triangle">⌃</text>
      </view>
    </view>
    <view v-if="filterMode" class="options">
      <view
        v-for="option in filterOptions"
        :key="option"
        :class="{ chosen: filter === option }"
        @tap="
          filter = option;
          filterMode = 0;
        "
      >
        {{ option }}
      </view>
    </view>
    <view v-if="type === 0" class="kind-tabs">
      <view :class="{ active: kind === '药品' }" @tap="kind = '药品'">
        药品
      </view>
      <view :class="{ active: kind === '器械' }" @tap="kind = '器械'">
        器械
      </view>
    </view>
    <view v-if="type === 0" class="results">
      <MedicineCard v-for="item in results" :key="item.id" :item="item" />
      <view v-if="!results.length" class="empty-state">
        暂无匹配结果
        <text @tap="reset">清除筛选，查看全部药械</text>
      </view>
    </view>
    <ResourceList
      v-else
      :type="type"
      :query="submittedQuery"
      :filter="filter"
    />
    <view v-if="submittedQuery" class="result-note">
      搜索“{{ submittedQuery }}”
    </view>
  </view>
</template>
<script>
import BrandHeader from "../../components/BrandHeader.vue";
import SearchField from "../../components/SearchField.vue";
import MedicineCard from "../../components/MedicineCard.vue";
import ResourceList from "../../components/ResourceList.vue";
import { medicines, departments, diseases } from "../../data/catalog";
export default {
  components: { BrandHeader, SearchField, MedicineCard, ResourceList },
  data() {
    return {
      type: 0,
      titles: ["药械搜索", "医院搜索", "专家搜索", "保险搜索"],
      query: "",
      submittedQuery: "",
      filterMode: 0,
      filter: "全部",
      kind: "药品",
      focus: false,
    };
  },
  onLoad(params) {
    this.type = Number(params.type || 0);
    this.query = params.q || "";
    this.submittedQuery = this.query;
    this.focus = params.focus === "1";
  },
  computed: {
    filterOptions() {
      return this.type === 3
        ? ["全部", "海南", "北京", "江苏", "浙江", "黑龙江"]
        : this.filterMode === 1
          ? departments
          : diseases;
    },
    results() {
      if (this.kind === "器械") return [];
      return medicines.filter(
        (i) =>
          (!this.submittedQuery ||
            (i.name + i.english)
              .toLowerCase()
              .includes(this.submittedQuery.toLowerCase())) &&
          (this.filter === "全部" ||
            i.department === this.filter ||
            (this.filter === "肿瘤" && i.department === "肿瘤科")),
      );
    },
  },
  methods: {
    runSearch() {
      this.submittedQuery = this.query.trim();
    },
    toggleFilter(n) {
      this.filterMode = this.filterMode === n ? 0 : n;
    },
    reset() {
      this.query = "";
      this.submittedQuery = "";
      this.filter = "全部";
      this.kind = "药品";
    },
  },
};
</script>
<style scoped>
.catalog-page {
  min-height: 100vh;
  background: #fff;
}
.catalog-page :deep(.brand-header) {
  background: #fff;
  height: 105rpx;
}
.search-wrap {
  padding: 0 26rpx 26rpx;
}
.search-wrap :deep(.search-field) {
  height: 66rpx;
  border: 0;
  background: #f4f4f4;
}
.catalog-filters {
  display: flex;
  justify-content: space-around;
  height: 88rpx;
  align-items: center;
  font-size: 28rpx;
}
.triangle {
  font-size: 22rpx;
  padding-left: 4rpx;
}
.kind-tabs {
  display: flex;
  height: 79rpx;
  margin: 0 30rpx;
  border-bottom: 1rpx solid #d9d9d9;
  align-items: center;
  justify-content: space-around;
}
.active {
  font-weight: 600;
}
.results {
  padding: 0 30rpx;
}
.results :deep(.medicine-title) {
  font-size: 28rpx;
}
.results :deep(.medicine-heading) {
  margin-bottom: 30rpx;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  padding: 24rpx;
  background: #f7f9fc;
}
.options view {
  padding: 12rpx 20rpx;
  border-radius: 12rpx;
  background: #fff;
  color: #7e8792;
  font-size: 25rpx;
}
.options .chosen {
  background: #e4f0ff;
  color: #388bff;
}
.result-note {
  text-align: center;
  font-size: 22rpx;
  color: #a7afb7;
  padding: 30rpx;
}
</style>
