import Vue from 'vue'
import * as constants from '@/store/constants'
import firebase from 'firebase'

const state = {
  txs: [],
  error: null,
  voter: {},
  voterError: {},
  winner: {},
  partial: []
}

const actions = {
  [constants.BALLOT_GET_CANDIDATE_LIST]: ({commit}, { account }) => {
    const headers = {
      address: account
    }
    Vue.axios.get('/getCandidatesList', { headers })
    .then(candidates => {
      commit(constants.BALLOT_SET_PARTIAL, candidates.data)
    })
  },
  [constants.BALLOT_GET_WINNER]: ({commit}, { account, nomination = 'procurator' }) => {
    const headers = {
      address: account
    }
    Vue.axios.get(`/getWinner?nomination=${ nomination }`, { headers })
      .then(winner => {
        commit(constants.BALLOT_SET_WINNER, winner.data)
      })
  },
  [constants.BALLOT_VOTE]: ({commit}, data) => {
    const { idVoter, idCandidate, account, schoolId } = data
    const headers = {
      address: account
    }
    firebase.database().ref(`school/${ schoolId }/candidates/${ idCandidate }`).once('value')
      .then(snapshot => {
        const candidate = snapshot.val()
        const keys = Object.keys(candidate)
        if (keys.includes('votes')) candidate['votes'] += 1
        else candidate['votes'] = 1
        const updates = {}
        updates[`school/${ schoolId }/candidates/${ idCandidate }`] = candidate
        firebase.database().ref().update(updates)
      })
    .catch(console.error)
    Vue.axios.post('/vote', { idVoter, idCandidate }, { headers })
      .then(console.info)
      .catch(console.error)
  },
  [constants.BALLOT_CHECK_VOTER]: ({commit}, data) => {
  },
  [constants.BALLOT_SEND_CANDIDATES]: ({commit}, data) => {
    const headers = {
      address: data.schoolAddress
    }
    for(const [k, v] of Object.entries(data.candidates)) {
      const candidate = {
        id: k,
        fname: v.fname,
        lname: v.lname,
        nomination: v.nomination,
        photoUrl: v.photoUrl,
        position: v.position
      }
      console.log(candidate)
      Vue.axios.post('/addCandidate', candidate, {headers})
        .then(tx => {
          commit(constants.BALLOT_SET_TX, { tx: tx, type: 'setCandidate' })
        })
        .catch(error => {
          commit(constants.BALLOT_SET_ERROR, { error: error, type: 'setCandidate' })
        })
    }
  }
}

const mutations = {
  [constants.BALLOT_SET_TX]: (state, tx) => { state.txs.push(tx.data.tx) },
  [constants.BALLOT_SET_ERROR]: (state, error) => { state.error = error },
  [constants.BALLOT_SET_VOTER]: (state, voter) => { state.voter = voter },
  [constants.BALLOT_SET_VOTER_ERROR]: (state, error) => { state.voterError = error },
  [constants.BALLOT_SET_WINNER]: (state, winner) => { state.winner = winner },
  [constants.BALLOT_SET_PARTIAL]: (state, partial) => { state.partial = partial }
}

const getters = { }

export default {
  state,
  actions,
  mutations,
  getters
}
