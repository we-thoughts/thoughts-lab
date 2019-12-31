import PosterRepository from "../poster.repository";

class CheckMessageSecurityUsecase {
  constructor() { }

  execute({ content }) {
    return PosterRepository.checkMessageSecurity({ content });
  }
}

let SingleCheckMessageSecurityUsecase = new CheckMessageSecurityUsecase();

export default SingleCheckMessageSecurityUsecase;
