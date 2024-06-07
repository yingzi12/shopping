<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";

const router = useRouter()

interface Product {
  pic: string;
  prodId: string;
  prodName: string;
  price: string;
}

const props = defineProps<{ value: Product }>();

function imageUrl() {
    return `https://image.51x.uk/xinshijie${props.value.pic}`;
}
function routerDetail() {
  router.push(`/product/detail?pid=${props.value.prodId}`);
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-shop-card" @click="routerDetail">
    <img :src="imageUrl()"
         class="m-shop-card-image"
    >
    <q-card-section class="text-center">
      <q-item-label  >
        <div class="text-h6">
          <a :href="'/product/detail?aid=' + props.value.prodId">
          </a>
          <p class="text-caption two-line-clamp tight-spacing">{{ props.value.prodName }}</p>
          <q-chip  size="ms">{{props.value.price}}$</q-chip>
        </div>
      </q-item-label>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.text-caption {
  margin-bottom: 5px; /* 您可以根据需要调整这个值 */
}

/* 如果需要针对特定情况调整，可以添加一个新的类 */
.tight-spacing {
  margin-top: -5px; /* 减少上边距来紧挨上一个元素 */
}

</style>
