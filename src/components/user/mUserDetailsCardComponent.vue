<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

interface User {
  imgUrl: String;
  id: String;
  title: String;
  intro: String;
  nickname:String;
  updateTime: String;
  countAttention: String;
  countLike: String;
  countSee: String;

}
const  score=ref(0);
const props = defineProps<{ value: User }>();
function imageUrl() {
  if (props.value && props.value.imgUrl) {

    const imgUrl = props.value.imgUrl; // 如果imgUrl为空，则使用默认图片路径
    return `https://image.51x.uk/blackwhite${imgUrl}`;
  }else{
    return "";
  }
}
function routerDetail(){
  router.push("/users/detail?userId="+props.value.id);
}
</script>

<template>
  <q-card class="my-card" flat bordered @click="routerDetail">
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="width: 150px">
        <q-avatar font-size="52px" size="100px" class="q-mb-md">
          <q-img :src="imageUrl() || `/shop-logo.png`" @error.once="e => { e.target.src = `/shop-logo.png` }"
                 class="m-shop-card-image"/>
        </q-avatar>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="two-line-clamp q-mt-sm q-mb-xs">{{props.value.nickname}}</div>
        <q-item-label class="two-line-clamp text-caption text-grey q-mb-xs" caption>{{props.value.intro}}</q-item-label>
        <q-item-label>
          <q-chip size="xs">
            <q-avatar color="red" text-color="white">{{ props.value.countAttention}}</q-avatar>
            关注
          </q-chip>
          <q-chip  size="xs">
            <q-avatar color="red" text-color="white">{{ props.value.countLike}}</q-avatar>
            喜欢
          </q-chip>
          <q-chip  size="xs">
            <q-avatar color="red" text-color="white">{{ props.value.countSee}}</q-avatar>
            查看
          </q-chip>
        </q-item-label>
      </q-card-section>


    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>
