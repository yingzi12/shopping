<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, watch } from 'vue';
function loadVideoSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://vjs.zencdn.net/8.10.0/video.min.js`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
// const videoUrl=ref("https://www.aiavr.com/xinshijie/album.m3u8");
const videoUrl=ref("https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8");
function loadStyleSheet() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://vjs.zencdn.net/8.10.0/video-js.css';
  document.head.appendChild(link);
}
function initializeVideoButton(){

}
const props = defineProps({
  options: {
    default: () => ({
      controls: true,
      poster: "/albun.jpg",
      preload: 'auto',
      src: "",
      width: 500
    }),
  },
});

console.log(`---ddd----${props.options.poster}---${props.options.src}----`)


onMounted(async () => {
  await loadVideoSDK();  // 等待 SDK 加载
  loadStyleSheet();
  initializeVideoButton();  // 初始化 PayPal 按钮
});
watch(() => props.options.src, (newSrc, oldSrc) => {
  // 当 props.options.src 发生变化时触发此回调函数
  console.log('New src:', newSrc);
  videoUrl.value=newSrc;
  // 手动重新加载视频
  const videoElement = document.getElementById('my-video');

  // 重新加载视频
  const player = videojs('my-video');
  player.src({
    src: newSrc,
    type: 'application/x-mpegURL' // 根据您的视频类型设置正确的 MIME 类型
  });
});
</script>

<template>

  <div>
<!--    <canvas ref="canvas" style="display: none;"></canvas>-->
<!--    <video ref="videoPlayer" class="video-js vjs-default-skin" controls></video>-->
    <video
      id="my-video"
      class="video-js"
      controls
      preload="auto"
      width="640"
      height="264"
      :poster="props.options.poster"
      data-setup="{}"
      autoplay
    >
<!--      <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />-->
      <source :src="videoUrl" type="application/x-mpegURL" />
      <p class="vjs-no-js">
        Black White
      </p>
    </video>
  </div>
</template>

<style scoped>

</style>
