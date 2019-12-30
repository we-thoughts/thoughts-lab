import PublicRepository from "../public.repository";

class RefreshUserinfoUsecase {
  constructor() {}
  execute() {
    PublicRepository.refreshUserinfo();
  }
}

let SingleRefreshUserinfoUsecase = new RefreshUserinfoUsecase();

export default SingleRefreshUserinfoUsecase;
