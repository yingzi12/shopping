<script setup lang="ts">
import shopVedio from 'components/shopVideo.vue';
import { Cookies, useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';

// 接收url里的参数
const route = useRoute();
const aid = ref(route.query.aid);
const vid = ref(route.query.vid);

const $q = useQuasar();
const token = Cookies.get("token");
const shop = ref({});
const videoList = ref([]);

const videoOptions = ref({
  type:"application/x-mpegURL",
  src: "", // 设置m3u8格式视频的URL
  controls: true,
  poster: "/albun.jpg",
  preload: 'auto',
  //设置视频的宽度
  width: "90vw"
});
// videoOptions.value.width = '90vw';
async function getInfo() {
  // 滚动到顶部
  const response = await api.get("/usershop/getInfo/" + aid.value, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    shop.value = data.data;
    const vieList = shop.value.videoList
    videoList.value.push(...vieList);
    for(let i=0;i<videoList.value.length;i++){
      const video=videoList.value[i];
      if(vid.value == video.id){
        videoId.value = video.id; // 设置当前播放视频的ID
        videoOptions.value.src=$q.config.sourceWeb+video.url;
        videoOptions.value.poster=$q.config.sourceWeb+video.imgUrl;
      }
    }
  }
}

function playVideo(video){
  videoId.value = video.id; // 设置当前播放视频的ID
  videoOptions.value.src=$q.config.sourceWeb+video.url
  videoOptions.value.poster=$q.config.sourceWeb+video.imgUrl

}
const videoId=ref(0);
const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/usershop/random', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
  }
}

getRandom();
getInfo();
function getImageUrl(imgUrl) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}
// 监听 videoOptions.src 的变化，重新加载组件
watch(() => videoOptions.value.src, () => {
  // 可以在这里执行一些额外的逻辑，如果需要的话
  // console.log(`--------watch------${videoOptions.value.src}----`)
});
</script>

<template>
  <div class="q-pa-xs">
    <div class="bg-cyan text-white">
      <q-toolbar inset>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el to="/usershop/index" :label="$t('usersshop') "  icon="widgets" />
          <q-breadcrumbs-el :to="`/usershop/detail?aid=${shop.id}&userId=${shop.userId}`" :label="shop.title" />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </div>
<!--  <div class="center-container">-->
    <div>
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>{{shop.title}}</q-toolbar-title>
      </q-toolbar>
      <shopVedio :src="videoOptions.src"></shopVedio>
<!--      <shopVedio></shopVedio>-->
    </div>
      <div class="q-pa-xs" >
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>视频播放列表</q-toolbar-title>
        </q-toolbar>

        <q-list bordered>
          <q-item v-for="(video,index) in videoList" :key="video.id" @click="playVideo(video)" class="q-my-sm" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ index+1 }}
              </q-avatar>
            </q-item-section>
            <q-item-section thumbnail>
              <img  :src="getImageUrl(video.imgUrl)">
              <img  v-if="video.status == -1" src="/lock_video.png">
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="video.status != -1 && videoId === video.id"  style="color: blue">播放中</q-item-label>
              <q-item-label v-if="video.status != -1 && videoId != video.id"  style="color: green">等待播放</q-item-label>
              <q-item-label v-if="video.status == -1"  style="color: red">锁定中</q-item-label>
              <q-item-label caption lines="1">{{ video.createTime }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon  v-if="video.status != -1 && videoId === video.id" name="play_circle_filled" color="blue" />
              <q-icon  v-if="video.status != -1 && videoId != video.id" name="play_circle_filled" color="green" />
              <q-icon  v-if="video.status == -1" name="lock" color="red" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
<!--  </div>-->
  <div style=" text-align: center;font-size: large">
    <a v-if="shop.pre != null " :href='"/usershop/detail?aid="+shop.pre.id'
       style="margin: 20px;font-size: large">{{ shop.pre.title }}</a>
    <a v-if="shop.next != null " :href='"/usershop/detail?aid="+shop.next.id'
       style="margin: 20px;font-size: large">{{ shop.next.title }}</a>
  </div>
  <div>
    <div class="scroll-container">
      <div class="scroll-content">
        <!-- 这里放置你需要滚动的内容 -->
        <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
          <m-shop-card  :shop="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass" >
.center-container
  display: flex
  justify-content: center

.example-item
  height: 273px
  width: 150px

.two-line-clamp
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis

.q-card-section
  padding: 8px

.text-caption
  margin: 0
  font-size: 0.8em
</style>
