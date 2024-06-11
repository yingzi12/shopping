<template>
  <div class="mod-prod-sku-tag">
    <q-form>
      <q-btn @click="shopTagInput()">
        添加规格
      </q-btn>
      <div
          v-for="(tag, tagIndex) in skuTags"
          :key="tagIndex"
      >
        <span>{{ tag.tagName }}</span>
        <q-btn
            class="button-new-tag"
            flat
            icon="delete"
            @click="removeTag(tagIndex)"
        >
          删除
        </q-btn>
        <br>
        <q-chip
            v-for="(tagItem, tagItemIndex) in tag.tagItems"
            :key="tagItem.valueId"
            removable
            @remove="handleTagClose(tagIndex, tagItemIndex)"
        >
          {{ tagItem.propValue }}
        </q-chip>
        <q-input
            v-if="tagItemInputs[tagIndex] && tagItemInputs[tagIndex].visible"
            v-model="tagItemInputs[tagIndex].value"
            class="input-new-tag"
            @keyup.enter="handleInputConfirm(tagIndex)"
            @blur="handleInputConfirm(tagIndex)"
        />
        <q-btn
            v-else
            class="button-new-tag"
            flat
            @click="showTagInput(tagIndex)"
        >
          + 添加
        </q-btn>
      </div>
      <q-form>
          {{unUseTags}}
        {{addTagInput.propName}}

        <q-select v-if="isShowTagInput"
            clearable filled color="purple-12"
                  v-model="addTagInput.propName"
                  :options="unUseTags"
                  option-value="propName"
                  option-label="propName"
                  option-disable="inactive"
                  @update:model-value="handleTagClick"
        />
        {{dbTagValues}}
        {{addTagInput.selectValues}}

        <q-select
            v-if="isShowTagInput"
            filled
            v-model="addTagInput.selectValues"
            multiple
            :options="dbTagValues"
            option-value="propValue"
            option-label="propValue"
            option-disable="inactive"
            use-chips
            stack-label
            label="值"
        />


      </q-form>
      <q-btn
          v-show="isShowTagInput"
          type="primary"
          @click="addTag()"
      >
        确定
      </q-btn>
      <q-btn
          v-show="isShowTagInput"
          @click="hideTagInput()"
      >
        取消
      </q-btn>
    </q-form>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted ,defineEmits, defineProps} from 'vue'

import { useQuasar, Notify } from 'quasar'
import {scoreProdStore} from "boot/prod";
import {api} from "boot/axios";
const prod = scoreProdStore()

