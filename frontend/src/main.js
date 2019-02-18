import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as firebase from 'firebase'

import { sync } from 'vuex-router-sync'
import { config } from './firebase'

sync(store, router)
Vue.use(VueAxios, axios)

const local = `http://138.68.254.20:3000`
const production = `http://138.68.254.20:3000`

switch(process.env.NODE_ENV) {
  case 'development':
    Vue.axios.defaults.baseURL = local
    break
  case 'production':
    Vue.axios.defaults.baseURL = production
    break
}

Vue.axios.defaults.headers.common['Authorization'] = 'Basic dml2ZWxhYjp2aXZlbGFiYm9nb3Rh'

Vue.config.productionTip = false

firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
