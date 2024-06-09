<template>
  <q-card class="my-card">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6" v-if="props.kind != 1">{{ props.productName }}</div>
      <div class="text-h6" v-if="props.kind == 1">{{   $t(`vip.${props.productName}`) }}</div>

      <div class="text-subtitle2">{{ $t(`vip.cancellation`) }}</div>
    </q-card-section>
    <q-card-section>
      {{ props.intro }}
    </q-card-section>
    <q-separator />
    <q-separator dark />

    <q-card-actions >
      <q-btn  class="left-3" flat>价格：{{props.amount}}</q-btn>
      <q-btn  class="left-3" flat>付款金额：{{discountAmount}}</q-btn>

    </q-card-actions>
    <q-card-actions >
      <q-btn  class="left-3" flat>账户余额：{{user.balance}}</q-btn>
    </q-card-actions>
    <q-card-actions >
      <q-btn  class="left-3" @click="onPay()">支付</q-btn>
    </q-card-actions>
  </q-card>


</template>

<script setup>
import {defineProps, onMounted, ref} from 'vue';
import {Cookies, useQuasar} from "quasar";
import { api } from 'boot/axios';
const $q = useQuasar();
const token=Cookies.get("token");

const props = defineProps({
  amount: {
    type: String,
    required: true
  },
  kind: {
    type: Number,
    required: true
  },
  productId: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  intro: {
    type: String
  },
  url: {
    type: String,
    default:"/index"
  },
  change:{
    type: String,
    default:"pc"
  },
  returnUrl:{
    type: String,
    default:"pc"
  },
  cancelUrl:{
    type: String,
    default:"pc"
  }
});
const user=ref({});
async function getDetail() {
  const response = await api.get(`/user/systemUser/getInfo`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    user.value = data.data;
  }
}
getDetail();
const discountAmount=ref(0);
async function getAmount() {
  // 滚动到顶部
  const response = await api.post("/user/payments/getAmount",JSON.stringify({
    productId: props.productId,
    amount: props.amount,
    description: props.description,
    kind: props.kind,
    productName: props.productName,
  }),  {
    headers: {
      "Content-Type": "application/json",
      "change":props.change,
      "Authorization": `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    discountAmount.value=data.data
  }
}
getAmount();
async  function onPay(){
  const response = await api.post(`/user/payments/pay`,  JSON.stringify({
    productId: props.productId,
    amount: props.amount,
    description: props.description,
    kind: props.kind,
    productName: props.productName,
  }),{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    $q.dialog({
      title: '通知',
      message: `支付成功.`,
      ok: {
        push: true
      },
      cancel: {
        push: true,
        color: 'negative'
      },
    }).onOk(async () => {
      //刷新页面
      location.reload();
    }).onCancel(() => {
      //刷新页面
      location.reload();
      // //console.log('Cancel')
    });
  }else{
    $q.dialog({
      title: '通知',
      message: `支付失败.${data.msg}`,
      ok: {
        push: true
      },
      cancel: {
        push: true,
        color: 'negative'
      },
    }).onOk(async () => {

    }).onCancel(() => {
      // //console.log('Cancel')
    });
  }
}

</script>

<style scoped>
/* 您的样式 */
.card_container {
  /* 样式定义 */
}
/* 其他样式 */
</style>
