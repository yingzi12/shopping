import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/index.vue') }],
  },

  {
    path: '/product',
    component: () => import('layouts/MainLayout.vue'),
    children: [
        { path: '', component: () => import('pages/index.vue') },
      { path: 'index', component: () => import('pages/product/index.vue') },
      { path: 'detail', component: () => import('pages/product/detail.vue') },
      { path: 'order', component: () => import('pages/product/order.vue') },
      { path: 'commit', component: () => import('pages/product/commit.vue') }

    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/UsersLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/index.vue') },
      { path: 'index', component: () => import('pages/admin/index.vue') },
      {
        path: 'product',
        component: () => import('layouts/layout.vue') ,
        children: [
          { path: 'index', component: () => import('pages/admin/product/list.vue') },
        ]
      },
    ],
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'index', component: () => import('pages/users/index.vue') },
      { path: 'commit', component: () => import('pages/users/commit.vue') },
      { path: 'detail', component: () => import('pages/users/detail.vue') },
      { path: 'product', component: () => import('pages/users/product.vue') },

    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/login.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/register.vue') }],
  },
  {
    path: '/checkEmailCode',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/checkEmailCode.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/forgotPassword.vue') }],
  },
  {
    path: '/paypalCard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/paypalCard.vue') }],
  },
  {
    path: '/payment',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/payment.vue') }],
  },
  {
    path: '/privacyPolicy',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/privacyPolicy.vue') }],
  },{
    path: '/restPassword',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/restPassword.vue') }],
  },{
    path: '/use',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/use.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/system/ErrorNotFound.vue'),
  },
];

export default routes;
