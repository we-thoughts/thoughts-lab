<template name="mobius-loadmore">
  <block>
    <!-- !loading && has_more -->
    <view v-if="type === 'normal'">
      <view class="mobius-loadmore mobius-loadmore--line">
        <view class="mobius-loadmore__tips" @click="__loadMore">{{computedTips.has_more}}</view>
      </view>
    </view>
    <!-- loading -->
    <view v-else-if="type === 'loading'">
      <view class="mobius-loadmore">
        <view class="mobius-loading"></view>
        <view class="mobius-loadmore__tips">{{computedTips.loading}}</view>
      </view>
    </view>
    <!-- !loading && !has_more -->
    <view v-else="type === 'nomore'">
      <view class="mobius-loadmore mobius-loadmore--line">
        <view class="mobius-loadmore__tips">{{computedTips.no_more}}</view>
      </view>
    </view>
  </block>
</template>

<script>
const TIPS = {
  has_more: "✦",
  loading: "正在加载",
  no_more: "没有更多内容啦"
};

export default {
  name: "mobius-loadmore",
  props: {
    type: {
      type: String,
      default: "normal"
    },
    tips: {
      type: Object,
      default: () => {
        return {
          ...TIPS
        };
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    computedTips() {
      return { ...TIPS, ...this.tips };
    }
  },
  methods: {
    __loadMore(e) {
      this.$emit("loadmore", e)
    }
  }
};
</script>

<style>
</style>
