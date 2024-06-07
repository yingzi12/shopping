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
const collectionUserList = ref([]);

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
    //server/admin/userCollection/list.get.ts
    const response = await api.get('/admin/userCollection/listSystem?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      collectionSystemList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
async function getListUser(page: number) {
  queryParams.value.pageNum = page;
  try {
    //server/admin/userCollection/list.get.ts
    const response = await api.get('/admin/userCollection/listUser?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      collectionUserList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getListSystem(1);
getListUser(1);

const tab = ref('mails')

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${$q.config.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
function getSystemImageUrl(shop) {
  if (shop.sourceUrl != null && shop.sourceUrl.startsWith('/image')) {
    return `${$q.config.sourceWeb}${shop.sourceUrl}`;
  }
  return shop.sourceWeb + shop.imgUrl;
}

</script>

<template>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
          <q-tab label="系统" name="system"/>
          <q-tab label="用户" name="users"/>
        </q-tabs>

        <q-tab-panels v-model="tab"  >
          <q-tab-panel  name="system">
            <div v-for="(collectionSystem,index) in collectionSystemList "  :key="index">
                  <m-shop-card :shop="collectionSystem"></m-shop-card>
            </div>
          </q-tab-panel>

          <q-tab-panel  name="users">
            <div v-for="(collectionUser,index) in collectionUserList "  :key="index">
                     <m-user-shop-card :shop="collectionUser"></m-user-shop-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
</template>

<style scoped>

</style>
