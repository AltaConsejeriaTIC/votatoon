<template>
  <div>
    <h1>Candidatos</h1>
    <form>
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Foto</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(candidate, id) in candidates">
            <th scope="row">{{ id }}</th>
            <td>{{ candidate.fname }} {{ candidate.lname }}</td>
            <td>
              <img :src="candidate.photoUrl" v-if="candidate.photoUrl">
              <input type="file" class="form-control-file" :id="id" @change="upload" v-else accept=".jpg, .png, .jpeg">
            </td>
            <td>
              <router-link class="btn btn-danger" :to="{ name: 'CandidateEdit', params: { id: id } }">Editar</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">
      Enviar candidatos a la cadena de bloques
    </button>

    <!-- Modal -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="title">Advertencia</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Por favor, antes de enviar los candidatos a la cadena de bloques, verifique que la información es correcta. Esta operación puede tomar algún tiempo.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="sendCandidates">Enviar candidatos a la cadena de bloques</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import * as constants from '@/store/constants'

export default {
  computed: {
    ...mapState({
      candidates: state => state.School.candidates,
      txs: state => state.Ballot.txs,
      school: state => state.School.school,
      txsError: state => state.Ballot.error
    })
  },
  methods: {
    ...mapActions({
      getCandidates: constants.SCHOOL_GET_CANDIDATES,
      sendCandidatesToBC: constants.BALLOT_SEND_CANDIDATES,
      uploadCandidatePhoto: constants.SCHOOL_UPLOAD_PHOTO
    }),
    ...mapGetters({
      getActiveSchool: constants.SCHOOL_GET_ACTIVE
    }),
    ...mapMutations({
      setActiveSchool: constants.SCHOOL_SET_SCHOOL
    }),
    sendCandidates () {
      const data = { candidates: this.candidates, schoolAddress: this.school.account }
      this.sendCandidatesToBC(data)
    },
    upload (e) {
      const files = e.target.files
      if (!files.length) return
      const file = files[0]
      const id = e.target.id
      console.log(id, file)
      const data = {
        schoolId: this.getActiveSchool(),
        candidateId: id,
        file: file
      }
      this.uploadCandidatePhoto(data)
    }
  },
  created () {
    this.setActiveSchool(this.getActiveSchool())
    this.getCandidates(this.getActiveSchool())
  }
}
</script>
