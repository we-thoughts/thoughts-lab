import PosterRepository from "../poster.repository";

class GetPostersUsecase {
  constructor() {}
  execute() {
    return PosterRepository.posters$;
  }
}

let SingleGetPostersUsecase = new GetPostersUsecase();

export default SingleGetPostersUsecase;
