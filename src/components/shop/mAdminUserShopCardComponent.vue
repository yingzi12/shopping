<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import {api} from "boot/axios";
import {useQuasar} from "quasar";
const router = useRouter()
const $q = useQuasar();

interface shop {
  imgUrl: string;
  id: string;
  title: string;
  girl: string;
  intro: string;
  tags: string;
  updateTime: string;
  userName: string;
  numberVideo: string;
  numberPhotos: string;
  countDiscuss: String;
  countLike: String;
  countSee: String;
  charge:number;
  status:number;
}
const props = defineProps<{ shop: shop }>();
// const tagList=ref([]);
// if(props.shop.tags != null){
//   tagList.value=props.shop.tags.split(";");
// }
function imageUrl() {
  return `https://image.51x.uk/blackwhite${props.shop.imgUrl}`;
}
function routerDetail(){
  router.push("/usershop/detail?aid="+props.shop.id);
}
function updateStatus(shop: any, statusChoise: number) {
  const message = ref("");
  if (statusChoise == 1) {
    const count = shop.numberPhotos + shop.numberVideo;
    if (count == 0 || !count) {
      shop.status = 2;
      statusChoise = 2;
      $q.dialog({
        title: '通知',
        message: '照片与视频为0不能发布.',
        ok: {
          push: true
        },
      }).onOk(async () => {
        return;
      });
      return;
    }
    message.value = "发布";
  } else {
    message.value = "下架";
  }
  $q.dialog({
    title: '通知',
    message: '是否确认' + message.value + '.',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(async () => {
    // server/user/userSettingVip/updateStatus.get.ts
    const response = await api.get(`/user/usershop/updateStatus?id=${shop.id}&status=${statusChoise}`);
    // if (response.data.code == 200) {
    //   await getList(1);
    // }
  }).onCancel(() => {
    if (statusChoise == 1) {
      shop.status = 2
    } else {
      shop.status = 1
    }
    // //console.log('Cancel')
  });
}
function editshop(id: string) {
  router.push("/user/users/editshop?id=" +id);
}
function delshop(id: string,title:string) {
  $q.dialog({
    title: '通知',
    message: '是否确认删除' + title + '',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
  }).onOk(async () => {
    const response = await api.get(`/user/usershop/remove/${id}`);
    if (response.data.code == 200) {
      $q.dialog({
        title: '通知',
        message: '删除成功',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
      })
    }
  });
}

</script>

<template>
  <q-card class="my-card" flat bordered >
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="width: 150px">
        <q-img :src="imageUrl()" class="m-shop-card-image" @click="routerDetail()"/>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="two-line-clamp q-mt-sm q-mb-xs">{{props.shop.title}}
        </div>
        <q-item-label class="q-mb-xs">
          <q-chip class="glossy" color="yellow" v-if="props.shop.charge == 1"  text-color="black" size="xs" >免费</q-chip>
          <q-chip class="glossy" color="yellow" v-if="props.shop.charge == 2"  text-color="black" size="xs" >VIP免费</q-chip>
          <q-chip class="glossy" color="yellow" v-if="props.shop.charge == 3"  text-color="black" size="xs" >VIP折扣</q-chip>
          <q-chip class="glossy" color="yellow" v-if="props.shop.charge == 4"  text-color="black" size="xs" >VIP独享</q-chip>
          <q-chip class="glossy" color="yellow" v-if="props.shop.charge == 5"  text-color="black" size="xs" >统一</q-chip>
          <q-chip class="glossy" color="orange" v-if="props.shop.girl != null" text-color="white" size="xs">
            {{ props.shop.girl }}
          </q-chip>
<!--          <q-chip class="glossy" color="orange" v-for="(tags,index) in tagList " :key="index" text-color="white" size="xs">-->
<!--            {{ tags }}-->
<!--          </q-chip>-->
        </q-item-label>
        <q-item-label class="two-line-clamp text-caption text-grey q-mb-xs" caption>{{props.shop.intro}}</q-item-label>
<!--        <q-item-label>-->
<!--          <q-chip  size="xs">-->
<!--            <q-avatar color="red" text-color="white">{{ props.shop.numberPhotos}}</q-avatar>-->
<!--            照片-->
<!--          </q-chip>-->
<!--          <q-chip  size="xs">-->
<!--            <q-avatar color="red" text-color="white">{{ props.shop.numberVideo}}</q-avatar>-->
<!--            视频-->
<!--          </q-chip>-->
<!--        </q-item-label>-->
        <q-item-label side>
          <q-toggle v-model="props.shop.status"
                    :false-value="2"
                    :true-value="1" label="发布" @update:modelValue="updateStatus( props.shop, props.shop.status)"/>
          <q-btn  color="blue" flat icon="edit" round size="12px" @click="editshop(props.shop.id)"/>
          <q-btn color="red"  v-if="props.shop.status ==2"  flat icon="delete" round size="12px" @click="delshop( props.shop.id, props.shop.title)"/>
        </q-item-label>
        <q-item-label>
            <router-link :to="'/user/users/addVideo?aid='+shop.id+'&title='+shop.title+'&status='+shop.status">
              视频： {{ shop.numberVideo }}
            </router-link>
            <router-link :to="'/user/users/addImage?aid='+shop.id+'&status='+shop.status+'&title='+shop.title">
              照片： {{shop.numberPhotos}}
            </router-link>
        </q-item-label>
      </q-card-section>


    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>
