import { from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import GetConfigUsecase from "../system/usecases/get-config.usecase";
import GetUserinfoUsecase from "../system/usecases/get-userinfo.usecase";
import RefreshUserinfoUsecase from "../system/usecases/refresh-userinfo.usecase";
import SetUserEmailUsecase from "../system/usecases/set-user_email.usecase";
import GetCreditinfoUsecase from "../system/usecases/get-creditinfo.usecase";

import IfanrServerData from '../../data/ifanr-server';

let ChangelogData = IfanrServerData.public.changelog;

const CACHE_SIZE = 1;

class PublicRepository {

  cacheChangelogs$ = null;

  constructor() { }

  get config$() {
    return GetConfigUsecase.execute().pipe(
      map(config => config.apps.public)
    );
  }

  get userinfo$() {
    return GetUserinfoUsecase.execute();
  }

  refreshUserinfo() {
    RefreshUserinfoUsecase.execute();
  }

  setUserEmail(data) {
    return SetUserEmailUsecase.execute(data);
  }

  get creditinfo$() {
    return GetCreditinfoUsecase.execute();
  }

  getChangelogs(option) {
    if (!this.cacheChangelogs$) {
      this.cacheChangelogs$ = from(
        ChangelogData.requestChangelogs(option)
      ).pipe(
        map(res => res.data.objects),
        shareReplay(CACHE_SIZE)
      )
    }
    return this.cacheChangelogs$;
  }
}

let SinglePublicRepository = new PublicRepository();

export default SinglePublicRepository;
