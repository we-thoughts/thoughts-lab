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
      {{str$}}
      {{interval$}}
      <!-- poster 标签栏 -->
      <tagbar
        :show="tagbar_show"
        :tags="poster_tags"
        type="multi"
        :selected="poster_tags"
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
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/interval";
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
} = createNamespacedHelpers("poster/poster");
const PAGE_CONFIG = AppConfigurations.getConfigByPath("pages/poster/poster");
let { app: PosterApp, poster: Poster } = PosterModule;

export default Mobius.page({
  components: {
    // posterCard,
    // loadmore
  },
  data: function() {
    return {
      pagetitle: PAGE_CONFIG.pagetitle || "列表",
      capsule: {
        main: {
          icon: PAGE_CONFIG.capsule_main_icon
        }
      },
      poster_tags: [],
      selected_tags: [],
      tagbar_show: false,

      posters: [],
      scroll_top: 0,
      loadmore_type: "normal",
      loadmore_tips: {},

      interval$: undefined,
      str$: undefined
    };
  },
  watch: {
    selected_tags() {
      this._loadPosters();
    },
    posters(new_val) {
      if (new_val.length <= 5) {
        this.loadmore_tips["has_more"] = "点击加载更多";
      } else {
        this.loadmore_tips["has_more"] = undefined;
      }
    }
  },

  computed: {
    ...mapSelfState(["has_myposter_changed", "myposter_changed_payloads"])
  },

  created() {
    Observable.of("test").subscribe(val => this.str$ = val)
    // Observable.interval(1000).subscribe(val => (this.interval$ = val));
    // Observable.interval(1000).subscribe(val => console.info(this.intervaal$));
  },

  methods: {
    ...mapSelfMutations(["resetMyposterChange"]),
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
      console.info("TagsChange", e);
      this.selected_tags = e.selected_tags;
    },
    // 滚动列表事件
    __scrolltolower(e) {
      console.info("ListReachBottom");
      this.loadMore();
    },
    __scrolltoupper(e) {
      console.info("ListReachTop");
    },
    __scrolllistLoadmore(e) {
      this.loadMore();
    },
    // poster 事件
    __posterClick: function(e) {
      let { index, id } = e;
      console.info(index, id);
    },
    // 业务处理
    async _loadPosters() {
      let diff = this.selected_tags.length - this.poster_tags.length;
      if (diff === 0) {
        this.posters = await Poster.getPosters({ fresh: false });
      }
      if (diff < 0) {
        this.posters = await Poster.getPostersByTags({
          fresh: false,
          tags: this.selected_tags
        });
      }
      if (this.selected_tags.length === 0) {
        // TODO: 展示“啥都不想看”动态背景
        return;
      }
    },
    loadMore: async function() {
      // TODO: 可以考虑为 loadmore 添加更加花哨的样式
      // TODO: 改为通过子组件方法控制
      // 判断 loading 状态以避免反复触发
      if (this.loadmore_type === "loading" || this.loadmore_type === "nomore")
        return;
      this.loadmore_type = "loading";
      let posters = await Poster.getOlderPosters();
      if (posters.length > 0) {
        this._loadPosters();
      }
      if (posters.length < Poster.getRequestParams("older_posters_limit")) {
        this.loadmore_type = "normal";
      } else {
        this.loadmore_type = "nomore";
      }
    },
    getNewPosters: async function() {
      let posters = await Poster.getNewPosters();
      if (posters && posters.length > 0) {
        this._loadPosters();
      } else {
        uni.showToast({
          title: "没有更多新消息啦~",
          icon: "none",
          duration: 1500
        });
      }
    }
  },

  onLoad: async function() {
    let poster_tags = Poster.getPosterTags();
    this.poster_tags = [...poster_tags];
    this.selected_tags = [...poster_tags];
    // 拉取记录，刷新列表
    this._loadPosters();
  },

  onShow: async function() {
    if (!this.has_myposter_changed) return;
    let {
      has_poster_changed,
      has_new_poster
    } = await Poster.revisePosterChanged(this.myposter_changed_payloads);
    if (has_poster_changed) {
      this._loadPosters();
    }
    if (has_new_poster) uni.startPullDownRefresh();
    this.resetMyposterChange();
  },

  onReady: async function() {},

  async onPullDownRefresh() {
    console.info("PagePullDownRefresh");
    await this.getNewPosters();
    // TODO: 改为通过子组件方法控制
    this.scroll_top = this.scroll_top === -1 ? -2 : -1;
    uni.stopPullDownRefresh();
  },

  onReachBottom: async function() {
    console.info("PageReachBottom");
  }
});
</script>

<style>
</style>
