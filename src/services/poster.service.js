import { of, Subject, combineLatest, merge } from "rxjs";
import { map, share, shareReplay, tap, concatMap, startWith, pairwise, switchMap, exhaustMap, withLatestFrom, filter } from "rxjs/operators";

import PosterEntity from "../entities/poster.entity";
import MyposterEntity from "../entities/myposter.entity";

import GetPosterConfigUsecase from "../domain/poster/usecases/get-poster_config.usecase";
import GetInitialPostersUsecase from "../domain/poster/usecases/get-initial_posters.usecase";
import GetNewerPostersUsecase from "../domain/poster/usecases/get-newer_posters.usecase";
import GetOlderPostersUsecase from "../domain/poster/usecases/get-older_posters.usecase";
import GetMypostersUsecase from "../domain/poster/usecases/get-myposters.usecase";
import PublishPosterUsecase from "../domain/poster/usecases/publish-poster.usecase";
import DeleteMyposterUsecase from "../domain/poster/usecases/delete-myposter.usecase";
import CheckMessageSecurityUsecase from "../domain/poster/usecases/check-message_security.usecase";

const CACHE_SIZE = 1;

class PosterService {

  PosterEntity = PosterEntity;
  MyposterEntity = MyposterEntity;

  _config = null;

  app_config$ = null; // new Observable();
  poster_tags$ = null; // new Observable();
  initial_poster_tags$ = null; // new Observable();
  posters$ = null; // new Observable();
  myposters$ = null; // new Observable();
  publish_tags$ = null; // new Observable();

  loading_states$ = new Subject();
  publish_states$ = new Subject();
  delete_states$ = new Subject();

  getInitialPostersEvt$ = new Subject();
  getOlderPostersEvt$ = new Subject();
  getNewerPostersEvt$ = new Subject();
  tagsChangeEvt$ = new Subject();
  refreshPostersEvt$ = new Subject();
  getMypostersEvt$ = new Subject();
  refreshMypostersEvt$ = new Subject();
  deleteMyposterEvt$ = new Subject();
  publishPosterEvt$ = new Subject();

