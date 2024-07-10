<script lang="ts" setup>
import {Cookies, useQuasar} from 'quasar'
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {tansParams} from "boot/tools";
import mShopCard from "components/shop/mUserShopDetailsCardComponent.vue"

const $q = useQuasar();

const token = Cookies.get('token');
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const collectionSystemList = ref([]);

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  }
});
const {queryParams} = toRefs(queryData);

async function getListSystem(page: number) {
  queryParams.value.pageNum = page;
  try {
    //server/user/userCollection/list.get.ts
    const response = await api.get('/user/userCollection/listSystem?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      if(total.value%queryParams.value.pageSize == 0){
        maxPage.value = total.value / queryParams.value.pageSize ;
      }else {
        maxPage.value = total.value / queryParams.value.pageSize + 1;
      }
      collectionSystemList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

getListSystem(1);

const tab = ref('mails')

</script>

<template>
  <div v-for="(collectionSystem,index) in collectionSystemList "  :key="index">
    <m-shop-card :shop="collectionSystem"></m-shop-card>
  </div>
</template>

<style scoped>

</style>
