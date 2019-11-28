<template>
  <view class="mobius-scrolllist">
    <!-- 滚动容器 -->
    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      :upper-threshold="10"
      :lower-threshold="lower_threshold"
      scroll-with-animation="true"
      enable-back-to-top="true"
      class="mobius-scrolllist__scrollview"
      @scrolltolower="__scrolltolower"
      @scrolltoupper="__scrolltoupper"
    >
      <!-- 项目列表 -->
      <view>
        <slot></slot>
      </view>
      <!-- 加载更多 -->
      <loadmore :type="loadmore_type" :tips="loadmore_tips" @loadmore="__loadMore"></loadmore>
    </scroll-view>
  </view>
</template>

<script>
import loadmore from "../mobius-loadmore/mobius-loadmore";
export default {
  name: "mobius-scrolllist",
  components: {
    loadmore
  },
  props: {
    scroll_top: {
      type: Number,
      default: 0
    },
    lower_threshold: {
      type: Number,
      default: 50
    },
    upper_threshold: {
      type: Number,
      default: 3
    },
    loadmore_type: {
      type: String,
      default: "normal"
    },
    loadmore_tips: {
      typs: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    scrollTop() {
      return this.scroll_top;
    }
  },
  created() {},
  mounted() {},
  methods: {
    __scrolltolower(e) {
      this.$emit("scrolltolower", e);
    },
    __scrolltoupper(e) {
      this.$emit("scrolltoupper", e);
    },
    __loadMore(e) {
      this.$emit("loadmore", e);
    }
  }
};
</script>

<style>
:host {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  margin: 0 !important;
}
</style>
