<template>
  <div>
    <h1>Candidato</h1>
    <form @submit.prevent>
      <div class="form-group">
        <label for="fname">Nombres</label>
        <input type="text" class="form-control" id="fname" v-model="candidate.fname">
      </div>
      <div class="form-group">
        <label for="lname">Apellidos</label>
        <input type="text" class="form-control" id="lname" v-model="candidate.lname">
      </div>
      <div class="form-group">
        <label for="proposal">Propuesta</label>
        <textarea v-model="candidate.proposal" id="proposal" class="form-control"></textarea>
      </div>
      <button type="button" class="btn btn-primary">Actualizar</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import * as constants from '@/store/constants'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      candidate: state => state.School.candidate
    })
  },
  methods: {
    ...mapActions({
      getCandidate: constants.SCHOOL_GET_CANDIDATE
    }),
    ...mapGetters({
      getActiveSchool: constants.SCHOOL_GET_ACTIVE
    })
  },
  created () {
    this.getCandidate({ candidate: this.id, school: this.getActiveSchool() })
  }
}
</script>
