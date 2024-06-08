<script setup lang="ts">
import { defineProps } from 'vue';

interface shop {
  sourceUrl: string;
  sourceWeb: string;
  imgUrl: string;
  id: string;
  title: string;
}

const props = defineProps<{ shop: shop }>();

function imageUrl() {
  const { sourceUrl, sourceWeb, imgUrl } = props.shop;
  if (sourceUrl != null && sourceUrl.startsWith('/image')) {
    return `https://image.51x.uk/blackwhite${sourceUrl}`;
  }
  return sourceWeb + imgUrl;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-shop-card">
    <img :src="imageUrl()" class="m-shop-card-image">
    <q-card-section>
      <div class="text-h6">
        <a :href="'/systemshop/detail?aid=' + props.shop.id">
          <p class="text-caption two-line-clamp">{{ props.shop.title }}</p>
        </a>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
