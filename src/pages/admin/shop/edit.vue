<script lang="ts" setup>
import { useQuasar } from 'quasar';
import pica from "pica";
import { api } from "boot/axios";
import { compressAccurately } from 'image-conversion';
import { Cookies } from 'quasar'
import {useRouter} from "vue-router";
import {reactive, ref, toRefs} from "vue";
import {compressIfNeeded} from "boot/tools";
const token = Cookies.get('token');
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const queryData = reactive({
  addForm: {
    shopId: -1,
    shopName: "",
    shopType: 1,
    shopIndustry: 1,
    shopLogo:"",
    intro: '',
    shopNotice: '',
    mobile: '',
    tel: '',
  },
  rules: {}
});
const {addForm, rules} = toRefs(queryData);

const intro = ref("");
const mobile = ref("");

const imgUrl = ref("");
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
  addForm.value.shopName = 1;
  addForm.value.intro = "";
  imgUrl.value = addForm.value.shopLogo;
  addForm.value.shopType = 1;
  addForm.value.shopNotice = "";
  addForm.value.mobile = "";
  addForm.value.tel = "";

}

async function getDetail() {
  const response = await api.get(`/admin/shopDetail/info`);
  const data = response.data;
  if (data.code == 200) {
    addForm.value=data.data;
    imgUrl.value = data.data.shopLogo  ;
    previewImage.value =data.data.shopLogo;
  }
}
getDetail();
async function onSubmit() {
  addForm.value.shopLogo=imgUrl.value;
  const response = await api.post("/admin/shopDetail/update", JSON.stringify(addForm.value), {
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
      message: '修改成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {
      //刷新页面
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
      message: '修改失败'
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
    const response = await api.put( '/user/systemUser/upload',  formData);
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
        <div class="text-h6">创建店铺</div>
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
              v-model="addForm.shopName"
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
            <q-select v-model="addForm.shopType" :options="shopTypeList" emit-value hint="店铺类型" label="店铺类型"
                      map-options
                      outlined
                      @update:modelValue="updateCharge"/>
          </div>
          <q-input
              v-model="addForm.mobile"
              :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入手机号码，长度3-30']"
              filled
              label="手机 *"
              lazy-rules
              type="text"
          />
          <q-input
              v-model="addForm.tel"
              :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入联系方式，长度3-30']"
              filled
              label="联系方式 *"
              lazy-rules
              type="text"
          />
          <q-input
              v-model="addForm.intro"
              :rules="[ val => val && val.length >= 5 && val.length <= 200 || '请输入简介，长度5-300']"
              filled
              label="简介 *"
              type="textarea"
          />
          <q-input
              v-model="addForm.shopNotice"
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
