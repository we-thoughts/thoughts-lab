import PosterRepository from "../poster.repository";

class GetPosterTagsUsecase {
  constructor() {}

  execute() {
    return PosterRepository.poster_tags$;
  }
}

let SingleGetPosterTagsUsecase = new GetPosterTagsUsecase();

export default SingleGetPosterTagsUsecase;
