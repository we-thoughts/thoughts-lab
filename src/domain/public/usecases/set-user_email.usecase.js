import PublicRepository from "../public.repository";

class SetUserEmailUsecase {

  constructor() { }

  execute(data) {
    return PublicRepository.setUserEmail(data);
  }
}

let SingleSetUserEmailUsecase = new SetUserEmailUsecase();

export default SingleSetUserEmailUsecase;
