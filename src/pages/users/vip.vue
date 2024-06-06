<script lang="ts" setup>
import {useRoute} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {reactive, ref, toRefs} from "vue";
import {tansParams} from "boot/tools";
import {api} from "boot/axios";
import mUserHeadCard from "components/user/mUserHeadComponent.vue"
import mRadomUserCard from "components/user/mRandomComponent.vue"

import PayaplCard from "pages/system/payment.vue";
const token = Cookies.get("token");
const route = useRoute();
const $q = useQuasar();

const userId = ref(route.query.userId);
const current = ref(1)
const slide = ref('first')
const nickname = ref('')
const intro = ref('')
const imgUrl = ref(null);
const countSee = ref(0);
const countLike = ref(0);
const countAttention = ref(0);

const productName = ref(null);
const productId = ref(null);
const productAmount = ref(null);
const productIntro = ref(null);

const vipList = ref([]);
const total = ref(0);

const queryData = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    userId: userId.value,
  },
  rules: {}
});
const image = ref("")
const {queryParams, form, rules} = toRefs(queryData);

async function getList(page: number) {
  // 滚动到顶部
  current.value = page
  // queryParams.value.title = title.value;
  queryParams.value.pageNum = page;
  queryParams.value.userId = userId.value;
  //server/userSettingVip/list.get.ts
  const response = await api.get('/userSettingVip/list?' + tansParams(queryParams.value))
  const data = response.data;
  //console.log(data.code)
  if (data.code == 200) {
    total.value = data.total
    vipList.value = data.data
  }
}

getList(1)
const paypalDialog = ref(false);
function openPayPalDialog (vip:any){
  //console.log("------------openPayPalDialog---------------------------")
  paypalDialog.value = true;
  productId.value=vip.id;
  productName.value=vip.title;
  productIntro.value=vip.intro;
  productAmount.value=vip.price;

};
const user=ref({});
async function getDetail() {
  const response = await api.get(`/systemUser/info?userId=${userId.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
     user.value=data.data;
  }
}

getDetail();

function getImageUrl(url) {
  console.log(url)
  if (url != null) {
    return `${$q.config.sourceWeb}${url}`;
  }
  return "/favicon.png";
}

const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/systemUser/random')
  const data = response.data;
  if (data.code == 200) {
    randomList.value = data.data
  }
}

getRandom();
</script>

<template>
  <m-user-head-card :user-id="userId"></m-user-head-card>

  <div v-if="vipList.length ==0">
     <div class="flex-center">
       <p class="text-h5 content-center bg-yellow">用户未设置VIP</p>
     </div>
  </div>
  <div>
    <q-toolbar >
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title>
        VIP({{total}})
      </q-toolbar-title>
<!--      <q-btn flat round dense icon="more_horiz" to="/usershop/order"/>-->
    </q-toolbar>
    <div class="flex flex-center q-gutter-md" style="padding: 20px">
      <div v-for="(vip,index) in vipList" :key="vip.id" class="row justify-center">
        <div class="col">
          <q-card class="my-card">
            <q-card-section class="bg-secondary text-white">
              <div class="text-h5" style="padding: 10px;">{{ vip.title }}</div>
              <div class="text-subtitle2">
                <p id="cache47" style="font-size: 36px;">
                  <span id="cache48">{{ vip.price }}$</span>
<!--                  <span id="cache38" v-if="vip.timeType != 5" class="strikethrough">{{ vip.timeLong }}</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 1" style="font-size: 20px;">{{ vip.timeLong }}/天</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 2" style="font-size: 20px;">{{ vip.timeLong }}/周</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 3" style="font-size: 20px;">{{ vip.timeLong }}/月</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 4" style="font-size: 20px;">{{ vip.timeLong }}/年</span>-->
<!--                  <span id="cache49" v-if="vip.timeType == 5" style="font-size: 20px;">永久</span>-->
                </p>
              </div>
            </q-card-section>
            <q-separator dark/>

            <q-card-section class="card-section" style="height: 176px">
<!--              <div v-for="feature in vip.features" :key="feature" class="q-mb-sm">-->
              <div  class="q-mb-sm">
                <p  v-if="vip.timeType == 1" >时长 ：{{ vip.timeLong }}天</p>
                <p  v-if="vip.timeType == 2" >时长 ：{{ vip.timeLong }}周</p>
                <p  v-if="vip.timeType == 3" >时长 ：{{ vip.timeLong }}月</p>
                <p  v-if="vip.timeType == 4" >时长 ：{{ vip.timeLong }}年</p>
                <p  v-if="vip.timeType == 5" >时长 ：永久</p>
              </div>
              <div  class="q-mb-sm">
                <pre id="myPre" style="color:#999999;"> {{ vip.introduce }}</pre>
              </div>
<!--              </div>-->
            </q-card-section>

            <q-card-actions align="right" style="padding: 10px">
              <q-btn  @click="openPayPalDialog(vip)">购买 </q-btn>
            </q-card-actions>
<!--            <div class="q-pa-md q-gutter-sm">-->
<!--              <q-btn v-if="shop.charge != 1" @click="openPayPalDialog()">购买 </q-btn>-->
<!--              <q-btn v-if="isCollection == 2" icon="favorite_border" @click="onCollection()">收藏</q-btn>-->
<!--              <q-btn v-if="isCollection == 1"  icon="favorite"  @click="closeCollection()">取消收藏</q-btn>-->
<!--            </div>-->
          </q-card>
        </div>
      </div>
    </div>
     <div>
       <m-radom-user-card></m-radom-user-card>
     </div>
  </div>

  <q-dialog v-model="paypalDialog">
    <PayaplCard :amount="productAmount" :productId="productId" :kind="2" :intro="productIntro" :productName="productName" :url='"/users/vip?userId="+userId'/>
  </q-dialog>
</template>

<style scoped>

.caption {
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 360px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.my-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.bg-secondary, .card-section {
  width: 100%; /* 使子元素宽度与卡片相同 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* 文本居中 */
}

.card-section p {
  margin: 0; /* 移除段落默认的外边距 */
}

.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 或者根据需要设置高度 */
}

.strikethrough {
  text-decoration: line-through;
}
#myPre {
  white-space: pre-wrap; /* 允许自动换行，同时保留空白符 */
}
</style>
