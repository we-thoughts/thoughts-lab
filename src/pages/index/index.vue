<template>
  <view>
    <view>
      <text class="test">&#xe600;</text>
      <text class="test">&#xe687;</text>
      <text class="test">&#xe60b;</text>
    </view>
    {{text}}
    <view @click="click">点我</view>
  </view>
</template>

<script>
let page = {
  data() {
    return {
      text: 1111111
    };
  },
  methods: {
    click() {
      this.text = 222222;
    }
  }
};
export default page;
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("https://at.alicdn.com/t/font_865816_17gjspmmrkti.ttf")
    format("truetype");
}
.test {
  font-family: iconfont;
  margin-left: 20rpx;
}
</style>
