<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const tab=ref("index");

function routerDetail(url){
  router.push(url);
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
          <div class="q-pa-xs">
            <div >
              <q-card flat bordered >
                <!--          <q-card-section>-->
                <img :src="getImageUrl(product.imgUrl)" class="m-shop-card-image">
                <!--          </q-card-section>-->
                <q-card-section>
                  <div class="row">
                    <div class="col-6 text-h6">{{ product.prodName }}</div>
                    <div class="col-6 text-right">
                      <q-btn   round :color="isCollection !=1 ?'blue':'red'" icon="favorite"  @click="isCollection !=1 ? onCollection() :closeCollection()"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="q-ma-sm bg-grey-2">
              <div v-html="product.content"></div>

            </div>
            <div class="bg-grey-2 q-ma-sm">
              <q-toolbar >
                <q-toolbar-title>
                  评论 <q-chip color="orange" size="xs">好评{{prodCommData.positiveRating}}%</q-chip>
                </q-toolbar-title>
                <q-btn flat round dense icon="more_horiz"  :to="{ path: '/common/order', query: { pid: pid }}"/>
              </q-toolbar>
              <div>
                <q-chip color="yellow" size="xs">全部({{ prodCommData.number }})</q-chip>
                <q-chip size="xs">好评({{ prodCommData.praiseNumber }})</q-chip>
                <q-chip size="xs">中评({{ prodCommData.secondaryNumber }})</q-chip>
                <q-chip size="xs">差评({{ prodCommData.negativeNumber }})</q-chip>
                <q-chip size="xs">有图({{ prodCommData.picNumber }})</q-chip>
              </div>
              <div>
                <div class="q-pa-md q-gutter-md">
                  <q-list bordered padding class="rounded-borders">
                    <div v-for="(value,index) in commontList" :key="index">
                      <commot-component :value="value"></commot-component>
                    </div>
                  </q-list>
                </div>

              </div>
            </div>
            <div class="q-ma-sm">
              <div class="scroll-container">
                <div class="scroll-content">
                  <!-- 这里放置你需要滚动的内容 -->
                  <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
                    <product-card-component  :value="value" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col-4"><q-btn flat  color="primary" icon="home" to="/" />
          <q-btn flat  color="purple" glossy icon="local_grocery_store" to="/shoppingCart" /></div>
        <div  class="col-8"><q-btn-group spread>
          <q-btn color="brown" label="加入购物车"  />
          <q-btn color="red" label="立即购买" />
        </q-btn-group></div>
      </div>

    </q-footer>

  </q-layout>
</template>

