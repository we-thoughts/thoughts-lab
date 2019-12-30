import SystemRepository from "../system.repository";

class RefreshUserinfoUsecase {
  constructor() { }
  execute() {
    SystemRepository.refreshUserinfo.bind(SystemRepository)();
  }
}

let SingleRefreshUserinfoUsecase = new RefreshUserinfoUsecase();

export default SingleRefreshUserinfoUsecase;
