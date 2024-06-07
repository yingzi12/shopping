<script lang="ts" setup>
import mShopCard from "components/shop/mUsershopCardComponent.vue"
import mUserCard from "components/user/mUserCardComponent.vue"
import mUserHeadCard from "components/user/mUserHeadComponent.vue"
import mRadomUserCard from "components/user/mRandomComponent.vue"

import { useRoute, useRouter } from 'vue-router';
import {reactive, ref, toRefs} from "vue";
import {Cookies, useQuasar} from "quasar";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
const route = useRoute();
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const token = Cookies.get("token");
const userId = ref(route.query.userId);

const shopList = ref([]);
const total = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,

    title: '',
    userId: userId.value,
  },
  rules: {}
});

const image = ref("")
const {queryParams, form, rules} = toRefs(queryData);
//有多少页
const  maxPage=ref(0);
const  current=ref(1);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  queryParams.value.pageNum = page;
  const response = await api.get('/usershop/list?' + tansParams(queryParams.value))
  const data = response.data;
  //console.log(data.code)
  if (data.code == 200) {
    total.value = data.total
    shopList.value = data.data
    if(data.total % queryParams.value.pageSize == 0){
      maxPage.value=data.total/queryParams.value.pageSize;
    }else{
      maxPage.value=data.total/queryParams.value.pageSize+1;
    }
  }
}

getList(1)

const isSee=ref(2)
async function onSee() {
  if ( isSee.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isSee.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/systemUser/see?userId=${userId.value}`)
  const data = response.data;
  if (data.code == 200) {
    isSee.value = 1;
  }else{
    isSee.value = 2;
  }
}
onSee();
const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/systemUser/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
  }
}

getRandom();

</script>

<template>

   <m-user-head-card :user-id="userId"></m-user-head-card>
  <q-toolbar >
    <q-btn flat round dense icon="menu" />
    <q-toolbar-title>
      用户图集({{total}})
    </q-toolbar-title>
    <q-btn flat round dense icon="more_horiz" to="/usershop/order"/>
  </q-toolbar>
  <div v-if="shopList.length ==0">
    <div class="caption">
      <p class="text-h5 content-center bg-yellow">用户未创建图集</p>
    </div>
  </div>
  <div>

    <div class="row items-start q-gutter-sm justify-center"> <!-- 修改为items-start以防止内容顶部对齐 -->
      <q-intersection
        v-for="(value ,index) in shopList"
        :key="index"
        class="col-auto m-shop-item-list"
        once
        transition="scale"
      >
        <m-shop-card :shop="value" />
      </q-intersection>
    </div>
    <q-pagination v-model="current"
                  active-color="primary"
                  class="caption"
                  color="grey"
                  direction-links
                  flat
                  :max="maxPage"
                  max-pages="6"
                  @update:model-value="getList"
    />

  </div>
  <m-radom-user-card></m-radom-user-card>

</template>

<style lang="sass" scoped>

.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)

.q-carousel__slide
  background-size: contain

.example-item
  height: 600px
  width: 260px

.q-card img
  object-fit: cover

.q-pagination
  text-align: center

.caption
  display: flex
  justify-content: center
  align-items: center

</style>
