<script setup lang="ts">
import { defineProps } from 'vue';
import {useRouter} from "vue-router";
const router = useRouter();

interface Product {
  prodId: string;
  pic: string;
  prodName: string;
  price: string;
  effectiveTimeLong: string;
  kind: number;
  brief: string;
  totality: string;
  oriPrice: string;

}

const props = defineProps<{ value: Product }>();

function imageUrl() {
  return `https://image.51x.uk/blackwhite${props.value.pic}`;
}
function routerDetail() {
  router.push(`/product/detail?pid=${props.value.prodId}`)
}
</script>

<template>
  <q-card flat bordered class="q-ma-sm " @click="routerDetail">

    <q-card-section>
      <q-item >
        <q-item-section avatar>
            <q-img :src="imageUrl()"
                 class="shop-card-image"
           />
        </q-item-section>
        <q-item-section>
          <q-item-label>
          <div class="">
              <p class="two-line-clamp">{{ props.value.prodName }}</p>
          </div>
          </q-item-label>
          <q-item-label>
            <div class="two-line-clamp text-subtitle1">{{ props.value.brief }}</div>
          </q-item-label>
          <q-item-label>
            <div><q-chip size="m" color="grey"><del>{{ props.value.oriPrice }}$</del></q-chip><q-chip size="m" color="red">{{props.value.price}}$</q-chip> </div>
          </q-item-label>

        </q-item-section>
      </q-item>

    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
