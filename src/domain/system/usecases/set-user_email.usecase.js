import SystemRepository from "../system.repository";

class SetUserEmailUsecase {
  constructor() {}
  execute(data) {
    return SystemRepository.setUserEmail(data);
  }
}

let SingleSetUserEmailUsecase = new SetUserEmailUsecase();

export default SingleSetUserEmailUsecase;