  constructor() {

    // 以获取配置为所有流起点
    this.app_config$ = GetPosterConfigUsecase.execute().pipe(
      tap(poster_config => this._config = poster_config)
    );

    // 需要前置加载的项目：标签
    this.poster_tags$ = this.app_config$.pipe(
      map(poster_config => poster_config.repos["POSTER_TAGS"])
    );
    this.initial_poster_tags$ = this.app_config$.pipe(
      map(poster_config => poster_config.repos["INITIAL_POSTER_TAGS"]),
      tap(initial_poster_tags => this.PosterEntity.setSelectedTags(initial_poster_tags))
    );
    this.publish_tags$ = this.app_config$.pipe(
      map(poster_config => poster_config.repos["PUBLISH_TAGS"])
    );

    let __preload$ = combineLatest(this.poster_tags$, this.initial_poster_tags$);

    // 核心业务处理流
    let __poster_publish$ = this.publishPosterEvt$.pipe(
      tap(() => {
        this.publish_states$.next({ type: "log", message: "Service Publish Poster Started" })
        this.publish_states$.next({ type: "status", message: "start", code: 0 })
      }),
      exhaustMap(poster_data => {
        this.publish_states$.next({ type: "log", message: "Verify the content ..." })
        return CheckMessageSecurityUsecase.execute({ content: poster_data["title"] + poster_data["content"] }).pipe(
          tap(check_res => {
            if (!check_res) {
              this.publish_states$.next({ type: "error", message: "risky_content" })
            }
          }),
          filter(check_res => check_res),
          map(() => poster_data)
        );
      }),
      exhaustMap(poster_data =>
        PublishPosterUsecase.execute(
          poster_data,
          {
            ...this._config.data.poster,
            category: this._config.data.poster["PUBLISH_OPT"].picture_category_name
          }
        )
      ),
      tap(() => {
        this.publish_states$.next({ type: "log", message: "Service Publish Success!" })
        this.publish_states$.next({ type: "status", message: "success", code: 1 })
      }),
      shareReplay(CACHE_SIZE)
    );

    let __initial_posters$ = combineLatest(__preload$, this.getInitialPostersEvt$).pipe(
      tap(() => this.loading_states$.next("loading")),
      exhaustMap(() => GetInitialPostersUsecase.execute(this._config.data.poster)),
      map(res => res.posters),
      tap(initial_posters => {
        this.PosterEntity.push(initial_posters)
      }),
      tap(() => this.loading_states$.next("normal"))
    );

    let __older_posters$ = this.getOlderPostersEvt$.pipe(
      tap(() => this.loading_states$.next("loading")),
      exhaustMap(() => GetOlderPostersUsecase.execute(this._config.data.poster)),
      map(res => res.posters),
      tap(older_posters => {
        this.PosterEntity.push(older_posters)
      }),
      share()
    );
    __older_posters$.pipe(
      startWith([]),
      pairwise(),
      startWith([[], []]),
      pairwise(),
      tap(([last, current]) => {
        // TODO: 解决妥协的问题
        //       需要考虑 initial poster num 和 older poster num 加载条目不一致的情况
        if ((current[1].length - current[0].length < last[1].length - last[0].length) || current[1].length === 0) {
          this.loading_states$.next("nomore")
        } else {
          this.loading_states$.next("normal")
        }
      })
    ).subscribe()

    let __newer_posters$ = merge(this.getNewerPostersEvt$, __poster_publish$).pipe(
      tap(() => this.loading_states$.next("loading")),
      exhaustMap(() => GetNewerPostersUsecase.execute(this._config.data.poster)),
      map(res => res.posters),
      tap(newer_posters => {
        this.PosterEntity.unshift(newer_posters)
      }),
      tap(() => this.loading_states$.next("normal"))
    );

    let __posters_of_tags$ = this.tagsChangeEvt$.pipe(
      tap(e => this.PosterEntity.setSelectedTags(e.tags)),
      withLatestFrom(__preload$)
    );

    let __posters_delete$ = this.deleteMyposterEvt$.pipe(
      tap(() => this.delete_states$.next("start")),
      concatMap(e => {
        return DeleteMyposterUsecase.execute(
          MyposterEntity.getPosterByPosterid(e.poster_id),
          this._config.data.poster
        ).pipe(
          withLatestFrom(of(e))
        );
      }),
      tap(([, e]) => this.MyposterEntity.removePosterByPosterid(e.poster_id)),
      tap(([, e]) => this.PosterEntity.removePosterByPosterid(e.poster_id)),
      tap(() => this.delete_states$.next("success")),
      share()
    );

    this.posters$ = merge(__initial_posters$, __older_posters$, __newer_posters$, __posters_of_tags$, this.refreshPostersEvt$, __posters_delete$).pipe(
      switchMap(() => of(this.PosterEntity.getPosters())),
      share()
    );

    let __myposters$ = merge(this.getMypostersEvt$, __poster_publish$).pipe(
      exhaustMap(e => GetMypostersUsecase.execute(this._config.data.poster)),
      map(res => res.posters),
      tap(myposters => this.MyposterEntity.set(myposters))
    );

    this.myposters$ = merge(__myposters$, this.refreshMypostersEvt$, __posters_delete$).pipe(
      switchMap(() => of(this.MyposterEntity.getPosters())),
      shareReplay(CACHE_SIZE)
    );

  }

  get exports() {
    return {
      app_config$: this.app_config$,
      poster_tags$: this.poster_tags$,
      initial_poster_tags$: this.initial_poster_tags$,
      posters$: this.posters$,
      myposters$: this.myposters$,
      publish_tags$: this.publish_tags$,

      loading_states$: this.loading_states$,
      publish_states$: this.publish_states$,
      delete_states$: this.delete_states$,

      getInitialPosters: this._getInitialPosters.bind(this),
      getOlderPosters: this._getOlderPosters.bind(this),
      getNewerPosters: this._getNewerPosters.bind(this),
      tagsChangeTo: this._tagsChangeTo.bind(this),
      refreshPosters: this._refreshPosters.bind(this),
      getMyposters: this._getMyposters.bind(this),
      refreshMyposters: this._refreshMyposters.bind(this),
      deletePoster: this._deletePoster.bind(this),
      publishPoster: this._publishPoster.bind(this),

      getMyposterByPosterid: this.MyposterEntity.getPosterByPosterid.bind(this.MyposterEntity)
    }
  }

  _getInitialPosters() {
    this.getInitialPostersEvt$.next()
  }
  _getOlderPosters() {
    this.getOlderPostersEvt$.next()
  }
  _getNewerPosters() {
    this.getNewerPostersEvt$.next()
  }
  _tagsChangeTo(tags) {
    this.tagsChangeEvt$.next({ tags })
  }
  _refreshPosters() {
    this.refreshPostersEvt$.next()
  }
  _getMyposters() {
    this.getMypostersEvt$.next()
  }
  _refreshMyposters() {
    this.refreshMypostersEvt$.next()
  }
  _deletePoster(poster_id) {
    this.deleteMyposterEvt$.next({ poster_id })
  }
  _publishPoster(poster_data) {
    this.publishPosterEvt$.next(poster_data)
  }

}

let SinglePosterService = new PosterService();

export default SinglePosterService;
