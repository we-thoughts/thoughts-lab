import { Subject, of } from "rxjs";
import { map, withLatestFrom, exhaustMap, tap, filter } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import UserService from "../../services/user.service";
import PosterService from "../../services/poster.service";

const PUBLISH_ERROR_DICT = {
  "not_verified": "not_verified",
  "myposters_num_exceeded": "myposters_num_exceeded",
  "risky_content": "risky_content"
};

class PublishPresenter extends BasePresenter {

  UserService = UserService.exports;
  PosterService = PosterService.exports;

  config = null;

  app_config$ = null;
  page_config$ = null;
  publish_tags$ = null;
  num_of_myposters$ = null;

  publish_states$ = new Subject();

  _publishPosterEvt$ = new Subject();

  _num_of_publish = undefined;
  _num_of_myposters = undefined;

  constructor() {
    super()

    let { app_config$, myposters$, publish_tags$, publish_states$, refreshMyposters, publishPoster } = this.PosterService;
    let { userinfo$, getUserinfo } = this.UserService;

    app_config$.pipe(
      tap(config => this.config = config),
      tap(config => {
        this._num_of_publish = config.repos["PUBLISH_PERMISSIONS"].num_of_publish;
      }),
      tap(() => getUserinfo())
    ).subscribe()

    this.app_config$ = app_config$;
    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["publish"])
    );
    this.publish_tags$ = publish_tags$;

    // 发布 Poster 流程： Check -> Publish
    //                        --> Cancel
    publish_states$.subscribe(state => {
      let { type, message } = state;
      if (type === "error") {
        this.publish_states$.next({ type: "error", message: PUBLISH_ERROR_DICT[message] })
      } else {
        this.publish_states$.next(state)
      }
    })

    let _publishPosterCheck$ = this._publishPosterEvt$.pipe(
      withLatestFrom(userinfo$),
      exhaustMap(([poster_data, userinfo]) => {
        this.publish_states$.next({ type: "log", message: "Verify the identity ..." })
        return of(userinfo._email_verified).pipe(
          tap(check_res => {
            if (!check_res) {
              this.publish_states$.next({ type: "error", message: PUBLISH_ERROR_DICT["not_verified"] })
            }
          }),
          filter(check_res => check_res),
          map(() => [poster_data, userinfo])
        );
      }),
      exhaustMap(([poster_data, userinfo]) => {
        this.publish_states$.next({ type: "log", message: "Verify the publish number ..." })
        return of(this._num_of_publish > this._num_of_myposters).pipe(
          tap(check_res => {
            if (!check_res) {
              this.publish_states$.next({ type: "error", message: PUBLISH_ERROR_DICT["myposters_num_exceeded"] })
            }
          }),
          filter(check_res => check_res),
          map(() => [poster_data, userinfo])
        );
      }),
      map(([poster_data]) => poster_data)
    );
    _publishPosterCheck$.subscribe((poster_data) => {
      this.publish_states$.next({ type: "log", message: "Presenter Publish request approved!" })
      publishPoster(poster_data)
    })

    this.num_of_myposters$ = myposters$.pipe(
      map(myposters => myposters.length),
      tap(num_of_myposters => this._num_of_myposters = num_of_myposters)
    );
    this.refreshMyposters = refreshMyposters;
  }

  publishPoster(poster_data) {
    console.info("publishPoster", poster_data)
    this._publishPosterEvt$.next(poster_data);
  }

}

let SinglePublishPresenter = new PublishPresenter();

export default SinglePublishPresenter;
