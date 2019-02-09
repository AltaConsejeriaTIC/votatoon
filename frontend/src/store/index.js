import Vue from 'vue'
import Vuex from 'vuex'

import School from './modules/school'
import Session from './modules/session'
import Ballot from './modules/ballot'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    School,
    Session,
    Ballot
  }
})
