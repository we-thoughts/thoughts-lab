import * as _ from "../../libs/lodash.4.17.11";

// const difference = (a, b) => {
//   const s = new Set(b);
//   return a.filter(x => !s.has(x));
// };

let { difference, intersection } = _;

let ArrayUtils = { difference, intersection };

export default { ArrayUtils }

export { ArrayUtils }
