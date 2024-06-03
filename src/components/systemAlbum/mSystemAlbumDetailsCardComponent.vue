<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

interface Album {
  sourceUrl: string;
  sourceWeb: string;
  imgUrl: string;
  id: string;
  title: string;
  girl: string;
  intro: string;
  tags: string;
  updateTime: string;
  createTime: string;
  userName: string;
  numberVideo: string;
  numberPhotos: string;
  countDiscuss: String;
  countLike: String;
  countSee: String;
}
const  score=ref(0);
const props = defineProps<{ album: Album }>();
const tagList=ref([]);
if(props.album.tags != null){
  tagList.value=props.album.tags.split(";");
}

function imageUrl() {
  const { sourceUrl, sourceWeb, imgUrl } = props.album;
  if (sourceUrl != null && sourceUrl.startsWith('/image')) {
    return `https://image.51x.uk/xinshijie${sourceUrl}`;
  }
  return sourceWeb + imgUrl;
}
function routerDetail(){
  router.push("/mobile/systemAlbum/detail?aid="+props.album.id);
}
</script>

<template>
  <q-card class="my-card" flat bordered @click="routerDetail">
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="width: 150px">
        <img :src="imageUrl()" class="m-album-card-image">
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="two-line-clamp q-mt-sm q-mb-xs">{{props.album.title}}</div>
        <q-item-label class="one-line-clamp text-weight-thin text-overline q-mb-xs">{{props.album.userName ==null ? "未知" :props.album.userName}}</q-item-label>
        <q-item-label class="one-line-clamp text-weight-thin text-overline q-mb-xs">{{props.album.createTime }}</q-item-label>
        <q-item-label class="q-mb-xs">
          <q-chip class="glossy" color="orange" v-if="props.album.girl != null" text-color="white" size="xs">
            {{ props.album.girl }}
          </q-chip>
          <q-chip class="glossy" color="orange" v-for="(tags,index) in tagList " :key="index" text-color="white" size="xs">
            {{ tags }}
          </q-chip>
        </q-item-label>
        <q-item-label class="two-line-clamp text-caption text-grey q-mb-xs" caption>{{props.album.intro}}</q-item-label>
        <q-item-label>
          <q-chip  size="xs">
          <q-avatar color="red" text-color="white">{{ props.album.numberPhotos}}</q-avatar>
          照片
        </q-chip>
          <q-chip  size="xs">
            <q-avatar color="red" text-color="white">{{ props.album.numberVideo}}</q-avatar>
            视频
          </q-chip>
        </q-item-label>
<!--        <div class="q-gutter-sm q-mb-xs">-->
<!--          <q-btn color="secondary" icon="favorite" label="喜欢" size="xs"/>-->
<!--          <q-btn color="secondary" icon="grade" label="收藏"  size="xs"/>-->
<!--        </div>-->
      </q-card-section>

    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>
