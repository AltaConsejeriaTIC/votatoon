<template>
  <div>
    <h1>Administrar Colegios</h1>
    <div>
      <router-link class="btn btn-primary" :to="{ name: 'SchoolNew' }">Nuevo</router-link>
    </div>
    <form>
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Cuenta</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(school, id) in schools">
            <th scope="row">{{ id }}</th>
            <td>{{ school.name }}</td>
            <td>{{ school.account }}</td>
            <td>
              <router-link class="btn btn-danger" :to="{ name: 'SchoolEdit', params: { id: id } }">Editar</router-link>
              <template v-if="school.active">
                <router-link class="btn btn-primary" :to="{ name: 'SchoolUpload', params: { id: id } }">Listas</router-link>
                <button type="button" class="btn btn-info" @click="sendToBC(id)">Agregar a BC</button>
                <button type="button" class="btn btn-success" @click="startElection(id)">Iniciar Proceso</button>
                <router-link class="btn btn-primary" :to="{ name: 'Partial' }">Parciales</router-link>
                <router-link class="btn btn-primary" :to="{ name: 'Results' }">Finales</router-link>
              </template>
              <template v-else>
                <button type="button" class="btn btn-warning" @click="activate(id)">Activar</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as constants from '@/store/constants'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      schools: state => state.School.schools
    }),
    active () {
      for (const [k, v] of Object.entries(this.schools)) {
        if (v.active) return k
      }
    }
  },
  methods: {
    ...mapActions({
      toggle: constants.SCHOOL_TOGGLE_ACTIVE,
      sendSchool: constants.SCHOOL_SEND_TO_BC,
      startElectionProcess: constants.SCHOOL_SET_ELECTION
    }),
    activate (id) {
      this.toggle({ inactive: this.active, active: id })
    },
    sendToBC (id) {
      this.sendSchool(this.schools[id])
    },
    startElection (id) {
      this.startElectionProcess({ id, school: this.schools[id], status: true })
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
