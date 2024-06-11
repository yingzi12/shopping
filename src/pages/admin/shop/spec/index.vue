<script lang="ts" setup>
import { Cookies } from 'quasar'
import {useQuasar} from "quasar";
import { ref } from "vue";
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import adminItemCardComponent from "components/spec/adminItemCardComponent.vue";

const $q = useQuasar();
const token = Cookies.get('token');
const router = useRouter();
const valueList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)
async function getList() {
  try {
    // queryParams.value.pageNum = page;
    // 使用 get 方法发送 GET 请求
    const response = await api.get(`/admin/spec/page?pageNum=${current.value}&pageSize=10`);
    const data = response.data;
    // 更新数据
    if (data.code === 200) {
      total.value = data.data.total;
      valueList.value = data.data.records;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
}
getList();



function addValue() {
  router.push("/admin/shop/spec/add");
}
</script>


<template>
  <div class="q-pa-xs q-gutter-xs">
    <q-toolbar >
      <q-btn flat round dense icon="light_mode" />
      <q-toolbar-title>
        统计({{total}})
      </q-toolbar-title>
      <q-btn color="primary" label="添加" @click="addValue"/>
    </q-toolbar>

    <div v-for="(value ,index) in valueList"
         :key="index">
      <admin-item-card-component :value="value"></admin-item-card-component>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="current"
          :max="maxPage"
          max-pages="6"
          direction-links
          @update:modelValue="getList()"
      />
    </div>
  </div>

</template>

<style scoped>

</style>
