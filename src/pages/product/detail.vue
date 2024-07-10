<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {Cookies, Dialog, useQuasar} from "quasar";
import {reactive, ref, toRefs, watch} from "vue";
import {api} from "boot/axios";
import PayaplCard from "pages/system/payment.vue";
import productCardComponent from "components/product/productCardComponent.vue"
import {tansParams} from "boot/tools";

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const amount=ref(0.0);
const intro=ref("");

const token = Cookies.get("token");

// 接收url里的参数
const route = useRoute();
const pid = ref(route.query.pid);
// const userId = ref(route.query.userId);

const $q = useQuasar();

const isSee = ref(false);

const isCollection = ref(2)
const pageNum = ref(0);

// 防抖函数定义
const title = ref("Black White")

const description = ref('Black White 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com.')
const ortTile = ref("Black White")
const orgDec = ref("Black White")
const orgImgae = ref("Black White")

const tagList=ref([]);
const product=ref({});
const  skuId=ref(0);
const  sku=ref({});

async function getInfo() {
  // 滚动到顶部
  const response = await api.get("/prod/prodInfo?prodId=" + pid.value, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    product.value = data.data;
    skuId.value=product.value.skuList[0].skuId;
    sku.value=product.value.skuList[0];
    isCollection.value=product.value.isCollection

    amount.value=product.value.amount
    if(product.value.tags != null){
      tagList.value=product.value.tags.split(";");
    }
    title.value = "Black White-" + product.value.prodName
    ortTile.value = product.value.prodName
    orgDec.value = product.value.description
    orgImgae.value = product.value.imgUrl

    if(data.data.isSee){
      isSee.value = data.data.isSee;
    }
  }
}
//user/collection/isCollection?prodId=74
async function onCollection() {
  if ( isCollection.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isCollection.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/user/userCollection/on?aid=${pid.value}&ctype=2`)
  const data = response.data;
  if (data.code == 200) {
    isCollection.value=1;
  }else{
    isCollection.value=2;
  }
}

const isLike=ref(0);
async function onLike() {
  if ( isLike.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isLike.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/product/like?aid=${pid.value}`)
  const data = response.data;
  if (data.code == 200) {
    isLike.value = 1;
  }else{
    isLike.value = 0;
  }
}
async function closeCollection() {
  if ( isCollection.value==2) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }
  // 滚动到顶部
  const response = await api.get(`/user/userCollection/close?aid=${pid.value}&ctype=2`)
  const data = response.data;
  if (data.code == 200) {
    isCollection.value=2;
  }
}

