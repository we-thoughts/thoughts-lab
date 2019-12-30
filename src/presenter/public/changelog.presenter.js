import { map } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import ChangelogService from "../../services/changelog.service";

class ChangelogPresenter extends BasePresenter {

  ChangelogService = ChangelogService.exports;

  page_config$ = null;

  formatedChangelogs$ = null;

  constructor() {
    super()

    let { app_config$, changelogs$ } = this.ChangelogService;

    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["changelog"])
    );
    this.formatedChangelogs$ = changelogs$.pipe(
      map(changelogs => {
        return this._formatLogs(changelogs)
      })
    )
  }

  _formatDate(timestamp) {
    return this.$utils.Date.dayjs(timestamp).format("YYYY-MM-DD");
  }

  _formatLogs(logs) {
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

let SingleChangelogPresenter = new ChangelogPresenter();

export default SingleChangelogPresenter;
