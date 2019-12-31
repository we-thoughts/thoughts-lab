import SecurityRepository from "../security.repository";

class CheckMessageSecurityUsecase {
  constructor() { }

  execute({ content }) {
    return SecurityRepository.checkMessageSecurity({ content });
  }
}

let SingleCheckMessageSecurityUsecase = new CheckMessageSecurityUsecase();

export default SingleCheckMessageSecurityUsecase;
