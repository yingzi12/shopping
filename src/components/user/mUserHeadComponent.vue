<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { api } from 'boot/axios';
import { Cookies, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const $q = useQuasar();
const props = defineProps({
  userId:  String
});
const token = Cookies.get("token");
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const user=ref({});
async function getDetail() {
  const response = await api.get(`/systemUser/info?userId=${props.userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;

  if (data.code == 200) {
    const userData = data.data;
    user.value=userData;
    isAttention.value=userData.isAttention
  }
}

getDetail();

function getImageUrl(url) {
  if (url != null) {
    return `${$q.config.sourceWeb}${url}`;
  }
  return "/favicon.png";
}
const isLike=ref(0);

async function onLike() {
  if ( isLike.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isLike.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/systemUser/like?userId=${props.userId}`)
  const data = response.data;
  if (data.code == 200) {
    isLike.value = 1;
  }else{
    isLike.value = 0;
  }
}
const isAttention = ref(2)

async function onAttention() {
  if ( isAttention.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isAttention.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/admin/userAttention/on?attUserId=${props.userId}&attUserName=${user.nickname}`)
  const data = response.data;
  if (data.code == 200) {
    isAttention.value=1;
  }else{
    isAttention.value=2;
  }
}
async function closeAttention() {
  if ( isAttention.value==2) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }
  // 滚动到顶部
  const response = await api.get(`/admin/userAttention/close?attUserId=${props.userId}&attUserName=${user.nickname}`)
  const data = response.data;
  if (data.code == 200) {
    isAttention.value=2;
  }else{
    isAttention.value=1;
  }
}
function routerVip(){
  router.push(`/users/vip?userId=${props.userId}`); // Redirect to login page
}
function routershop(){
  router.push(`/users/detail?userId=${props.userId}`); // Redirect to login page
}
</script>

<template>
  <q-breadcrumbs class="text-brown q-ma-md">
    <template v-slot:separator>
      <q-icon
        size="1.5em"
        name="chevron_right"
        color="primary"
      />
    </template>

    <q-breadcrumbs-el label="首页" icon="widgets"  to="/users/index"/>
    <q-breadcrumbs-el label="排行榜" icon="navigation" to="/users/order" />
    <q-breadcrumbs-el :label="user.nickname" icon="description" :to="{ path: '/users/detail', query: { userId: props.userId }}" />
  </q-breadcrumbs>
  <div class="text-center">
    <q-card flat bordered class="q-ma-sm">
      <q-card-section>
        <img :src="getImageUrl(user.imgUrl)" class="m-shop-card-image">
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          <q-item-label class="text-caption two-line-clamp">{{ user.nickname }}</q-item-label>
        </div>

      </q-card-section>
      <q-card-section>
        <q-item-label>{{ user.directions ==null? "还没有简介哦！" :user.directions}}</q-item-label>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-sm q-mb-xs">
          <span class="text-h6">
            {{ user.countSee ==null? 0: user.countSee}}次
            <q-badge outline align="middle" color="teal" >
              查看
            </q-badge>
          </span>
          <span class="text-h6">
            {{ user.countLike==null?  0: user.countLike}}次
            <q-badge outline align="middle" color="teal ">
              点赞
            </q-badge>
          </span>
          <span class="text-h6">
            {{ user.countAttention ==null?  0: user.countAttention }}人
            <q-badge outline align="middle" color="teal" >
              关注
            </q-badge>
          </span>
        </div>

      </q-card-section>
      <q-card-section class="row items-center justify-evenly">
        <q-btn round :color="isLike ==1?'red':'blue'" icon="thumb_up"  @click="onLike"  />
        <q-btn round :color="isAttention !=1 ?'blue':'red'" icon="favorite"  @click="isAttention !=1 ? onAttention() :closeAttention()"/>
        <q-btn round color="orange" icon="shop" @click="routershop()"/>
        <q-btn round color="yellow" icon="beenhere" @click="routerVip()"/>

      </q-card-section>
    </q-card>
  </div>

</template>

<style scoped>

</style>
