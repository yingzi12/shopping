<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
import productCard from "components/product/productCardComponent.vue"

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 6,
    device: 2,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);


const productList = ref([]);
async function getSystemList() {
  queryParams.value.pageNum = 1;
  const response = await api.get('/product/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    productList.value = data.data
  }
}
getSystemList();
</script>

<template>
  <div class="scroll-container">
    <div class="scroll-content">
      <!-- 这里放置你需要滚动的内容 -->
      <div v-for="(value ,index)  in productList" :key="index" class="scroll-item">
        <product-card  :value="value" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
