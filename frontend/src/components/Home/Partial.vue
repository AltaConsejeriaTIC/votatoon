<template>
  <div>
    <template v-if="route === 'Partial'">
      <div v-for="candidate in school.candidates" v-if="candidate !== undefined">
        <h3>{{ candidate.fname }} {{ candidate.lname }}</h3>
        <strong>Votos:</strong> {{ candidate.votes }} <br/>
        <strong>Cargo:</strong> {{ candidate.nomination }}
      </div>
    </template>
    <template v-else>
      <div v-for="candidate in partial">
        <h3>{{ candidate.fname }} {{ candidate.lname }}</h3>
        <strong>Votos:</strong> {{ candidate.votes }} <br/>
        <strong>Cargo:</strong> {{ candidate.nomination }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as constants from '@/store/constants'

export default {
  computed: {
    ...mapState({
      route: state => state.route.name,
      partial: state => state.Ballot.partial,
      school: state => state.School.school
    })
  },
  methods: {
    ...mapActions({
      getResults: constants.BALLOT_GET_CANDIDATE_LIST
    })
  },
  created () {
    if (this.route === 'Results')
      this.getResults({ account: this.school.account })
  }
}
</script>
