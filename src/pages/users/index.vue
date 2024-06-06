<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue'
import {useQuasar} from "quasar";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
import mUserCard from "components/user/mUserCardComponent.vue"
import {useRoute, useRouter} from "vue-router";

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

const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/systemUser/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
  }
}

getRandom();
const router = useRouter();

function search(){
  router.push(`/users/order?title=${title.value}`)
}
</script>
<template>
    <div>
      <!-- 更改q-tabs为普通的div，除非你确实需要标签页功能 -->
      <div>
        <q-input filled bottom-slots v-model="title" :label="$t(`search`)"  @keyup.enter="search" >
          <template v-slot:append>
            <q-icon v-if="title !== ''" name="close" @click="title = ''" class="cursor-pointer" />
            <q-icon name="search"  @click="search"/>
          </template>
        </q-input>
      </div>
      <div>
        <div class="scroll-container">
          <div class="scroll-content">
            <!-- 这里放置你需要滚动的内容 -->
            <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
              <m-user-card  :value="value" />
            </div>
          </div>
        </div>
        <div>
          <q-toolbar >
            <q-btn flat round dense icon="menu" />
            <q-toolbar-title>
              用户列表
            </q-toolbar-title>
            <q-btn flat round dense icon="more_horiz" to="/users/order"/>
          </q-toolbar>
          <div class="row items-start q-gutter-sm justify-center"> <!-- 修改为items-start以防止内容顶部对齐 -->
            <q-intersection
              v-for="(value ,index) in userList"
              :key="index"
              class="col-auto m-shop-item-list"
              once
              transition="scale"
            >
              <m-user-card :value="value" />
            </q-intersection>
          </div>
        </div>

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
