<template name="poster-card">
  <view
    class="mobius-summaryitem"
    key="id"
    :data-index="index"
    :data-id="poster.id"
    @click="clickHandler"
  >
    <view class="mobius-summaryitem__head">
      <view class="mobius-summaryitem__title">{{poster.title}}</view>
    </view>
    <view class="mobius-summaryitem__body">
      <view
        class="mobius-summaryitem__desc"
        @click="isActive = !isActive"
        :class="{'mobius-summaryitem__desc--activated_yes': isActive}"
      >{{poster.content}}</view>
    </view>
    <view class="mobius-summaryitem__footer">
      <view class="mobius-summaryitem__timestamp">{{humanizeDate}}</view>
      <block v-if="poster.pictures.length > 0">
        <view class="mobius-summaryitem__link" @click="previewImage">查看图片</view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  name: "poster-card",
  props: {
    poster: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      isActive: false
    };
  },
  computed: {
    humanizeDate() {
      return this.$utils.Date.humanize(this.poster.created_at * 1000);
    },
    pictures() {
      return this.poster.pictures.map(pic => {
        return pic.path;
      });
    }
  },
  created() {},
  watch: {},
  methods: {
    clickHandler(e) {
      let { index, id } = e.currentTarget.dataset;
      this.$emit("posterClick", { index, id });
    },
    previewImage(e) {
      uni.previewImage({
        current: this.pictures[0], // 当前显示图片的http链接
        urls: this.pictures // 需要预览的图片http链接列表
      });
    }
  }
};
</script>

<style>
</style>
