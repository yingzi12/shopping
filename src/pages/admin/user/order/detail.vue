<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import {Dialog, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";

const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const route = useRoute();
const ordernum = ref(route.query.ordernum);

const prodCount=ref({});
async function  getOrderProduct(){
  const response = await  api.get("/shopCart/prodCount");
  const dataJson=response.data;
  if (dataJson.code === 200) {
    console.log(dataJson)
    prodCount.value=dataJson.data;
  }
}
getOrderProduct();
const orderDetail=ref({});
const address=ref({});
const addressOk=ref(false);

async function  getOrderDetail(){
  const response = await  api.get(`/myOrder/orderDetail?orderNumber=${ordernum.value}`);
  const dataJson=response.data;
  if (dataJson.code === 200) {
    console.log(dataJson)
    orderDetail.value=dataJson.data;
    if(orderDetail.value.userAddrDto!=null){
      addressOk.value=true;
      address.value=orderDetail.value.userAddrDto;
    }
  }
}
getOrderDetail();
function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}


function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}

function onCancelOrder(ordernum:string) {
  Dialog.create({
    title: '取消订单',
    message: '是否取消订单？',
    cancel: true,
    ok: {
      label: '确定',
      color: 'primary'
    }
  }).onOk(
      async () => {
        const response = await api.get('/myOrder/cancel/'+ordernum)
        const data = response.data;
        if (data.code == 200) {
          window.history.back();
        }else{
          Dialog.create({
            title: '信息',
            message: '操作失败',
            cancel: true,
            ok: {
              label: '确定',
              color: 'primary'
            }
          })
        }

      });
}
function onConfirmReceive(ordernum:string) {
  Dialog.create({
    title: '确认收货',
    message: '是否确认收货？',
    cancel: true,
    ok: {
      label: '确定',
      color: 'primary'
    }
  }).onOk(
      async () => {
        const response = await api.get('/myOrder/receipt/'+ordernum)
        const data = response.data;
        if (data.code == 200) {
          window.history.back();
        }else {
          Dialog.create({
            title: '信息',
            message: '操作失败',
            cancel: true,
            ok: {
              label: '确定',
              color: 'primary'
            }
          });
        }
      });
}
</script>

<template>

  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>
        <q-toolbar-title>订单详细</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
<!--        <q-toolbar >-->
<!--          <q-toolbar-title>-->
<!--            <q>订单编号：{{ordernum}}</q>-->
<!--            <q>创建时间：{{orderDetail.createTime}}</q>-->
<!--          </q-toolbar-title>-->
<!--        </q-toolbar>-->
        <q-card>
          <q-card-section>
            <q-item-label>订单编号：{{ordernum}}</q-item-label>
            <q-item-label>创建时间：{{orderDetail.createTime}}</q-item-label>
            <q-item-label>订单状态：
            {{
              orderDetail.status == 1 ? '待支付' : (orderDetail.status == 2 ? '待发货' : (orderDetail.status == 3 ? '待收货' : (orderDetail.status == 5 ? '已完成' : '已取消')))
            }}
            </q-item-label>
          </q-card-section>
        </q-card>
        <div>
          <q-toolbar >
            <q-toolbar-title>
              地址信息
            </q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            <q-card>
              <q-card-section >
                <q-item-label  v-if="addressOk">收件人：{{address.receiver}}</q-item-label>
                <q-item-label v-if="addressOk" caption>国家：{{address.country}}</q-item-label>
                <q-item-label v-if="addressOk" caption>联系方式：{{address.mobile}}</q-item-label>
                <q-item-label v-if="addressOk" caption>区域：{{address.province}}-{{address.city}}-{{address.area}}</q-item-label>
                <q-item-label v-if="addressOk" caption>详细地址：{{address.addr}}</q-item-label>
                <q-item-label  v-if="!addressOk">无地址</q-item-label>

              </q-card-section>
            </q-card>
            <!--            <q-btn v-if="!address.receiver">选择地址</q-btn>-->
          </div>
        </div>
        <div>
          <q-toolbar >
            <q-toolbar-title>
              商品信息
            </q-toolbar-title>
          </q-toolbar>
          <q-list>
            <q-item
                tag="label"
                v-ripple
                v-for="(value, index) in orderDetail.orderItemDtos" :key="index"
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
            <q-item-label header>价格</q-item-label>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>总价格</q-item-label>
              </q-item-section>
              <q-item-section side >
                {{orderDetail.total}}

                <!--                <q-toggle color="blue"  val="battery" />-->
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>商品总数</q-item-label>
                <!--                <q-item-label caption>Allow notification</q-item-label>-->
              </q-item-section>
              <q-item-section side top>
                {{orderDetail.totalNum}}

                <!--                <q-toggle color="green" val="friend" />-->
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>运费</q-item-label>
              </q-item-section>
              <q-item-section side top>
                {{orderDetail.transfee}}
              </q-item-section>
            </q-item>


            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>优惠金额</q-item-label>
                <!--                <q-item-label caption>Allow notification when uploading images</q-item-label>-->
              </q-item-section>
              <q-item-section side top>
                {{orderDetail.reduceAmount}}
                <!--                <q-toggle color="red"  val="picture" />-->
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>合计</q-item-label>
              </q-item-section>
              <q-item-section side >
                {{orderDetail.actualTotal}}
                <!--                <q-toggle color="blue"  val="battery" />-->
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div>
          <q-toolbar >
            <q-toolbar-title>
              备注
            </q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            {{orderDetail.remarks}}
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col text-right">
          <q-btn flat color="blue"
                 v-if="orderDetail.status==1"
                 size="md"
                 @click="onCancelOrder(value.orderNumber)"
          >
            取消订单
          </q-btn>
          <q-btn flat color="blue"
                 v-if="orderDetail.status==1"
                 size="md"
                 :to="`/order/paypal?orderNumbers=${orderDetail.orderNumber}&amount=orderDetail{value.actualTotal}`"
          >
            付款
          </q-btn>
          <q-btn flat color="blue"
                 v-if="orderDetail.status==3"
                 size="md"
                 @click="onConfirmReceive(orderDetail.orderNumber)"
          >
            确认收货
          </q-btn>
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
