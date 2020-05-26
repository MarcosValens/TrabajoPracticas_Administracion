import Vue from 'vue'
import axios from 'axios'

const axiosBackend = axios.create({
    baseURL: process.env.CORE_URL
})

export default async ({Vue, router}) => {

  axiosBackend.interceptors.request.use(config => {
    config.withCredentials = true;
    const token = localStorage.getItem('access_token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axiosBackend.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {

    const originalRequest = error.config;


    /*
    * Ponemos que sea un error y a la vez no sea login,
    * por que si nos da este error en el login significa que
    * no se ha podido autenticar, no que el token este caducado
    * */
    if (error.response.status === 401 && router.currentRoute.path !== '/login') {
      // UNAUTORIZED, token no valido o token caducado.

      /*
      * Step 1- Intentar renovar token
      *
      * TODO - Aqui irá el path para hacer un refresh
      * */
      const response = await axiosBackend.post('/auth/refresh', {
        refresh_token: localStorage.getItem("refresh_token")
      });

      /*
      * OK - token renovado
      * */

      if (response.status === 200) {
        const token = response.data.access_token;
        const refresh = response.data.refresh_token;
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refresh);

        return axiosBackend(originalRequest);
      } else {
        router.push("/login")
      }

    }

    if (error.response.status === 403) {
      // FORBIDEN - NO tienes permisos, loggeate con usuario que si tenga permisos
      router.push('/login')
    }

    return error.response;
  });
}


Vue.prototype.$axiosCore = axiosBackend
