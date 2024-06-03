<script lang="ts" setup>
import {Cookies} from 'quasar'
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {getImageUrl, tansParams} from "boot/tools";

const token = Cookies.get('token');
const total = ref(0);
const maxPage = ref(0);
const current=ref(1)
const collectList = ref([]);

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
    //server/admin/userCollection/list.get.ts
    const response = await api.get('/admin/productCollect/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      collectList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getList(1);


</script>

<template>
    <div class="q-pa-md" style="width: 100%">
      <q-list bordered padding>
        <div v-for="(collectionSystem,index) in collectList "  :key="index">
          <q-item>
            <q-item-section class="q-ml-none" thumbnail top>
              <img :src="getImageUrl(collectionSystem)">
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <a :href='"/detail?aid="+collectionSystem.id'>
                  {{ collectionSystem.title }}
                </a>
              </q-item-label>
              <q-item-label caption>{{ collectionSystem.intro }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{ collectionSystem.createTime }}</q-item-label>
              <q-icon color="yellow" name="star"/>
              <q-icon color="white" name="star_border"/>

            </q-item-section>
          </q-item>
          <q-separator spaced/>
        </div>
      </q-list>
    </div>
</template>

<style scoped>

</style>
