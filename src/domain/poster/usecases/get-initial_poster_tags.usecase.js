import PosterRepository from "../poster.repository";

class GetInitialPosterTagsUsecase {
  constructor() {}
  execute() {
    return PosterRepository.initial_poster_tags$;
  }
}

let SingleGetInitialPosterTagsUsecase = new GetInitialPosterTagsUsecase();

export default SingleGetInitialPosterTagsUsecase;;
