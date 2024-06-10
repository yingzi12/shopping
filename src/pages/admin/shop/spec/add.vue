<script setup lang="ts">
import {useRouter} from "vue-router";
import {reactive, toRefs} from "vue";
import {api} from "boot/axios";
import {Dialog} from "quasar";

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数

interface ProdProp {
  propId: string;
  propName: string;
  rule: number;
  shopId: string;
  prodPropValues:Array<ProdPropValue>;
}

interface ProdPropValue {
  propValue: string;
}
const queryData = reactive({
  // 正确地初始化addForm为一个实现了ProdProp接口的对象
  addForm: {
    propId: '',
    propName: '',
    rule: 1,
    shopId: '',
    prodPropValues: [{ propValue: '' }],
  },
  rules: {},
});
const {addForm, rules} = toRefs(queryData);
//1:销售属性(规格); 2:参数属性;
const ruleList = [
  {
    label: '销售属性(规格)',
    value: 1
  },
  // {
  //   label: '参数属性',
  //   value: 2
  // },
]
async function onSubmit() {
  if(addForm.value.prodPropValues.length==0){
    Dialog.create({
      title: '通知',
      color: 'red-4',
      message: '请添加属性值'
    });
    return;
  }
  for(let i=0;i<addForm.value.prodPropValues.length;i++){
    if(addForm.value.prodPropValues[i].propValue==''){
      Dialog.create({
        title: '通知',
        color: 'red-4',
        message: '请添加属性值'
      });
      return;
    }
  }
  const response = await api.post("/admin/spec/add", JSON.stringify(addForm.value));
  const data = response.data;
  //console.log(data)
  if (data.code == 200) {
    Dialog.create({
      title: '通知',
      message: '添加成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {

      router.push('/admin/shop/spec/index'); // Redirect to login page
    }).onCancel(async () => {
      //刷新页面
      router.push('/admin/shop/spec/index'); // Redirect to login page
    });
  } else {
    Dialog.create({
        title: '通知',
        color: 'red-4',
      message: '创建失败'
    });
  }
}

</script>

<template>
  <div class="q-pa-xs">
    <q-card>
      <q-card-section>
        <div class="text-h6">添加</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-form
            class="q-gutter-md"
            @submit="onSubmit"
        >
          <q-input
              v-model="addForm.propName"
              :rules="[
    (val) => {
      const isLengthValid = val && val.length >= 2 && val.length <= 100;
      // 允许字母、数字、中文、空格、下划线和连字符
      const isCharValid = /^[a-zA-Z0-9\u4e00-\u9fa5\s_-]+$/.test(val);

      if (!isLengthValid) {
        return '请输入规格名称，长度2-100';
      }
      if (!isCharValid) {
        return '规格名称不能包含特殊符号';
      }

      return true;
    }
  ]"
              filled
              hint="输入规格名称"
              label="规格名称 *"
              lazy-rules
          />
          <div>
            <q-select v-model="addForm.rule" :options="ruleList" emit-value hint="规格类型" label="规格类型"
                      map-options
                      outlined
                    />
          </div>
          <div>
            <div><q-btn color="primary" label="添加属性值" @click="addForm.prodPropValues.push({ propValue: ''})"/></div>
            <div>
              <div v-for="(item, index) in addForm.prodPropValues" :key="index">
                <div class="row">
                  <div class="col-6">
                    <q-input
                      v-model="item.propValue"
                      :rules="[
                      (val) => {
                        const isLengthValid = val && val.length >= 2 && val.length <= 100;
                        // 允许字母、数字、中文、空格、下划线和连字符
                        const isCharValid = /^[a-zA-Z0-9\u4e00-\u9fa5\s_-]+$/.test(val);
                        if (!isLengthValid) {

                        }
                        if (!isCharValid) {
                        }
                        return true;
                       }
                       ]"
                      filled
                      hint="输入属性值"
                      label="属性值 *"
                      lazy-rules
                  />
                  </div>
                  <div class="col-6">                <q-btn color="primary" label="删除" @click="addForm.prodPropValues.splice(index, 1)"/>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div>
            <q-btn color="primary" label="Submit" type="submit"/>
          </div>
        </q-form>

      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>

</style>
