<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue'
import {useRoute} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {tansParams} from "boot/tools";
import productIndexComponent from "components/product/productIndexComponent.vue";

import {api} from "boot/axios";
const route = useRoute();

const invite = Cookies.get("invite");
if(invite != null && invite != ''){
  Cookies.set("invite",invite, {path:'/'})
}
const aid = ref(route.query.aid);

const $q = useQuasar();
const current = ref(1)
const slide = ref(0)
const title = ref('')

const image = ref("")
const productList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
  pageNum: 1,
    pageSize: 1,

    device: 2,
    title: '',
},
rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  const response = await api.get('/product/list?' + tansParams(queryParams.value))
  const data = response.data;
  if (data.code == 200) {
    total.value = data.total
    productList.value = data.data
    if(data.total % queryParams.value.pageSize == 0){
      maxPage.value=data.total/queryParams.value.pageSize;
    }else{
      maxPage.value=data.total/queryParams.value.pageSize+1;
    }
  }
}


function imageUrl(album) {
  if (album.sourceUrl != null && album.sourceUrl.startsWith('/image')) {
    return `${$q.config.sourceWeb}${album.sourceUrl}`;
  }
  return album.sourceWeb + album.imgUrl;
}

const imagesLoaded = ref(false);
const randomList = ref([]);
async function getRandom() {
  const response = await api.get('/product/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
    imagesLoaded.value = true
  }
}
getList(1);
getRandom();
</script>
<template>
  <q-tabs shrink stretch>
    <q-input v-model="title" :label="$t('search') " name="title" style="width: 600px" @keyup.enter="getList(1)"/>
    <q-icon name="search" @click="getList(1)"/>
  </q-tabs>
  <div class="q-pa-md">
    <q-carousel v-if="imagesLoaded"
                v-model="slide"
                animated
                arrows
                height="400px"
                navigation>
      <q-carousel-slide v-for="(album, index) in randomList" :img-src="imageUrl(album)" :name="index">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">
            <a :href="'/product/detail?aid=' + album.id" class="album-link">{{ album.title }}</a>
          </div>
          <!--          <div class="text-subtitle1">{{ album.intro }}</div>-->
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="(value ,index) in productList"
        :key="index"
        class="example-item"
        once
        transition="scale"
      >
        <product-index-component :value="value"></product-index-component>

      </q-intersection>
    </div>
  <div>
    <q-pagination v-model="current"
                  active-color="primary"
                  class="caption"
                  color="grey"
                  direction-links
                  flat
                  max="maxPage"
                  max-pages="5"
                  @update:model-value="getList"
    />
  </div>
  </div>
</template>

<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)

.q-carousel__slide
  background-size: contain

.example-item
  height: 500px
  width: 260px

.q-card img
  object-fit: cover

.q-pagination
  text-align: center

.caption
  display: flex
  justify-content: center
  align-items: center


</style>
<style>

/* 响应式设计：小屏幕上的文本大小调整 */
@media (max-width: 600px) {
  .custom-caption .text-h2 {
    font-size: 1em;
  }

  .custom-caption .text-subtitle1 {
    font-size: 0.8em;
  }
}

.album-link {
  color: white; /* 设置链接颜色为白色 */
  text-decoration: none; /* 去除下划线 */
}

/* 你可能还需要添加 :hover 和 :focus 状态的样式 */
.album-link:hover,
.album-link:focus {
  color: white; /* 鼠标悬浮和聚焦时的颜色 */
  text-decoration: none; /* 鼠标悬浮和聚焦时去除下划线 */
}
.text-h6 a {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制在两行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: normal;
}
</style>
