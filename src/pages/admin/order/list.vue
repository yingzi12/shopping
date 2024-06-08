<script setup lang="ts">
import {reactive, ref, toRefs} from "vue";
import {Cookies, Dialog, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
const token = Cookies.get("token");

// 接收url里的参数
const route = useRoute();
const router = useRouter();

const value=ref(0);
const tab = ref(0);

const orderList = ref([])

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: 0,
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);
async function getListOrder() {
  const response = await api.get('/myOrder/myOrder?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    orderList.value = data.data.records
  }
}
getListOrder();
function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
function changeTab() {
  queryParams.value.status= tab.value;
  queryParams.value.pageNum= 1;
  getListOrder();
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
          // orderList.value = data.data.records
          queryParams.value.pageNum=1;
          getListOrder();
        }else {
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
          // orderList.value = data.data.records
          queryParams.value.pageNum=1;
          getListOrder();
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
const $q = useQuasar();

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}
function retorDetail(ordernum:string) {
  router.push("/order/detail?ordernum="+ordernum)
}
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-white">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>-
        <q-toolbar-title>订单列表</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            @update:model-value="changeTab"
        >
          <q-tab name="0" label="全部" />
          <q-tab name="1" label="待支付" />
          <q-tab name="2" label="待发货" />
          <q-tab name="3" label="待完成" />
          <q-tab name="4" label="已完成" />

        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="0">
             <q-card v-for="(value,index) in orderList" :key="index">
               <q-card-section  @click="retorDetail(value.orderNumber)">
                    <div class="row">
                      <div class="col-9">
                      订单编号:{{value.orderNumber}}
                      </div>
                      <div class="col text-right">
                        <q-item-label class="right">
                          {{
                            value.status == 1 ? '待支付' : (value.status == 2 ? '待发货' : (value.status == 3 ? '待收货' : (value.status == 5 ? '已完成' : '已取消')))
                          }}
                        </q-item-label>
                      </div>
                    </div>

               </q-card-section>
               <q-card-section  @click="retorDetail(value.orderNumber)">
                 <q-list >
                   <q-item
                       tag="label"
                       v-ripple
                       v-for="(item,index) in value.orderItemDtos" :key="index"
                   >
                     <!-- ... 商品图片、名称、价格、数量等保持不变 ... -->
                     <q-item-section avatar>
                       <q-avatar>
                         <q-img fit="fill"
                                class="cartHeadImage"
                                :src="getImageUrl(item.pic)"
                         />
                       </q-avatar>
                     </q-item-section>
                     <q-item-section>
                       <q-item-label class="h3">{{ item.prodName }}</q-item-label>
                       <q-item-label caption>{{ item.price }}</q-item-label>
                     </q-item-section>
                     <q-item-section side><div class="col-6 right">{{ item.prodCount }}</div></q-item-section>

                   </q-item>

                 </q-list>
               </q-card-section>
               <q-card-section>
                 <div class="col text-right">
                   <q-item-label class="right">合计：{{value.actualTotal}} ¥</q-item-label>
                 </div>
               </q-card-section>
               <q-card-section>
                 <div class="col text-right">
                   <q-btn flat
                       v-if="value.status==1"
                       size="md"
                       @click="onCancelOrder(value.orderNumber)"
                   >
                     取消订单
                   </q-btn>
                   <q-btn flat
                       v-if="value.status==1"
                       size="md"
                       :to="`/order/paypal?orderNumbers=${value.orderNumber}&amount=${value.actualTotal}`"
                   >
                     付款
                   </q-btn>
<!--                   <q-btn flat-->
<!--                       v-if="value.status==3 || value.status==5"-->
<!--                       size="md"-->

<!--                       @click="toDeliveryPage"-->
<!--                   >-->
<!--                     查看物流-->
<!--                   </q-btn>-->
                   <q-btn flat
                       v-if="value.status==3"
                       size="md"
                       @click="onConfirmReceive(value.orderNumber)"
                   >
                     确认收货
                   </q-btn>
                 </div>
               </q-card-section>

             </q-card>
          </q-tab-panel>
          <q-tab-panel name="1">

          </q-tab-panel>
          <q-tab-panel name="2">

          </q-tab-panel>
          <q-tab-panel name="3">

          </q-tab-panel>
          <q-tab-panel name="4">

          </q-tab-panel>

        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<style scoped>

</style>
