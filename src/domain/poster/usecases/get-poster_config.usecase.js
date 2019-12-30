import PosterRepository from "../poster.repository";

class GetPosterConfigUsecase {
  constructor() {}

  execute() {
    return PosterRepository.config$;
  }
}

let SingleGetPosterConfigUsecase = new GetPosterConfigUsecase();

export default SingleGetPosterConfigUsecase;
