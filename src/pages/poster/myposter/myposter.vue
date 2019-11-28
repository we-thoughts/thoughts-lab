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
// 引入配置文件
import { AppConfigurations } from "../../../basic";
// 引入基础模块
import { createNamespacedHelpers } from "vuex";
import * as Mobius from "../../../libs/mobius";
// 引入功能模块
import * as PosterModule from "../../../modules/poster";

const {
  mapState: mapSelfState,
  mapMutations: mapSelfMutations
} = createNamespacedHelpers("poster/myposter");
const PAGE_CONFIG = AppConfigurations.getConfigByPath("pages/poster/myposter");
let { app: PosterApp, myposter: MyPoster } = PosterModule;

export default Mobius.page({
  components: {
    // myPosterCard
  },
  data() {
    return {
      pagetitle: PAGE_CONFIG.pagetitle || "我的发布",
      capsule: {
        vice: {
          icon: PAGE_CONFIG.capsule_vice_icon
        }
      },

      myposters: []
    };
  },
  computed: {
    ...mapSelfState(["has_myposter_changed", "myposter_changed_payloads"])
  },
  async onLoad() {
    this._loadMyposters();
  },
  async onShow() {
    this.refreshMyposterList();
  },
  methods: {
    ...mapSelfMutations(["resetMyposterChange"]),
    __navbarCapsuleViceClick(e) {
      uni.navigateTo({
        url: `../publish/publish?myposter_length=${this.myposters.length}`
      });
    },
    async _loadMyposters() {
      this.myposters = await MyPoster.getMyPosters({ fresh: false });
    },
    async refreshMyposterList() {
      if (!this.has_myposter_changed) return;
      let {
        has_poster_changed,
        has_new_poster
      } = await MyPoster.revisePosterChanged(this.myposter_changed_payloads);
      if (has_poster_changed) {
        this._loadMyposters();
      }
      if (has_new_poster) {
        this.myposters = await MyPoster.getMyPosters({ fresh: true });
      }
      this.resetMyposterChange();
    },
    // poster 删除流程
    async deletePoster(e) {
      let { id } = e;
      uni.showModal({
        title: "提示",
        content: "确认删除吗？🧐",
        success: res => {
          if (res.confirm) {
            MyPoster.deleteMyPosterById(id).then(
              () => {
                this.afterDelete({ id: id });
              },
              err => {
                uni.showToast({
                  title: "😔 删除失败啦",
                  icon: "none",
                  duration: 1000
                });
                return new Error(err);
              }
            );
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    afterDelete(data) {
      let { id } = data;
      PosterApp.markMyposterChange({ change_type: "delete", id: id });
      this.refreshMyposterList();
    }
  }
});
</script>

<style>
</style>
