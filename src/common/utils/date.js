import dayjs from "../../libs/dayjs.min.js";

const UNITS_DICT = {
  "year": "年", "month": "月", "week": "周", "day": "天", "hour": "小时", "minute": "分钟", "second": "秒", "millisecond": "毫秒"
};
const UNITS_MILLI_DICT = {
  'year': 31557600000,
  'month': 2629800000,
  'week': 604800000,
  'day': 86400000,
  'hour': 3600000,
  'minute': 60000,
  'second': 1000,
  "millisecond": 1
}

function humanize(timestamp) {
  let res = "";
  let milliseconds = dayjs().diff(timestamp);
  for (let key in UNITS_MILLI_DICT) {
    if (milliseconds >= UNITS_MILLI_DICT[key]) {
      res = `${Math.floor(milliseconds / UNITS_MILLI_DICT[key])} ${UNITS_DICT[key]}前`;
      break;
    }
  }
  return res || "刚刚"
}

export default { dayjs, humanize }

export { dayjs, humanize }
