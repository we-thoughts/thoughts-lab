import SystemRepository from "../system.repository";

class GetUserinfoUsecase {
  constructor() { }
  execute() {
    return SystemRepository.userinfo$;
  }
}

let SingleGetUserinfoUsecase = new GetUserinfoUsecase();

export default SingleGetUserinfoUsecase;
