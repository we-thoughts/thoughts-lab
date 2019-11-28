import Vue from 'vue';
import { Observable } from 'rxjs/Observable';
import App from './App';

import store from './store/index';
import utils from './common/utils';

// 引入组件
import basePageLayout from "./components/mobius-pagelayout/mobius-pagelayout";
import navbar from "./components/mobius-wxnavbar/mobius-wxnavbar";
import tagbar from "./components/mobius-tagbar/mobius-tagbar";
import scrolllist from "./components/mobius-scrolllist/mobius-scrolllist";
import posterCard from "./components/poster-card/poster-card";
import loadmore from "./components/mobius-loadmore/mobius-loadmore";
import myPosterCard from "./components/myposter-card/myposter-card";
import timelineItem from "./components/timeline-item/timeline-item";
Vue.component("base-page-layout", basePageLayout);
Vue.component("navbar", navbar);
Vue.component("tagbar", tagbar);
Vue.component("scrolllist", scrolllist);
Vue.component("poster-card", posterCard);
Vue.component("loadmore", loadmore);
Vue.component("myposter-card", myPosterCard);
Vue.component("timeline-item", timelineItem);

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$utils = utils

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
