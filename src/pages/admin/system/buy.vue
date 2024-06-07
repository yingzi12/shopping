<script lang="ts" setup>
import {Cookies, useQuasar} from 'quasar'
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {tansParams} from "boot/tools";
import mUserShopCard from "components/shop/mUserShopDetailsCardComponent.vue"

const $q = useQuasar();

const token = Cookies.get('token');

const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const sellList = ref([]);
const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  }
});
const {queryParams} = toRefs(queryData);

async function getList(page: number) {
  queryParams.value.pageNum = page;
  try {
    const response = await api.get('/admin/paymentOrder/listBuy?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      sellList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getList(1)

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${$q.config.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
</script>

<template>
  <div class="q-pa-xs" style="max-width: 350px">
    <q-toolbar >
      <q-btn flat round dense icon="light_mode" />
      <q-toolbar-title>
        已购买({{total}})
      </q-toolbar-title>
    </q-toolbar>
      <div v-for="(shop,index) in sellList"  :key="index">
        <m-user-shop-card :shop="shop"></m-user-shop-card>
      </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="current"
          :max="maxPage"
          max-pages="6"

          direction-links
          @update:modelValue="getList(current)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
