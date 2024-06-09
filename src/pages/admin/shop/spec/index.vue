<script lang="ts" setup>
import { Cookies } from 'quasar'
import {useQuasar} from "quasar";
import {onMounted, reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
import mAdminUserAlbumCardComponent from "components/userAlbum/mAdminUserAlbumCardComponent.vue";

const $q = useQuasar();
const token = Cookies.get('token');
const router = useRouter();
const albumList = ref([]);
const total = ref(0);
const maxPage = ref(0);

const current=ref(1)

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    device: 2,
    title: '',
  },
  rules: {}
});
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  try {
    // 使用 get 方法发送 GET 请求
    const response = await api.get(`/admin/spec/page?`+tansParams(queryParams.value));
    const data = response.data;
    // 更新数据
    if (data.code === 200) {
      total.value = data.total;
      albumList.value = data.data;
      if (total.value > 0) {
        total.value = data.total;
        maxPage.value = total.value / queryParams.value.pageSize + 1;
      }
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
  //console.log("token:" + token);
  queryParams.value.pageNum = page;
}



function delAlbum(id: number,title:string) {
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
    const response = await api.get(`/admin/userAlbum/remove/${id}`, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      await getList(1);
    }
  });
}


function updateStatus(album: any, statusChoise: number) {
  const message = ref("");
  if (statusChoise == 1) {
    const count = album.numberPhotos + album.numberVideo;
    if (count == 0 || !count) {
      album.status = 2;
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
    // server/admin/userSettingVip/updateStatus.get.ts
    const response = await api.get(`/admin/userAlbum/updateStatus?id=${album.id}&status=${statusChoise}`, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code == 200) {
      await getList(1);
    }
  }).onCancel(() => {
    if (statusChoise == 1) {
      album.status = 2
    } else {
      album.status = 1
    }
    // //console.log('Cancel')
  });
}

function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl != undefined && imgUrl != '') {
    return `${$q.config.sourceWeb}${imgUrl}`; // Replace with your default image URL
  }
  return `/empty.png`;
}
onMounted(() => {
  getList(1); // 在组件挂载时获取列表
});

function editAlbum(id: number) {
  router.push("/admin/users/editAlbum?id=" + id.toString());
}

function addAlbum() {
  router.push("/admin/users/addAlbum");
}
</script>


<template>
  <div class="q-pa-xs q-gutter-xs">
    <q-toolbar >
      <q-btn flat round dense icon="light_mode" />
      <q-toolbar-title>
        图集({{total}})
      </q-toolbar-title>
      <q-btn color="primary" label="添加" @click="addAlbum"/>
    </q-toolbar>

    <div v-for="(album ,index) in albumList"
         :key="index">
      <m-admin-user-album-card-component :album="album"></m-admin-user-album-card-component>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="current"
          :max="maxPage"
          max-pages="6"
          direction-links
          @update:modelValue="getList(current)"

      />
    </div>

  </div>

</template>

<style scoped>

</style>
