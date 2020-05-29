const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {path: "", redirect: '/admin'},
      {
        path: 'change/password', component: () => import('pages/public/Recovery.vue'),
        beforeEnter: (to, from, next) => {
          const url = new URL(location);
          const token = url.searchParams.get('recovery_token');
          sessionStorage.setItem('recovery_token_passwd', token);
          /*
          * Limpiar url de params
          * */

          window.history.pushState({}, document.title, "/#/change/password");
          next()
        }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: "", redirect: 'panel'},
      {path: 'panel', component: () => import('pages/private/PanellAdmin.vue')},
      {path: 'professor/:id', component: () => import('pages/private/Professor.vue')},
      {path: 'usuari/:id', component: () => import('pages/private/Usuari.vue')},
      {path: 'professors', component: () => import('pages/private/Professors.vue')},
      {path: 'usuaris', component: () => import('pages/private/Usuaris.vue')},
    ],
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        next('/login');
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {path: '', component: () => import('pages/public/Login.vue')},
      {
        path: 'oauth/callback',
        beforeEnter: (to, from, next) => {

          const url = new URL(location);
          const accessToken = url.searchParams.get('access_token');
          const refreshToken = url.searchParams.get('refresh_token');

          const admin = JSON.parse(url.searchParams.get('isAdmin'));
          if (!admin) {
            next('/login');
          }

          /*
          * Save tokens
          * */
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);

          /*
          * Limpiar url de params
          * */
          window.history.pushState({}, document.title, "/");
          next('/');
        }
      },
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/error/Error404.vue')
  })
}

export default routes
