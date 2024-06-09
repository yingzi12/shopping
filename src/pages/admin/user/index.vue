<script lang="ts" setup>
import {ref} from "vue";
import {Cookies, useQuasar} from 'quasar'
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {compressIfNeeded} from "boot/tools";
const token = Cookies.get('token');
const id = Cookies.get('id');
const $q = useQuasar()
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const imgUrl = ref("/favicon.png");
const previewImage = ref(null);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const userHeadImageStr=ref("点击替换头像");
const user=ref({});
async function getDetail() {
  const response = await api.get(`/user/systemUser/getInfo`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    user.value = data.data;
  }
}
function triggerFileInput() {
  fileInput.value?.click();
}

async function handleImageUpload(event: Event) {
  try {
    userHeadImageStr.value="上传中....";
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      throw new Error("No file selected");
    }
    selectedImage.value = file;
    const compressedFile = await compressIfNeeded(file);
    const formData = new FormData();
    formData.append('file', compressedFile);
    const response = await api.put( '/user/systemUser/upload',  formData);
    const data = await response.data; // 确保使用 await 等待 json 解析完成
    if (data.code === 200) {
      previewImage.value = $q.config.sourceWeb + data.data;
      imgUrl.value = data.data;
      userHeadImageStr.value="点击替换头像";
    } else {
      userHeadImageStr.value="替换头像失败";
      $q.dialog({
        title: '错误',
        message: data.msg,
        ok: {
          push: true
        },
      }).onOk(async () => {
        console.log("ok");
      });
      // throw new Error('Image upload failed');
    }
  } catch (error) {
    notify('Error uploading image', 'red-5');
  }
}
function notify(message: string, color: string) {
  $q.notify({
    color: color,
    textColor: 'white',
    icon: color === 'red-5' ? 'warning' : 'cloud_done',
    message: message
  });
}
getDetail();
function getImageUrl(url) {
  if (url != null) {
    return `${$q.config.sourceWeb}${url}`;
  }
  return "/favicon.png";
}
const link = ref('detail')
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

</script>

<template>
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
    </q-card>
  </div>
  <div>
    <div class="q-pa-xs" >
      <q-list padding>
        <q-item v-ripple
                :active="link === 'detail'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/index"
                @click="link = 'detail'"
        >
          <q-item-section avatar>
            <q-icon name="account_circle"/>
          </q-item-section>

          <q-item-section>
            {{ $t(`user.personalInfo`) }}
          </q-item-section>
        </q-item>
        <q-item v-ripple
                :active="link === 'collection'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/collection"
                @click="link = 'collection'"
        >
          <q-item-section avatar>
            <q-icon name="star_rate"/>
          </q-item-section>

          <q-item-section>
            {{ $t(`user.myCollection`) }}
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item v-ripple
                :active="link === 'buy'"
                active-class="my-menu-link"
                clickable
                to="/order/list"
                @click="link = 'buy'"
        >
          <q-item-section avatar>
            <q-icon name="shopping_bag"/>
          </q-item-section>
          <q-item-section>
            {{ $t(`user.myOrder`) }}
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item v-ripple
                :active="link === 'withdraw'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/withdraw"
                @click="link = 'withdraw'"
        >
          <q-item-section avatar>
            <q-icon name="paid"/>
          </q-item-section>
          <q-item-section>
            {{ $t(`user.myWithdrawal`) }}
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item v-ripple
                :active="link === 'invite'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/invite"
                @click="link = 'invite'"
        >
          <q-item-section avatar>
            <q-icon name="send"/>
          </q-item-section>
          <q-item-section>
            {{ $t(`user.myInvitation`) }}
          </q-item-section>
        </q-item>
        <q-item v-ripple
                :active="link === 'exchange'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/exchange"
                @click="link = 'exchange'"
        >
          <q-item-section avatar>
            <q-icon name="currency_exchange"/>
          </q-item-section>
          <q-item-section>
            {{ $t(`user.myExchange`) }}
          </q-item-section>
        </q-item>
        <q-item v-ripple
                :active="link === 'password'"
                active-class="my-menu-link"
                clickable
                to="/admin/users/password"
                @click="link = 'password'"
        >
          <q-item-section avatar>
            <q-icon name="password"/>
          </q-item-section>

          <q-item-section>
            {{ $t(`user.resetPassword`) }}
          </q-item-section>
        </q-item>
        <q-item
            v-ripple
            :active="link === 'service'"
            active-class="my-menu-link"
            clickable
            to="/admin/users/service"
            @click="link = 'service'"
        >
          <q-item-section avatar>
            <q-icon name="mail_outline"/>
          </q-item-section>

          <q-item-section>
            {{ $t(`user.customerService`) }}
          </q-item-section>
        </q-item>
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

    </div>
  </div>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
