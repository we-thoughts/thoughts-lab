import PublicRepository from "../public.repository";

class GetUserInfoUsecase {
  constructor() { }
  execute() {
    return PublicRepository.getUserInfo();
  }
}

let SingleGetUserInfoUsecase = new GetUserInfoUsecase();

export default SingleGetUserInfoUsecase;
