<template>
  <base-page-layout>
    <!-- header 区域 -->
    <view slot="header">
      <!-- navbar -->
      <navbar left="capsule" :title="pagetitle" center="title"></navbar>
    </view>

    <!-- body 区域 -->
    <view slot="body">
      <!-- 时间轴-->
      <view class="mobius-timeline">
        <timeline-item
          v-for="(item, index) in logs"
          :type="item.type"
          :key="index"
          :content="item.content"
        ></timeline-item>
      </view>
    </view>
  </base-page-layout>
</template>

<script>
import ChangelogPresenter from "../../../presenter/public/changelog.presenter";

export default {
  components: {
    // timelineItem
  },
  data() {
    return {
      pagetitle: "开发日志",
      logs: []
    };
  },

  install() {},

  onLoad() {
    ChangelogPresenter.bindPage(this);
    ChangelogPresenter.subscribe("page_config$", page_config => {
      this.pagetitle = page_config.pagetitle;
    });
    ChangelogPresenter.subscribe("formatedChangelogs$", formated_changelogs => {
      this.logs = formated_changelogs;
    });
  },

  onShow() {},

  destroyed() {
    ChangelogPresenter.unsubscribeAll();
  },

  methods: {}
};
</script>

<style lang="scss">
page {
  background-color: var(--page-bgcolor-light);
}
</style>
