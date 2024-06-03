<template>
  <q-layout view="hhh LpR fff" >

    <q-header class="bg-primary text-black" height-hint="98" >
      <q-toolbar class="bg-grey text-white shadow-2 rounded-borders">
        <q-toolbar-title @click="routerIndex">
          <q-avatar>
            <img src="/album-logo.png">
          </q-avatar>

          {{ $t('title') }}
        </q-toolbar-title>

        <q-space />
        <q-btn square color="primary" icon="shopping_cart" />
        <q-btn square color="secondary" icon="navigation" />
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" @click="routerUser">
        </q-avatar>
        <q-select
          filled
          v-model="locale"
          :options="options"
          label="Standard"
          emit-value
          map-options
        />
      </q-toolbar>
    </q-header>

    <q-page-container style="height: 100%;">
      <router-view />
    </q-page-container>
    <footer-layout></footer-layout>

  </q-layout>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useMeta} from "quasar";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import FooterLayout from "components/FooterLayout.vue";
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

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
