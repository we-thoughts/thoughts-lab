import GlobalStorage from '../../data/storage/index'
import CreditSubmodule from './credit'
import UserSubmodule from './user'

let credit = new CreditSubmodule(GlobalStorage)
let user = new UserSubmodule(GlobalStorage)

export default {
  credit,
  user
}

export { credit, user }
