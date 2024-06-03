<script setup lang="ts">
import { defineProps } from 'vue';

interface Album {
  imgUrl: string;
  id: string;
  title: string;
}

const props = defineProps<{ album: Album }>();

function imageUrl() {
    return `https://image.51x.uk/xinshijie${props.album.imgUrl}`;
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-album-card">
    <img :src="imageUrl()" class="m-album-card-image">
    <q-card-section>
      <div class="text-h6">
        <a :href="'/mobile/userAlbum/detail?aid=' + props.album.id">
          <p class="text-caption two-line-clamp">{{ props.album.title }}</p>
        </a>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
