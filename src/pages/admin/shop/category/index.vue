<script setup lang="ts">
import {reactive, ref, toRefs} from 'vue';
import { findAndModify, removeNodeById } from 'boot/TreeUtils';
import {api} from "boot/axios";
import {Dialog} from "quasar";
import {useRouter} from "vue-router";
import addCategoryComponenet from "components/product/addCategoryComponenet.vue";
import editCategoryComponenet from "components/product/editCategoryComponenet.vue";

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

const selected = ref(null);
function selectGoodService () {
  if (selected.value !== 'Good service') {
    selected.value = 'Good service'
  }
}
function unselectNode () {
  selected.value = null
}

function imageUrl(pic:string) {
  return `https://image.51x.uk/blackwhite${pic}`;
}
const queryData = reactive({
  addForm: {
    parentId: -1,
    status: 1,
    grade:0,
  },
  editForm: {
    parentId: -1,
    status: 1,
    grade:0,
    seq:1,
    categoryId:1,
    categoryName: "",
    pic: "",
  },
  rules: {},
});
const {addForm,editForm, rules} = toRefs(queryData);
const state = ref([]);

async function getList() {
  try {
    // 使用 get 方法发送 GET 请求
    const response = await api.get(`/admin/category/getTree`);
    const data = response.data;
    // 更新数据
    if (data.code === 200) {
      // total.value = data.data.total;
      state.value = data.data;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
}
getList();

const addDiaLog=ref(false);
const editDiaLog=ref(false);

async function onAddClick (id:number,grade:number) {
  addForm.value.parentId=id;
  addForm.value.grade=grade+1;
  addDiaLog.value=true;
}

async function onEditClick (cetory) {
  console.log(cetory);
  editForm.value.status= cetory.status;
  editForm.value.seq= cetory.seq;
  editForm.value.parentId=cetory.parentId;
  editForm.value.categoryId= cetory.categoryId;
  editForm.value.categoryName=  cetory.categoryName;
  editForm.value.pic=  cetory.avatar;
  editDiaLog.value=true;
}

function onDeleteClick (id:number) {
  Dialog.create({
    title: 'Delete',
    message: 'Are you sure you want to delete this item?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
    },
  }).onOk(() => {
    delCategory(id);
    // 确认删除操作
    console.log('User confirmed deletion');
  }).onCancel(() => {
    // 取消删除操作
    console.log('User canceled deletion');
  });
  console.log(`onDeleteClick ${id}`)
  // state.props=updatedArrayAfterRemove;
}

async function delCategory(id:number) {
  const response = await api.get(`/admin/category/del?id=${id}`);
  const data = response.data;
  // 更新数据
  if (data.code === 200) {
    // total.value = data.data.total;
    state.value = data.data;
    // const updatedArrayAfterRemove = removeNodeById(state.value, id);

  }else{
    Dialog.create({
      title: 'Error',
      message: `删除失败${data.msg}`,
      ok: {
        label: 'OK',
        color: 'primary',
      },
    })
  }
}
// function  addNewClick(){
//   let timestamp = Date.now();
//
//   const newPropObject = {
//     id: timestamp,
//     label: `Satisfied customers`,
//     avatar: 'https://example.com/new-avatar.png',
//     isOp: false,
//     children: [] // 根据需要初始化 children 数组
//   };
//
// // 将新对象添加到 state.props 数组的末尾
//   state.value.push(newPropObject);
//
// }

</script>

<template>
  <q-page>
    <q-toolbar class="bg-purple text-white">
      <q-btn flat round dense icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-separator dark inset />
    <div class="q-pa-md q-gutter-sm">
      <div>
        <div class="q-gutter-sm">
          <q-btn size="sm" color="primary"  label="添加一级分类" @click="onAddClick(0,0)"/>
<!--          <q-btn size="sm" color="primary" @click="selectGoodService" label="Select 'Good service'" />-->
<!--          <q-btn v-if="selected" size="sm" color="red" @click="unselectNode" label="Unselect node" />-->
        </div>
      </div>
      <q-tree
          :nodes="state"
          default-expand-all
          v-model:selected="selected"
          node-key="id"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center">
<!--            图标-->
            <img :src="imageUrl(prop.node.avatar)" class="q-mr-sm" style="width:50px;height:50px">
            <!--                      <q-icon :name="prop.node.icon || 'share'" color="orange" size="28px" class="q-mr-sm" />-->
            <div class="text-weight-bold text-primary">{{prop.node.label}}
<!--              <q-popup-edit v-model=" prop.node.label" auto-save v-slot="scope">-->
<!--                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />-->
<!--              </q-popup-edit>-->
            </div>
            <q-icon name="eco" color="orange" size="28px" class="q-mr-sm" />
            <q-fab
                v-model="prop.node.isOp"
                color="purple"
                icon="keyboard_arrow_right"
                direction="right"
                padding="xs"
            >
              <!--              <q-fab-action padding="5px"   color="orange" @click="onClick" icon="update" label="修改名称" />-->
              <q-fab-action padding="5px" color="primary" @click="onAddClick(prop.node.id,prop.node.grade)" icon="add" label="添加子类" />
              <q-fab-action padding="5px" color="primary" @click="onEditClick(prop.node)" icon="add" label="修改" />
              <q-fab-action padding="5px"   color="orange" @click="onDeleteClick(prop.node.id)" icon="delete" label="删除" />
            </q-fab>
          </div>
        </template>

      </q-tree>
    </div>
  </q-page>
  <q-dialog v-model="addDiaLog" persistent>
   <add-category-componenet :value="addForm"></add-category-componenet>
  </q-dialog>

  <q-dialog v-model="editDiaLog" persistent>
    <edit-category-componenet :value="editForm"></edit-category-componenet>
  </q-dialog>
</template>

<style scoped>

</style>
