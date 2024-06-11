<script lang="ts" setup>
import {Dialog, useQuasar} from 'quasar';
import { api } from "boot/axios";
import { Cookies } from 'quasar'
import {useRouter} from "vue-router";
import {computed, reactive, ref, toRefs} from "vue";
import {compressIfNeeded, compressIfNeededBatch} from "boot/tools";
import chooseComponent from "components/category/chooseComponent.vue";

const token = Cookies.get('token');
const $q = useQuasar();
const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const queryData = reactive({
  addForm: {
    prodName: "",
    price: 0.1,
    oriPrice: 0.1,
    totalStocks:0,
    categoryName: "",
    brief: '',
    pic: '',
    imgs: '',
    categoryId: 0,
    status: 1,
    isVirtual: 2,
    skuList: [{
      prodName:"",
      properties:"",
      oriPrice:0.0,
      price:0.0,
      stocks:0,
      partyCode:"",
      skuName:"默认",
      weight:0,
      isVirtual:0,
      faceValue:0.0,
      status:1,
    }],
    deliveryMode:{
      "hasShopDelivery": false,
      "hasUserPickUp": true
    },
    content: '',
    tagList: [1,2],
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
  //图片不能为空
  if(imgUrl==null||imgUrl.value==""){
    Dialog.create({
      title: '提示',
      message: '请上传图片',
      ok: {
        push: true
      },
    });
    return;
  }
  addForm.value.pic=imgUrl.value;
  addForm.value.imgs=imgUrl.value;
  addForm.value.content=editor.value;
  addForm.value.price =addForm.value.skuList[0].price;
  addForm.value.oriPrice =addForm.value.skuList[0].oriPrice;
  //分类不能为空
  if(addForm.value.categoryId ==null&&addForm.value.categoryId ==0){
    Dialog.create({
      title: '提示',
      message: '请选择分类',
      ok: {
        push: true
      },
    });
    return;
  }
  addForm.value.categoryId=category.value.id;
  addForm.value.categoryName=category.value.categoryName;

  //详细介绍不能少于30字
  if(editor.value.length<30){
    Dialog.create({
      title: '提示',
      message: '详细介绍不能少于30字',
      ok: {
        push: true
      },
    });
    return;
  }
  addForm.value.content=editor.value;
  for(var i=0;i<addForm.value.skuList.length;i++){
    addForm.value.totalStocks = Number(addForm.value.totalStocks) + Number(addForm.value.skuList[i].stocks);
    // addForm.value.totalStocks +=  addForm.value.skuList[i].stocks;
    addForm.value.skuList[i].isVirtual=addForm.value.isVirtual;
    addForm.value.skuList[i].prodName=addForm.value.prodName;

  }
  const response = await api.post("/admin/prod/add", JSON.stringify(addForm.value
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

      router.push('/admin/shop/product/index'); // Redirect to login page
    }).onCancel(async () => {
      //刷新页面
      router.push('/admin/shop/product/index'); // Redirect to login page
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
        previewImage.value =  data.data;
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

const editor= ref(
    '输入详细内容'
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

// /prod/spec/list
const specList = ref([]);
async function getSpecList() {
  try {
    const response = await api.get(`/admin/spec/list`);
    if (response.data.code === 200) {
      specList.value = response.data.data;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
}
getSpecList();
const categoryDialog=ref(false)
const category=ref({});
function handleCategorySelect(selectedCategory) {
  console.log('选中的分类是：', selectedCategory);
  category.value=selectedCategory;
  // 在这里处理选中的分类数据
}

function onClean(){
  category.value={};
}

const addTagInput = ref({
  propName: '',
  selectValues: [{ propValue: '' }]
})

const unUseTags = computed(() => {
  const res = []
  for (let i = 0; i < specList.value.length; i++) {
    const dbTag = specList.value[i]
    // const specIndex = addTagInput.value.value?.findIndex(tag => tag.tagName === dbTag.propName)
    if (dbTag.propName != addTagInput.value.propName ) {
      res.push(dbTag)
    }
  }
  return res;
})
function  onAddSKu(){
 addForm.value.skuList.push( {
      prodName:addForm.value.prodName,
      properties:"",
      oriPrice:0.0,
      price:0.0,
      stocks:0,
      partyCode:"",
      skuName:"默认",
      weight:0,
   status: 1,
      isVirtual:addForm.value.isVirtual,
      faceValue:0.0,
  });
}
function onDeleteSKu(index:number) {
  if(index!=0) {
    //删除指定未知的
    addForm.value.skuList.splice(index, 1);
  }
}
function getImageUrl(url:string) {
  return `https://image.51x.uk/blackwhite${url}`;
}
</script>

<template>
  <q-form
      class="q-gutter-md"
      @submit="onSubmit"
  >
  <div class="q-pa-xs">
    <q-card>
      <q-card-section>
        <div class="text-h6">创建</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>

          <div class="q-pa-md q-gutter-sm">
            <div>
              <q-img
                  :src="getImageUrl(previewImage)"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
              />
            </div>
            <input accept="image/*" type="file" @change="handleImageUpload"/>
          </div>
        <div class="q-gutter-sm">
         产品状态： <q-radio v-model="addForm.status" :val="1" label="上线" />
          <q-radio v-model="addForm.status" :val="2" label="下线" />
        </div>
        <div class="q-gutter-sm">
         是否虚拟产品： <q-radio v-model="addForm.isVirtual" :val="1" label="是" />
          <q-radio v-model="addForm.isVirtual" :val="2" label="不是" />
        </div>
          <div> <q-input
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
          /></div>
          <div>产品类型:<q-chip >{{category.categoryName}}</q-chip>
            <q-btn  flat @click="categoryDialog=true">
               选择
            </q-btn>
          </div>
          <div>
            <div>
              <div class="text-h6">商品价格 <q-btn flat @click="onAddSKu"> 添加</q-btn></div>
              <q-list  >
                <q-item v-for="(sku,index) in addForm.skuList" :key="index">
                  <q-item-section>
                    <q-input
                        v-model="sku.skuName"
                        fill-mask="0"
                        label="规格"
                        filled
                        input-class="text-left"
                        reverse-fill-mask
                    />
                  </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-input
                        v-model="sku.price"
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

                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-input
                        v-model="sku.oriPrice"
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

                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input
                      v-model="sku.stocks"
                      :rules="[
          val => (val !== null && val !== '') || '请输入库存',
        val => (val >= 1 && val <= 1000000) || '库存价格不能小与1大于1000000'
                  ]"
                      fill-mask="0"
                      type="number"
                      label="库存"
                      filled
                      input-class="text-left"
                      reverse-fill-mask
                  />
                </q-item-section>

                  <q-item-section>
                    <q-input
                        v-model="sku.partyCode"
                        fill-mask="0"
                        label="编码"
                        filled
                        input-class="text-left"
                        reverse-fill-mask
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-btn v-if="index !=0" flat @click="onDeleteSKu(index)">删除</q-btn>
                  </q-item-section>
                </q-item>

              </q-list>
            </div>

          </div>
        <div>
          <q-item-label>
            <q-input
                v-model="addForm.brief"
                :rules="[ val => val && val.length >= 5 && val.length <= 200 || '请输入简介，长度5-300']"
                filled
                label="简介 *"
                type="textarea"
            />

          </q-item-label>

        </div>

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

      </q-card-section>

    </q-card>
  </div>
  </q-form>

  <q-dialog v-model="categoryDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">选择分类</div>
      </q-card-section>
      <q-card-section>
        <choose-component  @categorySelected="handleCategorySelect" :value="category"></choose-component>

      </q-card-section>
       <q-card-section>
         已选择：{{category.categoryName}}
       </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup @click="onClean"/>
        <q-btn flat label="确认" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
