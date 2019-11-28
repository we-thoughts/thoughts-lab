<template name="mobius-wxcapsule">
  <view
    class="mobius-wxcapsule"
    :class="capsuleThemeComputedClassStr"
    :style="capsuleComputedStyleStr"
  >
    <view
      v-if="main"
      class="mobius-wxcapsule__btn"
      hover-class="mobius-wxcapsule__btn--hover"
      :style="capsuleBtnComputedStyleStr"
      @click.stop="mainClick"
    >
      <image class="mobius-wxcapsule__image" :src="main.icon" />
    </view>
    <view
      v-if="ifBackBtnShow"
      class="mobius-wxcapsule__btn"
      hover-class="mobius-wxcapsule__btn--hover"
      :style="capsuleBtnComputedStyleStr"
      @click.stop="__navigateBack"
    >
      <view class="mobius-wxcapsule__btn--back"></view>
    </view>
    <view
      v-if="vice"
      class="mobius-wxcapsule__btn"
      hover-class="mobius-wxcapsule__btn--hover"
      :style="capsuleBtnComputedStyleStr"
      @click.stop="viceClick"
    >
      <image class="mobius-wxcapsule__image" :src="vice.icon" />
    </view>
  </view>
</template>

<script>
export default {
  name: "mobius-wxcapsule",
  props: {
    theme: {
      type: String,
      default: "default"
    },
    plain: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: true
    },
    main: {
      type: Object
    },
    vice: {
      type: Object
    }
  },
  data() {
    return {
      capsule_btn_width: 43.5,
      capsule_btn_height: 32
    };
  },
  computed: {
    ifBackBtnShow() {
      return this.back;
    },
    capsuleThemeComputedClassStr() {
      let classes = [];
      classes.push("mobius-wxcapsule--theme_" + this.theme);
      if (this.plain) {
        classes.push("mobius-wxcapsule--theme_plain");
      }
      return classes.join(" ");
    },
    capsuleBtnComputedStyleStr() {
      return `
        width: ${this.capsule_btn_width}px;
      `;
    },
    capsuleComputedStyleStr() {
      return `
        height: ${this.capsule_btn_height}px;
      `;
    }
  },
  created() {
    this._adjustSize();
  },
  mounted() {},
  methods: {
    __navigateBack() {
      uni.navigateBack();
    },
    _adjustSize() {
      // https://res.wx.qq.com/wxdoc/dist/assets/img/13titlebar.61fd0811.jpg
      let { width, height } = uni.getMenuButtonBoundingClientRect();
      this.capsule_btn_width = width / 2;
      this.capsule_btn_height = height;
    },
    mainClick(e) {
      e.type = "main";
      this.$emit("mainClick", e);
      this.$emit("singleClick", e);
    },
    viceClick(e) {
      e.type = "vice";
      this.$emit("viceClick", e);
      this.$emit("singleClick", e);
    }
  }
};
</script>

<style>
</style>
