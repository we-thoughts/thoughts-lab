import PosterRepository from "../poster.repository";

class PublishPosterUsecase {
  constructor() {}

  execute(poster_data, option) {
    return PosterRepository.publishPoster(poster_data, option);
  }
}

let SinglePublishPosterUsecase = new PublishPosterUsecase()

export default SinglePublishPosterUsecase;
