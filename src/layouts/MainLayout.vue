<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click.capture="drawerClick"
          @click="drawer = !drawer"
        />
        <q-avatar>
          <q-img src="~/assets/esliceu-logo.png" alt="Logo de el liceu"/>
        </q-avatar>
        <q-toolbar-title>Administració</q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :mini="!drawer || miniState"
      :content-class="$q.screen.height>489?'bg-grey-2 column justify-between':'bg-grey-2'"
    >
      <q-list>
        <q-item clickable v-ripple v-for="link in links" :key="link.title" :to="link.link" >
          <q-item-section avatar>
            <q-icon :name="link.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" style="font-size: 1.2em">{{link.title}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color=primary
          icon="chevron_left"
          @click="miniState = true"
        ></q-btn>
      </div>

      <div class="q-pa-md">
        <q-separator class="q-mb-md"/>
        <div class="flex justify-end">
          <q-btn dense color="secondary" outline icon-right="exit_to_app" label="Desconectarse" @click="disconnect"/>
        </div>
      </div>

      <template v-slot:mini>
        <q-list class="">
          <q-item clickable v-ripple v-for="link in links" :key="link.title" :to="link.link">
            <q-item-section avatar>
              <q-icon :name="link.icon"/>
            </q-item-section>
            <q-tooltip :delay="150"
                       transition-hide="slide-left" anchor="center right" self="center left">
              {{link.title}}
            </q-tooltip>
          </q-item>
        </q-list>

        <div>
          <q-separator class="q-mb-md"/>
          <div class="flex flex-center q-mb-md">
            <q-btn dense color="secondary" outline icon-right="exit_to_app" @click="disconnect">
              <q-tooltip
                transition-hide="slide-left" content-class="bg-secondary" anchor="center right" self="center left">
                Desconectarse
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

  export default {
    name: "MainLayout",

    components: {},


    data() {
      return {
        links: [
          {
            title: "Panell d'administració",
            icon: "fas fa-user-shield",
            link: "/admin/panel",
          },
          {
            title: "Usuaris",
            icon: "account_circle",
            link: "/admin/usuaris",
          },
          {
            title: "Professors",
            icon: "people",
            link: "/admin/professors",
          },
        ],
        drawer: false,
        miniState: false,
        roles: []
      };
    },

    methods: {
      drawerClick(e) {
        if (this.miniState) {
          this.miniState = false;
          e.stopPropagation();
        }
      },
      disconnect() {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("rol")
        this.$router.push("/login")
      }
    }
  };
</script>
<style>

</style>>
