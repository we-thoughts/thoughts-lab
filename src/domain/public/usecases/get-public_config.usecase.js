import PublicRepository from "../public.repository";

class GetPublicConfigUsecase {
  constructor() {}

  execute() {
    return PublicRepository.config$;
  }
}

let SingleGetPublicConfigUsecase = new GetPublicConfigUsecase();

export default SingleGetPublicConfigUsecase;
