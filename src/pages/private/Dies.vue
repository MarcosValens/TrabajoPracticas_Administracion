<template>
  <q-page class="q-pa-md">
    <div class="column" style="width: 80%; margin-left: 10%">
      <div class="col">
        <div class="row justify-between q-mb-md">
          <div class="col-3">
            <q-input v-model="filter.dia" label="Dia" @input="filterDies"/>
          </div>
          <div class="col-3">
            <q-input v-model="filter.mes" label="Mes" @input="filterDies"/>
          </div>
          <div class="col-3">
            <q-input v-model="filter.any" label="Any" @input="filterDies"/>
          </div>
        </div>
      </div>

      <div class="col">
        <q-table
        title="Dies"
        :data="dataFilter"
        :columns="columns"
        @row-click="rowClick"
      >
        </q-table>
      </div>

    </div>
  </q-page>

</template>
<script>
    export default {
        data() {
            return {
                columns: [
                    {
                        name: 'data',
                        required: true,
                        label: 'Data',
                        align: 'center',
                        field: row => row.date,
                        sortable: true
                    },
                    {name: 'nombre alumnes', align: "center", label: 'Nombre alumnes', field: 'alumnes'},
                    {name: 'nombre profesors', align: "center", label: 'Nombre Professors', field: 'professors'},
                ],
                data: [
                    {
                        date: '01/01/2020',
                        alumnes: 100,
                        professors: 0,
                    },
                    {
                        date: '02/01/2020',
                        alumnes: 120,
                        professors: 2,
                    },
                    {
                        date: '03/01/2020',
                        alumnes: 35,
                        professors: 10,
                    },
                    {
                        date: '04/01/2020',
                        alumnes: 200,
                        professors: 8,
                    },
                    {
                        date: '04/01/2019',
                        alumnes: 200,
                        professors: 8,
                    }
                ],
                filter: {
                    dia: '',
                    mes: '',
                    any: ''
                },
                dataFilter: []
            }
        },
        methods: {
            filterDies(){
              this.dataFilter = this.data.filter((dia) => {
                  let date = dia.date.split("/");
                  let diaNum = date[0].toString();
                  let mesNum = date[1].toString();
                  let anyNum = date[2].toString();
                  return (diaNum.startsWith(this.filter.dia) && mesNum.startsWith(this.filter.mes) && anyNum.startsWith(this.filter.any));
              })
            },
            rowClick(event, row){
                console.log(row.date);
                //TODO modificarlo según lo que devuelva la base de datos
                this.$router.push("/dia/1")
            }
        },
        created() {
            this.dataFilter = this.data;
        }
    }
</script>
