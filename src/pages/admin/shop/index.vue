<script lang="ts" setup>
import { Cookies } from 'quasar'
import {useQuasar} from "quasar";
import {onMounted, reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
import mAdminUserShopCardComponent from "components/shop/mAdminUserShopCardComponent.vue";

const $q = useQuasar();
const token = Cookies.get('token');
const router = useRouter();
const shopList = ref([]);
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
    const response = await api.get(`/admin/usershop/list?`+tansParams(queryParams.value));
    const data = response.data;
    // 更新数据
    if (data.code === 200) {
      total.value = data.total;
      shopList.value = data.data;
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



function delshop(id: number,title:string) {
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
    const response = await api.get(`/admin/usershop/remove/${id}`, {
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
    // server/admin/userSettingVip/updateStatus.get.ts
    const response = await api.get(`/admin/usershop/updateStatus?id=${shop.id}&status=${statusChoise}`, {
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
      shop.status = 2
    } else {
      shop.status = 1
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

function editshop(id: number) {
  router.push("/admin/users/editshop?id=" + id.toString());
}

function addshop() {
  router.push("/admin/users/addshop");
}
</script>


<template>
  <div class="q-pa-xs q-gutter-xs">
    <q-toolbar >
      <q-btn flat round dense icon="light_mode" />
      <q-toolbar-title>
        店铺({{total}})
      </q-toolbar-title>
      <q-btn color="primary" label="添加" @click="addshop"/>
    </q-toolbar>

      <div v-for="(shop ,index) in shopList"
           :key="index">
          <m-admin-user-shop-card-component :shop="shop"></m-admin-user-shop-card-component>
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
