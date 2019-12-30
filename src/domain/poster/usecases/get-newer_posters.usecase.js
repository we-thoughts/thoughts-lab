import PosterRepository from "../poster.repository";

class GetNewerPostersUsecase {
  constructor() {}
  execute(option) {
    return PosterRepository.getNewerPosters(option);
  }
}

let SingleGetNewerPostersUsecase = new GetNewerPostersUsecase();

export default SingleGetNewerPostersUsecase;
