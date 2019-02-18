<template>
  <header>
    <h1>Votaciones {{ name }}</h1>
    <h2>Votación personero estudiantil {{ new Date().getFullYear() }}</h2>
    <h4>Colegio de educación Distrital el Rodeo</h4>
    <h4>Localidad San Cristobal</h4>


  </header>
</template>

<script>
import { mapState } from 'vuex'
import * as constants from '@/store/constants'

export default {
  computed: {
    ...mapState({
      name: state => state.School.school.name || 'Escolares'
    })
  }
}
</script>
