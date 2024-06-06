<script lang="ts" setup>
//关注
import Big from 'big.js';
import { Cookies } from 'quasar'
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {tansParams} from "boot/tools";
const token = Cookies.get('token');

const total = ref(0);
const maxPage = ref(0);
const withdraw = ref(0.0);
const income = ref(0.0);

const current=ref(1)
const withdrawList = ref([]);
const queryData = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  }
});
const {queryParams} = toRefs(queryData);

async function getList(page: number) {
  queryParams.value.pageNum = page;
  try {
    const response = await api.get('/admin/userWithdraw/list?' + tansParams(queryParams.value), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      total.value = response.data.total;
      maxPage.value=  total.value/queryParams.value.pageSize+1;
      withdrawList.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
async function getDetail() {
  const response = await api.get(`/admin/systemUser/getInfo`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    income.value=data.data.income;
    withdraw.value=data.data.withdraw;
  }
}

function minus(a,b) {
  const bigA = new Big(a);
  const bigB = new Big(b);
  return bigA.minus(bigB).toString();
}
getDetail();
getList(1)
</script>

<template>
  <div class="q-pa-xs">
    <div class="text-h4 q-mb-md">可提现金额 ：{{ minus(income,withdraw)}} 元</div>
    <div class="text-h4 q-mb-md">已提现金额 ：{{ withdraw }} 元</div>
  </div>

  <div class="q-pa-xs q-gutter-xs">
    <router-link to="/admin/users/addWithdraw">
      <q-btn color="primary" label="添加"/>
    </router-link>

    <q-list bordered class="rounded-borders" style="max-width: 600px">
      <q-item-label header>提现记录（{{total}}）</q-item-label>
      <div v-for="(withdraw,index) in withdrawList"  :key="index">
        <q-item>
          <q-item-section>
            <q-item-label>提现</q-item-label>
            <q-item-label caption lines="2">{{withdraw.id}}</q-item-label>
            <q-item-label>{{withdraw.amount}}</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-item-label caption>{{withdraw.email}}</q-item-label>
            <q-item-label caption>{{withdraw.withdrawName}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ withdraw.explanation }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{withdraw.createTime}}</q-item-label>
            <q-item-label v-if="withdraw.withdrawType == 1" caption>Paypal</q-item-label>
            <q-item-label v-if="withdraw.status == 1" caption>成功</q-item-label>
            <q-item-label v-if="withdraw.status == 2"  caption>失败</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced/>
      </div>
    </q-list>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        :max="maxPage"
        max-pages="6"

        direction-links
        @update:modelValue="getList(current)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
