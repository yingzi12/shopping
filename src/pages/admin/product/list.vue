<script lang="ts" setup>
import { Cookies } from 'quasar'
import {useQuasar} from "quasar";
import {onMounted, reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {tansParams} from "boot/tools";
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
    const response = await api.get(`/admin/userAlbum/list?`+tansParams(queryParams.value));
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

function editAlbum(id: number) {
  router.push("/users/editAlbum?id=" + id.toString());
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
    // server/admin/userSettingVip/updateStatus.get.ts
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
    const count = list.numberPhotos + list.numberVideo;
    if (count == 0 || !count) {
      list.status = 2;
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
    const response = await api.get(`/admin/userAlbum/updateStatus?id=${list.id}&status=${statusChoise}`, {
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
      list.status = 2
    } else {
      list.status = 1
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
</script>


<template>
  <div class="q-pa-md q-gutter-md">
    <router-link to="/users/addAlbum">
      <q-btn color="primary" label="添加"/>
    </router-link>
    <q-list bordered class="rounded-borders" style="max-width: 600px">
      <q-item-label header>我创建的图集（{{ total }}）</q-item-label>
      <div v-for="(album ,index) in albumList"
           :key="index">
        <q-item>
          <q-item-section>
            <q-img
                :src="getImageUrl(list.imgUrl)"
                spinner-color="white"
                style="height: 140px; max-width: 150px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">
              <span class="text-weight-medium">{{ list.title }}</span>
            </q-item-label>
            <q-item-label caption>
              {{ list.intro }}
            </q-item-label>
            <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              <router-link :to="'/users/addVideo?aid='+list.id+'&title='+list.title+'&status='+list.status">
                视频： {{ list.numberVideo }}
              </router-link>
            </q-item-label>
            <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              <router-link :to="'/users/addImage?aid='+list.id+'&status='+list.status+'&title='+list.title">
                照片： {{ list.numberPhotos }}
              </router-link>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span v-if="list.charge ==1 ">免费</span>
            <span v-if="list.charge ==2 ">VIP免费</span>
            <span v-if="list.charge ==3 ">VIP折扣</span>
            <span v-if="list.charge ==4 ">VIP独享</span>
            <span v-if="list.charge ==5 ">统一</span>
            <span v-if="list.charge ==2 || list.charge ==3 || list.charge ==5 ">价格:{{ list.price }}</span>
            <span v-if="list.charge ==3 || list.charge ==4 ">VIP价格：{{ list.vipPrice }}</span>
            <q-btn v-if="list.status ==1 " class="gt-xs" dense flat icon="done" round size="12px">已发布</q-btn>
            <q-btn v-if="list.status !=1 " class="gt-xs" dense flat icon="close" round size="12px">未发布</q-btn>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>收藏： {{ list.countCollection }}</q-item-label>
            <q-item-label caption>购买： {{ list.countBuy }}</q-item-label>
            <q-item-label caption>查看： {{ list.countSee }}</q-item-label>
            <q-item-label caption>模特： {{ list.girl }}
            </q-item-label>
            <q-item-label caption>{{ list.createTime }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="list.status"
                      :false-value="2"
                      :true-value="1" label="发布" @update:modelValue="updateStatus(list,list.status)"/>
            <q-btn class="gt-xs" dense flat icon="edit" round size="12px" @click="editAlbum(list.id)">修改</q-btn>
            <q-btn class="gt-xs" v-if="list.status ==2" dense flat icon="delete" round size="12px" @click="delAlbum(list.id,list.title)">删除</q-btn>
          </q-item-section>
        </q-item>

        <q-separator spaced/>
      </div>
    </q-list>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
          v-model="current"
          :max="maxPage"
          direction-links
          @update:modelValue="getList(current)"

      />
    </div>

  </div>

</template>

<style scoped>

</style>
