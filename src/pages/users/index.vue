<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue'
import {useQuasar} from "quasar";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
const $q = useQuasar();

const current = ref(1)
const slide = ref('first')
const title = ref('')
const userList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
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
  const response = await api.get('/systemUser/list?' + tansParams(queryParams.value))
  const data = response.data
  if (data.code == 200) {
    total.value = data.total
    userList.value = data.data
    maxPage.value=  total.value/queryParams.value.pageSize+1;
  }
}

getList(1)

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${$q.config.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/favicon.png`;
}
</script>
<template>
  <q-tabs shrink stretch>
    <q-input v-model="title" :label="$t('search') " name="title" style="width: 600px" @keyup.enter="getList(1)"/>
    <q-icon name="search" @click="getList(1)"/>
  </q-tabs>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
          v-for="(user ,index) in userList"
          :key="index"
          class="example-item"
          once
          transition="scale"
      >
        <q-card bordered class="q-ma-sm" flat>
          <div class="row justify-center">
            <q-avatar font-size="52px" size="100px" class="q-mb-md">
              <img :src="getImageUrl(user.imgUrl)">
            </q-avatar>
          </div>
          <q-card-section class="text-center">
            <div class="text-h6"><a :href='"/userDetail?userId="+user.id'>{{ user.nickname }}</a></div>
            <div class="text-subtitle2"><a :href='"/userDetail?userId="+user.id'>{{ user.intro }}</a></div>
          </q-card-section>
          <q-separator dark/>
        </q-card>
      </q-intersection>
    </div>
    <q-pagination v-model="current"
                  active-color="primary"
                  class="caption"
                  color="grey"
                  direction-links
                  flat
                  :max="maxPage"

                  @update:model-value="getList"
    />
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
  height: auto
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
