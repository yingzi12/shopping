<script setup lang="ts">
import { defineProps } from 'vue';

interface Product {
  id: string;
  imgUrl: string;
  title: string;
  amonut: string;
  effectiveTimeLong: string;
  kind: number;
  introduction: string;
  totality: string;

}

const props = defineProps<{ value: Product }>();

function imageUrl() {
    return `https://image.51x.uk/blackwhite${props.value.imgUrl}`;
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
          <a :href="'/product/detail?aid=' + props.value.id">
            <p class="text-caption two-line-clamp">{{ props.value.title }}</p>
          </a>
        </div>

      </q-item-label>
      <q-item-label>
        {{props.value.amonut}}
      </q-item-label>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
