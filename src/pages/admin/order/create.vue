<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const route = useRoute();

const orderProductList=ref([]);
async function  getOrderProduct(){
  const response = await  api.post("/basket/getBasketProduct");
  const dataJson=response.data;
  if (dataJson.code === 200) {
    console.log(dataJson)
    orderProductList.value=dataJson.data;
  }
}
getOrderProduct();

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}


const queryData = reactive({
  data: {
    addrId: 0,
    basketIds: [],
    couponIds: [],
    userChangeCoupon: 1,
  },
});
const {data} = toRefs(queryData);


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
        <div>
          <q-toolbar >
            <q-toolbar-title>
              商品推荐
            </q-toolbar-title>
          </q-toolbar>
          <q-list>
            <q-item
                tag="label"
                v-ripple
                v-for="(value, index) in orderProductList" :key="index"
            >
              <!-- ... 商品图片、名称、价格、数量等保持不变 ... -->
              <q-item-section avatar>
                <q-avatar>
                  <q-img fit="fill"
                         class="cartHeadImage"
                         :src="getImageUrl(value.pic)"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="h3">{{ value.prodName }}</q-item-label>
                <q-item-label caption>{{ value.price }}</q-item-label>
              </q-item-section>
              <q-item-section side><div class="col-6 right">{{ value.prodCount }}</div></q-item-section>

            </q-item>
          </q-list>
        </div>
        <div>
          <q-list>
            <q-item-label header>Notifications</q-item-label>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>商品金额</q-item-label>
              </q-item-section>
              <q-item-section side >
                <q-toggle color="blue"  val="battery" />
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Friend request</q-item-label>
                <q-item-label caption>Allow notification</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-toggle color="green" val="friend" />
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Picture uploaded</q-item-label>
                <q-item-label caption>Allow notification when uploading images</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-toggle color="red"  val="picture" />
              </q-item-section>
            </q-item>

          </q-list>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col-6 text-left">
          <q-btn flat  color="primary" >合计{{0}}$</q-btn>
          <!--          <q-btn flat  color="purple" glossy icon="local_grocery_store" to="/shoppingCart" />-->
        </div>
        <div  class="col-6 text-right">
          <q-btn color="red" label="结算" @click="onConfirm"/>
        </div>
      </div>

    </q-footer>

  </q-layout>

</template>

<style scoped>
.cartHeadImage{
  width: 80px;
  height: 80px;
}
</style>
