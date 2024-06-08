<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";

const router = useRouter()

interface Common {
  prodCommId: string;
  score: number;
  isAnonymous: number;
  replyContent: string;
  replyTime: string;
  recTime: string;
  nickName: string;
  pic: string;
  pics: string;
  evaluate: number;
  content: number;

}

const props = defineProps<{ value: Common }>();

function imageUrl() {
  return `https://image.51x.uk/blackwhite${props.value.pic}`;
}
function routerDetail() {
  router.push(`/common/detail?prodCommId=${props.value.prodCommId}`);
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm m-shop-card" @click="routerDetail">
    <q-card-section class="text-center">
      <q-item-label>
        <q-avatar size="24">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
        {{props.value.nickName}}
      </q-item-label>
      <q-item-label> {{props.value.recTime}}</q-item-label>
    </q-card-section>
    <q-card-section class="text-center">
      <q-item-label>{{props.value.content}}</q-item-label>
    </q-card-section>

  </q-card>
</template>

<style scoped>
.text-caption {
  margin-bottom: 5px; /* 您可以根据需要调整这个值 */
}

/* 如果需要针对特定情况调整，可以添加一个新的类 */
.tight-spacing {
  margin-top: -5px; /* 减少上边距来紧挨上一个元素 */
}

</style>
