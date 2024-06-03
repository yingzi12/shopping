<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import mUserCard from "components/user/mUserCardComponent.vue"

const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/systemUser/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
  }
}

getRandom();
</script>

<template>
  <q-toolbar >
    <q-btn flat round dense icon="menu" />
    <q-toolbar-title>
      随机推荐
    </q-toolbar-title>
    <q-btn flat round dense icon="more_horiz" to="/mobile/userAlbum/order"/>
  </q-toolbar>
  <div class="scroll-container">
    <div class="scroll-content">
      <!-- 这里放置你需要滚动的内容 -->
      <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
        <m-user-card  :value="value" />
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
