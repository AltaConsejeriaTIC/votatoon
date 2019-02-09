<template>

<div>
  <div class="row">
    <div class="col-12 text-center size-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="col-md-12 text-voter text-center ">
      <strong>!Su voto se ha registrado con éxito!</strong>
    </div>
    <div class="margin-top45">&nbsp;</div>

  </div>

  <div class="row">
    <div class="col-md-4">&nbsp;</div>
    <div class="col-md-4">
      <div class="button center-block button-width-rv" :class="buttonClassName" v-on:mouseover="buttonEvents('mouseover')" v-on:mouseout="buttonEvents('mouseout')">
        <button class="btn" type="button" @click="goHomePage()">Finalizar</button>
      </div>
    </div>
    <div class="col-md-4">&nbsp;</div>
  </div>

</div>
</template>

<script>
  export default {
    data () {
      return {
        buttonClassName: 'disabled'
      }
    },
    methods: {
      buttonEvents(event) {
        if (event === 'mouseover' ) {
          this.buttonClassName = 'active'
        } else if (event === 'mouseout') {
          this.buttonClassName = 'disabled'
        }
      },
      setHomePage() {
        setTimeout(() => {
          this.$router.push({ name: 'Home' })
        }, 3000)
      },
      goHomePage() {
        this.$router.push({ name: 'Home' })
      }

    },
    mounted () {
      this.setHomePage()
    }
  }
</script>

<style>
  .button-width-rv {
    width: 145px;
  }

  .text-voter {
    margin-top: 30px;
    font-size: 32px;
    font-weight: 300;
  }

  .size-icon {
    font-size: 150px;
    color: #42e26b;
  }

</style>
