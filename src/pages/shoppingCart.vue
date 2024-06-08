<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const shopCartList = ref([]);
//购物车列表
async  function getShopCartList() {
  // data  = await api.get('/api/shop/random')
  const response = await api.post(`/shopCart/info`,JSON.stringify({}));
  if (response.data.code === 200) {
    shopCartList.value = response.data.data
    console.log("----------------------")
    console.log(shopCartList.value)
  }
}
// getShopCartList();
//商品统计
const prodCount = ref(0);
async  function getProdCount() {
  // data  = await api.get('/api/shop/random')
  const response = await api.get(`/shopCart/prodCount`);
  if (response.data.code === 200) {
    prodCount.value = response.data
  }
}
getProdCount();
//已选商品统计
const totalPay = ref({});
async  function getTotalPay() {
  // data  = await api.get('/api/shop/random')
  const response = await api.post(`/shopCart/totalPay`,JSON.stringify({}));
  if (response.data.code === 200) {
    totalPay.value = response.data
  }
}
getTotalPay();

// 初始化一个空数组用于存储每个商品的选中状态
const checks = ref([]);

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}

const indexIdMap = ref(new Map());

// 当获取购物车列表后，初始化checks数组，确保长度与商品数量相匹配
async function initializeChecks() {
  await getShopCartList();
  const proDuctCount=0;
  for(const value of shopCartList.value) {
    for(const item of value.shopCartItemDiscounts) {
      for(const cartItem of item.shopCartItems) {
        console.log(cartItem);
        indexIdMap.value.set(cartItem.basketId,false);
      }
    }
  }
  // checks.value = new Array(proDuctCount).fill(false);
}
initializeChecks();

async function  changeCheck(){
  console.log(checks.value);
  const response = await  api.post("/shopCart/totalPay",JSON.stringify(checks.value));
  if (response.data.code === 200) {
    console.log(response.data)
  }
}

const queryData = reactive({
  confirm: {
    addrId: 0,
    basketIds: [],
    couponIds: [],
    userChangeCoupon: 1,
  },
});
const {confirm} = toRefs(queryData);

async function  onSubmit(){
  confirm.value.basketIds = checks.value;
  const response = await  api.post("/basket/submit",JSON.stringify(confirm.value));
  if (response.data.code === 200) {
    console.log(response.data)
    router.push('/order/create');
  }
}

function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
</script>

<template>

  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>
        <q-toolbar-title>商品详细</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-toolbar >
          <q-toolbar-title>
            商品推荐
          </q-toolbar-title>
        </q-toolbar>
        <div v-for="(value, shopIndex) in shopCartList" :key="shopIndex">
          <q-item-label header>{{ value.shopName }}</q-item-label>
          <div v-for="(item, discountIndex) in value.shopCartItemDiscounts" :key="discountIndex">
            <q-item
                tag="label"
                v-ripple
                v-for="(cartItem, itemIndex) in item.shopCartItems" :key="itemIndex"
            >
              <q-item-section side top>
                <!--          {{indexIdMap.get(cartItem.prodId)}}-->
                <q-checkbox v-model="checks" :val="cartItem.basketId" @update:model-value="changeCheck"/>
              </q-item-section>
              <!-- ... 商品图片、名称、价格、数量等保持不变 ... -->
              <q-item-section avatar>
                <q-avatar>
                  <q-img fit="fill"
                         class="cartHeadImage"
                         :src="getImageUrl(cartItem.pic)"
                  />
                </q-avatar>
              </q-item-section>
<!--              <q-item-section>-->
<!--                <q-item-label>{{ cartItem }}</q-item-label>-->
<!--              </q-item-section>-->
              <q-item-section caption>
                <q-item-label>{{ cartItem.prodName }}</q-item-label>
                <q-item-label>
                  {{ cartItem.price }}
<!--                  <div class="row">-->
<!--                    <div class="col-6 left">{{ cartItem.price }}</div>-->
<!--                    <div class="col-6 right">-->
<!--                      <q-input-->
<!--                          v-model.number="cartItem.prodCount"-->
<!--                          type="number"-->
<!--                          filled-->
<!--                          style="max-width: 50px;"-->
<!--                      /></div>-->
<!--                  </div>-->
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label></q-item-label>
                <q-item-label>
                  <q-input
                      v-model.number="cartItem.prodCount"
                      type="number"
                      filled
                      style="max-width: 50px;"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col-6 text-left">
          <q-btn flat  color="primary"  >删除</q-btn>
          <q-btn flat  color="primary" >合计{{0}}$</q-btn>
<!--          <q-btn flat  color="purple" glossy icon="local_grocery_store" to="/shoppingCart" />-->
        </div>
        <div  class="col-6 text-right">
          <q-btn color="red" label="结算" @click="onSubmit"/>
        </div>
      </div>

    </q-footer>

  </q-layout>

</template>

<style scoped>
.cartHeadImage{
  width: 120px;
  height: 120px;
}
</style>
