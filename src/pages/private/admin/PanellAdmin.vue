<template>
  <q-page :class="$q.screen.gt.sm?'q-pa-xl bg-grey-2  flex flex-center':'q-pa-xs bg-grey-2'">


    <div class="row   q-pa-sm ">
      <div class="col-6 flex justify-end ">
        <div class="colum">
          <q-btn

            color="primary"
            @click="uploadXML=!uploadXML"

            style="height: 200px; width: 300px; "
            class="q-ma-sm "
          >
            <div class="text-h5">
              <q-icon name="far fa-file-excel"/>

              ACTUALITZAR CORE VIA XML
            </div>
          </q-btn>
          <div>
            <q-btn
              color="white"
              text-color="black"
              to="professors"

              style="height: 230px; width: 300px; "
              class="q-ma-sm "
            >
              <div class="text-h5 column">
                <div class="q-mb-md">
                  PROFESSORS DINS L'APP
                </div>

                <div v-if="numeroDeProfesoresApp===null">
                  <q-spinner
                    color="white"
                    size="1.5"
                    :thickness="2"
                  />
                </div>
                <div v-if="numeroDeProfesoresApp!==null">

                  {{numeroDeProfesoresApp}}
                </div>
              </div>
            </q-btn>
          </div>

        </div>

      </div>
      <div class="col-6 flex ">
        <div class="colum">
          <q-btn
            color="white"
            text-color="black"
            @click="dialogAfegisUsuari=true"

            style="height: 300px; width: 300px; "
            class="q-ma-sm  "
          >
            <div class="text-h5">
              <q-icon name="far fa-plus-square"/>

              AFEGIR USUARIS A L'APP
            </div>
          </q-btn>
          <div>
            <q-btn
              color="primary"
              to="usuaris"

              style="height: 130px; width: 300px; "
              class="q-ma-sm "
            >
              <div class="text-h5 column">
                <div class="q-mb-md">
                  USUARIS DINS L'APP
                </div>

                <div v-if="numeroDeProfesoresApp===null">
                  <q-spinner
                    color="white"
                    size="1.5"
                    :thickness="2"
                  />
                </div>
                <div v-if="numeroDeProfesoresApp!==null">

                  {{numeroUsuarisApp}}
                </div>
              </div>
            </q-btn>
          </div>
        </div>

      </div>

    </div>


    <q-dialog v-model="uploadXML" @before-hide="fileXml=null">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Escollir arxiu xml
          </div>
        </q-card-section>
        <q-card-section>
          <q-file
            v-model="fileXml"
            label="Escollir/afegir arxiu (xml)"
            outlined
            use-chips
            style="max-width: 300px"
            accept=".xml"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file"/>
            </template>
            <template v-slot:after>
              <q-btn
                :disable="fileXml==null || fileXml.length==0"
                color="primary"
                dense
                icon="cloud_upload"
                round
                :loading="uploadingXml"

                @click="uploadXml"
              />
            </template>
          </q-file>
        </q-card-section>
      </q-card>
    </q-dialog>


    <q-dialog v-model="dialogAfegisUsuari" @before-hide="clearNewUsuari" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h5">
            Afegir usuari
          </div>
        </q-card-section>
        <q-separator inset=""/>
        <q-card-section>
          <div class="text-h6 text-weight-light">
            Informació
          </div>
          <q-input v-model="usuarioToAdd.nombre" placeholder="Nom" outlined dense class="q-my-sm"/>
          <div class="row q-my-sm full-width no-wrap">
            <q-input v-model="usuarioToAdd.apellido1" placeholder="Cognom" outlined dense class="q-pr-xs"/>
            <q-input v-model="usuarioToAdd.apellido2" placeholder="Segon cognom" outlined dense class=" q-pl-xs"/>
          </div>
          <q-input v-model="usuarioToAdd.email" placeholder="Email" outlined dense class="q-my-sm">

            <template v-slot:append>
              <q-icon name="far fa-envelope"></q-icon>
            </template>
          </q-input>
          <q-input v-model="usuarioToAdd.contrasenya" outlined dense
                   :type="usuarioToAdd.showContrasenya ? 'text' : 'password'" placeholder="Contrasenya" class="q-my-sm">
            <template v-slot:append>
              <q-icon
                :name="!usuarioToAdd.showContrasenya ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="usuarioToAdd.showContrasenya = !usuarioToAdd.showContrasenya"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-separator inset=""/>
        <q-card-section>
          <div class="text-h6 text-weight-light">
            Rols
          </div>
          <q-checkbox size="md" v-model="usuarioToAdd.roles" val="Cuiner" label="Cuiner"/>
          <q-checkbox size="md" v-model="usuarioToAdd.roles" val="Monitor" label="Monitor"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup label="cancelar" unelevated outline color="primary"/>
          <q-btn v-close-popup label="Desar" @click="saveNewUsuari" unelevated color="green-9"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
  export default {
    name: "PanellAdmin",
    async created() {

      const responseProfes = await this.$axiosCore.get('/private/professor/counter')
      if (responseProfes.status === 200) {
        this.numeroDeProfesoresApp = responseProfes.data
      }
      const responseUsuarisApp = await this.$axiosCore.get('/admin/usuaris/counter')
      if (responseUsuarisApp.status === 200) {
        this.numeroUsuarisApp = responseUsuarisApp.data
      }

    },
    data() {
      return {
        numeroDeProfesoresApp: null,
        numeroUsuarisApp: null,
        fileXml: null,
        uploadXML: false,
        uploadingXml: false,
        dialogAfegisUsuari: false,
        usuarioToAdd: {
          nombre: '',
          apellido1: '',
          apellido2: '',
          email: '',
          contrasenya: '',
          roles: [],
          showContrasenya: false
        },


      }
    },
    methods: {
      async uploadXml() {
        this.uploadingXml = true;
        const formData = new FormData()
        formData.append('file', this.fileXml)

        const response = await this.$axiosCore.put('/private/uploadxml', formData)
        if (response.status === 200) {
          this.notify("XML carregat correctament a la base de dades")
        } else {
          this.notify(response.data)
        }
        console.log(response)
        this.uploadingXml = false;
      },
      notify(message) {
        this.$q.notify({
          message: message,
          color: 'secondary',
          position: 'bottom-left'
        })
      },

      clearNewUsuari() {
        this.usuarioToAdd.nombre = '';
        this.usuarioToAdd.apellido1 = '';
        this.usuarioToAdd.apellido2 = '';
        this.usuarioToAdd.email = '';
        this.usuarioToAdd.contrasenya = '';
        this.usuarioToAdd.roles = [];
        this.usuarioToAdd.showContrasenya = false;
      },
      async saveNewUsuari() {

        const response = await this.$axiosCore.post('/admin/auth/register', this.usuarioToAdd);
        if (response.status === 200) {
          this.clearNewUsuari();
          this.notify("Usuari desat correctament")
        }
      }
    }

  }
</script>

<style scoped>

</style>
