import * as DateUtils from "./date";
import * as MobiusLodash from "./mobius-lodash";

let { ArrayUtils } = MobiusLodash;

let Utils = {
  Date: DateUtils,
  Array: ArrayUtils
};
export default Utils

let { Date, Array } = Utils;
export {
  Date, Array
}
