<template name="mobius-pagelayout">
  <view class="mobius-pagelayout">
    <view class="mobius-pagelayout--header">
      <slot name="header"></slot>
    </view>
    <view class="mobius-pagelayout--body">
      <slot name="body"></slot>
    </view>
    <view class="mobius-pagelayout--footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "mobius-pagelayout",
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.mobius-pagelayout {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  // layout
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  .mobius-pagelayout--body {
    position: relative;
    flex: 1 1 auto;
    overflow: scroll;
    // 组件外部通过 slot 插入内容时需要使用 view 容器包裹
    & > view {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      align-items: stretch;
      overflow: scroll;
    }
  }
}
</style>
