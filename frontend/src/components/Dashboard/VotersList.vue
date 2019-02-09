<template>
  <div>
    <h1>Votantes</h1>
    <form>
      <table class="table table-sm table-hover">
        <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Nombre</th>
          <th scope="col">Curso</th>
          <th scope="col">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(voter, id) in voters">
          <th scope="row">{{ id }}</th>
          <td>{{ voter.fname }} {{ voter.lname }}</td>
          <td>{{ voter.course }}</td>
          <td>
            <!--router-link class="btn btn-danger" :to="{ name: 'CandidateEdit', params: { id: id } }">Editar</router-link-->
          </td>
        </tr>
        </tbody>
      </table>
    </form>

  </div>

</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import * as constants from '@/store/constants'

  export default {
    computed: {
      ...mapState({
        voters: state => state.School.voters,
        school: state => state.School.school
      })
    },
    methods: {
      ...mapActions({
        getVoters: constants.SCHOOL_GET_VOTERS,
      }),
      ...mapGetters({
        getActiveSchool: constants.SCHOOL_GET_ACTIVE,
      }),
      ...mapMutations({
        setActiveSchool: constants.SCHOOL_SET_SCHOOL
      })
    },
    created () {
      this.setActiveSchool(this.getActiveSchool())
      this.getVoters(this.getActiveSchool())
    }
  }

</script>

<style scoped>

</style>
