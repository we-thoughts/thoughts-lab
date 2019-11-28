<template name="mobius-wxnavbar">
  <!--components/base/navigation-bar/navigation-bar.wxml-->
  <block>
    <view
      class="mobius-wxnavbar"
      :class="navbarThemeComputedClassStr"
      :style="navbarComputedStyleStr"
      @click="__navbarClick"
    >
      <!-- 左侧 -->
      <view class="mobius-wxnavbar__left">
        <!-- 默认标题样式 -->
        <block v-if="left === 'title'">
          <view v-if="ifBackBtnShow" @click="__navigateBack" class="mobius-wxnavbar__backbtn"></view>
          <view v-if="!ifBackBtnShow" class="mobius-wxnavbar__title">{{navTitle}}</view>
        </block>
        <!-- 胶囊样式 -->
        <block v-else-if="left === 'capsule'">
          <wx-capsule
            :back="ifBackBtnShow"
            :theme="theme"
            :plain="plain"
            :main="capsule.main"
            :vice="capsule.vice"
            @singleClick="__capsuleSingleClick"
          ></wx-capsule>
        </block>
        <!-- 自定义 slot -->
        <block v-else-if="left === 'custom'">
          <slot name="left"></slot>
        </block>
      </view>
      <!-- 中间 -->
      <view class="mobius-wxnavbar__center">
        <!-- 标题样式 -->
        <block v-if="center === 'title'">
          <view class="mobius-wxnavbar__title">{{navTitle}}</view>
        </block>
        <!-- 自定义 slot -->
        <block v-else-if="center === 'custom'">
          <slot name="center"></slot>
        </block>
      </view>
      <!-- 右侧 -->
      <view class="mobius-wxnavbar__right"></view>
    </view>
    <!-- shadow of navbar 支撑页面 -->
    <view v-if="fixed" :style="navbarComputedStyleStr"></view>
  </block>
</template>

<script>
import wxCapsule from "../mobius-wxcapsule/mobius-wxcapsule";
let last_click_timestamp = 0;
function ifDoubleClick(e) {
  let during = e.timeStamp - last_click_timestamp;
  last_click_timestamp = e.timeStamp;
  if (during < 300) {
    last_click_timestamp = 0;
    return true;
  }
  return false;
}

export default {
  name: "mobius-wxnavbar",
  components: {
    wxCapsule
  },
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: "default"
    },
    plain: {
      type: Boolean,
      default: false
    },
    left: {
      type: String,
      default: "title"
    },
    title: {
      type: String,
      default: ""
    },
    capsule: {
      type: Object
    },
    center: {
      type: String
    },
    back: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page_route: "",
      navbar_rect: null
    };
  },
  computed: {
    ifBackBtnShow() {
      return this.back && getCurrentPages().length > 1;
    },
    navbarThemeComputedClassStr() {
      let classes = [];
      classes.push("mobius-wxnavbar--theme_" + this.theme);
      if (this.plain) {
        classes.push("mobius-wxnavbar--theme_plain");
      }
      if (this.fixed) {
        classes.push("mobius-wxnavbar--position_fixed");
      }
      return classes.join(" ");
    },
    navbarComputedStyleStr() {
      return `
        padding-top: ${this.navbar_rect.navbar_padding_top}px;
        padding-left: ${this.navbar_rect.navbar_padding_right}px;
        padding-right: ${this.navbar_rect.navbar_padding_left}px;
        height: ${this.navbar_rect.navbar_height}px;
      `;
    },
    navTitle() {
      return this.title;
    }
  },
  watch: {},
  created() {
    this._initTitle();
    this._adjustSize();
  },
  mounted() {},
  methods: {
    _initTitle() {
      this.page_route = getCurrentPages().slice(-1)[0].route;
      if ((this.left === "title" || this.center === "title") && !this.title) {
        this.title = this.page_route
          .split("/")
          .slice(-1)[0]
          .replace(/^\S/g, function(s) {
            return s.toUpperCase();
          });
      }
    },
    _adjustSize() {
      let { windowWidth, statusBarHeight } = uni.getSystemInfoSync();
      let {
        width,
        height,
        top,
        right,
        bottom,
        left
      } = uni.getMenuButtonBoundingClientRect();
      let res = {
        statusBarHeight: statusBarHeight,
        navbar_height: top - statusBarHeight + bottom,
        navbar_padding_top: statusBarHeight,
        navbar_padding_right: windowWidth - right,
        navbar_padding_left: windowWidth - right,
        capsule_btn_width: width / 2,
        capsule_btn_height: height
      };
      this.navbar_rect = res;
    },
    __navigateBack() {
      uni.navigateBack();
    },
    __capsuleSingleClick(e) {
      let { type } = e;
      type === "main" && this.$emit("capsuleMainClick", e);
      type === "vice" && this.$emit("capsuleViceClick", e);
      this.$emit("capsuleSingleClick", e);
    },
    __navbarClick(e) {
      ifDoubleClick(e) && this.$emit("doubleClick", e);
    }
  }
};
</script>

<style>
:host {
  display: block;
}
</style>
