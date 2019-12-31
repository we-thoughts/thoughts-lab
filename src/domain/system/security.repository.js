import { from } from "rxjs";
import { map } from "rxjs/operators";

import WxServerData from "../../data/wx-server";

const WX_MES_CHECK_RESCODE = {
  0: true,
  87014: false
};

class SecurityRepository {

  constructor() { }

  checkMessageSecurity({ content }) {
    return from(WxServerData.msgSecCheck({ content })).pipe(
      map(res => WX_MES_CHECK_RESCODE[res.result.errCode])
    );
  }

}

let SingleSecurityRepository = new SecurityRepository();

export default SingleSecurityRepository;
