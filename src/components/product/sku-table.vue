<template>
  <q-form>
    <q-table
        :rows="modelValue"
        :columns="columns"
        row-key="id"
        class="q-ma-md"
    >
      <template v-for="(leftTitle, index) in tableLeftTitles" :slot="leftTitle">
        <q-td :key="index" :props="props">
          {{ props.row.properties.split(';')[index].split(':')[1] }}
        </q-td>
      </template>
      <template v-slot:body-cell-sku图片="props">
        <q-td :props="props">
          <pic-upload v-model="props.row.pic" />
        </q-td>
      </template>
      <template v-slot:body-cell-商品名称="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.prodName"
              type="textarea"
              :disable="!props.row.status"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-销售价="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.price"
              type="number"
              :min="0.01"
              :max="1000000000"
              :disable="!props.row.status"
              :decimals="2"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-市场价="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.oriPrice"
              type="number"
              :min="0.01"
              :max="1000000000"
              :disable="!props.row.status"
              :decimals="2"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-库存="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.stocks"
              type="number"
              :min="0"
              :disable="!props.row.status"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-商品重量="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.weight"
              type="number"
              :min="0"
              :disable="!props.row.status"
              :decimals="2"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-商品体积="props">
        <q-td :props="props">
          <q-input
              v-model="props.row.volume"
              type="number"
              :min="0"
              :disable="!props.row.status"
              :decimals="2"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-操作="props">
        <q-td :props="props">
          <q-btn
              v-if="props.row.status"
              flat
              @click="changeSkuStatus(props.row)"
          >
            禁用
          </q-btn>
          <q-btn
              v-else
              flat
              @click="changeSkuStatus(props.row)"
          >
            启用
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { scoreProdStore } from '@/stores/prod.js'

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array
  },
  prodName: {
    default: '',
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const dbSpecs = ref([]) // 数据库中的规格
let initing = false

const tableLeftTitles = computed(() => {
  const res = []
  for (let i = 0; i < skuTags.value.length; i++) {
    const skuTag = skuTags.value[i]
    res.push(skuTag.tagName)
  }
  return res
})
const prod = scoreProdStore()
const skuTags = computed(() => prod.skuTags)

const columns = computed(() => {
  const cols = tableLeftTitles.value.map((title, index) => ({
    name: title,
    required: true,
    label: title,
    align: 'left',
    field: row => row.properties.split(';')[index].split(':')[1],
  }))
  cols.push(
      { name: 'sku图片', required: true, label: 'sku图片', align: 'left' },
      { name: '商品名称', required: true, label: '商品名称', align: 'left' },
      { name: '销售价', required: true, label: '销售价', align: 'left' },
      { name: '市场价', required: true, label: '市场价', align: 'left' },
      { name: '库存', required: true, label: '库存', align: 'left' },
      { name: '商品重量', required: true, label: '商品重量(kg)', align: 'left' },
      { name: '商品体积', required: true, label: '商品体积(m³)', align: 'left' },
      { name: '操作', required: true, label: '操作', align: 'left' }
  )
  return cols
})

watch(() => props.prodName, skuAddProdName)

onMounted(() => {
  // Fetch the spec list from API
  http({
    url: http.adornUrl('/prod/spec/list'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    dbSpecs.value = data
  })
})

const init = () => {
  initing = true
}
defineExpose({ init })

const changeSkuStatus = (row) => {
  row.status = row.status ? 0 : 1
}

const skuAddProdName = () => {
  if (initing) return
  const skuList = props.modelValue.map(sku => {
    if (!sku.properties) return sku
    const properties = sku.properties.split(';')
    sku.skuName = properties.map(p => p.split(':')[1]).join(' ')
    sku.prodName = `${props.prodName} ${sku.skuName}`
    return sku
  })
  emit('update:modelValue', skuList)
}
</script>

<style scoped>
.q-ma-md {
  margin: 1rem;
}
</style>
