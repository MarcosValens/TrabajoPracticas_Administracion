<template>

  <q-page>

    <div class="row justify-center q-pt-lg">

      <div class="column items-center col-lg-3 col-md-4 col-sm-6 col-xs-11 q-mt-md q-ml-md q-mr-md"
           style="min-width: 350px">

        <q-avatar size="110px" class="q-mb-md" square>
          <q-img src="~/assets/esliceu-logo.png"/>
        </q-avatar>

        <q-card class="q-mt-lg full-width q-ml-md ">
          <q-card-section class="text-center">
            <div class="text-subtitle2 q-pa-sm" style="font-size: 16px">Asigna una nova contrasenya</div>
            <q-space/>
          </q-card-section>

          <q-separator/>
          <q-card-section>
            <div class="text-subtitle1 q-ml-md q-mr-md q-mt-md text-bold" style="font-size: 12px">Nova contrasenya
            </div>
            <q-input outlined v-model="newPassword" label="Contrasenya"
                     color="secondary"
                     :type="isPwd1 ? 'password' : 'text'"
                     class="q-ml-md q-mr-md">

              <template v-slot:prepend>
                <q-icon name="fas fa-key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd1 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd1 = !isPwd1"
                />
              </template>
            </q-input>

            <div class="text-subtitle1 q-ml-md q-mr-md text-bold q-mt-md" style="font-size: 12px">
              Repeteix la nova contrasenya
            </div>
            <q-input outlined v-model="newPassword2" label="Repeteix la nova contrasenya"
                     color="secondary"
                     :type="isPwd2 ? 'password' : 'text'"
                     class="q-ml-md q-mr-md"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>

          </q-card-section>

          <q-card-actions class="justify-center q-ml-lg q-mr-lg q-mb-lg">
            <q-btn
              label="Canviar contrasenya"
              text-color="white"
              class="text-center bg-green-9 full-width"
              @click="changePassword()"/>
          </q-card-actions>

        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script>
  export default {
    name: "Recovery",
    created() {
      this.token = sessionStorage.getItem('recovery_token_passwd')
      sessionStorage.removeItem('recovery_token_passwd')
    },
    data() {
      return {
        token: '',
        newPassword: '',
        newPassword2: '',
        isPwd1: true,
        isPwd2: true,
      }
    },
    methods: {
      async changePassword() {

        const response = await this.$axiosCore.put('/auth/recovery', {
          recoveryToken: this.token,
          newPasswd: this.newPassword,
          newPasswd2: this.newPassword2
        });
        if (response.status === 200) {
          this.notify("Contrasenya canviada correctament. En 5 segons seràs redirigit a la pantalla de login")
          setTimeout(() => {
            this.$router.push('/login')
          }, 5000)
        } else {
          this.notify("Hi ha hagut un error. Intenta-ho de nou o contacta amb un administrador: " + response.data)
        }
      },
      notify(message) {
        this.$q.notify({
          message: message,
          color: 'primary',
          position: 'bottom-left',
        })
      },
    }
  }
</script>

<style scoped>

</style>
