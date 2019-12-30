<template>
  <base-page-layout>
    <!-- header 区域 -->
    <view slot="header">
      <!-- navbar -->
      <navbar
        left="capsule"
        :capsule="capsule"
        :title="pagetitle"
        center="title"
        @capsuleViceClick="__navbarCapsuleViceClick"
      ></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- 用户发布列表  -->
      <view class="mobius-wxlisttitle">我发布的海报</view>
      <view class="mobius-summarylist compact marginyless">
        <myposter-card
          v-for="(poster, index) in myposters"
          :poster="poster"
          :key="index"
          @posterDelete="deletePoster"
        ></myposter-card>
      </view>
      <!-- TODO: 用户预约列表 -->
    </view>

    <!-- footer 区域 -->
    <view slot="footer">
      <view class="mobius-tabbar-height"></view>
    </view>
  </base-page-layout>
</template>

<script>
import MyposterPresenter from "../../../presenter/poster/myposter.presenter";

import * as Mobius from "../../../libs/mobius";

export default Mobius.page({
  components: {
    // myPosterCard
  },
  data() {
    return {
      pagetitle: "我的发布",
      capsule: {
        vice: {
          icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iO1YFIMFSA4N9zf.png"
        }
      },

      myposters: []
    };
  },
  computed: {},
  onLoad() {
    MyposterPresenter.bindPage(this);
    MyposterPresenter.subscribe("page_config$", page_config => {
      let { pagetitle, capsule_vice_icon } = page_config;
      this.pagetitle = pagetitle;
      this.capsule.vice.icon = capsule_vice_icon;
    });
    MyposterPresenter.subscribe("myposters$", myposters => {
      this.myposters = myposters;
    });
    MyposterPresenter.subscribe("delete_states$", state => {
      if (state.type === "log" && state.message === "success") {
        uni.showToast({
          title: "删除成功",
          icon: "success",
          duration: 1000
        });
      }
    });
    MyposterPresenter.getMyposters();
  },
  onShow() {
    MyposterPresenter.refreshMyposters();
  },
  destroyed() {
    MyposterPresenter.unsubscribeAll();
  },
  methods: {
    __navbarCapsuleViceClick(e) {
      uni.navigateTo({
        url: `../publish/publish`
      });
    },
    // poster 删除流程
    deletePoster(e) {
      let { id } = e;
      uni.showModal({
        title: "提示",
        content: "确认删除吗？🧐",
        success: res => {
          if (res.confirm) {
            MyposterPresenter.deletePoster(id);
          } else if (res.cancel) {
            return;
          }
        }
      });
    }
  }
});
</script>

<style>
</style>
