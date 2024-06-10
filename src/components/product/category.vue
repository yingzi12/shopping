<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ !dataForm.currentId ? '新增' : '修改' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit" ref="dataFormRef">
          <q-file
              v-if="dataForm.type !== 2"
              v-model="dataForm.pic"
              label="分类图片"
              @input="checkPic"
          />
          <q-input
              v-if="dataForm.type !== 2"
              v-model="dataForm.categoryName"
              label="分类名称"
              :rules="[{required: true, message: '分类名称不能为空'}]"
          />
          <q-cascader
              label="上级分类"
              v-model="selectedCategory"
              :options="categoryList"
              :props="categoryTreeProps"
              expand-trigger="hover"
              change-on-select
              clearable
              @input="handleChange"
          />
          <q-input
              v-if="dataForm.type !== 2"
              v-model.number="dataForm.seq"
              type="number"
              label="排序号"
              min="0"
          />
          <q-option-group
              label="状态"
              v-model="dataForm.status"
              :options="[
              {label: '下线', value: 0},
              {label: '正常', value: 1}
            ]"
              type="radio"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" @click="visible = false" />
        <q-btn flat label="确定" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { Notify } from 'quasar';

const emit = defineEmits(['refreshDataList']);
const visible = ref(false);
const dataForm = reactive({
  currentId: 0,
  type: 0, // 假设默认值，根据实际情况调整
  categoryName: '',
  seq: 1,
  status: 1,
  parentId: 0,
  pic: ''
});
const categoryList = ref([]);
const selectedCategory = ref([]);
const categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'categoryName',
  children: 'children'
});
const isSubmit = ref(false);

const init = (id) => {
  dataForm.currentId = id || 0;
  http.get('/prod/category/listCategory') // 请根据实际API路径调整
      .then(({ data }) => {
        categoryList.value = data.map(node => ({ ...node, children: [] }));
        // 手动构建树结构，根据实际返回的数据结构调整
        // 示例未包含真实数据转换逻辑，需根据实际返回的层级数据构建树
      })
      .then(() => {
        visible.value = true;
        nextTick(() => {
          selectedCategory.value = [];
        });
        if (dataForm.currentId) {
          http.get(`/prod/category/info/${dataForm.currentId}`) // 请根据实际API路径调整
              .then(({ data }) => {
                Object.assign(dataForm, data);
                selectedCategory.value = data.parentId ? [data.parentId] : []; // 假设只选择一级父节点ID
              });
        }
      });
};
defineExpose({ init });

const handleChange = (val) => {
  dataForm.parentId = val[val.length - 1];
};

const onSubmit = () => {
  if (isSubmit.value) {
    return;
  }
  isSubmit.value = true;

  // 根据业务逻辑调整字段处理
  const formData = {
    ...dataForm,
    // 需要根据grade的计算逻辑调整
    // grade: // 计算grade的逻辑
  };

  http[dataForm.currentId ? 'put' : 'post']('/prod/category', formData) // 请根据实际API路径调整
      .then(() => {
        Notify.create({
          message: '操作成功',
          type: 'positive',
          timeout: 1000,
          actions: [{ label: '关闭', color: 'white' }],
          onClose: () => {
            isSubmit.value = false;
            visible.value = false;
            emit('refreshDataList');
          }
        });
      });
};

// 注意：Quasar 中没有直接的“重校验”API，一般情况下表单验证会在提交时自动触发。
// 若要模拟类似行为，可考虑在特定逻辑处直接调用表单验证相关的逻辑。
</script>
