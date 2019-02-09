<template>

  <div class="margin-top80">
    <form @submit.prevent="studentLogin">

      <div class="row">
        <div class="col-md-12 text-center"><span class="title-login">Código de estudiante:</span></div>
        <div class="col-md-4">&nbsp;</div>
        <div class="col-md-4 text-center">
          <div class="form-group">
            <input type="text" class="form-control" id="code" v-model="code">
          </div>
        </div>
        <div class="col-md-4">&nbsp;</div>
      </div>

      <div class="row margin-top45">
        <div class="col-md-4">&nbsp;</div>
        <div class="col-md-4">
          <div class="button center-block button-width-le" :class="buttonClassName" v-on:mouseover="buttonEvents('mouseover')" v-on:mouseout="buttonEvents('mouseout')">
            <button class="btn" type="submit">ENTRAR A VOTAR</button>
          </div>
        </div>
        <div class="col-md-4">&nbsp;</div>
      </div>
    </form>


  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as constants from '@/store/constants'

export default {
  data () {
    return {
      code: null,
      buttonClassName: 'active'
    }
  },
  computed: {
    ...mapState({
      school: state => state.School.school
    })
  },
  methods: {
    ...mapMutations({
      loadStudent: constants.BALLOT_SET_VOTER
    }),
    studentLogin () {
      const voter = this.school.voters[this.code]
      if (voter !== undefined){
        voter['id'] = this.code
      }
      this.loadStudent(voter)
    },
    buttonEvents(event) {
      if (event === 'mouseover' ) {
        this.buttonClassName = 'disabled'
      } else if (event === 'mouseout') {
        this.buttonClassName = 'active'
      }
    }

  }
}
</script>

<style>

  .button-width-le {
    width: 235px;
  }

</style>
