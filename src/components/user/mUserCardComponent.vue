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
  return `https://image.51x.uk/xinshijie${imgUrl}`;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-album-card">
    <q-img :src="imageUrl() || `/album-logo.png`" @error.once="e => { e.target.src = `/album-logo.png` }"
           class="m-album-card-image"/>
    <q-card-section>
      <div class="text-h6">
        <a :href="'/mobile/users/detail?userId=' + props.value.id">
          <p class="text-caption two-line-clamp">{{ props.value.nickname }}</p>
        </a>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
