<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";
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
              <q-btn flat label="删除" @click="routerEdit"></q-btn>
          </q-item-label>
<!--          <q-icon name="star" color="yellow" />-->
        </q-item-section>
      </q-item>

    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
