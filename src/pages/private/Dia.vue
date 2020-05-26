<template>
  <q-page class="q-pa-md">
    <div class="column" style="width: 80%; margin-left: 10%">
      <div class="col">
        <div class="row justify-between q-mb-md">
          <div class="col-3">
            <q-input v-model="filter.nom" label="Nom" @input="filterUsers"/>
          </div>
          <div class="col-3">
            <q-input v-model="filter.ap1" label="Cognom 1" @input="filterUsers"/>
          </div>
          <div class="col-3">
            <q-input v-model="filter.ap2" label="Cognom 2" @input="filterUsers"/>
          </div>
        </div>
      </div>
      <q-select v-model="selected" :options="options" label="Standard" @input="change" style="width: 20%"/>
      <q-table
        :data="dataFilter"
        :columns="columns"
      >
      </q-table>
    </div>
  </q-page>
</template>
<script>
    export default {
        data() {
            return {
                professors: [
                    {
                        codi: 2131223,
                        nom: "Joan",
                        ap1: "Galmes",
                        ap2: "Riera"
                    },
                    {
                        codi: 2131223,
                        nom: "Pere",
                        ap1: "Negre",
                        ap2: "Doe"
                    },
                    {
                        codi: 2131223,
                        nom: "Xavi",
                        ap1: "Torrens",
                        ap2: "Doe"
                    },
                    {
                        codi: 2131223,
                        nom: "Fernando",
                        ap1: "Ríos",
                        ap2: "Llamazares"
                    },
                    {
                        codi: 2131223,
                        nom: "Manuel",
                        ap1: "Martinez",
                        ap2: "Doe"
                    },
                    {
                        codi: 2131223,
                        nom: "Pep",
                        ap1: "Buades",
                        ap2: "Fol"
                    }
                ],
                alumnes: [
                    {
                        codi: 382736227836,
                        nom: "Miki",
                        ap1: "Pons",
                        ap2: "Sanchez"
                    },
                    {
                        codi: 21312237236,
                        nom: "Miguel",
                        ap1: "Ángel",
                        ap2: "Arrones"
                    },
                    {
                        codi: 5986798,
                        nom: "Joan",
                        ap1: "Antoni",
                        ap2: "Pacheco"
                    }

                ],
                columns: [
                    {
                        name: "codi",
                        required: true,
                        label: "Codi",
                        align: "center",
                        field: row => row.codi,
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
                ],
                data: [],
                dataFilter: [],
                filter: {
                    nom: '',
                    ap1: '',
                    ap2: ''
                },
                selected: "Alumnes",
                options: ["Alumnes", "Professors"]
            }
        },
        created() {
            this.data = this.alumnes;
            this.dataFilter = this.data;
        },
        methods: {
            change() {
                if (this.selected === "Alumnes") {
                    this.data = this.alumnes;
                } else {
                    this.data = this.professors;
                }
                this.dataFilter = this.data;
                this.filterUsers();
            },
            filterUsers() {
                this.dataFilter = this.data.filter(client => client.nom.includes(this.filter.nom) && client.ap1.includes(this.filter.ap1) && client.ap2.includes(this.filter.ap2))
            }
        }
    }
</script>
