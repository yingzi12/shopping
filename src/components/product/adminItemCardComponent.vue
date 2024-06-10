<script setup lang="ts">
import { defineProps } from 'vue';

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
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-shop-card">
    <img :src="imageUrl()"
         class="m-shop-card-image"
    >
    <q-card-section>
      <q-item-label>
        <div class="text-h6">
          <a :href="'/product/detail?pid=' + props.value.prodId">
            <p class="text-caption two-line-clamp">{{ props.value.prodName }}</p>
          </a>
        </div>

      </q-item-label>
      <q-item-label>
        {{props.value.price}}
      </q-item-label>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
