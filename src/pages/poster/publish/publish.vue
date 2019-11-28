<template>
  <base-page-layout>
    <!-- header 区域 -->
    <view slot="header">
      <!-- navbar -->
      <navbar left="title" center="title" :title="pagetitle"></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- 编辑区域 -->
      <view class="weui-cells__group">
        <view class="weui-cells weui-cells_after-title weui-cells_bottomless">
          <form @submit="submit">
            <!-- 标题输入区域 -->
            <view class="weui-cell weui-cell_select weui-cell_select-before">
              <view class="weui-cell__hd">
                <picker @change="__tagChange" :value="tagIndex" :range="tags">
                  <view class="weui-select">{{tags[tagIndex]}}</view>
                </picker>
              </view>
              <view class="weui-cell__bd weui-cell__bd_in-select-before">
                <input
                  class="weui-input"
                  placeholder="请输入标题"
                  maxlength="20"
                  :value="title"
                  name="title"
                  @blur="(e) => {title = e.detail.value}"
                />
              </view>
            </view>
            <!-- 文本输入区域 -->
            <view class="weui-cell">
              <view class="weui-cell__bd">
                <textarea
                  class="weui-textarea"
                  placeholder="请输入内容"
                  maxlength="400"
                  name="content"
                  v-model="content"
                  style="height: 5em"
                ></textarea>
              </view>
            </view>
            <!-- 图片选择区域 -->
            <view class="weui-cell weui-cell_topless">
              <view class="weui-uploader">
                <view class="weui-uploader__bd">
                  <view class="weui-uploader__files" id="uploaderFiles">
                    <!-- 已选择列表 -->
                    <view
                      class="weui-uploader__file"
                      v-for="(pic, index) in pictures"
                      :key="pic"
                      :data-url="pic"
                      :data-index="index"
                      @click="previewImage"
                      @longtap="deleteImage"
                    >
                      <image class="weui-uploader__file" :src="pic" mode="aspectFill" />
                    </view>
                    <!-- 图片选择器 -->
                    <view class="weui-uploader__input-box" v-if="pictures.length < poster_credit">
                      <view class="weui-uploader__input" @click="chooseImage"></view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!-- 提交按钮 -->
            <view class="weui-btn-area">
              <button
                class="weui-btn weui-btn_primary"
                type="primary"
                :loading="isLoading"
                form-type="submit"
              >提交</button>
            </view>
          </form>
        </view>
      </view>
    </view>

    <!-- footer 区域 -->
    <view slot="footer"></view>
  </base-page-layout>
</template>

<script>
// 引入配置文件
import { AppConfigurations } from "../../../basic";
// 引入基础模块
import * as Mobius from "../../../libs/mobius";
// 引入功能模块
import * as PosterModule from "../../../modules/poster";

const PAGE_CONFIG = AppConfigurations.getConfigByPath("pages/poster/publish");
let { app: PosterApp, publish: Publish } = PosterModule;

export default Mobius.page({
  components: {},
  data() {
    return {
      pagetitle: PAGE_CONFIG.pagetitle || "发布",

      tags: [],
      poster_credit: 0,
      myposter_length: 0,

      tagIndex: 0,
      content: "",
      title: "",
      pictures: [],

      isLoading: false
    };
  },
  async onLoad(query) {
    this.myposter_length = query["myposter_length"];
    this.poster_credit = await Publish.getPosterCredit({ fresh: true });
    this.tags = ["选分类"].concat(Publish.getPublishTags());
  },
  async onShow() {},

  methods: {
    clearContent() {
      this.tagIndex = 0;
      this.title = "";
      this.content = "";
      this.pictures = [];
    },
    // 视图操作
    __tagChange(e) {
      this.tagIndex = e.detail.value;
    },
    async chooseImage(e) {
      uni.chooseImage({
        count: this.poster_credit - this.pictures.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          this.pictures = this.pictures.concat(tempFilePaths);
        }
      });
    },
    previewImage(e) {
      let { url } = e.currentTarget.dataset;
      uni.previewImage({
        urls: this.pictures,
        current: url,
        success: res => {}
      });
    },
    deleteImage(e) {
      let { index } = e.currentTarget.dataset;
      uni.showActionSheet({
        itemList: ["删除这张图片"],
        success: res => {
          this.pictures.splice(index, 1);
        },
        fail: res => {}
      });
    },
    // poster 提交流程
    revisePosterCreditCheckRes(credit_check_res) {
      let {
        poster_credit,
        no_poster_credit,
        lack_poster_credit
      } = credit_check_res;
      if (no_poster_credit) {
        uni.showToast({
          title: `请先进行校园邮箱认证~`,
          icon: "none",
          duration: 1000
        });
        return false;
      }
      if (lack_poster_credit) {
        uni.showToast({
          title: `您最多可以同时发布 ${poster_credit} 条内容~`,
          icon: "none",
          duration: 1000
        });
        return false;
      }
      return true;
    },
    revisePublishPosterCheckRes(poster_check_res) {
      let { tag, title, content, pictures } = poster_check_res;
      if (!tag) {
        uni.showToast({
          title: "请选择分类 ~",
          icon: "none",
          duration: 1000
        });
        return false;
      }
      if (!title) {
        uni.showToast({
          title: "请输入标题 ~",
          icon: "none",
          duration: 1000
        });
        return false;
      }
      if (!content) {
        uni.showToast({
          title: "请输入内容 ~",
          icon: "none",
          duration: 1000
        });
        return false;
      }
      if (!pictures) {
        return false;
      }
      return true;
    },
    async submit(e) {
      this.isLoading = true;
      let tag = this.tags[this.tagIndex];
      let title = e.detail.value.title;
      let content = e.detail.value.content;
      let pictures = [].concat(this.pictures);

      if (
        // 检查内容是否合格
        !this.revisePublishPosterCheckRes(
          Publish.checkPublishPoster({ tag, title, content, pictures })
        ) ||
        // 检查发布额度
        !this.revisePosterCreditCheckRes(
          await Publish.checkPosterCredit(this.myposter_length)
        )
      ) {
        this.isLoading = false;
        return;
      }

      Publish.publishPoster({ tag, title, content, pictures }).then(
        res => {
          uni.showToast({
            title: "🎈 发布成功啦 ~",
            icon: "success",
            duration: 1000
          });
          this.afterSubmit();
        },
        err => {
          return new Error(err);
        }
      );
    },
    afterSubmit() {
      this.isLoading = false;
      this.clearContent();
      PosterApp.markMyposterChange({ change_type: "add" });
      uni.navigateBack();
    }
  }
});
</script>

<style>
</style>
