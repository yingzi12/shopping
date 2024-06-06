<script lang="ts" setup>
import {Cookies, useQuasar} from "quasar";
import {api} from "boot/axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const $q = useQuasar();
const token = Cookies.get("token");
// 如果没有 token，重定向到登录页面
if (!token) {
  router.push('/login');
}
const drawer = ref(false);
const link = ref('detail')
const users = ref(null)
const previewImage = ref("/favicon.png")

const id = Cookies.get("id");
const userInfo = Cookies.get("userInfo");

const name = ref(null);
const nickname = ref(null);
const email = ref(null);
const imgUrl = ref(null);
const isEmail = ref(null);
const intro = ref(null);
const countSee = ref(0);
const countLike = ref(0);
const countAttention = ref(0);
const vip = ref(0);
const vipExpirationTime = ref(null);

// 添加注销方法

async function getDetail() {
  const response = await api.get(`/admin/systemUser/getInfo`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    name.value = data.data.name;
    nickname.value = data.data.nickname;
    email.value = data.data.email;
    imgUrl.value = data.data.imgUrl;
    intro.value = data.data.intro;
    isEmail.value = data.data.isEmail;
    countSee.value = data.data.countSee;
    countLike.value = data.data.countLike;
    countAttention.value = data.data.countAttention;
    vip.value = data.data.vip;
    vipExpirationTime.value = data.data.vipExpirationTime;
  }
}

getDetail();

const logout = async () => {
  try {
    const response = await api.get(`/admin/systemUser/logout`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("userInfo");
    router.push('/login'); // 假设登录页面的路由为 '/login'
  }catch (error){
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("userInfo");
    router.push('/login'); // 假设登录页面的路由为 '/login'
  }
};

function getImageUrl(url) {
  if (url != null) {
    return `${$q.config.sourceWeb}${url}`;
  }
  return "/favicon.png";
}


</script>

<template>
  <div class="q-pa-md" style="height: 100vh;">
    <q-layout class="shadow-2 rounded-borders" container view="lHh Lpr lff">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar>
            <q-btn dense flat icon="menu" round @click="drawer = !drawer"/>
          </q-toolbar>
<!--          <q-btn flat round dense icon="menu" class="q-mr-sm" />-->
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>

          <q-toolbar-title>Quasar Framework</q-toolbar-title>

          <q-btn flat round dense icon="whatshot" />
        </q-toolbar>
      </q-header>
<!--      <q-header class="bg-cyan-8" elevated>-->
<!--        <q-toolbar>-->
<!--          <q-btn dense flat icon="menu" round @click="drawer = !drawer"/>-->
<!--        </q-toolbar>-->
<!--      </q-header>-->

      <q-drawer
          v-model="drawer"
          :breakpoint="400"
          :width="200"
          show-if-above
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item v-ripple
                    :active="link === 'detail'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/"
                    @click="link = 'detail'"
            >
              <q-item-section avatar>
                <q-icon name="account_circle"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.personalInfo`) }}
              </q-item-section>
            </q-item>

            <q-item v-ripple
                    :active="link === 'attention'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/attention"
                    @click="link = 'attention'"
            >
              <q-item-section avatar>
                <q-icon name="favorite_border"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.myAttention`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'collection'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/collection"
                    @click="link = 'collection'"
            >
              <q-item-section avatar>
                <q-icon name="star_rate"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.myCollection`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'buy'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/buy"
                    @click="link = 'buy'"
            >
              <q-item-section avatar>
                <q-icon name="shopping_bag"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myPurchase`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'shop'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/shop"
                    @click="link = 'shop'"
            >
              <q-item-section avatar>
                <q-icon name="perm_media"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myshop`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'vip'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/vip"
                    @click="link = 'vip'"
            >
              <q-item-section avatar>
                <q-icon name="settings_brightness"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.vipSettings`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'sell'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/sell"
                    @click="link = 'sell'"
            >
              <q-item-section avatar>
                <q-icon name="view_headline"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.userPurchase`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'withdraw'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/withdraw"
                    @click="link = 'withdraw'"
            >
              <q-item-section avatar>
                <q-icon name="paid"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myWithdrawal`) }}
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-ripple
                    :active="link === 'invite'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/invite"
                    @click="link = 'invite'"
            >
              <q-item-section avatar>
                <q-icon name="send"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myInvitation`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'exchange'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/exchange"
                    @click="link = 'exchange'"
            >
              <q-item-section avatar>
                <q-icon name="currency_exchange"/>
              </q-item-section>
              <q-item-section>
                {{ $t(`user.myExchange`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'password'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/password"
                    @click="link = 'password'"
            >
              <q-item-section avatar>
                <q-icon name="password"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.resetPassword`) }}
              </q-item-section>
            </q-item>
            <q-item v-ripple
                    :active="link === 'buyLog'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/users/buyLog"
                    @click="link = 'buyLog'"
            >
              <q-item-section avatar>
                <q-icon name="vertical_split"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.consumptionRecord`) }}
              </q-item-section>
            </q-item>
            <q-item
                v-ripple
                :active="link === 'service'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/service"
                @click="link = 'service'"
            >
              <q-item-section avatar>
                <q-icon name="mail_outline"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.customerService`) }}
              </q-item-section>
            </q-item>
            <q-item
                v-ripple
                :active="link === 'drafts'"
                active-class="my-menu-link"
                clickable
                @click="logout"
            >
              <q-item-section avatar>
                <q-icon name="exit_to_app"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.logOut`) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar  class="q-mb-sm" size="56px">
              <img :src="getImageUrl(imgUrl)">
            </q-avatar>
            <div class="text-weight-bold">{{ nickname != null ? nickname : '待登录' }}</div>
            <div v-if="email">
              {{ email }}
              <q-icon v-if="isEmail==2" name="warning" style="color: red"/>
            </div>
            <div v-if="isEmail==2">
              ( {{ $t(`user.emailVerification`) }})
            </div>

            <div>
              <q-btn to="/admin/shop/index">管理中心</q-btn>
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>

</template>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