const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 3,
    prodId: pid.value,
    evaluate: -1,
  },
  //{"basketId":0,"count":1,"prodId":74,"shopId":1,"skuId":401}

  addCart: {
    count: 3,
    prodId: pid.value,
    shopId: -1,
    skuId: -1,

  },
});
const {queryParams,addCart} = toRefs(queryData);
const commontList = ref([]);
const total=ref(0);
async function getCommonLit() {
  const response = await api.get('/prodComm/prodCommPageByProd?' + tansParams(queryParams.value),{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    commontList.value = data.data.records;
    total.value=data.data.total;

  }
}
getCommonLit();

const prodCommData = ref({});
async function getProdCommData() {

  const response = await api.get(`/prodComm/prodCommData?prodId=${pid.value}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    prodCommData.value = data.data;
  }
}
getProdCommData();
const randomList = ref([]);
async function getRandom() {
  const response = await api.get('/product/random', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
  }
}
getRandom();
getInfo();
async function addChangeItem() {
  addCart.value.count=1;
  addCart.value.prodId=pid.value;
  addCart.value.shopId=product.value.shopId;
  addCart.value.skuId=skuId.value;
  // addCart.value.skuId=401;
  const response = await api.post('/shopCart/changeItem', JSON.stringify(addCart.value),{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
    Dialog.create({
      title: '信息',
      message: '操作成功',
      cancel: true,
      ok: {
        label: '确定',
        color: 'primary'
      }
    });
  }else{
    Dialog.create({
      title: '信息',
      message: `添加失败。${data.msg}`,
      cancel: true,
      ok: {
        label: '确定',
        color: 'primary'
      }
    });
  }
}
function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
function getImageUrl(imgUrl) {
    return `${$q.config.sourceWeb}${imgUrl}`;
} // immediate: true 确保在挂载时立即触发一次
const dialogAdd=ref(false);

const productCount=ref(1);
function routerOrder(){
  router.push(`/order/now?prodCount=${productCount.value}&skuId=${skuId.value}&shopId=${product.value.shopId}&prodId=${pid.value}`)
}
function onSkuId(s){
  skuId.value=s.skuId;
  sku.value=s;
}

// 添加watch来监听wid的变化
watch(() => route.query.pid, async (newPid, oldPid) => {
  if (newPid !== oldPid) {
    // 当wid变化时，重新加载数据
    pid.value = newPid;
    await getInfo(); // 重新获取世界详细信息
    // await getAllWorldComment(); // 重新获取评论列表
  }
}, { immediate: true }); // immediate: true 确保在初始渲染时也触发watcher

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
              <img :src="getImageUrl(product.pic) " class="m-shop-card-image">
              <q-card-section>
                <div class="row">
                  <div class="col-9 text-h6 ">
                   <div class="two-line-clamp"> {{ product.prodName }}</div>
                    <div><q-chip size="m" color="grey"><del>{{ sku.oriPrice }}$</del></q-chip><q-chip size="m" color="red">{{sku.price}}$</q-chip> </div>
                  </div>
                  <div class="col-3 text-right">
                    <q-btn   round :color="isCollection !=1 ?'blue':'red'" icon="favorite"  @click="isCollection !=1 ? onCollection() :closeCollection()"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="bg-grey-2 q-ma-sm">
            <div>
            <q-toolbar >
              <q-toolbar-title>
                选择
              </q-toolbar-title>
<!--              <q-btn flat round dense icon="more_horiz"  :to="{ path: '/common/order', query: { pid: pid }}"/>-->
            </q-toolbar>
            </div>
            <div class="q-pa-md q-gutter-md q-gutter-xs">
              <q-chip   v-for="(sku,index) in product.skuList"
                        :key="index"
                        :selected="skuId === sku.skuId"
                        color="primary"
                        text-color="white"
                        size="ms"
                        icon="bookmark"
                        @click="onSkuId(sku)"
              >
                {{ sku.skuName }}
              </q-chip>
            </div>
          </div>
          <div class="q-ma-sm bg-grey-2">
            <q-card flat bordered  class="main-content">
            <div v-html="product.content"></div>
            </q-card>
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

    <q-footer elevated class="bg-grey-2" >
      <div class="row" >
        <div class="col-4"><q-btn flat  color="primary" icon="home" to="/" />
          <q-btn flat  color="purple" glossy icon="local_grocery_store" to="/shoppingCart" /></div>
        <div  class="col-8"><q-btn-group spread>
          <q-btn color="brown" label="加入购物车"  @click="addChangeItem"/>
          <q-btn color="red" label="立即购买"  @click="dialogAdd =true"/>
        </q-btn-group></div>
      </div>

    </q-footer>

  </q-layout>

  <q-dialog v-model="dialogAdd" position="bottom">
    <q-card style="min-width: 300px">
      <q-card-section>
        <q-item>
          <q-item-section >数量</q-item-section>

          <q-item-section side>
            <q-input class="text-right"
                          v-model.number="productCount"
                          type="number"
                          filled
                          style="max-width: 50px"
                    />
          </q-item-section>

        </q-item>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-center"><q-btn color="blue" @click="routerOrder">确认</q-btn></q-item-label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<style lang="sass" scoped>
.my-card-container
  display: flex
  justify-content: center
  align-items: center
  height: 100%


.my-card
  width: 100%
  max-width: 900px

.responsive-image
  max-width: 980px
  height: auto
  margin: 0 auto

.caption
  display: flex
  justify-content: center
  align-items: center
  padding: 10px

.head-iamge
  height: 400px
  width: 260px

.head-iamge img
  object-fit: cover

.example-item
  height: 273px
  width: 150px

.two-line-clamp
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis

.q-card-section
  padding: 8px

.text-caption
  margin: 0
  font-size: 0.8em

.container
  max-width: 500px
  margin: 0 auto
  padding: 20px
  text-align: center

.headImage
  max-width: 200px
  height: 302px

.main-content img
  max-width:100vw
</style>

