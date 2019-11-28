<template name="timeline-item">
  <!-- time -->
  <view v-if="type === 'time'" class="mobius-timeline__time">{{content}}</view>
  <!-- segment -->
  <view v-else-if="type === 'segment'" class="mobius-timeline__segment">
    <view class="mobius-timeline__text">{{content}}</view>
  </view>
  <!-- 其它模块 -->
  <view v-else class="mobius-timeline__item" :class="computedTimelineItemClassStr">
    <!-- versioncard -->
    <view v-if="type === 'versioncard'" class="mobius-timeline__card" :class="type">
      <view v-if="content.version && content.timestamp" class="mobius-timeline__card-top">
        <view class="mobius-timeline__tag" :class="computedTimelineTagClassStr">{{content.version}}</view>
        <view class="mobius-timeline__timestamp">{{content.timestamp}}</view>
      </view>
      <view class="mobius-timeline__card-body mobius-timeline__list">
        <view v-for="item in content.list" :key="index" class="mobius-timeline__list-item">{{item}}</view>
      </view>
    </view>
  </view>
</template>

<script>
const FLAG_DICT = {
  update: {
    iconname: "radiobox--fill",
    colorname: "success"
  },
  bugfix: {
    iconname: "bug",
    colorname: "error"
  }
};

export default {
  name: "timeline-item",
  props: {
    type: {
      type: String
    },
    content: {}
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    computedTimelineItemClassStr() {
      if (!this.content.flag) return "";
      return `mobius-iconfont__${FLAG_DICT[this.content.flag].iconname} mobius-color__${FLAG_DICT[this.content.flag].colorname}`;
    },
    computedTimelineTagClassStr() {
      if (!this.content.flag) return "";
      return `mobius-bgcolor__${FLAG_DICT[this.content.flag].colorname}`;
    }
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style>
</style>
