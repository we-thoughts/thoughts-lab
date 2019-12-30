import PosterRepository from "../poster.repository";

class GetOlderPostersUsecase {
  constructor() {}
  execute(option) {
    return PosterRepository.getOlderPosters(option);
  }
}

let SingleGetOlderPostersUsecase = new GetOlderPostersUsecase();

export default SingleGetOlderPostersUsecase;
