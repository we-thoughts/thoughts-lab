import { Subject } from "rxjs";
import { map, withLatestFrom, tap } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import UserService from "../../services/user.service";
import PosterService from "../../services/poster.service";

const PUBLISH_ERROR_DICT = {
  "not_verified": "not_verified",
  "myposters_num_exceeded": "myposters_num_exceeded"
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
    publish_states$.subscribe(state => this.publish_states$.next({ type: "log", message: state }))
    let __publishPosterCheckRes = [];
    let _publishPosterCheck$ = this._publishPosterEvt$.pipe(
      withLatestFrom(userinfo$),
      tap(([, userinfo]) => {
        this.publish_states$.next({ type: "log", message: "Verify the identity ..." })
        if (!userinfo._email_verified) {
          __publishPosterCheckRes.push(PUBLISH_ERROR_DICT["not_verified"])
        }
      }),
      tap(() => {
        this.publish_states$.next({ type: "log", message: "Verify the publish number ..." })
        if (this._num_of_myposters >= this._num_of_publish) {
          __publishPosterCheckRes.push(PUBLISH_ERROR_DICT["myposters_num_exceeded"])
        }
      }),
      // exhaustMap(([poster_data]) => {
      // TODO: 接入微信的内容审查 API
      //   this.publish_states$.next("Verify the content ...")
      //   //
      // }),
      map(([poster_data]) => poster_data)
    );
    _publishPosterCheck$.subscribe((poster_data) => {
      if (__publishPosterCheckRes.length !== 0) {
        this.publish_states$.next({type: "log", message: "Publish request rejected!"})
        this.publish_states$.next({ type: "error", message: __publishPosterCheckRes[0] })
      } else {
        this.publish_states$.next({type: "log", message: "Publish request approved!"})
        publishPoster(poster_data)
      }
      __publishPosterCheckRes = [];
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
