<script setup lang="ts">
import {api} from "boot/axios";
import {ref} from "vue";

const valueList = ref([])
async function getList() {
  const response = await api.get('/address/list')
  const data = response.data;
  if (data.code == 200) {
    valueList.value = data.data
  }
}
getList();

const address=ref({});
function choose(v){
  address.value=v.value
}
</script>

<template>
  <q-toolbar >
    <q-toolbar-title>
      地址信息
    </q-toolbar-title>
    <q-btn flat icon="add">新增</q-btn>
  </q-toolbar>
    <div >
      <q-list>
        <q-item
            v-for="(value, index) in valueList" :key="index"
            tag="label"
                v-ripple>
          <q-item-section click=@"choose(value)">
            <q-item-label caption>{{value.receiver}}</q-item-label>
            <q-item-label caption>{{value.country}}</q-item-label>
            <q-item-label caption>{{value.mobile}}</q-item-label>
            <q-item-label caption>{{value.province}}-{{value.city}}-{{value.area}}</q-item-label>
            <q-item-label caption>{{value.addr}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn icon="edit" color="blue"  val="picture" @click="" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
</template>

<style scoped>

</style>
