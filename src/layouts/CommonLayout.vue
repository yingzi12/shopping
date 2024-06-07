<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const tab=ref("index");

function routerDetail(url){
  router.push(url);
}
function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>
        <q-toolbar-title>商品评价</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col-4"><q-btn flat  color="primary" icon="home" />
          <q-btn flat  color="purple" glossy icon="local_grocery_store" /></div>
        <div  class="col-8"><q-btn-group spread>
          <q-btn color="brown" label="加入购物车"  />
          <q-btn color="red" label="立即购买" />
        </q-btn-group></div>
      </div>

    </q-footer>

  </q-layout>
</template>

