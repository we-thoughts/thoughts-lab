import { combineLatest } from "rxjs";
import { exhaustMap, tap } from "rxjs/operators";

import GetPublicConfigUsecase from "../domain/public/usecases/get-public_config.usecase";
import GetChangelogsUsecase from "../domain/public/usecases/get-changelogs.usecase";

class ChangelogService {

  _config = [];

  app_config$ = null; // new Observable();
  changelogs$ = null; // new Observable();

  constructor() {

    // 以获取配置为所有流起点
    this.app_config$ = GetPublicConfigUsecase.execute().pipe(
      tap(public_config => this._config = public_config)
    );

    this.changelogs$ = combineLatest(this.app_config$).pipe(
      exhaustMap(() =>
        GetChangelogsUsecase.execute(this._config.data.changelog)
      )
    )
  }

  get exports() {
    return {
      app_config$: this.app_config$,
      changelogs$: this.changelogs$
    }
  }
}

let SingleChangelogService = new ChangelogService();

export default SingleChangelogService;
