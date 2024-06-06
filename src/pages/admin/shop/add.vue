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
const girl = ref(null);
const intro = ref(null);
const payIntro = ref(null);
const tags = ref(null);
const imgUrl = ref(null);
const vipPrice = ref(0.0);
const price = ref(0.0);
const accept = ref(false);
const charge = ref(1);
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
  title.value = null;
  girl.value = null;
  intro.value = null;
  tags.value = null;
  imgUrl.value = null;
  charge.value = 1;
  accept.value = false;
  payIntro.value = null;

}

async function onSubmit() {
  const response = await api.post("/admin/usershop/add", JSON.stringify({
    title: title.value,
    intro: intro.value,
    payIntro: payIntro.value,
    girl: girl.value,
    imgUrl: imgUrl.value,
    tags: tags.value,
    charge: charge.value,
    price: price.value,
    vipPrice: vipPrice.value,
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
      router.push('/admin/users/shop'); // Redirect to login page
    }).onCancel(async () => {
      router.push('/admin/users/shop'); // Redirect to login page
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
      const response = await api.put( '/admin/usershop/upload',  formData);
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


const chargeList = [
  {
    label: '免费',
    value: 1
  },
  {
    label: 'VIP免费',
    value: 2
  },

  {
    label: 'VIP折扣',
    value: 3
  },
  {
    label: 'VIP独享',
    value: 4
  },
  {
    label: '统一价格',
    value: 5
  }
]
function updateCharge(charge: number) {
  price.value = 1.0;
  vipPrice.value = 1.0;
}



</script>

<template>

  <div class="q-pa-xs" style="max-width: 400px">

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
          v-model="title"
          :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入图集名称，长度2-100']"
          filled
          hint="输入图集名称"
          label="图集名称 *"
          lazy-rules
      />
      <q-input
          v-model="girl"
          :rules="[ val => val && val.length >= 2  && val.length <= 50 || '请输入模特，长度2-50']"
          filled
          hint="Name and surname"
          label="模特 *"
          lazy-rules
      />
      <q-input
          v-model="intro"
          :rules="[ val => val && val.length >= 5 && val.length <= 300 || '请输入简介，长度5-300']"
          filled
          label="简介 *"
          type="textarea"
      />
      <q-input v-if="charge !='1'"
          v-model="payIntro"
          filled
          label="付费说明(购买图集之后才能看到) *"
          type="textarea"
      />
      <!--      </div>-->
      <q-input
          v-model="tags"
          :rules="[ val => val && val.length >= 2 && val.length <= 100 || '请输入标签，长度3-30']"
          filled
          label="标签 *"
          lazy-rules
          type="text"
      />
      <div>
        <q-select v-model="charge" :options="chargeList" emit-value hint="付费方式" label="付费方式"
                  map-options
                  outlined
                  @update:modelValue="updateCharge"/>
        <q-input v-if="charge =='2' || charge =='3' || charge=='5'"
                 v-model="price"
                 :rules="[
          val => (val !== null && val !== '') || '请输入金额',
        val => (val >= 1.0 && val <= 1000) || '金额不能小与1.0大于1000'
                  ]"
                 fill-mask="0"
                 filled
                 hint="Mask: #.##"
                 input-class="text-right"
                 label="价格"
                 mask="#.##"
                 reverse-fill-mask
        />
        <q-input v-if="charge =='3' || charge=='4'"
                 v-model="vipPrice"
                 :rules="[
          val => (val !== null && val !== '') || '请输入VIP金额',
        val => (val >= 1.0 && val <= 1000) || '金额不能小与1.0不能大于1000'
                  ]"
                 fill-mask="0"
                 filled
                 hint="Mask: #.##"
                 input-class="text-right"
                 label="VIP价格"
                 mask="#.##"
                 reverse-fill-mask
        />
      </div>
      <div>
        <q-btn color="primary" label="Submit" type="submit"/>
        <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"/>
      </div>
    </q-form>
  </div>
</template>

<style scoped>

</style>
