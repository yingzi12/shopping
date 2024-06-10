<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {Dialog} from "quasar";
const router = useRouter();

interface ProdProp {
  propId: string;
  propName: string;
  rule: string;
  shopId: string;
  prodPropValues:Array<ProdPropValue>;
}

interface ProdPropValue {
  valueId: string;
  propValue: string;
  propId: string;
}

const props = defineProps<{ value: ProdProp }>();
async function onDel(id:string){
  const response = await api.get(`/admin/spec/del/${id}`);
  const data = response.data;
  //console.log(data)
  if (data.code == 200) {
    Dialog.create({
      title: '通知',
      message: '删除成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {
      //重新加载页面
      await router.go(0);
      router.push('/admin/shop/spec/index'); // Redirect to login page
    }).onCancel(async () => {
      //刷新页面
      await router.go(0);
      router.push('/admin/shop/spec/index'); // Redirect to login page
    });
  } else {
    Dialog.create({
      title: '通知',
      color: 'red-4',
      message: '删除失败'
    });
  }
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm">
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label>{{ props.value.propName }}<q-chip  color="blue"  :label="props.value.rule ==1 ? '规格':'参数'" size="xs"></q-chip></q-item-label>
          <q-item-label caption>          <q-chip  color="yellow"  v-for="(v,index) in props.value.prodPropValues" :key="index" :label="v.propValue"></q-chip>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption><q-btn flat label="编辑" @click="router.push('/admin/shop/spec/edit?id=' + props.value.propId)"/>
            <q-btn flat label="删除" @click="onDel(props.value.propId)"/></q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
