<script setup lang="ts">
import {useRoute} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
import mUserCard from "components/user/mUserDetailsCardComponent.vue"
const token = Cookies.get("token");
const route = useRoute();
const $q = useQuasar();
// const title = ref('');
const title = ref(route.query.title);

const disableInfiniteScroll = ref(false)
const isRefreshing = ref(false)

const offsetPage = ref(1);
const pageNum = ref(0);

const currentIndex = ref(0);
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
const userList = ref([]);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    device: 2,
    title: '',
    orderBy:"",
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);
const orderBy = ref(0)

async function getList(page: number) {
  queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  if(orderBy.value==1) {
    queryParams.value.orderBy = "countSee";
  }
  if(orderBy.value==2) {
    queryParams.value.orderBy = "createTime";
  }
  if(orderBy.value==0) {
    queryParams.value.orderBy = "";
  }
  const response = await api.get('/systemUser/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code === 200) {
    const valueList = data.data
    if (valueList.length == 0) {
      disableInfiniteScroll.value = true
    }
    userList.value.push(...valueList);
    isRefreshing.value = false;
  }
}
function search(){
  userList.value=[];
  getList(1);
}
onLoad(0, () => {
});
function onOrderby(order:number){
  orderBy.value=order;
  userList.value=[];
  getList(1);
}
</script>

<template>
  <q-breadcrumbs class="text-brown q-ma-md">
    <template v-slot:separator>
      <q-icon
        size="1.5em"
        name="chevron_right"
        color="primary"
      />
    </template>

    <q-breadcrumbs-el label="首页" icon="widgets"  to="/users/index"/>
    <q-breadcrumbs-el label="排行榜" icon="navigation" to="/users/order" />
  </q-breadcrumbs>
  <q-input filled bottom-slots v-model="title" label="查询图集" counter @keyup.enter="search" >
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
  </div>
  <q-infinite-scroll :disable="disableInfiniteScroll" :offset="250" @load="onLoad">
    <div v-for="(value, index) in userList" :key="index" class="caption">
      <div>
        <m-user-card :value="value" />
      </div>
    </div>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px"/>
      </div>
    </template>
  </q-infinite-scroll>
</template>

<style scoped>

</style>
