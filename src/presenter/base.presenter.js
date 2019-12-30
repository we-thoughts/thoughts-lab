
import utils from '../common/utils';

class BasePresenter {

  $utils = utils;

  constructor() {
    this.subscriptions = {};
  }
  bindPage(page) {
    this.page = page;
  }
  subscribe(observable, observer) {
    this.subscriptions[observable] = (this[observable].subscribe(observer.bind(this.page)));
  }

  unsubscribe(observable) {
    this.subscriptions[observable].unsubscribe()
    delete this.subscriptions[observable];
  }

  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach((observable) => {
      this.subscriptions[observable].unsubscribe()
    })
    this.subscriptions = {};
  }
}

export default BasePresenter;
