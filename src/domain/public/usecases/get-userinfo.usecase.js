import PublicRepository from "../public.repository";

class GetUserInfoUsecase {
  constructor() { }
  execute() {
    return PublicRepository.userinfo$;
  }
}

let SingleGetUserInfoUsecase = new GetUserInfoUsecase();

export default SingleGetUserInfoUsecase;
