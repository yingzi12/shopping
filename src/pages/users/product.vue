<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue'
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
const $q = useQuasar()

const current = ref(1)
const slide = ref(0)
const title = ref('')
const albumList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    device: 2,
    pageSize:20,
    title: '',
  },
  rules: {}
});

const image = ref("")
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  const response = await api.get('/userAlbum/list?' + tansParams(queryParams.value))
  const data = response.data
  if (data.code == 200) {
    total.value = data.total
    albumList.value = data.data
    maxPage.value=  total.value/queryParams.value.pageSize+1;
  }

}
const imagesLoaded = ref(false);
const randomList = ref([]);
async function getRandom() {
  const response = await api.get('/userAlbum/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
    imagesLoaded.value = true
  }
}
getRandom();
getList(1)

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${$q.config.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}

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
                  navigation
      >
        <q-carousel-slide v-for="(album, index) in randomList" :img-src="getImageUrl(album.imgUrl)" :name="index">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">
              <a :href="`/userAlbumDetail?aid=${album.id}&userId=${album.userId}`" class="album-link">{{ album.title }}</a>
            </div>
            <!--          <div class="text-subtitle1">{{ album.intro }}</div>-->
          </div>
        </q-carousel-slide>
      </q-carousel>

    <div class="row justify-center q-gutter-sm">
      <q-intersection
          v-for="(album ,index) in albumList"
          :key="index"
          class="example-item"
          once
          transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <img style="max-height:363px " :src="getImageUrl(album.imgUrl)">
          <q-card-section>
            <div class="text-h6"><a :href='"/userAlbumDetail?aid="+album.id+"&userId="+album.userId'>{{ album.title }}</a></div>
            <div class="text-subtitle2">{{ album.createTime }}</div>
            <div class="text-subtitle2">
              <span v-if="album.charge == 1" class="text-primary" >免费</span>
              <span v-if="album.charge == 2" class="text-primary" >VIP免费</span>
              <span v-if="album.charge == 3" class="text-primary" >VIP折扣</span>
              <span v-if="album.charge == 4" class="text-primary" >VIP独享</span>
              <span  v-if="album.charge == 5" class="text-primary" >统一</span>
            </div>

          </q-card-section>
          <!--            <q-card-section class="q-pt-none">-->
          <!--              {{ lorem }}-->
          <!--            </q-card-section>-->
        </q-card>

      </q-intersection>
    </div>
    <div>
    <q-pagination v-model="current"
                  active-color="primary"
                  class="caption"
                  color="grey"
                  direction-links
                  flat
                  :max="maxPage"
                  @update:model-value="getList" />
    </div>
  </div>
  <div class="row">
    <div class="col-2"></div>
    <div class="col-auto" style="margin: 0px">
      <div class="footter" style="margin: 0px;text-align: center;">
        <router-link to="">关于图集</router-link>
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
      <div class="footerText text-weight-thin"><p>图片,美女,写真,图集</p></div>
      <div class="footerText text-weight-light"><p>
        本站所收录的作品、社区话题、用户评论、用户上传内容或图片等均属用户个人行为。如前述内容侵害您的权益，欢迎举报投诉，一经核实，立即删除，本站不承担任何责任</p>
      </div>
      <div class="footerText text-weight-thin"><a href="https://www.51k.uk">心世界小说网</a>|<a
          href="https://www.30dizhi.uk">30导航</a>|<a href="https://www.aravrw.com">心世界</a></div>
    </div>
    <div class="col-2"></div>
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
.text-h6 a
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 2 /* 限制在两行 */
  overflow: hidden
  text-overflow: ellipsis /* 超出部分显示省略号 */
  white-space: normal

</style>
