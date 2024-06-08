<template>

    <div>
      <div class="q-pa-md  div-center-child">
        <q-carousel
            v-model="slide"
            transition-prev="scale"
            transition-next="scale"
            swipeable
            animated
            control-color="white"
            navigation
            padding
            arrows
            autoplay="true"
            height="300px"
            class="bg-primary text-white shadow-1 rounded-borders"
        >
          <q-carousel-slide :name="1" img-src="https://image.aiavr.uk/blackwhite/WX20240608-102543@2x.png" />
          <q-carousel-slide :name="2" img-src="https://image.aiavr.uk/blackwhite/WX20240608-102612@2x.png" />
          <q-carousel-slide :name="3" img-src="https://image.aiavr.uk/blackwhite/WX20240608-102913@2x.png" />
        </q-carousel>
      </div>
      <q-card>
        <q-card-section class="row items-center justify-evenly">
          <q-btn  flat color="red" icon="wb_sunny"   label="新品"   stack/>
          <q-btn  flat color="red" icon="local_fire_department"  label="热门"   stack/>
          <q-btn  flat color="red" icon="bookmark" label="活动"   stack/>
          <q-btn  flat color="red" icon="payments" label="充值" stack/>
          <q-btn  flat class="red" icon="apps" label="分类" stack  />
        </q-card-section>
      </q-card>
      <q-toolbar >
        <q-toolbar-title>
          商品推荐
        </q-toolbar-title>
      </q-toolbar>
      <div class="scroll-container">
        <div class="scroll-content">
          <!-- 这里放置你需要滚动的内容 -->
          <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
            <product-card-component :value="value" />
          </div>
        </div>
      </div>
      <div>
        <div class="row items-start q-gutter-sm justify-center"> <!-- 修改为items-start以防止内容顶部对齐 -->
          <q-intersection
              v-for="(value ,index) in randomList"
              :key="index"
              class="col-auto m-shop-item-list"
              once
              transition="scale"
          >
            <product-card-component :value="value" />
          </q-intersection>
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
  queryParams.value.pageSize =10;
  const response = await api.get('/product/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    shopProductList.value = data.data
  }
}
getProductList();
const slide = ref(1)

</script>
<style lang="scss" scoped>

</style>
