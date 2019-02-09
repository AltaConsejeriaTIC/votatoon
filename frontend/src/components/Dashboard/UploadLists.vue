<template>
  <div>
    <h1>Subir listas</h1>
    <form>
      <div class="form-group">
        <label for="candidates">Lista de candidatos</label>
        <input type="file" class="form-control-file" id="candidates" @change="upload">
      </div>
    </form>
    <form>
      <div class="form-group">
        <label for="voters">Lista de votantes</label>
        <input type="file" class="form-control-file" id="voters" @change="upload">
      </div>
    </form>
  </div>
</template>

<script>
import Papa from 'papaparse'
import { mapActions, mapGetters } from 'vuex'
import * as constants from '@/store/constants'

export default {
  methods: {
    ...mapActions({
      uploadCandidates: constants.SCHOOL_UPLOAD_CANDIDATES,
      uploadVoters: constants.SCHOOL_UPLOAD_VOTERS
    }),
    ...mapGetters({
      getActiveSchool: constants.SCHOOL_GET_ACTIVE
    }),
    upload (e) {
      const files = e.target.files
      if (!files.length) return
      const file = files[0]
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          if (e.target.id === 'candidates') {
            this.uploadCandidates({ id: this.getActiveSchool(), candidates: result.data })
          } else {
            this.uploadVoters({ id: this.getActiveSchool(), voters: result.data })
          }
        }
      })
    }
  }
}
</script>
