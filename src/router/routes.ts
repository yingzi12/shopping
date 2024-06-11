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
      { path: 'category', component: () => import('pages/category.vue') },

    ],
  },
  {
    path: '/shoppingCart', component: () => import('layouts/layout.vue'),
    children: [
      { path: '', component: () => import('pages/shoppingCart.vue') },
      { path: 'index', component: () => import('pages/shoppingCart.vue') },
    ],
  },

  {
    path: '/product', component: () => import('layouts/layout.vue'),
    children: [
      { path: '', component: () => import('pages/product/index.vue') },
      { path: 'index', component: () => import('pages/product/index.vue') },
      { path: 'detail', component: () => import('pages/product/detail.vue') },
      { path: 'order', component: () => import('pages/product/order.vue') },
      { path: 'topUp', component: () => import('pages/system/topUp.vue') }
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
      { path: 'create', component: () => import('pages/admin/user/order/create.vue') },
      { path: 'paypal', component: () => import('pages/admin/user/order/paypal.vue') },
      { path: 'list', component: () => import('pages/admin/user/order/list.vue') },
      { path: 'detail', component: () => import('pages/admin/user/order/detail.vue') },
      { path: 'now', component: () => import('pages/admin/user/order/now.vue') },

    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/layout.vue'),
    children: [
      { path: '',
        component: () => import('layouts/MobileLayout.vue'),
        children: [
          { path: '', component: () => import('pages/admin/user/index.vue') },
          { path: 'index', component: () => import('pages/admin/user/index.vue') },
        ]
      },
      {
        path: 'users',
        component: () => import('layouts/UsersLayout.vue'),
        children: [
          // { path: '', component: () => import('pages/users/index.vue') },
          {
            path: 'index',
            component: () => import('pages/admin/user/users/index.vue'),
          },
          {
            path: 'exchange',
            component: () => import('pages/admin/user/system/exchange.vue'),
          },
          {
            path: 'addWithdraw',
            component: () => import('pages/admin/user/system/addWithdraw.vue'),
          },
          {
            path: 'attention',
            component: () => import('pages/admin/user/users/attention.vue'),
          },
          {
            path: 'buy',
            component: () => import('pages/admin/user/system/buy.vue'),
          },
          {
            path: 'buyLog',
            component: () => import('pages/admin/user/system/buyLog.vue'),
          },
          {
            path: 'collection',
            component: () => import('pages/admin/user/users/collection.vue'),
          },
          {
            path: 'delete',
            component: () => import('pages/admin/user/system/delete.vue'),
          },
          {
            path: 'invite',
            component: () => import('pages/admin/user/system/invite.vue'),
          },
          {
            path: 'password',
            component: () => import('pages/admin/user/users/password.vue'),
          },
          {
            path: 'sell',
            component: () => import('pages/admin/user/system/sell.vue'),
          },
          {
            path: 'userEdit',
            component: () => import('pages/admin/user/users/edit.vue'),
          },
          {
            path: 'userHeadImage',
            component: () => import('pages/admin/user/users/userHeadImage.vue'),
          },
          {
            path: 'service',
            component: () => import('pages/admin/user/system/service.vue'),
          },
          {
            path: 'addService',
            component: () => import('pages/admin/user/system/addService.vue'),
          },
          {
            path: 'withdraw',
            component: () => import('pages/admin/user/system/withdraw.vue'),
          }
        ]
      },
      {
        path: 'shop',
        component: () => import('layouts/ShopLayout.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/admin/shop/index.vue'),
          },
          {
            path: 'index',
            component: () => import('pages/admin/shop/index.vue'),
          },
          {
            path: 'add',
            component: () => import('pages/admin/shop/add.vue'),
          },
          {
            path: 'addImage',
            component: () => import('pages/admin/shop/image/add.vue'),
          },
          {
            path: 'edit',
            component: () => import('pages/admin/shop/edit.vue'),
          },
          {
            path: 'spec',
            component: () => import('layouts/layout.vue'),
            children:[
                {
                  path: 'index',
                  component: () => import('pages/admin/shop/spec/index.vue'),
                }
            ]
          },
          {
            path: 'product',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: '', component: () => import('pages/admin/shop/product/index.vue'),},
              {path: 'index', component: () => import('pages/admin/shop/product/index.vue'),},
              {path: 'add', component: () => import('pages/admin/shop/product/add.vue'),},
              {path: 'edit', component: () => import('pages/admin/shop/product/edit.vue'),},

            ]
          },
          {
            path: 'order',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: '', component: () => import('pages/admin/shop/order/index.vue'),},
              {path: 'index', component: () => import('pages/admin/shop/order/index.vue'),}
            ]
          },
          {
            path: 'image',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: '', component: () => import('pages/admin/shop/image/index.vue'),},
              {
                path: 'index',
                component: () => import('pages/admin/shop/image/index.vue'),
              }
            ]
          },
          {
            path: 'category',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: '', component: () => import('pages/admin/shop/category/index.vue'),},
              {
                path: 'index', component: () => import('pages/admin/shop/category/index.vue'),
              }
            ]
          },
          {
            path: 'message',
            component: () => import('layouts/layout.vue'),
            children:[
              {
                path: 'index',
                component: () => import('pages/admin/shop/message/index.vue'),
              }
            ]
          },
          {
            path: 'notice',
            component: () => import('layouts/layout.vue'),
            children:[
              {
                path: 'index',
                component: () => import('pages/admin/shop/notice/index.vue'),
              }
            ]
          },
          {
            path: 'prodTag',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: 'index', component: () => import('pages/admin/shop/prodTag/index.vue'),},
            ]
          },
          {
            path: 'spec',
            component: () => import('layouts/layout.vue'),
            children:[
              {path: '', component: () => import('pages/admin/shop/spec/index.vue'),},
              {path: 'index', component: () => import('pages/admin/shop/spec/index.vue'),},
              {path: 'add', component: () => import('pages/admin/shop/spec/add.vue'),},
              {path: 'edit', component: () => import('pages/admin/shop/spec/edit.vue'),},
            ]
          },
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
