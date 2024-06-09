<script setup lang="ts">
import {ref} from "vue";
import {Cookies} from "quasar";
import {useRoute, useRouter} from "vue-router";
import orderDetailComponent from "components/order/orderDetailComponent.vue";

const token = Cookies.get("token");

// 接收url里的参数
const route = useRoute();
const router = useRouter();

const value=ref(0);
const tab = ref("0");


function  goBack() {
  // 使用JavaScript的history对象来实现返回上一页
  window.history.back();
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
            <order-detail-component :status="0"></order-detail-component>
          </q-tab-panel>
          <q-tab-panel name="1">
            <order-detail-component :status="1"></order-detail-component>

          </q-tab-panel>
          <q-tab-panel name="2">
            <order-detail-component :status="2"></order-detail-component>

          </q-tab-panel>
          <q-tab-panel name="3">
            <order-detail-component :status="3"></order-detail-component>

          </q-tab-panel>
          <q-tab-panel name="4">
            <order-detail-component :status="4"></order-detail-component>

          </q-tab-panel>

        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<style scoped>

</style>
