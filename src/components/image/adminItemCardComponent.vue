<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {Dialog, useQuasar} from "quasar";
const router = useRouter();
const $q = useQuasar();

interface Image {
  id: string;
  imgUrl: string;
  tags: string;
}

const props = defineProps<{ value: Image }>();
async function onDel(id:string){
  const response = await api.get(`/admin/shipImage/del/${id}`);
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

function getImageUrl(imgUrl:string) {
  return `${$q.config.sourceWeb}${imgUrl}`;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm">
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-img :src="getImageUrl(props.value.imgUrl)" style="height: 180px;width: 160px"></q-img>
        </q-item-section>

        <q-item-section side top>
            <q-btn flat label="删除" @click="onDel(props.value.id)"/>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
