<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ !dataForm.id ? '新增' : '修改' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit" ref="dataFormRef">
          <q-input
              v-model="dataForm.title"
              label="标签名称"
              :rules="[val => val && val.length > 0 || '标签名称不能为空']"
              hint="请输入正确的标签名称"
          />
          <q-option-group
              v-model="dataForm.status"
              :options="[
              { label: '正常', value: 1 },
              { label: '禁用', value: 0 }
            ]"
              type="radio"
              label="状态"
          />
          <q-option-group
              v-model="dataForm.style"
              :options="[
              { label: '一列一个', value: 0 },
              { label: '一列两个', value: 1 },
              { label: '一列三个', value: 2 }
            ]"
              type="radio"
              label="列表样式"
          />
          <q-input
              v-model.number="dataForm.seq"
              type="number"
              min="0"
              label="排序"
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
import {ref, nextTick} from 'vue';
import {Notify} from 'quasar';

const emit = defineEmits(['refreshDataList']);
const visible = ref(false);
const dataForm = ref({
  id: null,
  title: null,
  shopId: null,
  status: 1,
  isDefault: null,
  prodCount: null,
  seq: null,
  style: 0
});

const init = (id) => {
  dataForm.value.id = id || 0;
  visible.value = true;
  nextTick(() => {
    if (dataForm.value.id) {
      // 模拟HTTP请求，实际开发中请替换为Quasar的axios请求或其他请求库
      // this.$axios.get(`/api/prodTag/info/${dataForm.value.id}`).then(response => {
      //   dataForm.value = response.data;
      // });
    }
  });
};
defineExpose({init});

const onSubmit = () => {
  // 注意Quasar表单验证需手动实现，这里简化处理
  if (dataForm.value.title) {
    // 模拟HTTP请求
    // this.$axios[dataForm.value.id ? 'put' : 'post']('/api/prodTag', dataForm.value).then(() => {
    //   Notify.create({
    //     message: '操作成功',
    //     type: 'positive',
    //     timeout: 1500,
    //     actions: [{ label: '关闭', color: 'white' }],
    //     onClose: () => {
    //       visible.value = false;
    //       emit('refreshDataList');
    //     }
    //   });
    // });
  } else {
    Notify.create({
      message: '标签名称不能为空',
      type: 'negative',
    });
  }
};
</script>
