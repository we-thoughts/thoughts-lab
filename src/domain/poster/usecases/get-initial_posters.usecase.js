import PosterRepository from "../poster.repository";

class GetInitialPostersUsecase {
  constructor() {}
  execute(option) {
    return PosterRepository.getInitialPosters(option);
  }
}

let SingleGetInitialPostersUsecase = new GetInitialPostersUsecase();

export default SingleGetInitialPostersUsecase;
