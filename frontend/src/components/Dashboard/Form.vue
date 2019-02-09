<template>
  <div>
    <h1>Formulario Colegio</h1>
    <form @submit.prevent>
      <div class="form-group">
        <label for="name">Nombre del colegio</label>
        <input type="text" class="form-control" id="name" v-model="school.name">
      </div>
      <div class="form-group">
        <label for="account">Cuenta</label>
        <input type="text" class="form-control" id="account" v-model="school.account">
      </div>
      <div class="form-group">
        <label for="start">Fecha de inicio proceso electoral</label>
        <input type="date" class="form-control" id="startDate" v-model="startDate">
        <input type="time" class="form-control" id="startTime" v-model="startTime">
        {{ school.start }}
      </div>
      <div class="form-group">
        <label for="end">Fecha de finalización proceso electoral</label>
        <input type="date" class="form-control" id="endDate" v-model="endDate">
        <input type="time" class="form-control" id="endTime" v-model="endTime">
        {{ school.end }}
      </div>
      <button type="button" class="btn btn-primary" @click="save">{{ isNew ? 'Crear' : 'Actualizar' }} </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import * as constants from '@/store/constants'
import moment from 'moment'

export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      ids: null,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null
    }
  },
  computed: {
    ...mapState({
      school: state => state.School.school,
      route: state => state.route.name
    }),
    isNew () {
      return this.route === 'SchoolNew'
    }
  },
  watch: {
    'school.name' (val) {
      this.ids = `${ val.split(' ').map(w => w.substr(0,1)).join('').toLowerCase() }-${ val.length }`
    },
    startTime (val) {
      this.school.start = moment(`${ this.startDate } ${ val }`).format('X')
    },
    startDate (val) {
      this.school.start = moment(`${ val } ${ this.startTime }`).format('X')
    },
    endDate (val) {
      this.school.end = moment(`${ val } ${ this.endTime }`).format('X')
    },
    endTime (val) {
      this.school.end = moment(`${ this.endDate } ${ val }`).format('X')
    }
  },
  methods: {
    ...mapActions({
      saveSchool: constants.SCHOOL_SAVE
    }),
    ...mapMutations({
      setSchool: constants.SCHOOL_SET_SCHOOL
    }),
    save () {
      const { name, account, start, end } = this.school
      this.saveSchool({ id: this.ids, data: { name, account, start, end, active: false } })
      this.$router.push({ name: 'Schools' })
    }
  },
  created () {
    this.setSchool(this.id)
  }
}
</script>
