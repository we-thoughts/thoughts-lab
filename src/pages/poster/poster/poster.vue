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
        @capsuleMainClick="__navbarCapsuleMainClick"
        @doubleClick="__navbarDoubleClick"
      ></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- poster 标签栏 -->
      <tagbar
        :show="tagbar_show"
        :tags="poster_tags"
        type="multi"
        :selected="selected_tags"
        @tagsChange="__tagsChange"
      ></tagbar>

      <!-- poster 列表 -->
      <scrolllist
        :scroll_top="scroll_top"
        :loadmore_type="loadmore_type"
        :loadmore_tips="loadmore_tips"
        class="mobius-summarylist"
        @scrolltolower="__scrolltolower"
        @scrolltoupper="__scrolltoupper"
        @loadmore="__scrolllistLoadmore"
      >
        <poster-card
          v-for="(poster, index) in posters"
          :poster="poster"
          :index="index"
          :key="index"
          @posterClick="__posterClick"
        />
      </scrolllist>
    </view>

    <!-- footer 区域 -->
    <view slot="footer">
      <view class="mobius-tabbar-height"></view>
    </view>
  </base-page-layout>
</template>

<script>
import PosterPresenter from "../../../presenter/poster/poster.presenter";

import * as Mobius from "../../../libs/mobius";

export default Mobius.page({
  components: {
    // posterCard,
    // loadmore
  },
  data: function() {
    return {
      pagetitle: "列表",
      capsule: {
        main: {
          icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iL8N7ythebKRzx6.png"
        }
      },
      poster_tags: [],
      selected_tags: [],
      tagbar_show: false,

      posters: [],
      scroll_top: 0,
      loadmore_type: "normal",
      loadmore_tips: {
        has_more: "加载更多"
      }
    };
  },
  watch: {
    posters(newposters, oldposters) {
      if (newposters.length <= 5) {
        this.loadmore_tips["has_more"] = "点击加载更多";
      } else {
        this.loadmore_tips["has_more"] = "上拉加载更多";
      }
      // TODO: 当某一分类 poster 数目为 0 的时候为空白列表添加点缀
    },
    selected_tags(newtags, oldtags) {
      if (newtags.length === 0) {
        // TODO: 为空白列表添加点缀, etc. 展示“啥都不想看”动态背景
        return;
      }
    },
    loadmore_type(new_type) {
      if (new_type === "nomore") {
        uni.showToast({
          title: `没有更多内容了~`,
          icon: "none",
          duration: 1500
        });
      }
    }
  },

  computed: {},

  created() {},

  methods: {
    /****************
     *    事件处理
     ****************/
    // 导航栏事件
    __navbarCapsuleMainClick(e) {
      console.info("__navbarCapsuleMainClick", e);
      this.tagbar_show = !this.tagbar_show;
    },
    __navbarDoubleClick(e) {
      console.info("navbarDoubleClick", e);
      this.scroll_top = this.scroll_top === -1 ? -2 : -1;
    },
    // 标签栏事件
    __tagsChange(e) {
      console.info("Poster 页面 selected_tags change to: ", e.selected_tags);
      this.selected_tags = e.selected_tags;
      PosterPresenter.tagsChangeTo(e.selected_tags);
    },
    // 滚动列表事件
    __scrolltolower(e) {
      console.info("ListReachBottom");
      PosterPresenter.getOlderPosters();
    },
    __scrolltoupper(e) {
      console.info("ListReachTop");
    },
    __scrolllistLoadmore(e) {
      PosterPresenter.getOlderPosters();
    },
    // poster 事件
    __posterClick: function(e) {
      let { index, id } = e;
      console.info(index, id);
    }
    /****************
     *    业务处理
     ****************/
    /****************
     *    交互处理
     ****************/
  },

  onLoad() {
    PosterPresenter.bindPage(this);
    PosterPresenter.subscribe("page_config$", page_config => {
      let { pagetitle, capsule_main_icon } = page_config;
      this.pagetitle = pagetitle;
      this.capsule.main.icon = capsule_main_icon;
    });
    PosterPresenter.subscribe("loading_states$", type => {
      this.loadmore_type = type;
    });
    PosterPresenter.subscribe("posters$", posters => {
      this.posters = posters;
      uni.stopPullDownRefresh();
    });
    PosterPresenter.subscribe("poster_tags$", tags => {
      this.poster_tags = tags;
    });
    PosterPresenter.subscribe("initial_poster_tags$", tags => {
      this.selected_tags = tags;
    });
    PosterPresenter.getInitialPosters();
  },

  onShow() {
    PosterPresenter.refreshPosters();
  },

  onReady() {},

  onPullDownRefresh() {
    console.info("PagePullDownRefresh");
    PosterPresenter.getNewerPosters();
    // TODO: 改为通过子组件方法控制
    this.scroll_top = this.scroll_top === -1 ? -2 : -1;
  },

  onReachBottom() {
    console.info("PageReachBottom");
  },

  destroyed() {
    PosterPresenter.unsubscribeAll();
  }
});
</script>

<style>
</style>
