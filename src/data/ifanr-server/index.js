// 公共服务
import SingleUserService from './common/user'
import SingleCreditService from './common/credit'
import SingleFileService from './common/file'
// 系统级服务
import SingleLoginService from './system/login'
import SingleChangelogService from './system/changelog'
// 应用级服务
import SinglePosterService from './poster/poster'

let Services = {
  common: {
    user: SingleUserService,
    credit: SingleCreditService,
    file: SingleFileService
  },
  system: {
    login: SingleLoginService,
    changelog: SingleChangelogService,
  },
  poster: {
    poster: SinglePosterService
  }
}

export default Services

let { common, system, poster} = Services;

export { common, system, poster}
