<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const tab=ref("index");
function updateTable(){
  console.log("------value--------");
  console.log(tab.value)
  if(tab.value == 'index'){
    router.push("/index");
  }
  if(tab.value == 'category'){
    router.push("/category");
  }
  if(tab.value == 'shoppingCart'){
    router.push("/shoppingCart");
  }
  if(tab.value == 'admin'){
    router.push("/admin/index");
  }

}
function routerUrl(url){
  router.push(url);
}
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
<!--        <q-btn flat round dense icon="menu" class="q-mr-sm" />-->
        <q-avatar  @click="routerUrl('/')">
          <img src="/logo.jpg" >
        </q-avatar>

        <q-toolbar-title @click="routerUrl('/')">Black White</q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
      </q-toolbar>
    </q-header>
    <q-page-container class="text-center">
      <q-page style="max-width: 600px">
      <router-view />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-green-8 text-white">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="bg-white text-black shadow-2"
          :breakpoint="0"
          @update:model-value="updateTable()"
        >
          <q-tab name="index"  icon="home" :label=" $t(`home`)"  />
          <q-tab name="category" icon="format_align_justify" :label=" $t(`kind`)"/>
          <q-tab name="shoppingCart" icon="shopping_cart" :label=" $t(`shoppingCart`)"/>
          <q-tab name="admin" icon="manage_accounts" :label=" $t(`users`)" />
        </q-tabs>
    </q-footer>

  </q-layout>
</template>

