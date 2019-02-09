<template>
  <div>
    <form @submit.prevent v-if="isAdminLogin">
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input type="email" class="form-control" id="email" v-model="admin.email">
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" class="form-control" id="password" v-model="admin.password">
      </div>
      <button type="button" class="btn btn-primary" @click="login">Iniciar sesión</button>
    </form>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import * as constants from '@/store/constants'

  export default {
    data () {
      return {
        admin: { email: null, password: null },
        school: ''
      }
    },
    computed: {
      ...mapState({
        route: state => state.route.name
      }),
      isAdminLogin () {
        return this.route === 'AdminLogin'
      }
    },
    methods: {
      ...mapActions({
        adminLogin: constants.SESSION_ADMIN_LOGIN,
      }),
      login () {
        if (this.isAdminLogin) {
          this.adminLogin(this.admin)
          this.$router.push({name: 'Dashboard'})
        }
      }
    },
    created () {
    }
  }
</script>
