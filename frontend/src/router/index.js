import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'

import Home from '@/components/Home/Home'

import Schools from '@/components/Dashboard/Schools'
import SchoolList from '@/components/Dashboard/List'
import SchoolForm from '@/components/Dashboard/Form'
import SchoolUpload from '@/components/Dashboard/UploadLists'
import SchoolCandidates from '@/components/Dashboard/CandidatesList'
import SchoolVoters from '@/components/Dashboard/VotersList'
import CandidateEdit from '@/components/Dashboard/CandidateForm'

import Ballot from '@/components/Home/Ballot'
import ResultVote from '@/components/Home/ResultVote'
import Partial from '@/components/Home/Partial.vue'
import Winner from '@/components/Home/Winner.vue'

import AdminLogin from '@/components/Home/Login'

Vue.use(Router)

const authRequired = (to, from, next) => {
  if (store.getters['session/SESSION_IS_ADMIN_LOGGED']) {
    next()
  } else {
    next({name: 'Home'})
  }
}

export default new Router({
  mode: 'history',
  routes: [
    { path: '/'          , name: 'Home'      , component: Home }      ,
    { path: '/ballot'    , name: 'Ballot'    , component: Ballot }    ,
    { path: '/adminlogin', name: 'AdminLogin', component: AdminLogin },
    { path: '/resultvote', name: 'ResultVote', component: ResultVote },
    { path: '/partial'   , name: 'Partial'   , component: Partial }   ,
    { path: '/results'   , name: 'Results'   , component: Winner }   ,
    {
      path: '/schools',
      component: Schools,
      beforeEnter: authRequired,
      children: [
        { path: ''                   , name: 'Schools'         , component: SchoolList }      ,
        { path: 'new'                , name: 'SchoolNew'       , component: SchoolForm }      ,
        { path: ':id/edit'           , name: 'SchoolEdit'      , component: SchoolForm        , props: true },
        { path: ':id/upload'         , name: 'SchoolUpload'    , component: SchoolUpload      , props: true },
        { path: 'candidates'         , name: 'SchoolCandidates', component: SchoolCandidates },
        { path: 'voters'             , name: 'SchoolVoters'    , component: SchoolVoters },
        { path: 'candidates/:id/edit', name: 'CandidateEdit'   , component: CandidateEdit     , props: true }
      ]
    }
  ]
})
