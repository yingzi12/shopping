<script setup lang="ts">
import paypal from "components/order/paypalComponent.vue"
import {ref} from "vue";
import {Cookies, Dialog} from "quasar";
import {useRoute, useRouter} from "vue-router";
import PaypalCard from "pages/system/paypalCard.vue";
const token = Cookies.get("token");
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

// 接收url里的参数
const route = useRoute();
const orderNumbers = ref(route.query.orderNumbers);
const amount = ref(route.query.amount);
const value=ref(0);

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
       //刷新当前页面
        router.go(0);
    }).onCancel(async () => {
      router.go(0);
    });
  }
};

</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-white">
    <q-header elevated>
      <q-toolbar class="bg-grey-2 text-black">
<!--        <q-btn flat round dense icon="arrow_back" class="q-mr-sm"       @click="addressDialog = false"/>-->
        <q-toolbar-title>支付订单</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <div>
          <q-card>
            <q-card-section>
              <q-item-label>订单编号：{{orderNumbers}}</q-item-label>
            </q-card-section>
            <q-card-section>
              <paypal :order-numbers="orderNumbers" :amount="amount"></paypal>
            </q-card-section>
            <q-card-section>
              <q-btn flat color="green" to="/order/list">查看订单</q-btn>
              <q-btn flat color="green" to="/">继续购物</q-btn>
            </q-card-section>
            <q-card-section>
              <q-item-label>充值余额</q-item-label>
              <q-item-label><q-input  v-model="money" type="number"
                                     filled></q-input></q-item-label>
              <q-item-label><q-btn color="blue" label="充值" @click="openPayPalDialog"></q-btn></q-item-label>

            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
<!--    <q-footer elevated class="bg-grey-2">-->
<!--      <q-btn-group spread>-->
<!--        <q-btn color="purple" label="添加地址" icon="add" @click="addAddressDialog=true"/>-->
<!--      </q-btn-group>-->
<!--    </q-footer>-->
    <q-dialog v-model="paypalDialog">
      <paypal-card :amount="money" :productId="orderNumbers" :kind="5" intro="充值余额" productName="充值余额" url='/'/>
    </q-dialog>
  </q-layout>

</template>

<style scoped>

</style>
