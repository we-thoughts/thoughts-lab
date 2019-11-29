import SystemRepository from "../system/system.repository";

class PublicRepository {
  constructor() {}
  getCreditInfo() {
    return SystemRepository.getCreditInfoByOpenid();
  }
  getUserInfo() {
    return SystemRepository.getUserInfo()
  }
}

let SinglePublicRepository = new PublicRepository();

export default SinglePublicRepository;
