import { map } from "rxjs/operators";
import PosterRepository from "../poster.repository";

class GetPostersByTagsUsecase {
  constructor() { }
  execute(tags) {
    return PosterRepository.posters$.pipe(
      map(posters => {
        if (tags.length === 0) return [];
        let res = [];
        for (let poster of posters) {
          tags.includes(poster.tag) && res.push(poster)
        }
        return res;
      })
    );
  }
}

let SingleGetPostersByTagsUsecase = new GetPostersByTagsUsecase();

export default SingleGetPostersByTagsUsecase;
