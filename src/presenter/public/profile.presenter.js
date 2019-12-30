import { map, tap } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import UserService from "../../services/user.service";
import PublicService from "../../services/public.service";

class ProfilePresenter extends BasePresenter {

  UserService = UserService.exports;
  PublicService = PublicService.exports;

  userinfo$ = null;
  page_config$ = null;

  constructor() {
    super()

    let { userinfo$, getUserinfo } = this.UserService;
    let { app_config$ } = this.PublicService;

    this.userinfo$ = userinfo$;

    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["profile"]),
      tap(() => getUserinfo())
    );
  }

}

let SingleProfilePresenter = new ProfilePresenter();

export default SingleProfilePresenter;
