import { tap } from "rxjs/operators";

import GetPublicConfigUsecase from "../domain/public/usecases/get-public_config.usecase";

class PublicService {

  _config = null;

  app_config$ = null;

  constructor() {
    // 以获取配置为所有流起点
    this.app_config$ = GetPublicConfigUsecase.execute().pipe(
      tap(public_config => this._config = public_config)
    );
  }

  get exports() {
    return {
      app_config$: this.app_config$
    }
  }
}

let SinglePublicService = new PublicService();

export default SinglePublicService;
