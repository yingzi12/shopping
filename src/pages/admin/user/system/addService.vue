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
const title = ref(null);
const explanation = ref(null);
const imgUrl = ref(null);
const wordType = ref(1);
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


async function onSubmit() {
  const response = await api.post("/user/workOrder/add", JSON.stringify({
    title: title.value,
    wordType: wordType.value,
    explanation: explanation.value,
    imgUrl: imgUrl.value,
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
      router.push('/user/users/service'); // Redirect to login page
    }).onCancel(async () => {
      router.push('/user/users/service'); // Redirect to login page
    });
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '创建成功'
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
      const response = await api.put( '/user/usershop/upload',  formData);
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
const wordTypeList = [
  {
    label: 'BUG',
    value: 1
  },
  {
    label: '投诉',
    value: 2
  },
  {
    label: '意见/建议',
    value: 3
  },
  {
    label: '其他',
    value: 4
  },
]




</script>

<template>

  <div class="q-pa-xs" style="max-width: 400px">

    <q-form
        class="q-gutter-md"
        @submit="onSubmit"
    >
      <q-input
          v-model="title"
          :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入标题，长度2-100']"
          filled
          hint=""
          label="标题 *"
          lazy-rules
      />
      <q-select v-model="wordType" :options="wordTypeList" emit-value hint="类型" label="类型"
                map-options
                outlined
      />
      <q-input
          v-model="explanation"
          :rules="[ val => val && val.length >= 5 && val.length <= 300 || '请输入简介，长度5-300']"
          filled
          label="说明 *"
          type="textarea"
      />
      <div>
        <q-btn color="primary" label="Submit" type="submit"/>
      </div>
    </q-form>
  </div>
</template>

<style scoped>

</style>
