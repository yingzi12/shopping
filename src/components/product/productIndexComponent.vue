<script setup lang="ts">
import { defineProps } from 'vue';

interface Product {
  imgUrl: string;
  id: string;
  title: string;
  amount: string;

}

const props = defineProps<{ value: Product }>();

function imageUrl() {
  return `https://image.51x.uk/xinshijie${props.value.imgUrl}`;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-album-card">
    <img :src="imageUrl()" class="m-album-card-image">
    <q-card-section>
      <div class="text-h6">
        <a :href="'/product/detail?pid=' + props.value.id">
          <p class="text-caption two-line-clamp">{{ props.value.title }}</p>
        </a>
      </div>
      <q-item-label class="text-red">{{props.value.amount}}</q-item-label>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
