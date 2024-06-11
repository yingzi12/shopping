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
  src: "https://image.51k.com/blackwhite/shop.m3u8", // 设置m3u8格式视频的URL
  controls: true,
  poster: "/albun.jpg",
  preload: 'auto',
  width: 500
});

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
    console.log(`--------------${vid.value}------`)

    for(let i=0;i<videoList.value.length;i++){
      const video=videoList.value[i];
      console.log(`--------------${vid.value}--${video.id}----`)
      if(vid.value == video.id){
        videoId.value = video.id; // 设置当前播放视频的ID
        videoOptions.value.src=$q.config.sourceWeb+video.url;
        videoOptions.value.poster=$q.config.sourceWeb+video.imgUrl;
        console.log(`--------------${videoOptions.value.src}----`)
      }
    }
  }
}

function playVideo(video){
  // console.log("播放")
  // console.log(video.id)
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
  console.log(`--------watch------${videoOptions.value.src}----`)
});
</script>

<template>
  <div class="q-pa-md">
    <div class="bg-cyan text-white">
      <q-toolbar inset>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el to="/" :label="$t('home')" icon="home" />
          <q-breadcrumbs-el to="/usershop/index" :label="$t('usersshop') "  icon="widgets" />
          <q-breadcrumbs-el :to="`/usershop/detail?aid=${shop.id}&userId=${shop.userId}`" :label="shop.title" />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </div>
  <div class="center-container">
  <div class="row">
    <div>
      <p class="text-h5">{{shop.title}}</p>

      <shopVedio :options="videoOptions"></shopVedio>
    </div>
    <div>
      <div class="q-pa-md" style="max-width: 350px">
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
    </div>
  </div>
  </div>
  <div style=" text-align: center;font-size: large">
    <a v-if="shop.pre != null " :href='"/usershop/detail?aid="+shop.pre.id'
       style="margin: 20px;font-size: large">{{ shop.pre.title }}</a>
    <a v-if="shop.next != null " :href='"/usershop/detail?aid="+shop.next.id'
       style="margin: 20px;font-size: large">{{ shop.next.title }}</a>
  </div>
  <div>
    <!-- 在这里放置您希望在新列中显示的内容 -->
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="(shop ,index) in randomList"
        :key="index"
        class="example-item"
        once
        transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <img :src="getImageUrl(shop.imgUrl)">
          <q-card-section>
            <div class="text-h6">
              <a :href='"/usershop/detail?aid="+shop.id+"&userId="+shop.userId'>
                <p class="text-caption  two-line-clamp"> {{ shop.title }} </p>
              </a>
              <p class="text-caption" style="padding: 0px"> {{ shop.createTime }} </p>
            </div>
          </q-card-section>
        </q-card>

      </q-intersection>
    </div>
  </div>
  <div class="row">
    <div class="col-2"></div>
    <div class="col-auto" style="margin: 0px">
      <div class="footter" style="margin: 0;text-align: center;">
        <router-link to="">关于黑白</router-link>
        |
        <router-link to="">联系我们</router-link>
        |
        <router-link to="">帮助中心</router-link>
        |
        <router-link to="">提交建议</router-link>
        |
        <router-link to="">举报中心</router-link>
        |
        <router-link to="/privacyPolicy">隐私政策</router-link>
        |
        <router-link to="/use">使用条款</router-link>
        |
        <router-link to="">漏洞提交</router-link>
        |
      </div>
      <div class="footerText text-weight-thin"><p>Copyright © 2002-2022 www.aiavr.uk Rights Reserved 版权所有
        心世界未来科技有限公司</p></div>
      <div class="footerText text-weight-thin"><p>图片,美女,写真,黑白</p></div>
      <div class="footerText text-weight-light"><p>
        本站所收录的作品、社区话题、用户评论、用户上传内容或图片等均属用户个人行为。如前述内容侵害您的权益，欢迎举报投诉，一经核实，立即删除，本站不承担任何责任</p>
      </div>
      <div class="footerText text-weight-thin"><a href="https://www.51k.uk">心世界小说网</a>|<a
        href="https://www.30dizhi.uk">30导航</a>|<a href="https://www.aravrw.com">心世界</a></div>
    </div>
    <div class="col-2"></div>
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
