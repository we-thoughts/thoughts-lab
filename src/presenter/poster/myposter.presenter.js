import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import BasePresenter from "../base.presenter";

import PosterService from "../../services/poster.service";

class MyposterPresenter extends BasePresenter {

  PosterService = PosterService.exports;

  page_config$ = null;
  myposters$ = null;

  _posterDeleteEvt$ = new Subject();

  delete_states$ = new Subject();

  constructor() {
    super()

    let { app_config$, myposters$, getMyposters, refreshMyposters, delete_states$, deletePoster } = this.PosterService;

    this.page_config$ = app_config$.pipe(
      map(app_config => app_config.pages["myposter"])
    );
    this.myposters$ = myposters$;

    this.getMyposters = getMyposters;
    this.refreshMyposters = refreshMyposters;
    this.delete_states$ = delete_states$.pipe(
      map(state => ({type: "log", message: state}))
    );

    this._posterDeleteEvt$.pipe(
      map(e => e.poster_id)
    ).subscribe(poster_id => {
      deletePoster(poster_id)
    })
  }

  deletePoster(poster_id) {
    this._posterDeleteEvt$.next({ poster_id })
  }

}

let SingleMyposterPresenter = new MyposterPresenter();

export default SingleMyposterPresenter;
