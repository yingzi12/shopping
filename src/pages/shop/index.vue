<template>
  <div>
    <!-- 更改q-tabs为普通的div，除非你确实需要标签页功能 -->
    <div>
      <q-input filled bottom-slots v-model="title" :label="$t(`search`)" @keyup.enter="search"  >
        <template v-slot:append>
          <q-icon v-if="title !== ''" name="close" @click="title = ''" class="cursor-pointer" />
          <q-icon name="search" @click="search"/>
        </template>
      </q-input>
    </div>
    <div>
      <div class="scroll-container">
        <div class="scroll-content">
          <!-- 这里放置你需要滚动的内容 -->
          <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
            <m-shop-card  :shop="value" />
          </div>
        </div>
      </div>
      <div>
        <q-toolbar >
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>
            用户图集
          </q-toolbar-title>
          <q-btn flat round dense icon="more_horiz" to="/shop"/>
        </q-toolbar>
        <div class="row items-start q-gutter-sm justify-center"> <!-- 修改为items-start以防止内容顶部对齐 -->
          <q-intersection
            v-for="(value ,index) in shopList"
            :key="index"
            class="col-auto m-shop-item-list"
          once
          transition="scale"
          >
          <m-shop-card :shop="value" />
          </q-intersection>
        </div>
      </div>

    </div>
    <!-- Swiper区域 -->
  </div>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from 'vue';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';
import { tansParams } from 'boot/tools';
import mshopCard from "components/shop/mUsershopCardComponent.vue"
import {useRouter} from "vue-router";
const title = ref('');
const token = Cookies.get("token");

const randomList = ref([]);

function imageUrl(shop) {
  if (shop.sourceUrl!=null &&  shop.sourceUrl.startsWith('/image')) {
    return `https://image.51x.uk/xinshijie${shop.sourceUrl}`;
  }
  return shop.sourceWeb + shop.imgUrl;
}

async  function getRandom() {
    // data  = await api.get('/api/shop/random')
  const response = await api.get(`/usershop/random`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.data.code === 200) {
    randomList.value = response.data.data
  }
}
getRandom();
const shopList = ref([]);
const total = ref(0);
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    device: 2,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

async function getList() {
  queryParams.value.title = title.value;
  queryParams.value.pageNum = 1;
  const response = await api.get('/usershop/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    total.value = data.total
    shopList.value = data.data
  }
}
getList();
const router = useRouter();

function search(){
  router.push(`/usershop/order?title=${title.value}`)
}
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
