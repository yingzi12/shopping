<template>
<!--  <div>-->
<!--    <div class="q-gutter-sm">-->
<!--      <q-btn v-if="selected" size="sm" color="red" @click="unselectNode" label="Unselect node" />-->
<!--    </div>-->
<!--  </div>-->
  <div>
    <q-tree
        ref="treeRef"
    :nodes="state"
    default-expand-all
    node-key="id"
        v-model:selected="selected"
    >
    <template v-slot:default-header="prop">
      <div class="row items-center">
        <img :src="imageUrl(prop.node.avatar)" class="q-mr-sm" style="width:50px;height:50px">
        <div class="text-weight-bold text-primary" @click="onNodeClick(prop.node)"><q-chip :color="selected === prop.node.id && (!prop.node.children || prop.node.children.length === 0 )?'red':'white'">{{prop.node.categoryName}}</q-chip></div>
      </div>
    </template>
    </q-tree>

<!--    <q-btn label="确认" @click="confirmSelection" class="q-mt-md" /> &lt;!&ndash; 添加确认按钮 &ndash;&gt;-->
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, defineProps} from "vue";
import {api} from "boot/axios";

const emit = defineEmits(['categorySelected']); // 定义自定义事件
const treeRef = ref(null); // 用于访问Vue实例的引用
const state = ref([]);

const selected = ref("");
//判断是否最后的节点
// const selectedOk = ref(false);
interface Category {
  id: string;
  categoryName: string;
  avatar: string;
}

const props = defineProps<{ value: Category }>();
if(props.value.id !=null && props.value.id !=undefined){
  selected.value = props.value.id;
}

async function getList() {
  try {
    const response = await api.get(`/admin/category/getTree`);
    if (response.data.code === 200) {
      state.value = response.data.data;
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
}
getList();

function imageUrl(pic:string) {
  return `https://image.51x.uk/blackwhite${pic}`;
}

let selectedNode = ref(null); // 用于存储选中的节点

// 节点点击事件处理器

// 修改后的节点点击事件处理器
//判断是否最后的节点
function onNodeClick(node) {
  console.log(selectedNode.value)
  // selectedOk.value=false;
  // 检查节点是否有子节点，如果没有则认为是叶子节点并记录选中
  if (!node.children || node.children.length === 0) {
    // selectedOk.value=true;
    selectedNode.value = node;
    emit('categorySelected', selectedNode.value);

  } else {
    // selectedOk.value=false;
    console.log('此节点不是叶子节点，不能被选择。');
  }
}
function unselectNode () {
  console.log(selected.value)
  selected.value = null
};
</script>
