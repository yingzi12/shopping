<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {Dialog} from "quasar";
const router = useRouter();

interface Product {
  prodId: string;
  pic: string;
  prodName: string;
  price: string;
  effectiveTimeLong: string;
  kind: number;
  introduction: string;
  totality: string;

}

const props = defineProps<{ value: Product }>();

function imageUrl() {
    return `https://image.51x.uk/blackwhite${props.value.pic}`;
}
function routerEdit() {
  router.push(`/admin/shop/product/edit?pid=${props.value.prodId}`)
}
function routerDel() {
  //添加弹出款是否确定删除
  Dialog.create({
    title: '提示',
    message: '确定删除该商品吗？',
    cancel: true,
    ok: {
      label: '确定',
      color: 'primary',
      handler: () => {
        delProd();
      }
    }
  })
}
async function delProd() {
  try {
    const response = await api.get(`/admin/prod/del?id=${props.value.prodId}`);
    if (response.data.code === 200) {
      router.go(0);
    }
  } catch (error) {
  }
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm ">

    <q-card-section>
      <q-item>
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="imageUrl()"
                 class="m-shop-card-image"
            >
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <div class="text-h6">
            <a :href="'/product/detail?pid=' + props.value.prodId">
              <p class="text-caption two-line-clamp">{{ props.value.prodName }}</p>
            </a>
          </div>
          <q-item-label>
            {{props.value.price}}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>
            <q-btn flat label="编辑" @click="routerEdit"></q-btn>
              <q-btn flat label="删除" @click="routerDel"></q-btn>
          </q-item-label>
<!--          <q-icon name="star" color="yellow" />-->
        </q-item-section>
      </q-item>

    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
