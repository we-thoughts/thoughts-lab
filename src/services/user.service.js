import { Subject, ReplaySubject, merge, timer } from "rxjs";
import { tap, map, take, exhaustMap, switchMap, shareReplay, skipWhile } from "rxjs/operators";

import GetUserInfoUsecase from "../domain/public/usecases/get-userinfo.usecase";
import RefreshUserinfoUsecase from "../domain/public/usecases/refresh-userinfo.usecase";
import SetUserEmailUsecase from "../domain/public/usecases/set-user_email.usecase";

const CACHE_SIZE = 1;

class UserService {

  userinfo$ = null;

  set_user_email_states$ = new Subject();
  set_user_email_cooldown$ = new ReplaySubject(CACHE_SIZE);

  _getUserinfoEvt$ = new Subject();
  _setUserEmailEvt$ = new Subject();
  _refreshUserinfoEvt$ = new Subject();

  _isCoolingdown = false;

  constructor() {

    let _user_email_set$ = this._setUserEmailEvt$.pipe(
      skipWhile(() => this._isCoolingdown),
      tap(() => {
        this.set_user_email_states$.next("start")
      }),
      exhaustMap(data => SetUserEmailUsecase.execute(data)),
      tap(() => { RefreshUserinfoUsecase.execute() }),
      tap(() => {
        this.set_user_email_states$.next("success")
      }),
      shareReplay(CACHE_SIZE)
    );

    // FIXME: 在多个应用周期中通过本地存储保持冷却状态
    // TODO: 提取冷却时间(cooldown_time = 60)为配置项
    let _check_cooldown_cache$ = null; // new Observable();
    merge(_user_email_set$).pipe(
      tap(() => this._isCoolingdown === true),
      exhaustMap(() => {
        return timer(1, 1000).pipe(
          take(60),
          map(val => val + 1),
          map(val => 60 - val)
        )
      })
    ).subscribe(val => {
      this.set_user_email_cooldown$.next(val)
    })

    let _userinfo_refresh$ = this._refreshUserinfoEvt$.pipe(
      tap(() => { RefreshUserinfoUsecase.execute() })
    );

    this.userinfo$ = merge(this._getUserinfoEvt$, _user_email_set$, _userinfo_refresh$).pipe(
      switchMap(() => GetUserInfoUsecase.execute()),
      shareReplay(CACHE_SIZE)
    )

  }

  get exports() {
    return {
      userinfo$: this.userinfo$,

      set_user_email_states$: this.set_user_email_states$,
      set_user_email_cooldown$: this.set_user_email_cooldown$,

      getUserinfo: this._getUserinfo.bind(this),
      refreshUserinfo: this._refreshUserinfo.bind(this),
      setUserEmail: this._setUserEmail.bind(this)
    };
  }

  _getUserinfo() {
    this._getUserinfoEvt$.next()
  }
  _refreshUserinfo() {
    this._refreshUserinfoEvt$.next()
  }
  _setUserEmail(data) {
    this._setUserEmailEvt$.next(data)
  }
}

let SingleUserService = new UserService();

export default SingleUserService;
