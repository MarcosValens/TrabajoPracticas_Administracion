<template>
  <q-page class="q-pa-md">
    <q-table
      class="full-width"
      :data="dataAlumnosFiltered"
      :columns="columnsAlumnos"
      row-key="name"
      separator="cell"
      :pagination.sync="myPagination"
    >
      <template v-slot:top>
        <div :class="$q.screen.gt.md?'full-width flex justify-between':'full-width'">
          <div class="text-h5">Alumnes</div>
          <q-input
            outlined
            dense
            debounce="300"
            placeholder="Cercar"
            @enter="filterAlumno"
            v-model="filtroAlumno"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="codi" :props="props">
            {{props.row.codi}}
          </q-td>
          <q-td key="nom" :props="props">{{props.row.nom}}
            <q-popup-edit v-model="props.row.nom" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.nom" dense autofocus counter></q-input>
            </q-popup-edit>

          </q-td>
          <q-td key="apellido" :props="props">{{props.row.ap1}}
              <q-popup-edit v-model="props.row.ap1" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.ap1" dense autofocus counter></q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="apellido2" :props="props">{{props.row.ap2}}
              <q-popup-edit v-model="props.row.ap2" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.ap2" dense autofocus counter></q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="expedient" :props="props">{{props.row.expedient}}
              <q-popup-edit v-model="props.row.expedient" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.expedient" dense autofocus counter></q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="loginldap" :props="props">{{props.row.loginLDAP}}
              <q-popup-edit v-model="props.row.loginLDAP" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.loginLDAP" dense autofocus counter></q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="passwordldap" :props="props">{{props.row.passwordLDAP}}
              <q-popup-edit v-model="props.row.passwordLDAP" buttons @save="editAlumne(props.row)" label-set="Guardar" label-cancel="Cancelar">
              <q-input v-model="props.row.passwordLDAP" dense autofocus counter></q-input>
            </q-popup-edit>
          </q-td>
            <q-td key="actions" :props="props">
              <q-btn v-if="!props.row.eliminat" flat color="primary" label="Eliminar" @click="deleteAlumne(props.row)"/>
              <p v-else>Alumne eliminat</p>
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
    this.$q.loading.show();
    const response = await this.$axiosCore.get("/private/alumnos");
    if (response.status === 200) {
      this.dataAlumnos = this.orderAlumnos(response.data);
      this.dataAlumnosFiltered = this.dataAlumnos;
    } else {
      this.notify(response.data);
    }
    this.$q.loading.hide();
  },
  data() {
    return {
      myPagination: {
        rowsPerPage: 12
      },
      columnsAlumnos: [
        {
          name: "codi",
          align: "center",
          label: "Codi",
          field: row => row.codi,
          sortable: true
        },

        {
          name: "nom",
          required: true,
          label: "Nom",
          align: "left",
          field: row => row.nom,
          sortable: true
        },
        {
          name: "apellido",
          align: "left",
          label: "Cognom",
          field: row => row.ap1,
          sortable: true
        },
        {
          name: "apellido2",
          align: "left",
          label: "Segon cognom",
          field: row => row.ap2,
          sortable: true
        },
        {
          name: "expedient",
          align: "center",
          label: "Expedient",
          field: row => row.expedient,
          sortable: true
        },
        {
          name: "loginldap",
          align: "center",
          label: "Login LDAP",
          field: row => row.loginLDAP,
          sortable: true
        },
        {
          name: "passwordldap",
          align: "center",
          label: "Password LDAP",
          field: row => row.passwordLDAP,
          sortable: true
        },
        {
          name: "actions",
          align: "center",
          label: "Accions",
          field: row => row.eliminat,
          sortable: true
        }
      ],
      dataAlumnos: [],
      dataAlumnosFiltered: [],
      filtroAlumno: ""
    };
  },
  methods: {
    orderAlumnos(alumnos) {
      return alumnos.sort((a, b) => {
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
        color: "secondary",
        position: "bottom-left"
      });
    },
    filterAlumno(texto) {
      this.dataAlumnosFiltered = this.dataAlumnos.filter(alumno => {
        if (alumno.username.toLowerCase().includes(texto.toLowerCase()))
          return true;
        if (
          alumno.email != null &&
          alumno.email.toLowerCase().includes(texto.toLowerCase())
        )
          return true;
        const nombreCompleto = alumno.nom + " " + alumno.ap1 + " " + alumno.ap2;
        return nombreCompleto.toLowerCase().includes(texto.toLowerCase());
      });
    },
    deleteAlumne(alumne){
        alumne.eliminat = true
        this.editAlumne(alumne)
    },
    editAlumne(alumne) {
        this.$axiosCore.put("/private/alumno", {
            codi: alumne.codi,
            nom: alumne.nom,
            ap1: alumne.ap1,
            ap2: alumne.ap2,
            expedient: alumne.expedient,
            loginldap: alumne.loginLDAP || "" ,
            passwordldap: alumne.passwordLDAP || "",
            eliminat: alumne.eliminat || false
        }).then(() => {
            this.notify("Alumne actualizat")
        })
        .catch(() => {
            this.notify("No es pot actualizar")
        }
        )
    },
    
  }
};
</script>
