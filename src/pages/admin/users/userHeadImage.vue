<script lang="ts" setup>
import { Cookies } from 'quasar'

import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {api} from "boot/axios";
const $q = useQuasar();

const token = Cookies.get('token');
const user = Cookies.get('userInfo');
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const selectedImage = ref<File | null>(null);
const previewImage = ref((user == null || user.imgUrl == null) ? "/favicon.png" : user.imgUrl);

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.size <= 2 * 1024 * 1024) { // 2MB限制
      selectedImage.value = file;

      // 预览图片
      const reader = new FileReader();
      reader.onload = () => {
        previewImage.value = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('图片大小不能超过2MB');
    }
  }
};

const uploadImage = async () => {
  if (selectedImage.value) {
    // 创建一个FormData对象用于上传
    const formData = new FormData();
    formData.append('file', selectedImage.value);

    // 使用fetch或axios等方式将formData上传到后端
    // 例如：fetch('/upload', { method: 'POST', body: formData })
    try {
      const response = await api.put('/admin/systemUser/upload', formData);

      const data = await  response.data;
      if (data.code == 200) {
        useQuasar().dialog({
          title: '信息',
          message: '替换头像成功.'
        });
        router.push('/admin/users'); // Redirect to login page

      } else {
        useQuasar().dialog({
          title: '信息',
          message: '替换头像失败.'
        });
      }
      //console.log(data); // 处理响应
    } catch (error) {
      console.error('上传失败:', error);
    }
    // 在这里处理后端上传逻辑
    // 注意：这里只是示例，实际情况可能会根据您的后端和网络请求库而有所不同
  } else {
    alert('请选择一张图片');
  }
};


</script>

<template>
  <div>
    <input accept="image/*" type="file" @change="handleImageUpload"/>
  </div>
  <div>
    <q-avatar v-if="previewImage" font-size="52px" size="100px">
      <img :src="previewImage">
    </q-avatar>
  </div>
  <button @click="uploadImage">提交</button>

</template>


<style scoped>
/* 添加您的样式 */
</style>
