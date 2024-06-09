<script lang="ts" setup>
//兑换
import { Cookies, useQuasar } from 'quasar';
import {reactive, ref, toRefs} from "vue";
import { api } from "boot/axios";
import {tansParams} from "boot/tools";
const token = Cookies.get('token');
const $q = useQuasar();
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
    const response = await api.get('/user/productOrder/list?' + tansParams(queryParams.value), {
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



const card=ref("");
const password=ref("");

async function onSubmit() {
  const response = await api.post("/user/productOrder/exchange", JSON.stringify({
    card: card.value,
    password: password.value,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  //console.log(data)
  if (data.code == 200) {
    $q.dialog({
      title: '通知',
      message: '添加成功.',
    })
    card.value="";
    password.value="";
    getList(1);
  } else {
    $q.dialog({
      title: '通知',
      message: `兑换失败.${data.msg}`,
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
getList(1)
</script>

<template>

  <div class="q-pa-xs q-gutter-xs">
    <div>
      <q-input
        v-model="card"
        :rules="[ val => val && val.length > 0 || 'Please type something']"
        filled
        hint="Card Number 卡号"
        label="Card Number 卡号*"
        type="email"
      />
      <q-input
        v-model="password"
        :rules="[ val => val && val.length > 0 || 'Please type something']"
        filled
        hint="Card Password 密码"
        label="Card Password 密码 *"
        type="text"
      />
      <q-btn color="primary" label="提交" @click="onSubmit" />
    </div>

    <q-list bordered class="rounded-borders" style="max-width: 600px">
      <q-item-label header>兑换记录（{{total}}）</q-item-label>
      <div v-for="(value,index) in withdrawList"  :key="index">
        <q-item>
          <q-item-section>
            <q-item-label v-if="1 === value.kind">网站会员</q-item-label>
            <q-item-label v-if="2 === value.kind">个人会员</q-item-label>
            <q-item-label v-if="1 === value.kind">充值</q-item-label>

            <q-item-label caption lines="2">{{value.name}}</q-item-label>
            <q-item-label>{{value.amount}}</q-item-label>
          </q-item-section>
<!--          <q-item-section side >-->
<!--            <q-item-label caption>{{withdraw.email}}</q-item-label>-->
<!--            <q-item-label caption>{{withdraw.withdrawName}}</q-item-label>-->
<!--          </q-item-section>-->
          <q-item-section side>
            <q-item-label caption>{{ withdraw.describe }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{withdraw.createTime}}</q-item-label>
<!--            <q-item-label v-if="withdraw.withdrawType == 1" caption>Paypal</q-item-label>-->
<!--            <q-item-label v-if="withdraw.status == 1" caption>成功</q-item-label>-->
<!--            <q-item-label v-if="withdraw.status == 2"  caption>失败</q-item-label>-->
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
