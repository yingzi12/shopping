<script lang="ts" setup>
//关注
import {Cookies, useQuasar} from 'quasar'
import {reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
const token = Cookies.get('token');
const $q = useQuasar();


const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const attentionList = ref([]);
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
    const response = await api.get('/admin/userAttention/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      attentionList.value = response.data.data;
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
  return `/favicon.png`;
}
</script>

<template>
  <div class="q-pa-xs" style="max-width: 350px">
    <q-list bordered padding>
      <q-item-label header>关注列表（{{ total }}）</q-item-label>

      <div v-for="(attention,index) in attentionList" :key="index">
      <q-item>
        <q-item-section avatar top>
          <q-avatar>
            <img :src="getImageUrl(attention.imgUrl)">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <a :href='"/users/detail?userId="+attention.id'>
            {{ attention.nickname }}
            </a>
          </q-item-label>
          <q-item-label caption>{{ attention.intro }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge :label="attention.countAttention"/>
        </q-item-section>
      </q-item>
      <q-separator inset="item" spaced/>
      </div>
    </q-list>
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
