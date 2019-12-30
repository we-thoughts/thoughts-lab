import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

import BasePresenter from "../base.presenter";
import UserService from "../../services/user.service";
import PublicService from "../../services/public.service";

class VerifyPresenter extends BasePresenter {

  UserService = UserService.exports;
  PublicService = PublicService.exports;

  page_config$ = null;
  userinfo$ = null;

  email_submit_states$ = new Subject(); // start, success
  submit_timer$ = new Subject(); // 59, 58, 57 ...

  email_input_status$ = new Subject(); // normal, disabled
  submit_btn_status$ = new Subject(); // normal, disabled

  _emailChangeEvt$ = new Subject();

  constructor() {
    super()

    let { userinfo$, set_user_email_states$, set_user_email_cooldown$, getUserinfo, setUserEmail } = this.UserService;
    let { app_config$ } = this.PublicService;

    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["verify"]),
      tap(() => getUserinfo())
    )
    this.userinfo$ = userinfo$;

    set_user_email_states$.subscribe(state => {
      this.email_submit_states$.next(state)
    })

    this._emailChangeEvt$.pipe(
      // TODO: 将 input_status 和 submit_btn_status 的判断提取到 Presenter 里
    )

    this.setUserEmail = setUserEmail;
    this.set_user_email_cooldown$ = set_user_email_cooldown$.pipe(
      tap(val => {
        if (val > 0) {
          this.submit_btn_status$.next("disabled")
          this.email_input_status$.next("disabled")
        }
        if (val === 0) {
          this.email_input_status$.next("normal")
          this.submit_btn_status$.next("normal")
        }
      })
    );
  }

  emailChangeTo(email) {
    this._emailChangeEvt$.next(email)
  }

}

let SingleVerifyPresenter = new VerifyPresenter();

export default SingleVerifyPresenter;
