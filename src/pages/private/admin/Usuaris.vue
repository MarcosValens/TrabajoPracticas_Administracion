<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-table
          :data="usuarisFiltered"
          :columns="columns"
          row-key="codi"
          rows-per-page-label="Usuaris per fila"
          :rows-per-page-options="[5,12,0]"
          separator="cell"
          :pagination.sync="myPagination"
        >
        <template v-slot:top>
            <div :class="$q.screen.gt.md?'full-width flex justify-between':'full-width'">
            <div class="text-h4">Usuaris</div>
              <q-input :class="$q.screen.lt.lg?'full-width q-mb-sm':''" outlined dense debounce="300"
                      v-model="filtroDeUsuarios" placeholder="Cerca"
                      @input="filterUsuari">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </div>
        </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>


<script>
export default {
  name: "PagesUsuaris",
  async created(){
    const responseUsuaris = await this.$axiosCore.get("/admin/usuaris");

    this.usuaris = responseUsuaris.data.map(usuario => {
      const newUsuari = {
          nom: usuario.nombre,
          ap1: usuario.apellido1,
          ap2: usuario.apellido2,
          email: usuario.email,
          isAdmin: usuario.admin,
          isCuiner: usuario.cuiner,
          isMonitor: usuario.monitor
      }
      return newUsuari;
    })
    console.log(this.usuaris);
    this.usuaris = this.orderUsuaris(this.usuaris);
    this.usuarisFiltered = this.usuaris;
  },
  data() {
    return {
      myPagination: {
        rowsPerPage: 14
      },
      usuarisFiltered: '',
      usuarioSeleccionado: '',
      filtroDeUsuarios: '',
      filter: {
        nom: "",
        ap1: "",
        ap2: "",
      },      
      columns: [
         {
          name: "email",
          required: true,
          label: "Email",
          align: "center",
          field: row => row.email,
          format: val => `${val}`,
          sortable: true
        },
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
          name: "isAdmin",
          required: true,
          label: "Administrador",
          align: "center",
          field: row => row.isAdmin,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "isCuiner",
          required: true,
          label: "Cuiner",
          align: "center",
          field: row => row.isCuiner,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "isMonitor",
          required: true,
          label: "Monitor",
          align: "center",
          field: row => row.isMonitor,
          format: val => `${val}`,
          sortable: true
        }
      ],
      usuaris: [],
      usuarisFiltered: []
    };
  },
  methods: {
    filterUsuari(){
      const textoFiltro = this.filtroDeUsuarios.toLowerCase();
      this.usuarisFiltered = this.usuaris.filter(usuari => {
        const nombreCompleto = usuari.nom + ' ' + usuari.ap1 + ' ' + usuari.ap2;
        return nombreCompleto.toLowerCase().includes(textoFiltro);
      })
    },
    orderUsuaris(usuaris){
      return usuaris.sort((a,b) => {
        if(a.nom == null) a.nom = "No tiene nombre seleccionado";
        if(b.nom == null) b.nom = "No tiene nombre seleccionado";
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


