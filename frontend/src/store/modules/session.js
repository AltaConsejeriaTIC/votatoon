import firebase from 'firebase'
import * as constants from '@/store/constants'

const emptyAdmin = () => {
  return {
    name          : undefined,
    email         : undefined,
    emailVerified : undefined,
    uid           : undefined
  }
}

const state = {
  admin: emptyAdmin()
}

const actions = {
  [constants.SESSION_ADMIN_LOGIN]: ({commit}, data) => {
    firebase.auth().signInWithEmailAndPassword(data.email, data.password)
      .then(user => {
        commit(constants.SESSION_SET_ADMIN, user)
      })
      .catch(console.error)
  },
  [constants.SESSION_AUTH_CHANGED]: ({commit}) => {
    firebase.auth().onAuthStateChanged(user => {
      commit(constants.SESSION_SET_ADMIN, user)
    })
  }
}

const mutations = {
  [constants.SESSION_SET_ADMIN]: (state, admin) => {
    if (admin) {
      state.admin.name          = admin.displayName
      state.admin.email         = admin.email
      state.admin.emailVerified = admin.emailVerified
      state.admin.uid           = admin.uid
    } else {
      state.admin = emptyAdmin()
    }
  }
}

const getters = {
  [constants.SESSION_IS_ADMIN_LOGGED]: state => {
    return state.admin.uid !== undefined
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
