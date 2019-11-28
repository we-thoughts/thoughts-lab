<template>
  <base-page-layout>
    <!-- header 区域 -->
    <view slot="header">
      <!-- navbar -->
      <navbar left="capsule" :title="pagetitle" center="title"></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- 头部介绍文字 -->
      <view class="page__hd">
        <view class="page__title">Email</view>
        <view class="page__desc">避免平台校外广告泛滥，同学们需要进行校园邮箱的认证之后才可以发布信息哟~</view>
      </view>

      <!-- 表单区域 -->
      <form @submit="submit">
        <!-- 输入框 -->
        <view class="weui-cells">
          <view class="weui-cell">
            <view class="weui-cell__bd">
              <input
                class="weui-input"
                type="text"
                :placeholder="email_input_placeholder"
                confirm-type="done"
                name="email"
                :value="email"
                @input="__inputChange"
                :disabled="loading"
              />
            </view>
          </view>
        </view>
        <!-- 提示信息 -->
        <view class="mobius-info" v-if="loading">验证邮件已发送至您邮箱，请移步邮箱操作！完成验证之后在个人页面刷新积分即可！{{submit_time}} 秒后可进行下一次更改……</view>
        <!-- 提交按钮 -->
        <view class="weui-btn-area">
          <button
            class="weui-btn weui-btn_primary"
            :class="submitBtnComputedClass"
            type="primary"
            form-type="submit"
            :disabled="input_ui_status === 'disabled' || loading"
          >{{submitBtnTitle}}</button>
        </view>
      </form>
    </view>
  </base-page-layout>
</template>

<script>
// 引入配置文件
import { AppConfigurations } from "../../../basic";
// 引入基础模块
import { createNamespacedHelpers } from "vuex";
// 引入功能模块
import * as SystemModule from "../../../modules/system";

const {
  mapState: mapSelfState,
  mapMutations: mapSelfMutations
} = createNamespacedHelpers("system/verify");
const { pagetitle, EMAIL_VERIFY } = AppConfigurations.getConfigByPath(
  "pages/system/verify"
);
let { app: SystemApp, verify: VerifyPageModule } = SystemModule;

const INPUT_STATUS_DICT = {
  bind: "绑定邮箱",
  verify: "提交验证",
  modify: "提交修改"
};

export default {
  data() {
    return {
      pagetitle: pagetitle || "邮箱验证",
      email_input_placeholder: EMAIL_VERIFY.email_input_placeholder,
      email_suffix: EMAIL_VERIFY.email_suffix,
      email_suffix_invalid_toast_title:
        EMAIL_VERIFY.email_suffix_invalid_toast_title,

      email: "",
      email_changed: false,
      input_status: undefined,
      input_ui_status: "normal",

      loading: false,
      submit_timer: undefined,
      submit_time: 0,

      user_info: null,
      _email: undefined,
      _email_verified: undefined
    };
  },
  computed: {
    ...mapSelfState(["submit_limit_time"]),
    submitBtnTitle() {
      return INPUT_STATUS_DICT[this.input_status];
    },
    submitBtnComputedClass() {
      return `weui-btn_${this.input_ui_status}`;
    }
  },
  async onLoad() {},
  async onShow() {
    this.user_info = await VerifyPageModule.getUserInfo({ fresh: false });
    this.destructUserInfo();
    this.checkInputStatus().checkInputUIStatus();
    this.setSubmitTimer(this.submit_limit_time);
  },
  methods: {
    ...mapSelfMutations(["setSubmitLimitTime"]),
    __inputChange(e) {
      // throttle
      this.email = e.detail.value;
      this.checkInputChange()
        .checkInputStatus()
        .checkInputUIStatus();
    },
    checkInputChange() {
      this.email_changed = this.email !== this._email;
      return this;
    },
    checkInputStatus() {
      if (!this._email) {
        this.input_status = "bind";
        return this;
      }
      if (!this._email_verified) {
        this.input_status = !this.email_changed ? "verify" : "modify";
        return this;
      }
      this.input_status = "modify";
      return this;
    },
    checkInputUIStatus() {
      switch (this.input_status) {
        case "bind":
          this.input_ui_status = this.email === "" ? "disabled" : "normal";
          break;
        case "verify":
          break;
        case "modify":
          this.input_ui_status = !this.email_changed ? "disabled" : "normal";
          break;
        default:
          break;
      }
      console.info(this.input_status, this.input_ui_status);
    },
    async refreshUserInfo() {
      this.user_info = await VerifyPageModule.getUserInfo({ fresh: true });
      this.destructUserInfo();
    },
    destructUserInfo() {
      let { _email, _email_verified } = this.user_info;
      this.email = _email;
      this._email = _email;
      this._email_verified = _email_verified;
    },
    async submit(e) {
      if (this.loading) {
        uni.showToast({
          title: `验证消息已发送至您邮箱，10 分钟内有效，请稍后再试。`,
          icon: "none",
          duration: 1500
        });
        return;
      }
      let email = e.detail.value.email;

      let suffix = email.split("@").slice(-1)[0];
      if (suffix !== this.email_suffix) {
        uni.showToast({
          title: this.email_suffix_invalid_toast_title,
          icon: "none",
          duration: 1500
        });
        return;
      }

      let user = this.user_info;
      await user.setEmail(email, { sendVerificationEmail: true }).catch(err => {
        throw new Error(err);
      });

      uni.showLoading({
        title: "请稍等……"
      });

      this._afterSubmit();

      uni.hideLoading();

      uni.showToast({
        title:
          "验证消息已经发送至您的邮箱，10 分钟内有效，请登录邮箱进行验证操作。",
        icon: "none",
        duration: 2000
      });

      this.setSubmitTimer();
    },
    setSubmitTimer(time) {
      if (time === undefined) {
        this.submit_time = 60;
        this.setSubmitLimitTime({
          limit_time: new Date().getTime() + this.submit_time * 1000
        });
      } else {
        let diff = time - new Date().getTime();
        if (diff > 0) {
          this.submit_time = Math.floor(diff / 1000);
          console.info("diff > 0", this.submit_time);
        } else {
          console.info("diff < 0");
          return;
        }
      }
      this.loading = true;
      this.submit_timer = setInterval(() => {
        --this.submit_time <= 0 &&
          !(this.loading = false) &&
          clearInterval(this.submit_timer);
      }, 1000);
    },
    async _afterSubmit() {
      this.email_changed = false;
      // 刷新 Credit 并同步最新状态
      await this.refreshUserInfo();
      await VerifyPageModule.checkStaticCredit();
      let credit = await VerifyPageModule.getCreditInfo({ fresh: true });
      this.checkInputStatus().checkInputUIStatus();
    }
  }
};
</script>

<style>
page {
  background-color: var(--bg-color_gray);
}
.mobius-info {
  margin-top: 10px;
  padding: 0 16px;
  color: #888888;
  text-align: left;
  font-size: 14px;
}
</style>
