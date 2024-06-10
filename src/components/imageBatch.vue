<template>
  <div>
  <div>
    <q-toggle
        :false-value="1"
        :label="`上传图片是否私有`"
        :true-value="2"
        color="green"
        v-model="isFree"
    />
  </div>
  <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card" :class="{ 'loading-state': uploadState.isUploading }">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isFree==1?"上传公共图片(公开可看)":"上传私有图片" }}</div>
        <button @click="openFilePicker">选择文件</button>
        <button @click="uploadFile">上传文件</button>
        上传进度：{{ totalUploaded }}/{{ totalSelected }}

      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="image/*" style="display: none" />
        <div style="width: 300px; height: 200px; overflow: auto; border: 1px solid #ccc">
          <div v-for="(file, index) in selectedFiles" :key="index" class="image-container">
            <img :src="file.preview" class="preview-image" />
            <div class="delete-badge" @click="removeFile(index)">×</div>
            <div>{{ filesStatus[index] }}
              <span v-if="filesErrors[index]" style="color: red;">{{ filesErrors[index] }}</span>
            </div>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </div>
  </div>
</template>

<script setup>
import {defineProps, reactive, ref} from 'vue';
import pica from 'pica';
import {Cookies, useQuasar} from 'quasar'
import { api } from 'boot/axios';
const $q = useQuasar();

const filesErrors = ref([]); // 记录每个文件的错误信息
const selectedFiles = ref([]);
const filesStatus = ref([]);
const isFree = ref(2);

const totalSelected = ref(0); // 已选择的图片数量
const totalUploaded = ref(0); // 已上传的图片数量

const token=Cookies.get("token");
//接受参数
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  onUploadComplete: Function // 定义一个方法类型的prop
});
const uploadState = reactive({
  isUploading: false, // 是否正在上传
  disableButtons: false // 是否禁用按钮
});
const openFilePicker = () => {
  document.querySelector('input[type="file"]').click();
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          file.preview = reader.result;
          selectedFiles.value.push(file);
          filesStatus.value.push('等待上传');
          // 更新已选择文件的总数
          totalSelected.value = selectedFiles.value.length;
        };
        reader.readAsDataURL(file);
      }
    }
  }

};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  filesStatus.value.splice(index, 1);
  // 更新已选择文件的总数
  totalSelected.value = selectedFiles.value.length;
};

async function uploadFile() {
  uploadState.isUploading = true;
  uploadState.disableButtons = true;

  const batchSize = 10;

  try {
    for (let i = 0; i < selectedFiles.value.length; i += batchSize) {
      const batchFiles = selectedFiles.value.slice(i, i + batchSize);
      const compressedFiles = await Promise.all(batchFiles.map(file => compressIfNeeded(file)));

      const formData = new FormData();
      formData.append('isFree', isFree.value.toString());
      compressedFiles.forEach(file => {
        formData.append('files', file);
      });

      const url = `${$q.config.baseUrl}${props.url}&isFree=${isFree.value}`;
      const response = await api.put(url);

      const data = await response.json();
      if (data.code === 200) {
        totalUploaded.value += compressedFiles.length;
        compressedFiles.forEach((_, index) => {
          filesStatus.value[i + index] = '上传成功';
        });
      } else {
        throw new Error(data.msg || '上传失败');
      }
    }
  } catch (error) {
    console.error('上传错误', error);
    selectedFiles.value.forEach((_, index) => {
      filesStatus.value[index] = '上传失败';
      filesErrors.value[index] = error.message || "未知错误";
    });
  } finally {
    uploadState.isUploading = false;
    uploadState.disableButtons = false;
  }

  if (props.onUploadComplete) {
    props.onUploadComplete();
  }
}


async function compressIfNeeded(file) {
  if (file.size > 500 * 1024) {
    return compressImage(file).catch(error => {
      console.error('Compression failed', error);
      return file;
    });
  } else {
    return file;
  }
}

// 压缩图片的函数
async function compressImage(file) {
  const picaInstance = pica();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;
        if (img.width > 1920) {
          targetWidth = 1920;
          targetHeight = (img.height / img.width) * 1920;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        picaInstance.resize(img, canvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        })
            .then(resizedCanvas => picaInstance.toBlob(resizedCanvas, 'image/jpeg', 0.8))
            .then(blob => {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            })
            .catch(error => {
              reject(error);
            });
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}
</script>

<style>
.image-container {
  position: relative;
  display: inline-block;
  margin: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
}

.delete-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-state {
  position: relative;
}
.loading-state::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8) url('/upload.gif') no-repeat center center;
  z-index: 1;
}
</style>
