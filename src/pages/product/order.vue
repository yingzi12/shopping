<script setup lang="ts">
import {useRoute} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
import orderItemCardComponent from "components/product/orderItemCardComponent.vue"
const token = Cookies.get("token");
const route = useRoute();
const $q = useQuasar();
const categoryId = ref(route.query.categoryId);
const title = ref(route.query.title);

const disableInfiniteScroll = ref(false)
const isRefreshing = ref(false)
const offsetPage = ref(1);
const pageNum = ref(0);

const onLoad = async (index: number, done: () => void) => {
  try {
    pageNum.value=index;
    isRefreshing.value = true
    await getList(index + offsetPage.value);

    done();

  } catch (error) {
    disableInfiniteScroll.value = true;
    console.error(error);
    done();
  } finally {
    isRefreshing.value = false;
  }
}
const productList = ref([]);
//categoryId=97&current=1&size=10&sort=0&isAllProdType=true
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    categoryId: 2,
    prodName:"",
    sort: 0,
    isAllProdType:true,
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);
const orderBy = ref(0)

async function getList(page: number) {
  queryParams.value.categoryId= categoryId.value;
  queryParams.value.prodName = title.value;
  queryParams.value.pageNum = page;
  // if(orderBy.value==1) {
  //   queryParams.value.orderBy = "countSee";
  // }
  // if(orderBy.value==2) {
  //   queryParams.value.orderBy = "createTime";
  // }
  // if(orderBy.value==0) {
  //   queryParams.value.orderBy = "";
  // }
  // if(orderBy.value==4) {
  //   queryParams.value.charge = 1;
  // }else{
  //   queryParams.value.charge = null;
  // }
  const response = await api.get('/prod/pageProd?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code === 200) {
    const valueList = data.data.records;
    if (valueList.length == 0) {
      disableInfiniteScroll.value = true
    }
    productList.value.push(...valueList);
    isRefreshing.value = false;
  }
}
function search(){
  productList.value=[];
  getList(1);
}
onLoad(0, () => {
});
function onOrderby(order:number){
  orderBy.value=order;
  productList.value=[];
  getList(1);
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
        <q-toolbar-title>产品列表</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>

        <q-input filled bottom-slots v-model="title" :label="$t(`search`)" counter  @keyup.enter="search" >
          <template v-slot:append>
            <q-icon v-if="title !== ''" name="close" @click="title = ''" class="cursor-pointer" />
            <q-icon name="search"         @click="search" />
          </template>
        </q-input>
        <div class="q-gutter-xs">
          <q-chip :selected="orderBy === 0" color="orange" text-color="white" icon="density_small" @click="onOrderby(0)">
            默认
          </q-chip>
          <q-chip :selected="orderBy === 1" color="primary" text-color="white" icon="local_fire_department" @click="onOrderby(1)">
            最热
          </q-chip>
          <q-chip :selected="orderBy === 2" color="teal" text-color="white" icon="refresh" @click="onOrderby(2)">
            最新
          </q-chip>
          <q-chip :selected="orderBy === 4" color="orange" text-color="white" icon="cruelty_free" @click="onOrderby(4)">
            免费
          </q-chip>
        </div>
        <q-infinite-scroll :disable="disableInfiniteScroll" :offset="250" @load="onLoad">
          <div v-for="(value, index) in productList" :key="index" class="caption">
            <div >
              <order-item-card-component :value="value" />
            </div>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"/>
            </div>
          </template>
        </q-infinite-scroll>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<style scoped>

</style>
