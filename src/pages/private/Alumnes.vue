<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12  q-pa-sm">
        <q-table
          :data="alumnesFiltered"
          :columns="columns"
          @row-click="onRowClick"
          row-key="codi"
          rows-per-page-label="Alumnes per fila"
          :rows-per-page-options="[5,12,0]"
          separator="cell"
          :pagination.sync="myPagination"
        >
          <template v-slot:top>
            <div :class="$q.screen.gt.md?'full-width flex justify-between':'full-width'">
              <div class="text-h4">Alumnes</div>
              <div class="row">
                <q-input :class="$q.screen.lt.lg?'full-width q-mb-sm':'q-mr-sm'" outlined dense debounce="300"
                         v-model="filtroDeAlumnos" placeholder="Cerca"
                         @input="filterAlumnes">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
                <q-select :class="$q.screen.lt.lg?'full-width q-mb-sm':''" dense style="min-width: 200px" outlined
                          v-model="grupoSeleccionado"
                          :options="grups" label="Grup"
                          @input="filterAlumnes(filtroDeAlumnos)"/>
              </div>
            </div>
          </template>

        </q-table>
      </div>
    </div>
  </q-page>
</template>


<script>
export default {
  name: "PagesAlumne",
  async created() {
    const responseAlumnes = await this.$axiosCore.get( "/private/alumnos");
    this.alumnes = responseAlumnes.data.map(alumno => {
      const newAlumno = {
        nom: alumno.nom,
        ap1: alumno.ap1,
        ap2: alumno.ap2,
        grup: "",
        codi: alumno.codi,
      }
      let grupo;
      if(alumno.grup != null && typeof alumno.grup === 'object'){
        grupo = alumno.grup.curs.descripcio + "-" + alumno.grup.nom
      } else if (alumno.grup != null && typeof alumno.grup != 'object'){
        grupo = alumno.grup;
      }
      newAlumno.grup = grupo;
      return newAlumno;
    });
    this.alumnes = this.orderAlumnes(this.alumnes);
    this.alumnesFiltered = this.alumnes;
    const responseGrups = await this.$axiosCore.get("/private/grupos");
    this.grups = responseGrups.data.map(grup => {
      return grup.curs.descripcio + "-" + grup.nom;
    });
    this.grups.unshift("Tots");
  },
  data() {
    return {
      myPagination: {
        rowsPerPage: 14
      },
      grups: [],
      grupoSeleccionado: 'Tots',
      filtroDeAlumnos: '',
      filter: {
        nom: "",
        ap1: "",
        ap2: "",
        grup: "",
      },
      columns: [
        {
          name: "nom",
          required: true,
          label: "Nom",
          align: "center",
          field: row => row.nom,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "ap1",
          required: true,
          label: "Primer cognom",
          align: "center",
          field: row => row.ap1,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "ap2",
          required: true,
          label: "Segon cognom",
          align: "center",
          field: row => row.ap2,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "grup",
          required: true,
          label: "Grup",
          align: "center",
          field: row => row.grup,
          format: val => `${val}`,
          sortable: true
        },
      ],
      alumnes: [],
      alumnesFiltered: []
    };
  },
  methods: {
      onRowClick: function (evt, row) {
        this.$router.push(`alumne/${row.codi}`)
      },
      filterAlumnes(){
        const textoFiltro = this.filtroDeAlumnos.toLowerCase();
        this.alumnesFiltered = this.alumnes.filter(alumne => {
          const nombreCompleto = alumne.nom + ' ' + alumne.ap1 + ' ' + alumne.ap2;

          if (this.grupoSeleccionado.toLowerCase() !== 'tots' && this.grupoSeleccionado !== alumne.grup) return false
          return nombreCompleto.toLowerCase().includes(textoFiltro);
        })
      },
      orderAlumnes(alumnes){
        return alumnes.sort((a,b) => {
        if(a.nom[0].toLowerCase() < b.nom[0].toLowerCase()) {
          return -1;
        }
        if(a.nom[0].toLowerCase() > b.nom[0].toLowerCase()) {
          return 1;
        }
        return 0;
      })
      }
  }
};
</script>
