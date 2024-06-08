import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MobileLayout.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') },
      { path: 'index', component: () => import('pages/index.vue') },
      { path: 'shop', component: () => import('pages/shop.vue') },
      { path: 'forgotPassword', component: () => import('pages/system/forgotPassword.vue') },
      { path: 'checkEmailCode', component: () => import('pages/system/checkEmailCode.vue') },
      { path: 'restPassword', component: () => import('pages/system/restPassword.vue') },
      { path: 'login', component: () => import('pages/system/login.vue') },
      { path: 'register', component: () => import('pages/system/register.vue') },
      { path: 'product', component: () => import('pages/product/index.vue') },
      // { path: 'shoppingCart', component: () => import('pages/shoppingCart.vue') },
      { path: 'category', component: () => import('pages/category.vue') },
    ],
  },
  {
    path: '/shoppingCart', component: () => import('layouts/layout.vue'),
    children: [
      { path: '', component: () => import('pages/shoppingCart.vue') },
      { path: 'index', component: () => import('pages/shoppingCart.vue') },
      // { path: 'detail', component: () => import('pages/product/detail.vue') },
      // { path: 'order', component: () => import('pages/product/order.vue') }
    ],
  },

  {
    path: '/product', component: () => import('layouts/layout.vue'),
    children: [
      { path: '', component: () => import('pages/product/index.vue') },
      { path: 'index', component: () => import('pages/product/index.vue') },
      { path: 'detail', component: () => import('pages/product/detail.vue') },
      { path: 'order', component: () => import('pages/product/order.vue') }
    ],
  },
  {
    path: '/common', component: () => import('layouts/CommonLayout.vue'),
    children: [
      { path: '', component: () => import('pages/common/index.vue') },
      { path: 'index', component: () => import('pages/common/index.vue') },
      { path: 'detail', component: () => import('pages/common/detail.vue') },
      { path: 'order', component: () => import('pages/common/order.vue') }
    ],
  },
  {
    path: '/shop',
    component: () => import('layouts/MobileLayout.vue'),
    children: [
      { path: '', component: () => import('pages/shop/index.vue') },
      { path: 'index', component: () => import('pages/shop/index.vue') },
      { path: 'detail', component: () => import('pages/shop/detail.vue') },
      { path: 'order', component: () => import('pages/shop/order.vue') },
    ],
  },
  {
    path: '/discuss',
    component: () => import('layouts/MobileLayout.vue'),
    children: [
      { path: '', component: () => import('pages/discuss/index.vue') },
      { path: 'detail', component: () => import('pages/discuss/detail.vue') },
      { path: 'order', component: () => import('pages/discuss/order.vue') },
    ],
  },
  {
    path: '/order', component: () => import('layouts/layout.vue'),
    children: [
      { path: 'create', component: () => import('pages/admin/order/create.vue') },
      { path: 'paypal', component: () => import('pages/admin/order/paypal.vue') },
      { path: 'list', component: () => import('pages/admin/order/list.vue') },
      { path: 'detail', component: () => import('pages/admin/order/detail.vue') },
      { path: 'now', component: () => import('pages/admin/order/now.vue') },

    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/UsersLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/index.vue') },
      { path: 'index', component: () => import('pages/admin/index.vue') },
      {
        path: 'users',
        component: () => import('layouts/layout.vue'),
        children: [
          // { path: '', component: () => import('pages/users/index.vue') },
          {
            path: 'index',
            component: () => import('pages/admin/users/index.vue'),
          },
          {
            path: 'addshop',
            component: () => import('pages/admin/shop/add.vue'),
          }
          ,
          {
            path: 'exchange',
            component: () => import('pages/admin/system/exchange.vue'),
          },
          {
            path: 'addWithdraw',
            component: () => import('pages/admin/system/addWithdraw.vue'),
          },
          {
            path: 'shop',
            component: () => import('pages/admin/shop/index.vue'),
          },
          {
            path: 'attention',
            component: () => import('pages/admin/users/attention.vue'),
          },
          {
            path: 'buy',
            component: () => import('pages/admin/system/buy.vue'),
          },
          {
            path: 'buyLog',
            component: () => import('pages/admin/system/buyLog.vue'),
          },
          {
            path: 'collection',
            component: () => import('pages/admin/users/collection.vue'),
          },
          {
            path: 'delete',
            component: () => import('pages/admin/system/delete.vue'),
          },
          {
            path: 'editshop',
            component: () => import('pages/admin/shop/edit.vue'),
          },
          {
            path: 'invite',
            component: () => import('pages/admin/system/invite.vue'),
          },
          {
            path: 'password',
            component: () => import('pages/admin/users/password.vue'),
          },
          {
            path: 'sell',
            component: () => import('pages/admin/system/sell.vue'),
          },
          {
            path: 'userEdit',
            component: () => import('pages/admin/users/edit.vue'),
          },
          {
            path: 'userHeadImage',
            component: () => import('pages/admin/users/userHeadImage.vue'),
          },
          {
            path: 'service',
            component: () => import('pages/admin/system/service.vue'),
          },
          {
            path: 'addService',
            component: () => import('pages/admin/system/addService.vue'),
          },
          {
            path: 'withdraw',
            component: () => import('pages/admin/system/withdraw.vue'),
          }
        ]
      },
      {
        path: 'shop',
        component: () => import('layouts/ShopLayout.vue'),
        children: [
          {
            path: 'index',
            component: () => import('pages/admin/shop/index.vue'),
          },
          {
            path: 'addshop',
            component: () => import('pages/admin/shop/add.vue'),
          },
          {
            path: 'addWithdraw',
            component: () => import('pages/admin/system/addWithdraw.vue'),
          },
          {
            path: 'shop',
            component: () => import('pages/admin/shop/index.vue'),
          },
          {
            path: 'attention',
            component: () => import('pages/admin/users/attention.vue'),
          },
          {
            path: 'buy',
            component: () => import('pages/admin/system/buy.vue'),
          },
          {
            path: 'buyLog',
            component: () => import('pages/admin/system/buyLog.vue'),
          },
          {
            path: 'collection',
            component: () => import('pages/admin/users/collection.vue'),
          },
          {
            path: 'delete',
            component: () => import('pages/admin/system/delete.vue'),
          },
          {
            path: 'editshop',
            component: () => import('pages/admin/shop/edit.vue'),
          },
          {
            path: 'invite',
            component: () => import('pages/admin/system/invite.vue'),
          },
          {
            path: 'sell',
            component: () => import('pages/admin/system/sell.vue'),
          },
          {
            path: 'userEdit',
            component: () => import('pages/admin/users/edit.vue'),
          },
          {
            path: 'userHeadImage',
            component: () => import('pages/admin/users/userHeadImage.vue'),
          },
          {
            path: 'service',
            component: () => import('pages/admin/system/service.vue'),
          },
          {
            path: 'addService',
            component: () => import('pages/admin/system/addService.vue'),
          },
          {
            path: 'withdraw',
            component: () => import('pages/admin/system/withdraw.vue'),
          }
        ]
      },

    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/system/ErrorNotFound.vue'),
  },
];

export default routes;
