import * as _ from '../lodash.4.17.11';
const ASPECTS = ["before", "after", "around"];

const HELPERS = {
  checkHijackArguments(target, aspect, hijackFunction) {
    return (typeof (target) !== "function")
      || !aspect || ASPECTS.indexOf(aspect) < 0
      || typeof (hijackFunction) !== "function";
  },
  checkInjectArguments(target, match, aspect, InjectFunction) {
    return (typeof (target) !== "object") || typeof (_.get(target, match)) !== "function"
      || !aspect || ASPECTS.indexOf(aspect) < 0
      || typeof (InjectFunction) !== "function";
  }
}

class AOPBase {
  constructor() { }

  // hijack
  createNewHijackFunction(target) {
    let _new = function (...args) {
      let res;
      if (_new.aop["before"]) _new.aop["before"].apply(null, args);
      res = _new.aop["origin"].apply(null, args);
      if (_new.aop["after"]) _new.aop["after"].apply(null, args);
      return res
    }
    _new.aop = {
      origin: target,
      newer: _new,
      remove: () => target
    }
    return _new;
  }
  hijackBase(target, aspect, hijackFunction) {
    if (HELPERS.checkHijackArguments(...arguments)) return;
    if (!target.aop) target = this.createNewHijackFunction(target);
    // TODO: 注入的方式方法有待改进
    target.aop[aspect] = hijackFunction;
    return target;
  }

  // inject
  createNewInjectFunction(target, match) {
    let _new = async function (...args) {
      let res;
      if (_.get(target, match).aop["before"]) await _.get(target, match).aop["before"].apply(this, args);
      res = await _.get(target, match).aop["origin"].apply(this, args);
      if (_.get(target, match).aop["after"]) await _.get(target, match).aop["after"].apply(this, args);
      return res
    }
    _new.aop = {
      origin: _.get(target, match),
      newer: _new,
      remover: {
        remove: function () {
          console.info(_.get(target, match))
        }
      }
    }
    return _new;
  }
  injectBase(target, match, aspect, injectFunction) {
    if (HELPERS.checkInjectArguments(...arguments)) return;
    if (!_.get(target, match).aop) _.set(target, match, this.createNewInjectFunction(target, match))
    // TODO: 注入的方式方法有待改进
    _.get(target, match).aop[aspect] = injectFunction;
    return target;
  }
}

class AOP extends AOPBase {
  constructor() { super() }

  inject(aspect) {
    return (target, match, injectFunction) => {
      return this.injectBase(target, match, aspect, injectFunction)
    }
  }

  hijack(aspect) {
    return (target, hijackFunction) => {
      return this.hijackBase(target, aspect, hijackFunction).aop.remover
    }
  }

  assign() { }

  meld(target, stuffs) { }
}

export default AOP

export { AOP }
