<script setup lang="ts">
import {Dialog, useQuasar} from "quasar";
import {api} from "boot/axios";
import {defineProps, reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {useRoute, useRouter} from "vue-router";
const $q = useQuasar();

// 接收url里的参数
const route = useRoute();
const router = useRouter();
const orderList = ref([])

const props = defineProps({
  status: {
    type: Number,
    required: true
  }});
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: 0,
  },
  rules: {}
});
const current=ref(1);
const total = ref(0);
const maxPage = ref(1);

const {queryParams, form, rules} = toRefs(queryData);
async function getListOrder() {
  queryParams.value.pageNum=current.value;
  queryParams.value.status=props.status;
  const response = await api.get('/myOrder/myOrder?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    orderList.value = data.data.records
    if(total.value%queryParams.value.pageSize == 0){
      maxPage.value = total.value / queryParams.value.pageSize ;
    }else {
      maxPage.value = total.value / queryParams.value.pageSize + 1;
    }
  }
}
getListOrder();
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
  <div>
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
  <q-pagination
      v-model="current"
      :max="maxPage"
      max-pages="6"

      direction-links
      @update:modelValue="getListOrder()"
  />
  </div>
</template>

<style scoped>

</style>
