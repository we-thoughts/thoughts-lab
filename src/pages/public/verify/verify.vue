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
                :disabled="input_ui_status === 'disabled'"
              />
            </view>
          </view>
        </view>
        <!-- 提示信息 -->
        <view
          class="mobius-info"
          v-if="submit_cooldown > 0"
        >验证邮件已发送至您邮箱，请移步邮箱操作！完成验证之后即可解锁相关权限！{{submit_cooldown}} 秒后可进行下一次更改……</view>
        <!-- 提交按钮 -->
        <view class="weui-btn-area">
          <button
            class="weui-btn weui-btn_primary"
            :class="submitBtnComputedClass"
            type="primary"
            form-type="submit"
            :disabled="submit_btn_status === 'disabled'"
          >{{submitBtnTitle}}</button>
        </view>
      </form>
    </view>
  </base-page-layout>
</template>

<script>
import VerifyPresenter from "../../../presenter/public/verify.presenter";

const INPUT_STATUS_DICT = {
  bind: "绑定邮箱",
  verify: "提交验证",
  modify: "提交修改"
};

export default {
  data() {
    return {
      pagetitle: "邮箱验证",
      email_input_placeholder: "请输入 CUC 邮箱",
      email_suffix: "cuc.edu.cn",
      email_suffix_invalid_toast_title: "必须是中国传媒大学的邮箱噢！",

      email: "",
      email_changed: false,
      input_status: undefined,

      input_ui_status: "normal",
      submit_btn_status: "normal",

      submit_cooldown: 0,

      _email: undefined,
      _email_verified: undefined
    };
  },
  computed: {
    submitBtnTitle() {
      return INPUT_STATUS_DICT[this.input_status];
    },
    submitBtnComputedClass() {
      return `weui-btn_${this.input_ui_status}`;
    }
  },
  onLoad() {
    VerifyPresenter.bindPage(this);
    VerifyPresenter.subscribe("page_config$", page_config => {
      this.pagetitle = page_config.pagetitle;
      let {
        email_input_placeholder,
        email_suffix,
        email_suffix_invalid_toast_title
      } = page_config["EMAIL_VERIFY"];
      this.email_input_placeholder = email_input_placeholder;
      this.email_suffix = email_suffix;
      this.email_suffix_invalid_toast_title = email_suffix_invalid_toast_title;
    });
    VerifyPresenter.subscribe("userinfo$", userinfo => {
      let { _email, _email_verified } = userinfo;
      this.email = _email;
      this._email = _email;
      this._email_verified = _email_verified;

      this.checkInputStatus().checkSubmitBtnStatus();
    });
    VerifyPresenter.subscribe("email_input_status$", statu => {
      this.input_ui_status = statu;
    });
    VerifyPresenter.subscribe("submit_btn_status$", statu => {
      this.submit_btn_status = statu;
    });
    VerifyPresenter.subscribe("email_submit_states$", state => {
      if (state === "start") {
        uni.showLoading({
          title: "请稍等……"
        });
      }
      if (state === "success") {
        uni.hideLoading();
        this.email_changed = false;
        uni.showToast({
          title:
            "验证消息已经发送至您的邮箱，10 分钟内有效，请登录邮箱进行验证操作。",
          icon: "none",
          duration: 2000
        });
      }
    });
    VerifyPresenter.subscribe("set_user_email_cooldown$", val => {
      this.submit_cooldown = val;
    });
  },
  onShow() {},
  destroyed() {
    VerifyPresenter.unsubscribeAll();
  },
  methods: {
    __inputChange(e) {
      let email = e.detail.value.email;
      // throttle
      this.email = email;
      this.checkInputChange()
        .checkInputStatus()
        .checkSubmitBtnStatus();
      VerifyPresenter.emailChangeTo(email);
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
    checkSubmitBtnStatus() {
      switch (this.input_status) {
        case "bind":
          this.submit_btn_status = this.email === "" ? "disabled" : "normal";
          break;
        case "verify":
          break;
        case "modify":
          this.submit_btn_status = !this.email_changed ? "disabled" : "normal";
          break;
        default:
          break;
      }
      console.info("页面检验：", this.input_status, this.submit_btn_status);
    },
    submit(e) {
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

      VerifyPresenter.setUserEmail({ email, sendVerificationEmail: true });
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
