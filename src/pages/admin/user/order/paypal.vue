<script setup lang="ts">
import paypal from "components/order/paypalComponent.vue"
import {ref} from "vue";
import {Cookies} from "quasar";
import {useRoute} from "vue-router";
const token = Cookies.get("token");

// 接收url里的参数
const route = useRoute();
const orderNumbers = ref(route.query.orderNumbers);
const amount = ref(route.query.amount);
const value=ref(0);
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
              <q-item-label><q-input :model-value="value"  type="number"
                                     filled></q-input></q-item-label>
              <q-item-label><q-btn color="blue" label="充值"></q-btn></q-item-label>

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
  </q-layout>

</template>

<style scoped>

</style>
