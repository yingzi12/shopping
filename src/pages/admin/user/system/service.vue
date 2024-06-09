<script lang="ts" setup>
import { Cookies } from 'quasar'
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {tansParams} from "boot/tools";
const token = Cookies.get('token');


const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
const serviceList = ref([]);
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
    const response = await api.get('/user/workOrder/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      serviceList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
getList(1)


</script>

<template>
  <div>
    <router-link to="/user/users/addService">
      <q-btn color="primary" label="添加服务工单"/>
    </router-link>
  </div>
  <div class="q-pa-xs" style="max-width: 800px">
    <q-list bordered padding>
      <q-item-label header>服务列表（{{total}}）</q-item-label>
      <div v-for="(service,index) in serviceList"  :key="index">
        <q-item>
          <q-item-section>
            <q-item-label>{{ service.title }}</q-item-label>
            <q-item-label v-if="service.wordType ==1" caption>BUG</q-item-label>
            <q-item-label v-if="service.wordType ==2" caption>投诉</q-item-label>
            <q-item-label v-if="service.wordType ==3" caption>意见/建议</q-item-label>
            <q-item-label v-if="service.wordType ==4" caption>其他</q-item-label>
            <q-item-label v-if="service.status ==1" caption>等待</q-item-label>
            <q-item-label v-if="service.status ==2" caption>已处理</q-item-label>
            <q-item-label v-if="service.status ==3" caption>拒绝</q-item-label>
            <q-item-label caption>{{ service.createTime }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>{{ service.explanation }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ service.replay }}</q-item-label>
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
