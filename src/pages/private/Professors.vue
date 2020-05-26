<template>
  <q-page class="q-pa-md ">

    <q-table
      class="full-width" :data="dataProfesoresFiltered" :columns="columnsProfesores" row-key="name" separator="cell"
      :pagination.sync="myPagination"
    >
      <template v-slot:top>
        <div :class="$q.screen.gt.md?'full-width flex justify-between':'full-width'">
          <div class="text-h5">Professors</div>
          <q-input outlined dense debounce="300" placeholder="Cercar" @input="filterProfesor"
                   v-model="filtroProfesor">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body="props">

        <q-tr :props="props">
          <q-td key="username" :props="props">{{props.row.username}}</q-td>
          <q-td key="nom" :props="props">{{props.row.nom}}</q-td>
          <q-td key="apellido" :props="props">{{props.row.ap1}}</q-td>
          <q-td key="apellido2" :props="props">{{props.row.ap2}}</q-td>
          <q-td key="email" :props="props" style="max-width: 200px">
            <q-input dense v-model="props.row.email" outlined label="Asignar email" class="full-width">
              <template v-slot:append>
                <q-btn class="q-mx-xs" round size="sm" color="green-9" icon="fas fa-save"
                       @click="asignarEmail((props.row))"
                       :disable="!(props.row.email!==undefined && props.row.email!=='')"
                       v-show="(props.row.email!==undefined && props.row.email!=='')"/>
                <q-btn outline class="q-mx-xs" round size="sm" color="red-9" icon="far fa-trash-alt"
                       @click="removeEmailUser(props.row)"
                       :disable="!(props.row.email!==undefined && props.row.email!=='')"
                       v-show="(props.row.email!==undefined && props.row.email!=='')"/>
              </template>
            </q-input>

          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>


<script>
  export default {
    name: "PagesAlumne",
    async created() {

      this.$q.loading.show()
      const response = await this.$axiosCore.get('/private/professor');
      if (response.status === 200) {
        this.dataProfesores = this.orderProfesors(response.data);
        this.dataProfesores = this.dataProfesores.map(profesor => {
          if (profesor.usuariApp !== null) profesor.email = profesor.usuariApp.email
          return profesor;
        })
        this.dataProfesoresFiltered = this.dataProfesores;
      } else {
        this.notify(response.data)
      }
      this.$q.loading.hide()
    },
    data() {
      return {
        myPagination: {
          rowsPerPage: 12
        },
        columnsProfesores: [
          {name: 'username', align: 'center', label: 'Nom d\'usuari', field: row => row.username, sortable: true},

          {
            name: 'nom',
            required: true,
            label: 'Nom',
            align: 'left',
            field: row => row.nom,
            sortable: true,
          },
          {name: 'apellido', align: 'left', label: 'Cognom', field: row => row.ap1, sortable: true},
          {name: 'apellido2', align: 'left', label: 'Segon cognom', field: row => row.ap2, sortable: true},
          {name: 'email', align: 'center', label: 'Email', field: row => row.email, sortable: true},

        ],
        dataProfesores: [],
        dataProfesoresFiltered: [],
        filtroProfesor: '',

      }
    },
    methods: {
      async removeEmailUser(profesor) {
        const codigo = profesor.codi;
        console.log(profesor)

        const response = await this.$axiosCore.delete('/admin/professor/email', {
          data: {
            codi: codigo
          }
        })

        if (response.status === 200) {
          this.notify("Email eliminat correctament")
          // Aqui hacemos que el email no se vea mas en la lista
          profesor.email = ""
          this.dataProfesoresFiltered = [];
          this.dataProfesoresFiltered = this.orderProfesors(this.dataProfesores)
        } else {
          this.notify(response.data);
        }
      },
      orderProfesors(profesores) {
        return profesores.sort((a, b) => {
          if (a.nom[0].toLowerCase() < b.nom[0].toLowerCase()) {
            return -1;
          }
          if (a.nom[0].toLowerCase() > b.nom[0].toLowerCase()) {
            return 1;
          }
          return 0;
        });
      },
      notify(message) {
        this.$q.notify({
          message: message,
          color: 'secondary',
          position: 'bottom-left'
        })
      },
      filterProfesor(texto) {
        this.dataProfesoresFiltered = this.dataProfesores.filter(profesor => {

          if (profesor.username.toLowerCase().includes(texto.toLowerCase())) return true;
          if (profesor.email != null && profesor.email.toLowerCase().includes(texto.toLowerCase())) return true;
          const nombreCompleto = profesor.nom + ' ' + profesor.ap1 + ' ' + profesor.ap2;
          return nombreCompleto.toLowerCase().includes(texto.toLowerCase());
        })
      },
      async asignarEmail(profesor) {
        console.log(profesor)
        const codigo = profesor.codi;
        const email = profesor.email;
        if (codigo && email) {

          const response = await this.$axiosCore.put('/admin/professor/email', {
            email: email,
            codi: codigo
          })


          if (response.status === 200) {
            this.notify("Email asignat correctament")
          } else {
            this.notify(response.data);
          }

        }
      },

    },

  };
</script>
