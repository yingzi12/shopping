<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { api } from "boot/axios";
import { Cookies } from 'quasar'
import {useRouter} from "vue-router";
import {reactive, ref, toRefs} from "vue";
import {compressIfNeeded, compressIfNeededBatch} from "boot/tools";
const token = Cookies.get('token');
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const queryData = reactive({
  addForm: {
    shopId: -1,
    prodName: "",
    price: 0.1,
    oriPrice: 0.1,
    totalStocks:1,
    brief: '',
    pic: '',
    imgs: '',
    categoryId: 1,
    skuList: [{
      prodName:"",
      properties:"",
      oriPrice:0.0,
      price:0.0,
      stocks:0,
      partyCode:"",
      skuName:"默认",
      weight:"",
      isVirtual:0,
      faceValue:0.0,
    }],
    content: '',
    tagList: [],

  },
  rules: {}
});
const {addForm, rules} = toRefs(queryData);

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


async function onSubmit() {
  addForm.value.pic=imgUrl.value;
  addForm.value.content=editor.value;
  const response = await api.post("/admin/shopDetail/add", JSON.stringify(addForm.value
  ), {
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

const editor= ref(
    'After you define a new button,' +
    ' you have to make sure to put it in the toolbar too!'+
    "<img src=\"https://image.aiavr.uk/xinshijie/image/682/c8b08d26bb838c6a983b9345597a5b63/ddc451da81cb39db235a538c95160924aa183055.webp\"/>"
);

 function  saveWork () {
  $q.notify({
    message: 'Saved your text to local storage',
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done'
  })
};
// 文件选择处理
const fileInput = ref(null);

// 模拟上传图片的方法，现在接受一个FileList作为参数
async function simulateUpload(files: FileList) {
  console.log("-------------ddd2-------------------");
  console.log(files);
  // console.log(files);

  //
  const compressedFile = await compressIfNeededBatch(files);
  console.log("-------------ddd-------------------");
  console.log(compressedFile);
  const formData = new FormData();
  for (let i = 0; i < compressedFile.length; i++) {
    formData.append('files', compressedFile[i]);
  }

  // formData.append('files', files);
  const response = await api.put( '/admin/file/uploadBatch',  formData,{
    headers: {
      'Content-Type': 'multipart/form-data' // 实际上通常不需要手动设置，这里仅作示例
    }
  });
  const data = await response.data; // 确保使用 await 等待 json 解析完成

  if (data.code === 200) {
    for(let i = 0; i < data.data.length; i++){
      editor.value=editor.value+ "<img src=\""+ $q.config.sourceWeb + data.data[i]+"\"/>"
    }
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
}

// 选择图片的处理函数
async function uploadIt() {
  fileInput.value.click(); // 触发文件选择框
}

// 文件选择后的处理函数，现在处理多个文件
async function uploadSelectedFiles(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    try {
      console.log('开始上传多个文件');
      await simulateUpload(files);
      console.log('所有文件上传成功');
      $q.notify({
        message: '图片上传成功',
        color: 'positive',
        textColor: 'white',
        icon: 'cloud_upload',
      });
    } catch (error) {
      console.error('上传失败:', error);
      $q.notify({
        message: '图片上传失败，请重试',
        color: 'negative',
        textColor: 'white',
        icon: 'warning',
      });
    }
  }
}

const  modelSingle= ref('Apple');
const  modelMultiple = ref(['Facebook']);
const options = [
  {
    id: 'goog',
    desc: 'Google'
  },
  {
    id: 'fb',
    desc: 'Facebook'
  },
  {
    id: 'twt',
    desc: 'Twitter'
  },
  {
    id: 'app',
    desc: 'Apple'
  },
  {
    id: 'ora',
    desc: 'Oracle',
    inactive: true
  }
]

const  modelMultiple2 = ref(['Facebook']);
const options2= [
  {
    id: 'goog',
    desc: 'Google'
  },
  {
    id: 'fb',
    desc: 'Facebook'
  },
  {
    id: 'twt',
    desc: 'Twitter'
  },
  {
    id: 'app',
    desc: 'Apple'
  },
  {
    id: 'ora',
    desc: 'Oracle',
    inactive: true
  }
]
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
              v-model="addForm.prodName"
              :rules="[
    (val) => {
      const isLengthValid = val && val.length >= 2 && val.length <= 100;
      // 允许字母、数字、中文、空格、下划线和连字符
      const isCharValid = /^[a-zA-Z0-9\u4e00-\u9fa5\s_-]+$/.test(val);

      if (!isLengthValid) {
        return '请输入产品名称，长度2-100';
      }
      if (!isCharValid) {
        return '产品名称不能包含特殊符号';
      }
      return true;
    }
  ]"
              filled
              hint="输入产品名称"
              label="产品名称 *"
              lazy-rules
          />
          <div>
            <q-select v-model="addForm.categoryId" :options="shopTypeList" emit-value hint="产品类型" label="产品类型"
                      map-options
                      outlined
                      @update:modelValue="updateCharge"/>
          </div>

          <div>
            <q-select clearable filled color="purple-12"
                      v-model="modelMultiple"
                      :options="options"
                      option-value="id"
                      option-label="desc"
                      option-disable="inactive"
            />

            <div style="min-width: 250px; max-width: 300px">
              <q-badge color="secondary" class="q-mb-md">
                Model: {{ modelMultiple2 || '[]' }}
              </q-badge>

              <q-select
                  filled
                  v-model="modelMultiple2"
                  multiple
                  :options="options2"
                  option-value="id"
                  option-label="desc"
                  option-disable="inactive"
                  use-chips
                  stack-label
                  label="值"
              />
            </div>
          </div>
          <q-input
                   v-model="addForm.price"
                   :rules="[
          val => (val !== null && val !== '') || '请输入商品价格',
        val => (val >= 1.0 && val <= 1000) || '商品价格不能小与1.0大于1000'
                  ]"
                   fill-mask="0"
                   filled
                   hint="Mask: #.##"
                   input-class="text-left"
                   label="商品价格"
                   mask="#.##"
                   reverse-fill-mask
          />
          <q-input
              v-model="addForm.oriPrice"
              :rules="[
          val => (val !== null && val !== '') || '请输入商品原价',
        val => (val >= 1.0 && val <= 1000) || '商品价格不能小与1.0大于1000'
                  ]"
              fill-mask="0"
              filled
              hint="Mask: #.##"
              input-class="text-left"
              label="商品原价"
              mask="#.##"
              reverse-fill-mask
          />
          <q-input
              v-model="addForm.brief"
              :rules="[ val => val && val.length >= 5 && val.length <= 200 || '请输入简介，长度5-300']"
              filled
              label="简介 *"
              type="textarea"
          />
            <div class="">
              <div class="text-h6">详细介绍</div>
              <!-- 文件输入隐藏，用于选择文件 -->
              <input type="file" ref="fileInput" hidden @change="uploadSelectedFiles" accept="image/*" multiple>
              <q-editor
                  v-model="editor"
                  :dense="$q.screen.lt.md"
                  :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork
        },
        upload: {
          tip: 'Upload to cloud',
          icon: 'cloud_upload',
          label: 'Upload',
          handler: uploadIt
        }
      }"
                  :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['upload', 'save'],

        ['undo', 'redo'],
        ['viewsource']
      ]"
                  :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
              />
            </div>
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
