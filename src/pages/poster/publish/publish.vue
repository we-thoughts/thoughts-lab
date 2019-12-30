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
                    <view class="weui-uploader__input-box" v-if="pictures.length < num_of_pics">
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
import PublishPresenter from "../../../presenter/poster/publish.presenter";

import * as Mobius from "../../../libs/mobius";

export default Mobius.page({
  components: {},
  data() {
    return {
      pagetitle: "发布",

      tags: [],
      num_of_publish: 0,
      num_of_pics: 0,

      num_of_myposters: 0,

      tagIndex: 0,
      content: "",
      title: "",
      pictures: [],

      isLoading: false
    };
  },
  onLoad() {
    PublishPresenter.bindPage(this);
    PublishPresenter.subscribe("publish_tags$", tags => {
      this.tags = ["选分类", ...tags];
    });
    PublishPresenter.subscribe("app_config$", config => {
      this.num_of_publish = config.repos["PUBLISH_PERMISSIONS"].num_of_publish;
      this.num_of_pics = config.repos["PUBLISH_PERMISSIONS"].num_of_pics;
    });
    PublishPresenter.subscribe("page_config$", page_config => {
      this.pagetitle = page_config.pagetitle;
    });
    PublishPresenter.subscribe("num_of_myposters$", num_of_myposters => {
      this.num_of_myposters = num_of_myposters;
    });
    PublishPresenter.subscribe("publish_states$", state => {
      console.info("Publish 页面收到 publish state: ", state);
      this.handlePublishState(state);
    });
  },
  onShow() {
    PublishPresenter.refreshMyposters();
  },
  destroyed() {
    PublishPresenter.unsubscribeAll()
  },

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
    chooseImage(e) {
      uni.chooseImage({
        count: this.num_of_pics - this.pictures.length,
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
    checkPublishPoster(poster_info) {
      let { tag, title, content, pictures } = poster_info;
      let res = {};
      // INFO: 第一个 tag 是 “选分类”
      if (!(res["tag"] = this.tags.indexOf(tag) > 0)) {
        return res;
      }
      if (!(res["title"] = title !== "")) {
        return res;
      }
      if (!(res["content"] = content !== "")) {
        return res;
      }
      res["pictures"] = true;
      return res;
    },
    submit(e) {
      this.isLoading = true;
      let tag = this.tags[this.tagIndex];
      let title = e.detail.value.title;
      let content = e.detail.value.content;
      let pictures = [].concat(this.pictures);

      if (
        // 关键内容不准为空
        !this.revisePublishPosterCheckRes(
          this.checkPublishPoster({ tag, title, content, pictures })
        )
      ) {
        this.isLoading = false;
        return;
      }

      PublishPresenter.publishPoster({
        tag,
        title,
        content,
        pictures
      });
    },
    handlePublishState(state) {
      if (state.type === "log" && state.message === "success") {
        uni.showToast({
          title: "🎈 发布成功啦 ~",
          icon: "success",
          duration: 1000
        });
        this.clearContent();
        this.isLoading = false;
        uni.navigateBack();
      }
      if (state.type === "error") {
        switch (state.message) {
          case "not_verified":
            uni.showToast({
              title: `请先进行校园邮箱认证~`,
              icon: "none",
              duration: 1000
            });
            break;
          case "myposters_num_exceeded":
            uni.showToast({
              title: `您最多可以同时发布 ${this.num_of_publish} 条内容~`,
              icon: "none",
              duration: 1000
            });
            break;
          default:
            break;
        }
        this.isLoading = false;
      }
    }
  }
});
</script>

<style>
</style>
