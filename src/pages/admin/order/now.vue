<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import {Dialog, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";

const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const route = useRoute();
const prodCount = ref(route.query.prodCount);
const prodId = ref(route.query.prodId);
const shopId = ref(route.query.shopId);
const skuId = ref(route.query.skuId);

const confirm=ref({});
const queryData = reactive({
  addAddress:{
    addrId:"",
    receiver:"",
    country:"",
    province:"",
    city:"",
    addr:"",
    postCode:"",
    mobile:"",
  },
  data: {
    orderShopParam: [],
    remarks: "",
    addrId: "",
  },
  addCreate: {
    "addrId":0,
    "orderItem":
        {"prodId":prodId.value,
          "skuId":skuId.value,
          "prodCount":prodCount.value,
          "shopId":shopId.value
        },
    "couponIds":[],
    "userChangeCoupon":1
  },
});
const {data,addAddress,addCreate} = toRefs(queryData);
async function  getOrderProduct(){
  const response = await  api.post("/order/confirm",JSON.stringify(addCreate.value));
  const dataJson=response.data;
  if (dataJson.code === 200) {
    console.log(dataJson)
    confirm.value=dataJson.data;
  }
}
getOrderProduct();

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}


const remarks=ref("");

function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
function onSubmit(){
  if(!addressOk){
    Dialog.create({
      title: '提示',
      message: '请选择收货地址',
      ok: {
        label: '确定',
        color: 'primary'
      },
      cancel: {
        label: '取消',
        color: 'primary'
      }
    }).onOk(() => {
      // 点击确定按钮时执行的操作
    }).onCancel(() => {
      // 点击取消按钮时执行的操作
    });
  }else {
    console.log(address.value)
    data.value.addrId=address.value.addrId;
    api.post("/order/submit", JSON.stringify(data.value)).then(response => {
      const dataJson = response.data;
      if (dataJson.code === 200) {
        const orderNumbers = dataJson.data.orderNumbers;
        router.push(`/order/paypal?orderNumbers=${orderNumbers}&amount=${confirm.value.actualTotal}`);
      }
    });
  }
}
const  address=ref({});
const  addressOk=ref(false);

const  addressDialog=ref(false);
const  addAddressDialog=ref(false);

const addressList = ref([])
async function getListAddress() {
  const response = await api.get('/address/list')
  const data = response.data;
  if (data.code == 200) {
    addressList.value = data.data
  }
}
getListAddress();
function selectAddress(v){
  address.value=v
  addressOk.value=true
  addressDialog.value=false;
}
async function onAddAddress(){
  const response = await api.post('/address/addAddr',JSON.stringify(addAddress.value))
  const data = response.data;
  if (data.code == 200) {
    getListAddress();
    addAddressDialog.value=false;
    Dialog.create({
      title: '提示',
      message: '添加成功',
      ok: {
        label: '确定',
        color: 'primary',
        flat: true,
      },

    })
    // addressList.value = data.data
  }else{
    Dialog.create({
      title: '提示',
      message: `添加失败 ${data.msg}`,
      ok: {
        label: '确定',
        color: 'primary',
        flat: true,
      },

    })
  }
}
</script>

