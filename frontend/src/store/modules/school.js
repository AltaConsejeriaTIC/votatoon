import Vue from 'vue'
import firebase from 'firebase'
import * as constants from '@/store/constants'

const emptySchool = () => {
  return {
    name: null,
    active: false,
    account: null,
    start: null,
    end: null,
    isUnderElection: false
  }
}

const state = {
  school: emptySchool(),
  schools: [],
  candidate: {},
  candidates: [],
  nominations: []
}

const actions = {
  [constants.SCHOOL_UPLOAD_PHOTO]: ({}, data) => {
    const file = firebase.storage().ref().child(`images/${ data.schoolId }/candidates/${ data.candidateId }${ data.file.name }`).put(data.file)
    file.on(firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {},
        error => { console.error(error) },
        success => {
          const update = {}
          update[`/school/${ data.schoolId }/candidates/${ data.candidateId }/photoUrl`] = file.snapshot.downloadURL
          firebase.database().ref().update(update)
        }
        )
  },
  [constants.SCHOOL_SET_ELECTION]: ({commit}, data) => {
    const headers = {
      address: data.school.address
    }
    const updates = {}
    updates[`school/${ data.id }/isUnderElection`] = data.status
    firebase.database().ref().update(updates)
      .then(() => {
        commit(constants.SCHOOL_SET_ELECTION_STATUS, data.status)
      })
  },
  [constants.SCHOOL_SEND_TO_BC]: ({}, school) => {
    const headers = {
      address: school.account
    }
    const { name, start, end } = school
    const s = { name, start, end }
    Vue.axios.post('/addSchool', s, {headers})
      .then(console.info)
      .catch(console.error)
  },
  [constants.SCHOOL_GET_SCHOOLS]: ({commit, dispatch}) => {
    firebase.database().ref('school').on('value', snapshot => {
      commit(constants.SCHOOL_SET_SCHOOLS, snapshot.val())
      setTimeout(() => {
        dispatch(constants.SCHOOL_GET_BC_CANDIDATES)
      }, 2000)
    })
  },
  [constants.SCHOOL_SAVE_SCHOOL]: ({commit}, school) => {
    firebase.database().ref(`school/${ school.id }`).set({
      account: school.account,
      active: false,
      name: school.name
    })
  },
  [constants.SCHOOL_SET_INACTIVE]: ({}, id) => new Promise((resolve, reject) => {
    firebase.database().ref(`school/${ id }/active`).set(false).then(resolve).catch(reject)
  }),
  [constants.SCHOOL_SET_ACTIVE]: ({}, id) => new Promise((resolve, reject) => {
    firebase.database().ref(`school/${ id }/active`).set(true).then(resolve).catch(reject)
  }),
  [constants.SCHOOL_TOGGLE_ACTIVE]: ({dispatch}, data) => {
    dispatch(constants.SCHOOL_SET_ACTIVE, data.active)
      .then(() => {
        if (data.inactive !== undefined) dispatch(constants.SCHOOL_SET_INACTIVE, data.inactive)
      })
      .catch(console.error)
  },
  [constants.SCHOOL_SAVE]: ({}, school) => {
    const data = {}
    const dataList = [ 'name', 'account', 'active', 'start', 'end' ]
    for (const [k, v] of Object.entries(school.data)) {
      if (dataList.includes(k)) data[k] = v
    }
    data['active']          = false
    data['isUnderElection'] = false
    firebase.database().ref(`school/${ school.id }`).set(data)
  },
  [constants.SCHOOL_UPLOAD_CANDIDATES]: ({}, school) => {
    const candidates = {}
    school.candidates.forEach(candidate => {
      const { code, ...data } = candidate
      candidates[code] = data
    })
    firebase.database().ref(`school/${ school.id }/candidates`).set(candidates)
  },
  [constants.SCHOOL_UPLOAD_VOTERS]: ({}, school) => {
    const voters = {}
    school.voters.forEach(voter => {
      const { code, ...data } = voter
      voters[code] = data
    })
    firebase.database().ref(`school/${ school.id }/voters`).set(voters)
  },
  [constants.SCHOOL_GET_VOTERS]: ({commit}, school) => {
    firebase.database().ref(`school/${ school }/voters`).on('value', snapshot => {
      commit(constants.SCHOOL_SET_VOTERS, snapshot.val())
    })
  },
  [constants.SCHOOL_GET_CANDIDATES]: ({commit}, school) => {
    firebase.database().ref(`school/${ school }/candidates`).on('value', snapshot => {
      commit(constants.SCHOOL_SET_CANDIDATES, snapshot.val())
    })
  },
  [constants.SCHOOL_GET_CANDIDATE]: ({commit}, data) => {
    firebase.database().ref(`school/${ data.school }/candidates/${ data.candidate }`).once('value')
      .then(snapshot => {
        commit(constants.SCHOOL_SET_CANDIDATE, snapshot.val())
      })
  },
  [constants.SCHOOL_GET_BC_CANDIDATES]: ({commit, state}) => {
    if (state.school.account) {
      const headers = {
        address: state.school.account
      }
      Vue.axios.get('/getCandidatesList', {headers})
        .then(candidates => {

          commit(constants.SCHOOL_SET_CANDIDATES, candidates.data)

          let c = []
          for (const v of Object.values(candidates.data)) {
            c.push(v.nomination)
          }

          return c
        })
        .then(candidates => {
          let result = candidates.sort().reduce((init, current) => {
            if (init.length === 0 || init[init.length - 1] !== current) {
              init.push(current)
            }
            return init
          }, [])
          commit(constants.SCHOOL_SET_BC_NOMINATIONS, result)
        })
    }
  }
}

const mutations = {
  [constants.SCHOOL_SET_SCHOOLS]: (state, schools) => {
    state.schools = schools
    for(const [k, v] of Object.entries(schools)) {
      if (v.isUnderElection) state.school = schools[k]
    }
  },
  [constants.SCHOOL_SET_SCHOOL]: (state, school) => { state.school = Object.assign({}, emptySchool(), state.schools[school]) },
  [constants.SCHOOL_SET_CANDIDATES]: (state, candidates) => { state.candidates = candidates },
  [constants.SCHOOL_SET_CANDIDATE]: (state, candidate) => { state.candidate = candidate },
  [constants.SCHOOL_SET_VOTERS]: (state, voters) => { state.voters = voters },
  [constants.SCHOOL_SET_ELECTION_STATUS]: (state, status) => { state.school.isUnderElection = status },
  [constants.SCHOOL_SET_BC_NOMINATIONS]: (state, nominations) => { state.nominations = nominations }
}

const getters = {
  [constants.SCHOOL_GET_ACTIVE]: state => {
    for (const [k, v] of Object.entries(state.schools)) {
      if (v.active) return k
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
