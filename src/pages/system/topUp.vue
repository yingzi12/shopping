<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="goBack"/>
        <q-toolbar-title>充值账户余额</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-card class="my-card">

          <q-card-actions >
            <q-btn  class="left-3" flat>账户余额：{{user.balance}}</q-btn>
          </q-card-actions>
          <q-card-actions >
           <q-input  label="充值金额"  v-model.number="money"                 type="number"
           ></q-input>
          </q-card-actions>
          <q-card-actions >
            <q-btn  class="left-3" @click="openPayPalDialog()">支付</q-btn>
          </q-card-actions>
        </q-card>

      </q-page>
    </q-page-container>

<!--    <q-footer elevated class="bg-grey-2">-->
<!--      <div class="row">-->
<!--        <div class="col-4"><q-btn flat  color="primary" icon="home" to="/" />-->
<!--          <q-btn flat  color="purple" glossy icon="local_grocery_store" to="/shoppingCart" /></div>-->
<!--        <div  class="col-8"><q-btn-group spread>-->
<!--          <q-btn color="brown" label="加入购物车"  @click="addChangeItem"/>-->
<!--          <q-btn color="red" label="立即购买"  @click="dialogAdd =true"/>-->
<!--        </q-btn-group></div>-->
<!--      </div>-->

<!--    </q-footer>-->
    <q-dialog v-model="paypalDialog">
      <payapl-card :amount="money" :productId="user.id" :kind="5" intro="充值余额" productName="充值余额" url='/'/>
    </q-dialog>
  </q-layout>



</template>

<script setup>
import { ref } from 'vue';
import {Cookies, Dialog, useQuasar} from "quasar";
import { api } from 'boot/axios';
import PayaplCard from "pages/system/paypalCard.vue";
import {useRouter} from "vue-router";
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const token=Cookies.get("token");

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

const  money=ref(0.0);
const paypalDialog = ref(false);
function openPayPalDialog (){
  if(money.value<1){
    Dialog.create({
      title: '通知',
      message: '金额不能少于1',
    })
    return;
  }
  if(token !== null && token !== '' && token !== undefined ) {
    paypalDialog.value = true;
  }else {
    Dialog.create({
      title: '通知',
      message: '请先登录，点击ok跳转登录.',
      ok: {
        push: true
      },
      cancel: {
        push: true
      },
    }).onOk(async () => {
      router.push('/login'); // Redirect to login page
    }).onCancel(async () => {
      // router.push('/users/shop'); // Redirect to login page
    });
  }
};

function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
}
</script>

<style scoped>
/* 您的样式 */
.card_container {
  /* 样式定义 */
}
/* 其他样式 */
</style>
