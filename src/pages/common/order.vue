<script setup lang="ts">
import {useRoute} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
import productCardComponent from "components/product/productCardComponent.vue"
const token = Cookies.get("token");

const route = useRoute();
const $q = useQuasar();
const pid = ref(route.query.pid);

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

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 3,
    prodId: pid.value,
    evaluate: -1,
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);
const orderBy = ref(0)
const commonList = ref([]);

async function getList(page: number) {
  // queryParams.value.title = title.value;
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
  const response = await api.get('/prodComm/prodCommPageByProd?' + tansParams(queryParams.value));
  const data = response.data;
  if (data.code === 200) {
    const valueList = data.data
    if (valueList.length == 0) {
      disableInfiniteScroll.value = true
    }
    commonList.value.push(...valueList);
    isRefreshing.value = false;
  }
}
function search(){
  commonList.value=[];
  getList(1);
}
onLoad(0, () => {
});
function onOrderby(order:number){
  orderBy.value=order;
  commonList.value=[];
  getList(1);
}
</script>

<template>
  <div>
    <q-chip color="yellow" size="xs">全部</q-chip>
    <q-chip size="xs">好评</q-chip>
    <q-chip size="xs">中评</q-chip>
    <q-chip size="xs">差评</q-chip>
    <q-chip size="xs">有图</q-chip>
  </div>
  <q-infinite-scroll :disable="disableInfiniteScroll" :offset="250" @load="onLoad">
    <div v-for="(value, index) in commonList" :key="index" class="caption">
      <div>
        <product-card-component :value="value" />
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
