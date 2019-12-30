import {map} from "rxjs/operators";
import SystemRepository from "../system.repository";

class GetSystemConfigUsecase {
  constructor() {}
  execute() {
    return SystemRepository.config$.pipe(
      map(config => config.apps.system)
    );
  }
}


let SingleGetSystemConfigUsecase = new GetSystemConfigUsecase();

export default SingleGetSystemConfigUsecase;
