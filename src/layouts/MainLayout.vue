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

        <q-toolbar-title>Administració</q-toolbar-title>


        <q-btn icon="far fa-user" outline round>
          <q-menu class="">
            <q-list style="width: 220px">
              <q-item>
                <q-item-section class="text-black">{{loguedUser.nom}} {{loguedUser.cognoms}}</q-item-section>
              </q-item>
              <q-separator inset=""/>
              <q-item clickable v-close-popup @click="cambiarContrasenya=true">
                <q-item-section avatar>
                  <q-avatar icon="lock" text-color="black"/>
                </q-item-section>
                <q-item-section class="text-black">Canviar contrasenya</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/login">
                <q-item-section avatar>
                  <q-avatar icon="supervisor_account"/>
                </q-item-section>
                <q-item-section>Canviar de compte</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="disconnect">
                <q-item-section avatar class="text-black">
                  <q-avatar icon="exit_to_app"/>
                </q-item-section>
                <q-item-section class="text-black">
                  Desconectarse
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

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
        <q-item clickable v-ripple v-for="link in links" :key="link.title" :to="link.link">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" style="font-size: 1.2em">{{link.title}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn dense round unelevated color="primary" icon="chevron_left" @click="miniState = true"></q-btn>
      </div>

      <div class="q-pa-md">
        <q-separator class="q-mb-md" />
        <div class="flex justify-end">
          <q-btn
            dense
            color="secondary"
            outline
            icon-right="exit_to_app"
            label="Desconectarse"
            @click="disconnect"
          />
        </div>
      </div>

      <template v-slot:mini>
        <q-list class>
          <q-item clickable v-ripple v-for="link in links" :key="link.title" :to="link.link">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-tooltip
              :delay="150"
              transition-hide="slide-left"
              anchor="center right"
              self="center left"
            >{{link.title}}</q-tooltip>
          </q-item>
        </q-list>

        <div>
          <q-separator class="q-mb-md" />
          <div class="flex flex-center q-mb-md">
            <q-btn dense color="secondary" outline icon-right="exit_to_app" @click="disconnect">
              <q-tooltip
                transition-hide="slide-left"
                content-class="bg-secondary"
                anchor="center right"
                self="center left"
              >Desconectarse
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-dialog position="right" v-model="cambiarContrasenya" @before-hide="clearPasswordManager">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6 text-weigth-light">Canviar contrasenya</div>
        </q-card-section>
        <q-separator inset=""/>
        <q-card-section>
          <q-input label="Contrasenya antigua" outlined class="q-my-xs" v-model="passwordmanager.oldpasswd"/>
          <q-input label="Contrasenya nova" outlined class="q-my-xs" v-model="passwordmanager.newpasswd"/>
          <q-input label="Repetir contrasenya" outlined class="q-my-xs" v-model="passwordmanager.newpasswd2"/>
        </q-card-section>
        <q-separator inset=""/>

        <q-card-actions align="right">
          <q-btn label="desar" @click="changePasswd" color="blue-9" unelevated v-close-popup/>
          <q-btn label="cancelar" @click="clearPasswordManager" flat color="red-9" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
          link: "/admin/panel"
        },
        {
          title: "Usuaris",
          icon: "account_circle",
          link: "/admin/usuaris"
        },
        {
          title: "Professors",
          icon: "people",
          link: "/admin/professors"
        }
      ],
      drawer: false,
      miniState: false,
      roles: [],
      loguedUser: {
        nom: "",
        cognoms: "",
        email: ""
      },
      cambiarContrasenya: false,
      passwordmanager: {
        oldpasswd: '',
        newpasswd: '',
        newpasswd2: ''
      }
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("rol");
      this.$router.push("/login");
    },
    async changePasswd() {
      const response = await this.$axiosCore.put('private/auth/password', this.passwordmanager)
      if (response.status === 200) this.notify("Contrasenya modificada correctament")
      else this.notify("Ha habido un error")
    },
    clearPasswordManager() {
      this.passwordmanager.oldpasswd = ''
      this.passwordmanager.newpasswd = ''
      this.passwordmanager.newpasswd2 = ''
    },
    notify(message) {
      this.$q.notify({
        message: message,
        color: 'secondary',
        position: 'bottom-left'
      })
    },
  },
  async created() {
    /**
     * Cogemos la informacion propia del usuario logueado
     */
    const response = await this.$axiosCore.get("/private/usuario/me");
    console.log(response)
    if (response.status === 200) {
      this.loguedUser.nom = response.data.nombre;
      this.loguedUser.cognoms = response.data.apellido1 + ' ' + response.data.apellido2;
    }
  },
};
</script>
<style>
</style>>
