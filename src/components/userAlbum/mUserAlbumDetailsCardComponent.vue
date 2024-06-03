<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

interface Album {
  imgUrl: string;
  id: string;
  title: string;
  girl: string;
  intro: string;
  tags: string;
  updateTime: string;
  userName: string;
  numberVideo: string;
  numberPhotos: string;
  countDiscuss: String;
  countLike: String;
  countSee: String;
  charge:number;

}
const  score=ref(0);
const props = defineProps<{ album: Album }>();
const tagList=ref([]);
if(props.album.tags != null){
  tagList.value=props.album.tags.split(";");
}
function imageUrl() {
    return `https://image.51x.uk/xinshijie${props.album.imgUrl}`;
}
function routerDetail(){
  router.push("/mobile/userAlbum/detail?aid="+props.album.id);
}
</script>

<template>
<!--  <q-card flat bordered class="q-ma-sm m-album-card">-->
<!--    <img :src="imageUrl()" class="m-album-card-image">-->
<!--    <q-card-section>-->
<!--      <div class="text-h6">-->
<!--        <a :href="'/mobile/userAlbum/detail?aid=' + props.album.id">-->
<!--          <p class="text-caption two-line-clamp">{{ props.album.title }}</p>-->
<!--        </a>-->
<!--      </div>-->
<!--    </q-card-section>-->
<!--  </q-card>-->
  <q-card class="my-card" flat bordered @click="routerDetail">
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="width: 150px">
        <img :src="imageUrl()" class="m-album-card-image">
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="two-line-clamp q-mt-sm q-mb-xs">{{props.album.title}}
        </div>
        <q-item-label class="one-line-clamp text-weight-thin text-overline q-mb-xs">{{props.album.userName ==null ? "未知" :props.album.userName}}</q-item-label>
        <q-item-label class="q-mb-xs">
            <q-chip class="glossy" color="yellow" v-if="props.album.charge == 1"  text-color="black" size="xs" >免费</q-chip>
            <q-chip class="glossy" color="yellow" v-if="props.album.charge == 2"  text-color="black" size="xs" >VIP免费</q-chip>
            <q-chip class="glossy" color="yellow" v-if="props.album.charge == 3"  text-color="black" size="xs" >VIP折扣</q-chip>
            <q-chip class="glossy" color="yellow" v-if="props.album.charge == 4"  text-color="black" size="xs" >VIP独享</q-chip>
            <q-chip class="glossy" color="yellow" v-if="props.album.charge == 5"  text-color="black" size="xs" >统一</q-chip>
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
<!--&lt;!&ndash;          <q-btn color="red" icon="comment" to="/world/discuss"   size="xs" >讨论({{props.album.countDiscuss? "0": props.album.countDiscuss}})</q-btn>&ndash;&gt;-->
<!--        </div>-->
      </q-card-section>


    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>
