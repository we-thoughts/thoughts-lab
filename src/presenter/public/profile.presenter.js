
import GetCreditInfoUsecase from "../../domain/public/usecases/get-creditinfo.usecase";
import GetUserInfoUsecase from "../../domain/public/usecases/get-userinfo.usecase";

class ProfilePresenter {
  constructor() {}

  getCreditInfo() {
    return GetCreditInfoUsecase.execute();
  }

  getUserInfo() {
    return GetUserInfoUsecase.execute();
  }

}

let SingleProfilePresenter = new ProfilePresenter();

export default SingleProfilePresenter;
