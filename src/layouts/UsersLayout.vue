<template>
  <q-layout view="hhh LpR fff" >

   <q-header elevated class="bg-black">
    <q-toolbar >
      <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
      <q-avatar>
        <q-img src="/album-logo.png" @click="routerIndex"/>
      </q-avatar>
      <q-toolbar-title> {{ $t('title') }}</q-toolbar-title>
    </q-toolbar>
    </q-header>
    <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item v-ripple
                  :active="link === 'detail'"
                  active-class="my-menu-link"
                  clickable
                  to="/users/"
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
                  to="/users/attention"
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
                  to="/users/collection"
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
                  to="/users/buy"
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
                  :active="link === 'album'"
                  active-class="my-menu-link"
                  clickable
                  to="/users/album"
                  @click="link = 'album'"
          >
            <q-item-section avatar>
              <q-icon name="perm_media"/>
            </q-item-section>
            <q-item-section>
              {{ $t(`user.myAlbum`) }}
            </q-item-section>
          </q-item>
          <q-item v-ripple
                  :active="link === 'vip'"
                  active-class="my-menu-link"
                  clickable
                  to="/users/vip"
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
                  to="/users/sell"
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
                  to="/users/withdraw"
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
                  to="/users/invite"
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
                  to="/users/exchange"
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
                  to="/users/password"
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
                  to="/users/buyLog"
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
              to="/users/service"
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
            <q-img
                :src="getImageUrl(user.imgUrl) || `/default.png`" @error.once="e => { e.target.src = `/default.png` }"
            />
          </q-avatar>
          <div class="text-weight-bold">{{ user.nickname != null ? user.nickname : '待登录' }}</div>
          <div v-if="user.email">
            {{ user.email }}
            <q-icon v-if="user.isEmail==2" name="warning" style="color: red"/>
          </div>
          <div v-if="user.isEmail==2">
            ( {{ $t(`user.emailVerification`) }})
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container style="height: 100%;">
      <router-view />
    </q-page-container>
    <footer-layout></footer-layout>

  </q-layout>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {Cookies, useMeta, useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import FooterLayout from "components/FooterLayout.vue";
import {api} from "boot/axios";
import {getImageUrl} from "boot/tools";
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const $q = useQuasar();
const token = Cookies.get("token");
// 如果没有 token，重定向到登录页面
if (!token) {
  router.push('/login');
}
const metaData = {
  // sets document title
  title: '图集网',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => `${title} - 最热门 Photo Black White, Beauty, Photo, Photography, Showman.com`,

  // meta tags
  meta: {
    verification:{name:"baidu-site-verification", content:"codeva-y79QY7Z0Nm"},
    description: { name: 'description', content: '图集网  最热门 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com' },
    keywords: { name: 'keywords', content: '图集网 最热门 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle:  {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template (ogTitle) {
        return `${ogTitle} - 最热门 图集网 美女 写真 摄影 秀人网  Photo Gallery, Beauty, Photo, Photography, Showman.com`
      }
    }
  },
}
useMeta(metaData);
const drawer = ref(false);

const tab= ref('images');

const { locale } = useI18n()
const options= [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: '中文',
    value: 'zh-CN'
  }
]
// 创建一个响应式引用作为默认语言
const defaultLanguage = ref('en');
// 设置默认语言的方法
const setDefaultLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage;
  const availableLanguages = ['en', 'zh-CN']; // 示例语言列表

  if (availableLanguages.includes(userLang)) {
    locale.value = userLang;
  } else {
    locale.value = defaultLanguage.value;
  }
};

const user=ref({});
async function getDetail() {
  const response = await api.get(`/admin/systemUser/getInfo`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code === 200) {
    user.value = data.data;
    // nickname.value = data.data.nickname;
    // email.value = data.data.email;
    // imgUrl.value = data.data.imgUrl;
    // intro.value = data.data.intro;
    // isEmail.value = data.data.isEmail;
    // countSee.value = data.data.countSee;
    // countLike.value = data.data.countLike;
    // countAttention.value = data.data.countAttention;
    // vip.value = data.data.vip;
    // vipExpirationTime.value = data.data.vipExpirationTime;
  }
}

getDetail();
function routerUser() {
  router.push('/admin/index'); // 或者其他页面
}
function routerIndex() {
  router.push('/'); // 或者其他页面
}
// 在组件挂载后调用设置默认语言的方法
onMounted(() => {
  setDefaultLanguage();
});

</script>
