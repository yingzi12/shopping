<template>
  <div>
    <!-- 更改q-tabs为普通的div，除非你确实需要标签页功能 -->
    <div>
      <!--      <q-input name="title" label="搜索" v-model="title"   @keyup.enter="getList()"/>-->
      <!--      <q-icon name="search" @click="getList()"/>-->
      <q-input filled bottom-slots v-model="title" label="Label" counter maxlength="12" :dense="dense">
        <!--        <template v-slot:before>-->
        <!--          <q-icon name="flight_takeoff" />-->
        <!--        </template>-->

        <template v-slot:append>
          <q-icon v-if="title !== ''" name="close" @click="title = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-input>
    </div>
    <div>
      <div class="scroll-container">
        <div class="scroll-content">
          <!-- 这里放置你需要滚动的内容 -->
          <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
            <m-album-card  :album="value" />
          </div>
        </div>
      </div>
      <div>
        <q-toolbar >
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>
            最新图集
          </q-toolbar-title>
          <q-btn flat round dense icon="more_horiz" to="/mobile/systemAlbum/order"/>
        </q-toolbar>
        <div class="row items-start q-gutter-sm justify-center"> <!-- 修改为items-start以防止内容顶部对齐 -->
          <q-intersection
            v-for="(value ,index) in albumList"
            :key="index"
            class="col-auto m-album-item-list"
            once
            transition="scale"
          >
            <m-album-card :album="value" />
          </q-intersection>
        </div>
      </div>

    </div>
    <!-- Swiper区域 -->
  </div>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from 'vue';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';
import { tansParams } from 'boot/tools';
import mAlbumCard from "components/mAlbumCard.vue"
const title = ref('');
const search = ref(''); // 修正拼写错误
const token = Cookies.get("token");

const randomList = ref([]);

function imageUrl(album) {
  if (album.sourceUrl!=null &&  album.sourceUrl.startsWith('/image')) {
    return `https://image.51x.uk/xinshijie${album.sourceUrl}`;
  }
  return album.sourceWeb + album.imgUrl;
}

async  function getRandom() {
  // data  = await api.get('/api/album/random')
  const response = await api.get(`/album/random`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.data.code === 200) {
    randomList.value = response.data.data
  }
}
getRandom();
const albumList = ref([]);
const total = ref(0);
const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    device: 2,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

async function getList() {
  queryParams.value.title = title.value;
  queryParams.value.pageNum = 1;
  const response = await api.get('/album/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    total.value = data.total
    albumList.value = data.data
  }
}
getList();
</script>
<style lang="scss" scoped>
.m-album-card{
  height: 220px;
  width: 150px;
}
.m-album-card-image{
  height: 180px;
  width: 130px;
}

.scroll-container {
  overflow-x: auto; /* 水平滚动 */
  white-space: nowrap; /* 确保内容不换行 */
}

.scroll-content {
  display: inline-block; /* 使子元素水平排列 */
}

.scroll-item {
  display: inline-block; /* 让子元素水平排列 */
  margin-right: 10px; /* 添加间隔 */
}
</style>
