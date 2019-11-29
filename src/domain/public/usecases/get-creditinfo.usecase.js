import PublicRepository from "../public.repository";

class GetCreditInfoUsecase {
  constructor() { }
  execute() {
    return PublicRepository.getCreditInfo();
  }
}

let SingleGetCreditInfoUsecase = new GetCreditInfoUsecase();

export default SingleGetCreditInfoUsecase;
