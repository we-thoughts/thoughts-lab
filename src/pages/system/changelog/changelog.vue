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
// 引入配置文件
import { AppConfigurations } from "../../../basic";
// 引入功能模块
import * as SystemModule from "../../../modules/system";

const PAGE_CONFIG = AppConfigurations.getConfigByPath("pages/system/changelog");
let { changelog: Changelog } = SystemModule;

export default {
  components: {
    // timelineItem
  },
  data() {
    return {
      pagetitle: PAGE_CONFIG.pagetitle || "开发日志",
      logs: []
    };
  },

  async install() {},

  async onShow() {
    let logs = await Changelog.getChangelogs({ fresh: false });
    this.logs = this.formatLogs(logs);
  },

  methods: {
    _formatDate(timestamp) {
      return this.$utils.Date.dayjs(timestamp).format("YYYY-MM-DD");
    },
    formatLogs(logs) {
      console.info(logs)
      let res = [];
      let last_status;
      for (let log of logs) {
        if (!last_status || log.status !== last_status) {
          res.push({
            type: "segment",
            content: log.status
          });
        }
        res.push({
          type: "versioncard",
          content: {
            version: log.version,
            timestamp: this._formatDate(log.created_at * 1000),
            list: log.list,
            flag: log.flag
          }
        });
        last_status = log.status;
      }
      return res;
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: var(--page-bgcolor-light);
}
</style>
