<template>
  <base-page-layout>
    <!-- header 区域 -->
    <view slot="header">
      <!-- navbar -->
      <navbar left="title" :title="pagetitle"></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- section of avatar & intro -->
      <view class="weui-cells weui-cells_after-title">
        <view class="weui-cell">
          <view class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <view class="avatar-wrapper">
              <open-data type="userAvatarUrl"></open-data>
            </view>
          </view>
          <view class="weui-cell__bd">
            <open-data type="userNickName"></open-data>
            <view class="user-intro">不用问，问就是一只小可爱😊</view>
          </view>
        </view>
      </view>
      <!-- section of email & credit -->
      <view class="weui-cells__group weui-cells__group_list">
        <view class="weui-cells">
          <view class="weui-cell weui-cell_access" hover-class="weui-cell_active">
            <view class="weui-cell__hd">
              <image
                :src="icon_paths.email"
                style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"
              />
            </view>
            <view class="weui-cell__bd">{{user_info._email ? user_info._email : "未绑定"}}</view>
            <view
              class="weui-cell__ft weui-cell__ft_in-access"
              @click="navigateToVerifyPage"
            >{{!user_info._email ? "绑定" : !user_info._email_verified ? "验证" : "修改"}}</view>
          </view>
        </view>
      </view>
      <!-- section of log & feedback -->
      <view class="weui-cells__group weui-cells__group_list">
        <view class="weui-cells">
          <!-- part of log -->
          <view class="weui-cell weui-cell_access weui-cell_example" hover-class="weui-cell_active">
            <view class="weui-cell__hd">
              <image
                :src="icon_paths.changelog"
                style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"
              />
            </view>
            <view class="weui-cell__bd">开发日志</view>
            <view class="weui-cell__ft weui-cell__ft_in-access" @click="navigateToChangelog"></view>
          </view>
          <!-- part of todo vote -->
          <view class="weui-cell weui-cell_access weui-cell_example" hover-class="weui-cell_active">
            <view class="weui-cell__hd">
              <image
                :src="icon_paths.todo"
                style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"
              />
            </view>
            <view class="weui-cell__bd">产品社区</view>
            <view class="weui-cell__ft weui-cell__ft_in-access" @click="navigateToTucao">吐个槽</view>
          </view>
          <!-- part of online service -->
          <view class="weui-cell weui-cell_access weui-cell_example" hover-class="weui-cell_active">
            <view class="weui-cell__hd">
              <image
                :src="icon_paths.chat_service"
                style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"
              />
            </view>
            <view class="weui-cell__bd">智能客服</view>
            <label>
              <view class="weui-cell__ft weui-cell__ft_in-access">
                <button hidden open-type="contact"></button>侃一侃
              </view>
            </label>
          </view>
        </view>
      </view>
    </view>

    <!-- footer 区域 -->
    <view slot="footer">
      <view class="mobius-tabbar-height"></view>
    </view>
  </base-page-layout>
</template>

<script>
import ProfilePresenter from "../../../presenter/public/profile.presenter";

import * as Mobius from "../../../libs/mobius";

export default Mobius.page({
  data() {
    return {
      pagetitle: "个人",

      icon_paths: {},
      tucao: {},
      user_info: {}
    };
  },

  computed: {},

  install() {},

  onLoad() {
    ProfilePresenter.bindPage(this);
    ProfilePresenter.subscribe("userinfo$", userinfo => {
      this.user_info = userinfo;
    });
    ProfilePresenter.subscribe("page_config$", page_config => {
      this.pagetitle = page_config.pagetitle;
      this.icon_paths = page_config["ICON_PATHS"];
      this.tucao = page_config["TUCAO"];
    });
  },

  onShow() {},

  destroyed() {
    ProfilePresenter.unsubscribeAll();
  },

  methods: {
    navigateToVerifyPage(e) {
      uni.navigateTo({
        url: `../verify/verify`
      });
    },
    navigateToChangelog() {
      uni.navigateTo({
        url: `../changelog/changelog`
      });
    },
    navigateToTucao() {
      wx.navigateToMiniProgram({
        appId: this.tucao.app_id,
        extraData: {
          id: this.tucao.product_id
        },
        success(res) {},
        fail(res) {}
      });
    }
  }
});
</script>

<style>
.avatar-wrapper {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  overflow: hidden;
}
.user-intro {
  font-size: 13px;
  color: #888888;
}
.iconfont {
  margin: 0 0.2em;
}
</style>
