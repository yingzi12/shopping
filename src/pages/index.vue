<template>
  <div>
    <div>
      <div class="scroll-container">
        <div class="scroll-content">
          <!-- 这里放置你需要滚动的内容 -->
          <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
            <product-card-component :value="value" />
          </div>
        </div>
      </div>
      <div class="scroll-container">
        <div class="scroll-content">
          <!-- 这里放置你需要滚动的内容 -->
          <div v-for="(value ,index)  in shopProductList" :key="index" class="scroll-item">
            <product-card-component :value="value" />
          </div>
        </div>
      </div>

    </div>
  </div>


</template>

<script setup>
import { computed, reactive, ref, toRefs } from 'vue';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';
import { tansParams } from 'boot/tools';
import productCardComponent from "components/product/productCardComponent.vue"

const title = ref('');
const token = Cookies.get("token");

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 8,
    device: 2,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

const randomList = ref([]);
async  function getProductRandom() {
  // data  = await api.get('/api/shop/random')
  const response = await api.get(`/product/random`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.data.code === 200) {
    randomList.value = response.data.data
  }
}
getProductRandom();
const shopProductList = ref([]);
async function getProductList() {
  queryParams.value.pageNum = 1;
  const response = await api.get('/product/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    shopProductList.value = data.data
  }
}
getProductList();

</script>
<style lang="scss" scoped>
.m-shop-card{
  height: 220px;
  width: 150px;
}
.m-shop-card-image{
  height: 180px;
  width: 130px;
}

.scroll-container {
  overflow-x: auto; /* 水平滚动 */
  white-space: nowrap; /* 确保内容不换行 */
}

.scroll-content {
  display: inline-block; /* 使子元素水平排列 */
}

.scroll-item {
  display: inline-block; /* 让子元素水平排列 */
  margin-right: 10px; /* 添加间隔 */
}
</style>
