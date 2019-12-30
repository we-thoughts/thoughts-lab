import PosterRepository from "../poster.repository";

class GetMypostersUsecase {
  constructor() {}
  execute(option) {
    return PosterRepository.getMyposters(option);
  }
}

let SingleGetMypostersUsecase = new GetMypostersUsecase();

export default SingleGetMypostersUsecase;
