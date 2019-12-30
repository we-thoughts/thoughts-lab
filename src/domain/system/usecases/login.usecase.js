import SystemRepository from "../system.repository";

class LoginUsecase {
  constructor() {}

  execute() {
    return SystemRepository.login();
  }
}

let SingleLoginUsecase = new LoginUsecase();

export default SingleLoginUsecase;
