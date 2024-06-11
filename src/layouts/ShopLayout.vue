<script lang="ts" setup>
import {Cookies, useQuasar} from "quasar";
import {api} from "boot/axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const $q = useQuasar();
const token = Cookies.get("token");
// 如果没有 token，重定向到登录页面
// if (!token) {
//   router.push('/login');
// }

if(token == null || token == '' || token == undefined ) {

  $q.dialog({
    title: '通知',
    message: '请先登录，点击ok跳转登录.',
    ok: {
      push: true
    },
    cancel: {
      push: true
    },
  }).onOk(async () => {
    router.push('/login'); // Redirect to login page
  }).onCancel(async () => {
    router.push('/'); // Redirect to login page
  });
}
const drawer = ref(false);
const link = ref('detail')

const chargeList = ref([]);
const charge = ref(-1);
// 抽取添加默认项的逻辑到单独的函数
function addDefaultCreateShopOption() {
  chargeList.value.push({
    label: `创建店铺`,
    value: -1,
  });
}

async function getList() {
  const response = await api.get(`/admin/shopDetail/getUserShop`);
  const dataJson = response.data;

  if (dataJson.data && dataJson.code === 200) {
    const shops = dataJson.data;
    chargeList.value = shops.map((shop, index) => ({
      label: `${shop.shopName}`,
      value: shop.shopId,
    }));

    // 确保至少有一个选项，即使API返回为空
    // if (chargeList.value.length === 0) {
      addDefaultCreateShopOption();
    // }

    // 设置默认选中第一个店铺的ID，注意处理空数组的情况
    charge.value = chargeList.value.length > 0 ? chargeList.value[0].value : 0;
    if(charge.value != -1){
      setShopId(charge.value)
    }
  } else {
    console.error("API 返回错误码:", dataJson.code);
    // 如果API调用失败，仍然保证有默认选项
    if (chargeList.value.length === 0) {
      addDefaultCreateShopOption();
    }
  }
}
getList();
const logout = async () => {
  try {
    const response = await api.get(`/user/systemUser/logout`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("userInfo");
    router.push('/login'); // 假设登录页面的路由为 '/login'
  }catch (error){
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("userInfo");
    router.push('/login'); // 假设登录页面的路由为 '/login'
  }
};

function getImageUrl(url) {
  if (url != null) {
    return `${$q.config.sourceWeb}${url}`;
  }
  return "/favicon.png";
}
function updateCharge() {
   console.log(charge.value)
  if(charge.value==-1){
    router.push("/admin/shop/add")
  }
}
function handleSelectClick() {
  if(chargeList.value.length==0||chargeList.value.length ==1){
     router.push("/admin/shop/add")
  }
  // console.log('Select component was clicked');
  // 在这里添加你希望点击时执行的逻辑
};

async function setShopId(shopId:number){
  const response = await api.get(`/admin/shopDetail/setShopId?shopId=${shopId}`);

}
</script>

<template>
  <div class="q-pa-md" style="height: 100vh;">
    <q-layout class="shadow-2 rounded-borders" container view="lHh Lpr lff">
      <q-header class="bg-cyan-8" elevated>
        <q-toolbar>
          <q-btn dense flat icon="menu" round @click="drawer = !drawer"/>
        </q-toolbar>
      </q-header>

      <q-drawer
          v-model="drawer"
          :breakpoint="400"
          :width="200"
          show-if-above
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item v-ripple
                    :active="link === 'detail'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/index"
                    @click="link = 'detail'"
            >
              <q-item-section avatar>
                <q-icon name="account_circle"/>
              </q-item-section>

              <q-item-section>
                店铺信息
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-if="charge != -1" v-ripple
                    :active="link === 'invite'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/spec/index"
                    @click="link = 'invite'"
            >
              <q-item-section avatar>
                <q-icon name="send"/>
              </q-item-section>
              <q-item-section>
                商品规格
              </q-item-section>
            </q-item>

            <q-item v-if="charge != -1"  v-ripple
                    :active="link === 'buy'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/product"
                    @click="link = 'buy'"
            >
              <q-item-section avatar>
                <q-icon name="shopping_bag"/>
              </q-item-section>
              <q-item-section>
                产品管理
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item v-if="charge != -1" v-ripple
                    :active="link === 'shop'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/order"
                    @click="link = 'shop'"
            >
              <q-item-section avatar>
                <q-icon name="perm_media"/>
              </q-item-section>
              <q-item-section>
                订单管理
              </q-item-section>
            </q-item>
            <q-item v-if="charge != -1" v-ripple
                    :active="link === 'image'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/image"
                    @click="link = 'image'"
            >
              <q-item-section avatar>
                <q-icon name="image"/>
              </q-item-section>
              <q-item-section>
                图片管理
              </q-item-section>
            </q-item>
            <q-item v-if="charge != -1" v-ripple
                    :active="link === 'sell'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/category"
                    @click="link = 'sell'"
            >
              <q-item-section avatar>
                <q-icon name="view_headline"/>
              </q-item-section>
              <q-item-section>
                 分类管理
              </q-item-section>
            </q-item>
            <q-item v-if="charge != -1" v-ripple
                    :active="link === 'withdraw'"
                    active-class="my-menu-link"
                    clickable
                    to="/admin/shop/category"
                    @click="link = 'withdraw'"
            >
              <q-item-section avatar>
                <q-icon name="paid"/>
              </q-item-section>
              <q-item-section>
                评论管理
              </q-item-section>
            </q-item>
            <q-separator/>

            <q-item
                v-ripple
                :active="link === 'drafts'"
                active-class="my-menu-link"
                clickable
                @click="logout"
            >
              <q-item-section avatar>
                <q-icon name="exit_to_app"/>
              </q-item-section>

              <q-item-section>
                {{ $t(`user.logOut`) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <div>
              <q-btn to="/admin/users/index">个人中心</q-btn>
            </div>
<!--            <q-avatar  class="q-mb-sm" size="56px">-->
<!--              <img :src="getImageUrl(imgUrl)">-->
<!--            </q-avatar>-->
<!--            <div class="text-weight-bold">{{ nickname != null ? nickname : '待登录' }}</div>-->
            <div>
              <q-select v-model="charge" :options="chargeList" emit-value
                        map-options
                        outlined
                        @update:modelValue="updateCharge" @click="handleSelectClick"/>
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
