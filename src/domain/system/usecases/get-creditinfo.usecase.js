import SystemRepository from "../system.repository";

class GetCreditinfoUsecase {
  constructor() {  }

  execute() {
    return SystemRepository.getCreditInfoByOpenid();
  }
}

let SingleGetCreditinfoUsecase = new GetCreditinfoUsecase();

export default SingleGetCreditinfoUsecase;
