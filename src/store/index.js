import Vue from 'vue'
import Vuex from 'vuex'
import PosterStore from './poster/app'
import SystemStore from './system/app'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		poster: PosterStore,
		system: SystemStore
	},
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null
	},
	getters: {},
	mutations: {},
	actions: {}
})

export default store
