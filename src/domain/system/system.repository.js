import { from } from 'rxjs';
import { tap, map, switchMap, shareReplay } from 'rxjs/operators';

import IfanrServerData from "../../data/ifanr-server";
import GlobalStorage from "../../data/storage";

let CreditData = IfanrServerData.common.credit;
let UserData = IfanrServerData.common.user;
let Login = IfanrServerData.system.login;

const CACHE_SIZE = 1;

class SystemRepository {
  cacheLogin$ = null;
  cacheUserinfo$ = null;
  cacheCreditinfo$ = null;

  constructor() { }

  login() {
    if (!this.cacheLogin$) {
      this.cacheLogin$ = from(Login.login()).pipe(
        tap((userinfo) => {
          GlobalStorage.setData("openid", userinfo.openid);
          GlobalStorage.setData("userinfo", userinfo);
          console.log(`【initializeData】: openid = ${userinfo.openid}`)
        }),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheLogin$;
  }

  get userinfo$() {
    if (!this.cacheUserinfo$) {
      console.info("create cache")
      this.cacheUserinfo$ = this.login().pipe(
        switchMap(() => from(UserData.getUser())),
        tap((userinfo) => {
          GlobalStorage.setData("userinfo", userinfo);
        }),
        shareReplay(CACHE_SIZE)
      )
    }
    return this.cacheUserinfo$;
  }

  refreshUserinfo() {
    this.cacheUserinfo$ = null;
  }

  setUserEmail(data) {
    return from(UserData.setEmail(data));
  }

  getCreditInfoByOpenid(openid) {
    openid = openid || GlobalStorage.getData("openid");
    if (!this.cacheCreditinfo$) {
      this.cacheCreditinfo$ = from(CreditData.requestCreditInfoByOpenid(openid)).pipe(
        map(res => res.data.objects[0]),
        tap(creditinfo => {
          GlobalStorage.setData("creditinfo", creditinfo)
        }),
        shareReplay(CACHE_SIZE)
      )
    }
    return this.cacheCreditinfo$;
  }

}

let SingleSystemRepository = new SystemRepository();

export default SingleSystemRepository;
