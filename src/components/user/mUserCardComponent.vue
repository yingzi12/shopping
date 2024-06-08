<script setup lang="ts">
import { defineProps } from 'vue';

interface User {
  imgUrl: string;
  id: string;
  nickname: string;
}

const props = defineProps<{ value: User }>();

function imageUrl() {
  const imgUrl = props.value.imgUrl; // 如果imgUrl为空，则使用默认图片路径
  return `https://image.51x.uk/blackwhite${imgUrl}`;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-shop-card">
    <q-img :src="imageUrl() || `/shop-logo.png`" @error.once="e => { e.target.src = `/shop-logo.png` }"
           class="m-shop-card-image"/>
    <q-card-section>
      <div class="text-h6">
        <a :href="'/users/detail?userId=' + props.value.id">
          <p class="text-caption two-line-clamp">{{ props.value.nickname }}</p>
        </a>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
