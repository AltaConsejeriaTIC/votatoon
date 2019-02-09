<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col text-center img-header">
          <a href="/"><img src="./assets/logo_bogotamejorparatodos.png" class="logo-bogota"/></a>
        </div>
      </div>
      <admin-nav v-if="isAdminLogged() && !isUnderElection"> </admin-nav>
      <heading> </heading>
      <router-view/>
    </div>
    <footing> </footing>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import * as constants from '@/store/constants'

import AdminNav from '@/components/Header/AdminNav'
import Heading from '@/components/Header/Header'
import Footing from '@/components/Header/Footer'

export default {
  name: 'App',
  computed: {
    ...mapState({
      schools: state => state.School.schools,
      isUnderElection: state => state.School.school.isUnderElection
    })
  },
  methods: {
    ...mapActions({
      authChanged: constants.SESSION_AUTH_CHANGED,
      getSchools: constants.SCHOOL_GET_SCHOOLS
    }),
    ...mapMutations({
      setSchool: constants.SCHOOL_SET_SCHOOL
    }),
    ...mapGetters({
      isAdminLogged: constants.SESSION_IS_ADMIN_LOGGED
    })
  },
  created () {
    this.authChanged()
    this.getSchools()
  },
  components: {
    AdminNav,
    Heading,
    Footing
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Bree+Serif:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i');
@import "./styles/styles.scss";
</style>
