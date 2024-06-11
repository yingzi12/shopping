<script lang="ts" setup>
import { useQuasar } from 'quasar';
import pica from "pica";
import { api } from "boot/axios";
import { compressAccurately } from 'image-conversion';
import { Cookies } from 'quasar'
import {useRouter} from "vue-router";
import {ref} from "vue";
import {compressIfNeeded} from "boot/tools";
const token = Cookies.get('token');
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const shopName = ref("");
const shopType = ref(1);
const shopIndustry = ref(1);

const intro = ref("");
const shopNotice = ref("");
const mobile = ref("");
const tel = ref("");

const imgUrl = ref(null);
const accept = ref(false);
const previewImage = ref("/favicon.png");
const selectedImage = ref<File | null>(null);

function notify(message: string, color: string) {
  $q.notify({
    color: color,
    textColor: 'white',
    icon: color === 'red-5' ? 'warning' : 'cloud_done',
    message: message
  });
}

function onReset() {
  shopName.value = "";
  intro.value = "";
  imgUrl.value = null;
  shopType.value = 1;
  accept.value = false;
  shopNotice.value = "";
  mobile.value = "";
  tel.value = "";

}

async function onSubmit() {
  const response = await api.post("/admin/shopDetail/add", JSON.stringify({
    shopName: shopName.value,
    shopType: shopType.value,
    intro: intro.value,
    shopNotice: shopNotice.value,
    shopLogo: imgUrl.value,
    mobile: mobile.value,
    tel: tel.value,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  //console.log(data)
  if (data.code == 200) {
    $q.dialog({
      title: '通知',
      message: '添加成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {

      router.push('/admin/shop/index'); // Redirect to login page
    }).onCancel(async () => {
      //刷新页面
      router.push('/admin/shop/index'); // Redirect to login page
    });
  } else {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '创建失败'
    });
  }
}

async function handleImageUpload(event: Event) {
    try {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }
      selectedImage.value = file;
      const compressedFile = await compressIfNeeded(file);
      const formData = new FormData();
      formData.append('file', compressedFile);
      const response = await api.put( '/admin/file/upload',  formData);
      const data = await response.data; // 确保使用 await 等待 json 解析完成
      if (data.code === 200) {
        previewImage.value = $q.config.sourceWeb + data.data;
        imgUrl.value = data.data;
      } else {
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


const shopTypeList = [
  {
    label: '个人',
    value: 1
  },
  {
    label: '个体户',
    value: 2
  },
  {
    label: '企业',
    value: 3
  }
]


function updateCharge() {

}



</script>

<template>

  <div class="q-pa-xs">
    <q-card>
      <q-card-section>
        <div class="text-h6">创建</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-form
            class="q-gutter-md"
            @reset="onReset"
            @submit="onSubmit"
        >
          <div class="q-pa-md q-gutter-sm">
            <div>
              <q-img
                  :src="previewImage"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
              />
            </div>
            <input accept="image/*" type="file" @change="handleImageUpload"/>
          </div>
          <q-input
              v-model="shopName"
              :rules="[
    (val) => {
      const isLengthValid = val && val.length >= 2 && val.length <= 100;
      // 允许字母、数字、中文、空格、下划线和连字符
      const isCharValid = /^[a-zA-Z0-9\u4e00-\u9fa5\s_-]+$/.test(val);

      if (!isLengthValid) {
        return '请输入店铺名称，长度2-100';
      }
      if (!isCharValid) {
        return '店铺名称不能包含特殊符号';
      }

      return true;
    }
  ]"
              filled
              hint="输入店铺名称"
              label="店铺名称 *"
              lazy-rules
          />
          <div>
            <q-select v-model="shopType" :options="shopTypeList" emit-value hint="店铺类型" label="店铺类型"
                      map-options
                      outlined
                      @update:modelValue="updateCharge"/>
          </div>
          <q-input
              v-model="mobile"
              :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入手机号码，长度3-30']"
              filled
              label="手机 *"
              lazy-rules
              type="text"
          />
          <q-input
            v-model="tel"
            :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入联系方式，长度3-30']"
            filled
            label="联系方式 *"
            lazy-rules
            type="text"
        />
          <q-input
              v-model="intro"
              :rules="[ val => val && val.length >= 5 && val.length <= 200 || '请输入简介，长度5-300']"
              filled
              label="简介 *"
              type="textarea"
          />
          <q-input
              v-model="shopNotice"
              :rules="[ val => val && val.length >= 0 && val.length <= 50 || '请输入公告，长度5-300']"
              filled
              label="公告 *"
              type="textarea"
          />
          <div>
            <q-btn color="primary" label="Submit" type="submit"/>
            <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
          </div>
        </q-form>

      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>

</style>
