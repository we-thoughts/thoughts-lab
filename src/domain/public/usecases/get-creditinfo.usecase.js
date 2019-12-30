import PublicRepository from "../public.repository";

class GetCreditInfoUsecase {
  constructor() { }
  execute() {
    return PublicRepository.creditinfo$;
  }
}

let SingleGetCreditInfoUsecase = new GetCreditInfoUsecase();

export default SingleGetCreditInfoUsecase;
