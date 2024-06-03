<script lang="ts" setup>
import {ref} from "vue";
import {Cookies, useQuasar} from 'quasar'
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {compressIfNeeded} from "boot/tools";
import PayaplCard from "pages/system/paypalCard.vue";

const token = Cookies.get('token');
const id = Cookies.get('id');
const $q = useQuasar()
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const user = ref({  });
const imgUrl = ref("/favicon.png");
const vip = ref(0);
const previewImage = ref(null);
const vipExpirationTime = ref(null);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const userHeadImageStr=ref("点击替换头像");

async function getDetail() {
  const response = await api.get(`/admin/systemUser/getInfo`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    user.value=data.data;

    imgUrl.value = data.data.imgUrl  ;
    if(imgUrl!=null ) {
      previewImage.value = $q.config.sourceWeb + data.data.imgUrl;
    }

    vip.value = data.data.vip;
    vipExpirationTime.value = data.data.vipExpirationTime;
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
      throw new Error("---1-- No file selected");
    }
    selectedImage.value = file;
    const compressedFile = await compressIfNeeded(file);
    if (!compressedFile) {
      throw new Error("---2-- No file selected");
    }
    const formData = new FormData();
    console.log("压缩文件:", compressedFile);
    formData.append('file', compressedFile);
    const response = await api.put( '/admin/systemUser/upload',  formData);
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

const  money=ref(0.0);
const paypalDialog = ref(false);

function openPayPalDialog (){
  if(money.value<1){
    $q.dialog({
      title: '通知',
      message: '金额不能少于1',
    })
    return;
  }
  //console.log("------------openPayPalDialog---------------------------")
  if(token !== null && token !== '' && token !== undefined ) {
    paypalDialog.value = true;
  }else {
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
      // router.push('/users/album'); // Redirect to login page
    });
  }
};

</script>

<template>
  <div>
    <router-link to="/users/userEdit">
      <q-btn color="primary" label="编辑个人信息"/>
    </router-link>
  </div>

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card bordered class="my-card" flat>
      <q-item>
        <q-item-section @click="triggerFileInput">
          <q-avatar font-size="52px" size="100px">
            <img
                :src="previewImage || `/default.png`" @error.once="e => { e.target.src = `/default.png` }"
            >
          </q-avatar>
          <input type="file" ref="fileInput" @change="handleImageUpload" hidden>
          <p class="text-caption">{{ userHeadImageStr }}</p>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ user.nickname != null ? user.nickname : '待登录' }}
            ({{ name != null ? name : '待登录' }})
          </q-item-label>
          <q-item-label v-if="user.id" caption>
            ID:{{ user.id }}
          </q-item-label>
          <q-item-label v-if="user.email" caption>
            {{ user.email }}
            <q-icon v-if="user.isEmail ==2 " name="warning" style="color: red"/>
          </q-item-label>
          <q-item-label v-if="user.isEmail ==2 " caption>
            （点击发送邮箱验证码）
          </q-item-label>
        </q-item-section>

      </q-item>
      <q-card-section>
        <q-item-label caption>
          余额：{{user.balance}}
        </q-item-label>
        <q-item-label caption>

          <q-input
            v-model.number="money"
            type="number"
            filled
            style="max-width: 200px"
          /><q-btn icon="payments" @click="openPayPalDialog()">充值</q-btn>
        </q-item-label>
      </q-card-section>
      <q-separator/>

      <q-card-section  horizontal>
        <div class="text-body2" style="padding: 10px">
          {{ user.intro }}
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-actions>
        <q-btn color="red-8" flat icon="favorite" round>{{user.countAttention }}</q-btn>
        <q-btn color="red-8" flat icon="thumb_up" round>{{user.countLike }}</q-btn>
        <q-btn color="red-8" flat icon="visibility" round>{{user.countSee }}</q-btn>
      </q-card-actions>
    </q-card>


  </div>
  <q-dialog v-model="paypalDialog">
    <payapl-card :amount="money" :productId="user.id" :kind="5" intro="充值余额" productName="充值余额" url='/admin/index'/>
  </q-dialog>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