<template>

  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>
        <q-toolbar-title>确认订单</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <div>
          <q-toolbar >
            <q-toolbar-title>
              地址信息
            </q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            <q-card>
              <q-card-section @click="addressDialog=true">
                <q-item-label v-if="!addressOk">选择地址</q-item-label>
                <q-item-label  v-if="addressOk">收件人：{{address.receiver}}</q-item-label>
                <q-item-label v-if="addressOk" caption>国家：{{address.country}}</q-item-label>
                <q-item-label v-if="addressOk" caption>联系方式：{{address.mobile}}</q-item-label>
                <q-item-label v-if="addressOk" caption>区域：{{address.province}}-{{address.city}}-{{address.area}}</q-item-label>
                <q-item-label v-if="addressOk" caption>详细地址：{{address.addr}}</q-item-label>
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
          <div
              v-for="(cart, index) in confirm.shopCartOrders" :key="index"
          >
            <div
                v-for="(catItem, index) in cart.shopCartItemDiscounts" :key="index"
            >
            <q-list>
              <q-item
                  tag="label"
                  v-ripple
                  v-for="(value, index) in catItem.shopCartItems" :key="index"
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
          </div>

        </div>

        <div>
          <q-list>
            <q-item-label header>价格</q-item-label>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>总价格</q-item-label>
              </q-item-section>
              <q-item-section side >
                {{confirm.total}}

                <!--                <q-toggle color="blue"  val="battery" />-->
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>商品总数</q-item-label>
<!--                <q-item-label caption>Allow notification</q-item-label>-->
              </q-item-section>
              <q-item-section side top>
                {{confirm.totalCount}}

                <!--                <q-toggle color="green" val="friend" />-->
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>优惠金额</q-item-label>
<!--                <q-item-label caption>Allow notification when uploading images</q-item-label>-->
              </q-item-section>
              <q-item-section side top>
                   {{confirm.orderReduce}}
<!--                <q-toggle color="red"  val="picture" />-->
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>合计</q-item-label>
              </q-item-section>
              <q-item-section side >
                {{confirm.actualTotal}}
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
            <q-input
                v-model="remarks"
                filled
                type="textarea"
                label="订单备注"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-2">
      <div class="row">
        <div class="col-6 text-left">
          <q-btn flat  color="primary" >{{confirm.actualTotal}}$</q-btn>
        </div>
        <div  class="col-6 text-right">
          <q-btn color="red" label="支付" @click="onSubmit()"/>
        </div>
      </div>

    </q-footer>

  </q-layout>

<!--  地址列表-->
  <q-dialog
      v-model="addressDialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
  >
    <q-layout view="hHh lpR fFf" class="bg-white">
      <q-header elevated>
        <q-toolbar class="bg-grey-2 text-black">
          <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="addressDialog = false"/>
          <q-toolbar-title>地址列表</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page>
          <div>
            <q-list>
              <q-item
                  clickable v-ripple
                  v-for="(address, index) in addressList" :key="index"
                  @click="selectAddress(address)"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="home" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>收件人：{{address.receiver}}</q-item-label>
                  <q-item-label caption>区域：{{address.province}}-{{address.city}}-{{address.area}}</q-item-label>
                  <q-item-label caption>详细地址：{{address.addr}}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>国家：{{address.country}}</q-item-label>
                  <q-item-label caption>联系方式：{{address.mobile}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-page>
      </q-page-container>
      <q-footer elevated class="bg-grey-2">
        <q-btn-group spread>
          <q-btn color="purple" label="添加地址" icon="add" @click="addAddressDialog=true"/>
        </q-btn-group>
      </q-footer>
    </q-layout>
  </q-dialog>
  <!--  添加地址-->

  <q-dialog
      v-model="addAddressDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
  >
    <q-layout view="hHh lpR fFf" class="bg-white">
      <q-header elevated>
        <q-toolbar class="bg-grey-2 text-black">
          <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="addAddressDialog = false"/>
          <q-toolbar-title>添加地址</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page>
          <div class="text-center">
            <q-input filled v-model="addAddress.receiver" label="收件人" />
            <q-input filled v-model="addAddress.mobile" label="联系方式" />
            <q-input filled v-model="addAddress.country" label="国家" />
            <q-input filled v-model="addAddress.postCode" label="邮编" />
            <q-input filled v-model="addAddress.city" label="城市" />
            <q-input filled v-model="addAddress.addr" label="地址" />
            <q-btn color="blue" label="添加地址" @click="onAddAddress()"></q-btn>
          </div>
        </q-page>
      </q-page-container>
<!--      <q-footer elevated class="bg-grey-2">-->
<!--        <q-btn-group spread>-->
<!--          <q-btn color="purple" label="添加地址" icon="add" />-->
<!--        </q-btn-group>-->
<!--      </q-footer>-->
    </q-layout>
  </q-dialog>

</template>

<style scoped>
.cartHeadImage{
  width: 80px;
  height: 80px;
}
</style>
