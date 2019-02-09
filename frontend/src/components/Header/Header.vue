<template>
  <header>
    <h1>Votaciones {{ name }}</h1>
    <h2>Votación representante estudiantil 2018</h2>
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
