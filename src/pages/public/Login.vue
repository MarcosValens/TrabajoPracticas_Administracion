<template>
  <q-page
    :class="$q.screen.lt.md?'bg-sm-image window-height window-width row justify-center items-center':'bg-lg-image window-height window-width row justify-center items-center'"
    >
    <div class="column">
      <div class="row">
        <h5 class="text-h5  q-my-md">Administracio - Es Liceu</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
              <q-input class="q-my-sm" outlined  v-model="login.email" type="email" label="email" />
              <q-input class="q-my-sm" outlined v-model="login.password" label="password"
                       :type="!verContrasena ? 'password' : 'text'"
                       @keydown.enter="doLogin"
              >
                <template v-slot:append>
                  <q-icon
                    :name="!verContrasena ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="verContrasena = !verContrasena"
                  />
                </template>
            </q-input>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="md" class="full-width" label="Login" @click="doLogin"/>
            <a :href="urlLoginOauth" class="full-width q-mt-sm" style="text-decoration: none">
              <q-btn outline unelevated color="red-8" size="md" class="full-width">
                <q-avatar size="18px">
                  <q-img ratio="1" :src="require('./assets/G-logo.png')"/>
                </q-avatar>
                <div class="q-pl-md">
                  Login con google
                </div>
              </q-btn>
            </a>
            <div @click="forgottenUserPassword = true"
                 class="full-width text-center cursor-pointer text-weight-bold q-mt-md">¿Contrasenya oblidada?
            </div>
          </q-card-actions>

        </q-card>

        <q-dialog v-model="forgottenUserPassword" @before-hide="()=>this.forgottenUserEmail=''">
          <q-card>
            <q-card-section>
              <div class="text-h6 ">¿No recorda la seva contrasenya?</div>
            </q-card-section>
            <q-separator/>
            <q-card-section>
              <div class="q-mb-sm">
                L'hi enviarem un correu de recuperació a:
              </div>
              <q-input v-model="forgottenUserEmail" outlined type="email" label="Email">
                <template v-slot:append>
                  <q-icon
                    name="alternate_email"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn color="primary" class="full-width" label="Enviar correu de recuperació" v-close-popup
                     @click="sendEmailPass(forgottenUserEmail)"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>


  </q-page>
</template>


<script>
  export default {
    name: 'Login',
    data () {
      return {
        urlLoginOauth: process.env.CORE_URL + process.env.URI_OAUTH_GOOGLE,
        login: {
          email: '',
          password: '',
        },
        verContrasena: false,
        forgottenUserPassword: false,
        forgottenUserEmail: ''
      }
    },
    methods: {
      async doLogin() {
        const responseLogin = await this.$axiosCore.post('/auth/login', this.login); // TODO PONER EL PATH DEL LOGIN + ASEGURARNOS DE MANDAR LO CORRECTO UNA VEZ FUNCIONE EN BACK
        if (responseLogin.status === 200) {
          // Ok, guardamos tokens y a parte privada
          const access = responseLogin.data.access_token;
          const refresh = responseLogin.data.refresh_token;


          localStorage.setItem("access_token", access)
          localStorage.setItem("refresh_token", refresh)

          const recived = JSON.parse(responseLogin.data.rol);
          console.log("recived",recived);
          const userRoles = [];
          recived.forEach(rol => {
            if (rol === "cuiner") userRoles.push(process.env.CUINER_ROL)
            if (rol === "monitor") userRoles.push(process.env.MONITOR_ROL)
            if (rol === "admin") userRoles.push(process.env.ADMIN_ROL)
          })

          localStorage.setItem('rol', JSON.stringify(userRoles));

          await this.$router.push("/")
        } else {
          // No ok
          this.notify('Email o contrasenya incorrectes')
        }
      },
      notify(message) {
        this.$q.notify({
          message: message,
          color: 'primary',
          position: 'bottom-left'
        })
      },
      async sendEmailPass(email) {
        const response = await this.$axiosCore.post("/auth/recovery", {
          email: email
        })
        if (response.status === 200) {
          this.notify("Un email de confirmació ha sigut enviat al teu correu electrònic")
          this.forgottenUserEmail = ''
        }
      }

    }
  }
</script>

<style>
  .q-card {
    width: 360px;
  }
  .bg-lg-image {
    background-image: url("assets/esliceu-logo.png");
    background-repeat: no-repeat;
    background-position: 95% 100%;
    background-size: 13vw;
  }
  .bg-sm-image {
    background-image: url("assets/esliceu-logo.png");
    background-repeat: no-repeat;
    background-position: 100% 100%;
    background-size: 75vw;
  }
</style>
