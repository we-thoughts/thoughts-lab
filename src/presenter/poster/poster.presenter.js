import { tap, map } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import PosterService from "../../services/poster.service";

const LOADMORE_TYPE = {
  normal: "normal",
  nomore: "nomore",
  loading: "loading"
};

class PosterPresenter extends BasePresenter {

  PosterService = PosterService.exports;

  page_config$ = null;
  loading_states$ = null;
  posters$ = null;
  poster_tags$ = null;
  initial_poster_tags$ = null;

  _loadmore_type = "normal";

  constructor() {
    super()

    let { app_config$, posters$, poster_tags$, initial_poster_tags$, loading_states$, getInitialPosters, getNewerPosters, getOlderPosters, tagsChangeTo, refreshPosters } = this.PosterService;

    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["poster"])
    );
    this.posters$ = posters$;
    this.poster_tags$ = poster_tags$;
    this.initial_poster_tags$ = initial_poster_tags$;
    this.loading_states$ = loading_states$;
    this.getInitialPosters = getInitialPosters;
    this.getNewerPosters = () => {
      if (this._loadmore_type === LOADMORE_TYPE["loading"]) return;
      getNewerPosters()
    };
    this.getOlderPosters = () => {
      if (this._loadmore_type === LOADMORE_TYPE["loading"]) return;
      getOlderPosters()
    };
    this.tagsChangeTo = tagsChangeTo;
    this.refreshPosters = refreshPosters;

    this.loading_states$.pipe(
      tap(state => this._loadmore_type = LOADMORE_TYPE[state])
    )
  }
}

let SinglePosterPresenter = new PosterPresenter();

export default SinglePosterPresenter;
