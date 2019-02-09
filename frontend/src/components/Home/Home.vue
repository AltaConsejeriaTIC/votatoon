<template>
  <div>
    <login></login>
    <login-student></login-student>
    <div class="alert alert-danger margin-top45" role="alert" v-if="voter === undefined">
      Estimado estudiante, usted no aparece en nuestros registros. Verificar con su profesor.
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as constants from '@/store/constants'

import Login from './Login'
import LoginStudent from './LoginStudent'

export default {
  computed: {
    ...mapState({
      voter: state => state.Ballot.voter
    })
  },
  watch: {
    voter (val) {
      if (val === undefined) {
        setTimeout(() => { this.setVoter({}) }, 5000)
      } else if (val.id) {
        this.$router.push({ name: 'Ballot' })
      }
    }
  },
  methods: {
    ...mapMutations({
      setVoter: constants.BALLOT_SET_VOTER
    })
  },
  components: {
    Login,
    LoginStudent
  }
}
</script>
