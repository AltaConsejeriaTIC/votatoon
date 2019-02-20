<template>
  <div id="ballot" class="carousel slide" data-ride="carousel" data-interval="5000000" data-pause="hover"
       data-wrap="false">
       <div class="text-center" >

       <div class="button button-width-ballot" :class="clean" style="margin:0 auto">
         <button class="btn" type="button" @click="clean()">LIMPIAR TARJETON</button>
       </div>
       </div>
    <div class="carousel-inner" role="listbox">
      <div  v-if="!voter[`has_voted_${nomination}`]" class="carousel-item" :class="defineSlideClass(i)" v-for="nomination, i in nominations">
        <div class="row">
          <div class="col-md-4"></div>
          <div class="col-md-4">
            <div class="title-nomination">{{ getNominationName(nomination) }}</div>
          </div>
          <div class="col-md-4"></div>
        </div>

        <div class="row">
          <div class="col-md-12 text-voter">Hola <strong>{{ voter.fname }}</strong>, por favor elige un candidato:
          </div>
        </div>

        <div class="row">
          <div class="col-md-3" v-for="candidate in getCandidatesByNomination(nomination)">
            <div class="candidates-group">
              <div class="candidate-card" :ref="candidate.id" @click="setCandidatesToVote(candidate.id, nomination)">
                <div class="photo">
                  <img :src="candidate.photoUrl" alt="" height="230" width="180" v-if="candidate.photoUrl !== 'undefined'">
                  <img src="../../assets/default_photo.png" alt="" height="230" width="180" v-else>
                  <div class="number">{{ candidate.position }}</div>
                </div>
                <label class="candidate-name">{{ candidate.fname }} {{ candidate.lname }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a class="carousel-control-prev" href="#ballot" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fas fa-arrow-alt-circle-left"></i></span>
      <span class="sr-only">Anterior</span>
    </a>
    <a class="carousel-control-next" href="#ballot" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"><i class="fas fa-arrow-alt-circle-right"></i></span>
      <span class="sr-only">Siguiente</span>
    </a>

    <div class="row">
      <div class="col-md-5">&nbsp;</div>
      <div class="col-md-2 text-center">
        <div class="button button-width-ballot" :class="buttonClassName">
          <button class="btn" type="button" @click="vote()">ENVIAR VOTO</button>
        </div>
      </div>
      <div class="col-md-5">&nbsp;</div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import * as constants from '@/store/constants'

export default {
  data () {
    return {
      active: null,
      buttonClassName: 'disabled',
      selectCandidates: []
    }
  },
  computed: {
    ...mapState({
      nominations: state => state.School.nominations,
      candidates: state => state.School.candidates,
      voter: state => state.Ballot.voter,
      school: state => state.School.school
    })
  },
  methods: {
    ...mapActions({
      doVote: constants.BALLOT_VOTE
    }),
    ...mapMutations({
      setVoter: constants.BALLOT_SET_VOTER
    }),
    ...mapGetters({
      getSchoolId: constants.SCHOOL_GET_ACTIVE
    }),
    clean(){
    location.reload();

    },
    vote () {
      if (this.selectCandidates.length === this.nominations.length) {
        this.candidates.forEach((data) => {
          this.$refs[data.id][0].className = 'candidate-card'
        })
        this.selectCandidates.forEach((data) => {
          this.doVote({idVoter: this.voter.id, idCandidate: data.id, nomination:data.nomination, account: this.school.account, schoolId: this.getSchoolId()})
        })
        this.setVoter({})
        this.$router.push({name: 'ResultVote'})
      }
    },
    getNominationName (val) {
      switch (val) {
        case 'procurator':
          return 'Personero';
        case 'comptroller':
          return 'Contralor';
        case 'observer':
          return 'Veedor';
        case 'councilor':
          return 'Cabildante';
        case 'healthwatch':
          return 'Vigía de la salud'
      }
    },
    getCandidatesByNomination (nomination) {
      const nom = []

      this.candidates.filter((candidate) => {
        if (candidate.nomination === nomination) {
          nom.push(candidate)
        }
      })
      nom.sort((a, b) => {
        if (a.position > b.position) {
          return 1;
        }
        if (a.position < b.position) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
      return nom
    },
    defineSlideClass (index) {
      if (index === 0) {
        return 'active'
      }
    },
    setCandidatesToVote(candidate_id, candidate_nomination) {
      const id = this.selectCandidates.find((data) => {
        if (data.id === candidate_id && data.nomination === candidate_nomination) {
          return true
        }
      })
      const nomination = this.selectCandidates.find((data) => {
        if (data.nomination === candidate_nomination) {
          return true
        }
      })
      if (typeof id === 'undefined' && typeof nomination === 'undefined') {
        this.selectCandidates.push({id: candidate_id, nomination: candidate_nomination})
        this.$refs[candidate_id][0].className = 'candidate-card active'
        this.allSelectedCandidates()
      }
    },
    allSelectedCandidates () {
      if (this.selectCandidates.length === this.nominations.length) {
        this.candidates.forEach((data) => {
          this.$refs[data.id][0].className = 'candidate-card disabled'
        })
        this.selectCandidates.forEach((data) => {
          this.$refs[data.id][0].className = 'candidate-card active'
        })
        this.buttonClassName = 'active'
      }
    }
  }
}
</script>

<style>
  .button-width-ballot {
    width: 200px;
  }

  .text-voter {
    margin-top: 30px;
    font-size: 32px;
    font-weight: 300;
  }

  .photo {
    padding: 10px 10px 14px 10px;
    background: rgba(25, 173, 228, 0.1);
    border-radius: 12px;
    margin: 0 12px;
    height: 254px;
  }

  .photo:hover {
    background: #a1fbff;
  }

  .candidate-card.disabled {
    filter: grayscale(100%)
    opacity(.5);
  }

  .candidates-group {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .candidate-card .photo img {
    box-shadow: 0 4px 0 0 #04436c;
    border-radius: 10px;
    border: 2px solid #04436c;
    cursor: pointer;
    display: block;
    padding: 1px;
    background: white;
  }

  .candidate-card label.candidate-name {
    background: rgba(25, 173, 228, 0.1);
    border-radius: 12px;
    color: #04436c;
    font-size: 18pt;
    font-weight: 200;
    text-align: center;
    width: 200px;
    padding: 10px 10px;
    margin-top: 15px;
  }
  .candidate-card.active .photo {
    background: rgba(25, 173, 228, 0.5);
  }

  .number {
    position: relative;
    margin: 0 auto;
    top: -25px;
    color: #04436c;
    font-size: 24pt;
    width: 45px;
    height: 45px;
    background: white;
    box-shadow: 0 4px 0 0 #04436c;
    font-weight: 200;
    border-radius: 45px;
  }

  .title-nomination {
    padding: 5px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 24pt;
    text-transform: uppercase;
    margin-top: 7px;
    outline: none;
    border-radius: 10px;
    background: #04436c;
    color: white;
    text-align: center;
  }

  .carousel-control-prev-icon, .carousel-control-next-icon {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: transparent no-repeat center center;
    background-size: 100% 100%;
    color: #04436c;
    font-size: 50px;
  }

  .carousel-control-prev {
    left: -120px;
  }
  .carousel-control-next {
    right: -120px;
  }


</style>