const props = defineProps({
  skuList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['change'])
const $q = useQuasar()
const isShowTagInput = ref(false)
const addTagInput = ref({
  propName: '',
  selectValues: []
})
const type = ref(0)
const tagItemName = ref('')
const tagItemInputs = ref([])
const dbTagValues = ref([]) // 根据选定的规格所查询出来的规格值
const dbTags = ref([]) // 数据库中的规格

let tagName = ''
let tagNameIndex = 0
// let maxValueId = 0 // 规格值id最大
// let maxPropId = 0 // 规格id 最大
let initing = false

const skuTags = computed({
  get () { return prod.skuTags },
  set (val) { prod.updateSkuTags(val) }
})

/**
 * 未使用的规格, 通过计算属性计算
 */
const unUseTags = computed(() => {
  const res = []
  for (let i = 0; i < dbTags.value.length; i++) {
    const dbTag = dbTags.value[i]
    const specIndex = skuTags.value?.findIndex(tag => tag.tagName === dbTag.propName)
    if (specIndex === -1) {
      res.push(dbTag)
    }
  }
  return res
})

const defalutSku = computed(() => {
  return prod.defalutSku
})

watch(() => skuTags.value,
    (val) => {
      if (initing) {
        initing = false
        return
      }
      let skuListArr = []
      if (type.value === 4) {
        // 删除规格值
        props.skuList?.forEach(sku => {
          const propertiesArray = sku.properties.split(';')
          if (tagItemName.value !== propertiesArray[tagNameIndex].split(':')[1]) {
            skuListArr.push(sku)
          }
        })
      } else if (type.value === 2) {
        // 添加规格值
        const properties = tagName + ':' + tagItemName.value
        // 增加或删除规格
        let tempSkuList = []
        val?.forEach(tag => {
          if (skuListArr.length === 0) {
            if (tagName === tag.tagName) {
              const sku = Object.assign({}, defalutSku.value)
              sku.properties = properties // 销售属性组合字符串
              skuListArr.push(sku)
            } else {
              tag.tagItems.forEach(tagItem => {
                const sku = Object.assign({}, defalutSku.value)
                sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
                skuListArr.push(sku)
              })
            }
            if (val.length === 1) {
              skuListArr = props.skuList.concat(skuListArr)
            }
          } else {
            tempSkuList = []
            if (tagName === tag.tagName) {
              skuListArr.forEach(sku => {
                if (sku.properties.indexOf(tagName) === -1) {
                  const newSku = Object.assign({}, sku)
                  newSku.properties = `${sku.properties};${properties}`
                  tempSkuList.push(newSku)
                }
              })
            } else {
              tag.tagItems.forEach(tagItem => {
                skuListArr.forEach(sku => {
                  if (sku.properties.indexOf(tag.tagName) === -1) {
                    const newSku = Object.assign({}, sku)
                    newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                    tempSkuList.push(newSku)
                  }
                })
              })
            }
            skuListArr = props.skuList.concat(tempSkuList)
          }
        })
      } else {
        // 增加或删除规格
        let tempSkuList = []
        val?.forEach(tag => {
          if (skuListArr.length === 0) {
            tag.tagItems.forEach(tagItem => {
              const sku = Object.assign({}, defalutSku.value)
              sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
              skuListArr.push(sku)
            })
          } else {
            tempSkuList = []
            tag.tagItems.forEach(tagItem => {
              skuListArr.forEach(sku => {
                const newSku = Object.assign({}, sku)
                newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                tempSkuList.push(newSku)
              })
            })
            skuListArr = tempSkuList
          }
        })
      }
      if (!skuListArr.length) {
        skuListArr.push(Object.assign({}, defalutSku.value))
      }
      // debugger
      emit('change', skuListArr)
    },
    {
      deep: true
    }
)


async function getSpecList() {
  try {
    const response = await api.get(`/admin/spec/list`);
    if (response.data.code === 200) {
      dbTags.value = response.data.data;
      // if (dbTags.value) {
      //   maxPropId = Math.max.apply(Math, dbTags.value.map(item => item.propId))
      // } else {
      //   maxPropId = 0
      // }
    }
  } catch (error) {
    console.error('获取数据失败：', error);
  }
}
getSpecList();
// onMounted(() => {
//   http({
//     url: http.adornUrl('/prod/spec/list'),
//     method: 'get',
//     params: http.adornParams()
//   })
//       .then(({ data }) => {
//         dbTags.value = data

//       })
//   http({
//     url: http.adornUrl('/prod/spec/listSpecMaxValueId'),
//     method: 'get',
//     params: http.adornParams()
//   })
//       .then(({ data }) => {
//         if (data) {
//           maxValueId = data
//         } else {
//           maxValueId = 0
//         }
//       })
// })

const init = (skuList) => {
  if (!skuList || !skuList.length) {
    skuTags.value = []
    emit('change', [Object.assign({}, defalutSku.value)])
    return
  }
  initing = true
  const skuTagsParam = []
  for (let i = 0; i < skuList.length; i++) {
    const sku = skuList[i]
    if (!sku.properties) break
    const propertiesArray = sku.properties.split(';')
    for (const j in propertiesArray) {
      const properties = propertiesArray[j].split(':')
      if (!skuTagsParam[j]) {
        skuTagsParam[j] = {
          tagName: properties[0],
          tagItems: []
        }
        tagItemInputs.value.push({ visible: false, value: '' })
      }
      const tagItemNameIndex = skuTagsParam[j].tagItems.findIndex((tagItemName) => tagItemName.propValue === properties[1])
      if (tagItemNameIndex === -1) {
        skuTagsParam[j].tagItems.push({
          propId: maxPropId++,
          valueId: maxValueId++,
          propValue: properties[1]
        })
      }
    }
  }
  skuTags.value = skuTagsParam
}

const shopTagInput = () => {
  addTagInput.value.propName = ''
  addTagInput.value.selectValues = []
  isShowTagInput.value = true
}

const handleTagClick = () => {
  for(var i=0;dbTags.value.length>i;i++){
    console.log(dbTags.value.propName+"  " +addTagInput.value.propName)
    if(dbTags.value.propName== addTagInput.value.propName){
      dbTagValues.value = dbTags.value.prodPropValues;
      return;
    }
  }
}

const addTag = () => {
  if (!addTagInput.value.propName || !addTagInput.value.selectValues.length) {
    Notify.create({ type: 'warning', message: '规格名及规格值不能为空' })
    return
  }
  const existTagIndex = skuTags.value.findIndex(tag => tag.tagName === addTagInput.value.propName)
  if (existTagIndex !== -1) {
    Notify.create({ type: 'warning', message: '已经存在同名规格' })
    return
  }
  const tagItems = []
  for (let i = 0; i < addTagInput.value.selectValues.length; i++) {
    tagItems.push({
      valueId: maxValueId++,
      propValue: addTagInput.value.selectValues[i]
    })
  }
  skuTags.value.push({
    tagName: addTagInput.value.propName,
    tagItems
  })
  hideTagInput()
}

const hideTagInput = () => {
  isShowTagInput.value = false
}

const showTagInput = (tagIndex) => {
  tagItemInputs.value[tagIndex].visible = true
}

const handleInputConfirm = (tagIndex) => {
  const inputValue = tagItemInputs.value[tagIndex].value
  if (!inputValue) {
    tagItemInputs.value[tagIndex].visible = false
    return
  }
  for (const tagItem of skuTags.value[tagIndex].tagItems) {
    if (tagItem.propValue === inputValue) {
      Notify.create({ type: 'warning', message: '规格值不能重复' })
      tagItemInputs.value[tagIndex].visible = false
      return
    }
  }
  type.value = 2
  skuTags.value[tagIndex].tagItems.push({
    valueId: maxValueId++,
    propValue: inputValue
  })
  tagItemInputs.value[tagIndex].visible = false
}

const handleTagClose = (tagIndex, tagItemIndex) => {
  type.value = 4
  tagItemName.value = skuTags.value[tagIndex].tagItems[tagItemIndex].propValue
  tagNameIndex = tagIndex
  skuTags.value[tagIndex].tagItems.splice(tagItemIndex, 1)
  if (!skuTags.value[tagIndex].tagItems.length) {
    skuTags.value.splice(tagIndex, 1)
  }
}

const removeTag = (tagIndex) => {
  type.value = 1
  skuTags.value.splice(tagIndex, 1)
}

init(props.skuList)
</script>
<style scoped>
.input-new-tag {
  margin-left: 8px;
}
.button-new-tag {
  margin-left: 8px;
  padding: 5px 5px 0 5px;
}
</style>

