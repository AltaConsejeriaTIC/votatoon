<template>
  <div class="margin-top80 text-center">
    <h1>Resultado de las elecciones</h1>

    <div class="dropdown show">
      <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Personero
      </a>

      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <a class="dropdown-item" href="/getWinnerComptroller">Contralor</a>
        <a class="dropdown-item" href="/getWinnerObserver">Veedor</a>
        <a class="dropdown-item" href="/getWinnerCouncilor">Cabildante</a>
        <a class="dropdown-item" href="/getWinnerHealthwatch">Vigía de la salud</a>
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center margin-top45"><h2>Ganador:</h2>
      <br> <h2>{{ winner.fname }} {{ winner.lname }} <br> {{ winner.votes }} votos</h2></div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import * as constants from '@/store/constants'


export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      school: state => state.School.school,
      candidates: state => state.School.candidates,
      winner: state => state.Ballot.winner
    })
  },
  methods: {
    ...mapActions({
      getWinner: constants.BALLOT_GET_WINNER
    }),
    displayWinner(nomination) {
      setTimeout(() => {
        console.log(this.school.account)
        this.getWinner({ account: this.school.account, nomination: nomination })
      }, 2000)
    },

  },
  mounted () {
    this.displayWinner('procurator')
  }
}
</script>
