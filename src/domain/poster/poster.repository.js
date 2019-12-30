import { from } from 'rxjs';
import { tap, shareReplay, map, switchMap } from 'rxjs/operators';

import GetConfigUsecase from "../system/usecases/get-config.usecase";
import GetUserinfoUsecase from "../system/usecases/get-userinfo.usecase";

import IfanrServerData from "../../data/ifanr-server";
import GlobalStorage from "../../data/storage";

let PosterData = IfanrServerData.poster.poster;
let FileData = IfanrServerData.common.file;
let PosterStorage = GlobalStorage.use("poster");
PosterStorage.init({
  config: {},

  initial_poster_tags: [],
  poster_tags: [],

  posters: [],
  initial_posters: [],
  newer_posters: [],
  older_posters: [],

  myposters: []
})

const CACHE_SIZE = 1;

class PosterRepository {
  cacheInitialPosters$ = null;

  constructor() { }

  get config$() {
    return GetConfigUsecase.execute().pipe(
      map(config => config.apps.poster),
      tap(config => {
        console.info("设置 PosterStorage 缓存 - config：", config)
        PosterStorage.setData("config", config)
      }),
      shareReplay(CACHE_SIZE)
    );
  }

  get poster_tags$() {
    return GetConfigUsecase.execute().pipe(
      map(config => config.apps.poster.repos["POSTER_TAGS"]),
      tap(poster_tags => {
        console.info("设置 PosterStorage 缓存 - poster_tags：", poster_tags)
        PosterStorage.setData("poster_tags", poster_tags)
      })
    );
  }

  get posters$() {
    return from(new Promise((resolve, reject) => {
      resolve(PosterStorage.getData("posters"))
    }));
  }

  get initial_poster_tags$() {
    return GetConfigUsecase.execute().pipe(
      map(config => config.apps.poster.repos["INITIAL_POSTER_TAGS"]),
      tap(initial_poster_tags => {
        console.info("设置 PosterStorage 缓存 - initial_poster_tags", initial_poster_tags)
        PosterStorage.setData("initial_poster_tags", initial_poster_tags)
      })
    );
  }

  getInitialPosters(option) {
    if (!this.cacheInitialPosters$) {
      this.cacheInitialPosters$ = from(PosterData.requestPosters(option)).pipe(
        map(res => res.data.objects),
        tap(initial_posters => {
          PosterStorage.setData("initial_posters", PosterStorage.getData("initial_posters").concat(initial_posters))
          PosterStorage.setData("posters", PosterStorage.getData("posters").concat(initial_posters))
          console.info("initialPosters$ set initial_posters: ", PosterStorage.getData("initial_posters"))
        }),
        map(initial_posters => ({ type: "initial", posters: initial_posters }))
      )
    }
    return this.cacheInitialPosters$;
  }

  getOlderPosters(option) {
    let posters = PosterStorage.getData("posters");
    return from(new Promise((resolve, reject) => {
      console.info("getOlderPosters")
      if (posters && posters.length > 0) {
        resolve(PosterData.requestOlderPosters(posters[posters.length - 1].created_at, option))
      } else {
        resolve([])
      }
    })).pipe(
      map(res => res.data.objects),
      tap(older_posters => {
        PosterStorage.setData("older_posters", PosterStorage.getData("older_posters").concat(older_posters))
        PosterStorage.setData("posters", PosterStorage.getData("posters").concat(older_posters))
        console.info("olderPosters$ set older_posters: ", PosterStorage.getData("older_posters"))
      }),
      map(older_posters => ({ type: "older", posters: older_posters }))
    );
  }

  getNewerPosters(option) {
    let posters = PosterStorage.getData("posters");
    return from(new Promise((resolve, reject) => {
      console.info("getNewerPosters")
      if (posters && posters.length > 0) {
        resolve(
          PosterData.requestNewerPosters(posters[0].created_at, option)
        )
      } else {
        resolve([])
      }
    })).pipe(
      map(res => res.data.objects),
      tap(newer_posters => {
        PosterStorage.setData("newer_posters", PosterStorage.getData("newer_posters").concat(newer_posters))
        PosterStorage.setData("posters", newer_posters.concat(PosterStorage.getData("posters")))
        console.info("newerPosters$ set newer_posters: ", PosterStorage.getData("newer_posters"))
      }),
      map(newer_posters => ({ type: "newer", posters: newer_posters }))
    );
  }

  getMyposters(option) {
    return GetUserinfoUsecase.execute().pipe(
      switchMap(userinfo => from(PosterData.requestPostersByUserId(userinfo.id, option)).pipe(
        map(res => res.data.objects),
        tap(myposters => {
          PosterStorage.setData("myposters", [...myposters])
          console.info("myposters$ set myposters: ", PosterStorage.getData("myposters"))
        }),
        map(myposters => ({ type: "myposters", posters: myposters }))
      ))
    );
  }

  deletePosterByPosterid(poster_id, option) {
    return from(PosterData.deletePosterById(poster_id, option));
  }

  deleteFiles(file_ids) {
    return from(FileData.deleteFiles(file_ids));
  }

  publishPoster(poster_data, option) {
    let { tag, title, content, pictures } = poster_data;
    return from(
      FileData.uploadFiles(pictures, option)
    ).pipe(
      map(res => res.map(item => item.data.file)),
      switchMap(pics =>
        from(
          PosterData.createPoster(
            { tag, title, content, pictures: pics }, option
          )
        )
      )
    )
  }
}

let SinglePosterRepository = new PosterRepository();

export default SinglePosterRepository;
