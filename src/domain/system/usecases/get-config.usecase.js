import ConfigRepository from "../config.repository";

class GetConfigUsecase {
  constructor() {}
  execute() {
    return ConfigRepository.config$;
  }
}

let SingleGetConfigUsecase = new GetConfigUsecase();

export default SingleGetConfigUsecase;
