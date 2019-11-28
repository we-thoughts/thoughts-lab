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
          <view
            class="weui-cell weui-cell_access"
            hover-class="weui-cell_active"
            @click="__showCreditInfoTip"
          >
            <view class="weui-cell__hd">
              <image
                :src="icon_paths.poster_credit"
                style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"
              />
            </view>
            <view class="weui-cell__bd mobius-layout-flex">
              <iconfont class="iconfont" v-for="(item) in creditArray" :key="index" name="shuye"></iconfont>
            </view>
            <view
              v-if="can_credit_updated === true"
              class="weui-cell__ft weui-cell__ft_in-access"
              @click.stop="__handlePosterCreditRefresh"
            >{{poster_credit_refresh_time > 0 ? poster_credit_refresh_time : "刷新"}}</view>
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
// 引入配置文件
import { AppConfigurations } from "../../../basic";
// 引入基础模块
import { createNamespacedHelpers } from "vuex";
import * as Mobius from "../../../libs/mobius";
// 引入功能模块
import * as SystemModule from "../../../modules/system";

const {
  mapState: mapSelfState,
  mapMutations: mapSelfMutations
} = createNamespacedHelpers("system/profile");
const { pagetitle, ICON_PATHS } = AppConfigurations.getConfigByPath(
  "pages/system/profile"
);
let { profile: Profile } = SystemModule;

export default Mobius.page({
  data() {
    return {
      pagetitle: pagetitle || "个人",

      icon_paths: ICON_PATHS,
      credit_info: {},
      user_info: {},

      can_credit_updated: false,
      poster_credit_refresh_timer: undefined,
      poster_credit_refresh_time: 0
    };
  },

  computed: {
    ...mapSelfState(["has_email_changed"]),
    posterCredit() {
      return this.credit_info.poster_credit;
    },
    creditArray() {
      return new Array(this.posterCredit);
    }
  },

  async install() {},

  async onShow() {
    this.user_info = await Profile.getUserInfo({ fresh: false });
    // await 以避免同时造成两次 ”首次 Credit 请求” 导致的条目冲突问题
    this.credit_info = await Profile.getCreditInfo({ fresh: false });
    this.can_credit_updated = await Profile.canCreditUpdated();
  },

  methods: {
    ...mapSelfMutations(["resetEmailChange"]),
    navigateToVerifyPage(e) {
      uni.navigateTo({
        url: `../verify/verify`
      });
    },
    __showCreditInfoTip(e) {
      uni.showToast({
        title: `你可以发布 ${this.posterCredit} 条 Poster`,
        icon: "none",
        duration: 1500
      });
    },
    async refreshPosterCredit() {
      this.user_info = await Profile.getUserInfo({ fresh: true });
      await Profile.checkStaticCredit();
      this.credit_info = await Profile.getCreditInfo({ fresh: true });
      this.can_credit_updated = await Profile.canCreditUpdated();
    },
    async __handlePosterCreditRefresh(e) {
      if (this.poster_credit_refresh_time > 0) {
        uni.showToast({
          title: `容土豆服务器喘口气哈 ~`,
          icon: "none",
          duration: 1500
        });
        return;
      }

      await this.refreshPosterCredit();

      this.poster_credit_refresh_time = 30;
      this.poster_credit_refresh_timer = setInterval(() => {
        --this.poster_credit_refresh_time <= 0 &&
          clearInterval(this.poster_credit_refresh_timer);
      }, 1000);
    },
    navigateToChangelog() {
      uni.navigateTo({
        url: `../changelog/changelog`
      });
    },
    navigateToTucao() {
      wx.navigateToMiniProgram({
        appId: "wx8abaf00ee8c3202e",
        extraData: {
          id: "102267"
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
