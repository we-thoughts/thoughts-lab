// 公共服务
import SingleUserService from "./common/user";
import SingleCreditService from "./common/credit";
import SingleFileService from "./common/file";
// 系统级服务
import SingleLoginService from "./system/login";
// 应用级服务
import SingleChangelogService from "./public/changelog";
import SinglePosterService from "./poster/poster";

let Services = {
  common: {
    user: SingleUserService,
    credit: SingleCreditService,
    file: SingleFileService
  },
  public: {
    changelog: SingleChangelogService
  },
  system: {
    login: SingleLoginService
  },
  poster: {
    poster: SinglePosterService
  }
};

export default Services;
