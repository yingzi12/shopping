<script setup lang="ts">
import { defineProps } from 'vue';
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {Dialog, useQuasar} from "quasar";
const $q = useQuasar();

// 接收url里的参数
const route = useRoute();
const router = useRouter();
interface Order {
  orderNumber: string;
  pic: string;
  prodName: string;
  status: string;
  actualTotal: string;
  orderItemDtos:Array<OrderItem>;
}

interface OrderItem {
  pic: string;
  prodName: string;
  prodCount: string;
  price: string;

}

const props = defineProps<{ value: Order }>();
async function onDel(id:string){
  const response = await api.get(`/admin/spec/del/${id}`);
  const data = response.data;
  //console.log(data)
  if (data.code == 200) {
    Dialog.create({
      title: '通知',
      message: '删除成功.',
      ok: {
        push: true
      },
    }).onOk(async () => {
      //重新加载页面
      await router.go(0);
      router.push('/admin/shop/spec/index'); // Redirect to login page
    }).onCancel(async () => {
      //刷新页面
      await router.go(0);
      router.push('/admin/shop/spec/index'); // Redirect to login page
    });
  } else {
    Dialog.create({
      title: '通知',
      color: 'red-4',
      message: '删除失败'
    });
  }
}
function getImageUrl(imgUrl:string) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}
function retorDetail(ordernum:string) {
  router.push("/order/detail?ordernum="+ordernum)
}
</script>

<template>
  <q-card >
    <q-card-section  @click="retorDetail(props.value.orderNumber)">
      <div class="row">
        <div class="col-9">
          订单编号:{{props.value.orderNumber}}
        </div>
        <div class="col text-right">
          <q-item-label class="right">
            {{
              props.value.status == 1 ? '待支付' : (props.value.status == 2 ? '待发货' : (props.value.status == 3 ? '待收货' : (props.value.status == 5 ? '已完成' : '已取消')))
            }}
          </q-item-label>
        </div>
      </div>

    </q-card-section>
    <q-card-section  @click="retorDetail(props.value.orderNumber)">
      <q-list >
        <q-item
            tag="label"
            v-ripple
            v-for="(item,index) in props.value.orderItemDtos" :key="index"
        >
          <!-- ... 商品图片、名称、价格、数量等保持不变 ... -->
          <q-item-section avatar>
            <q-avatar>
              <q-img fit="fill"
                     class="cartHeadImage"
                     :src="getImageUrl(item.pic)"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="h3">{{ item.prodName }}</q-item-label>
            <q-item-label caption>{{ item.price }}</q-item-label>
          </q-item-section>
          <q-item-section side><div class="col-6 right">{{ item.prodCount }}</div></q-item-section>

        </q-item>

      </q-list>
    </q-card-section>
    <q-card-section>
      <div class="col text-right">
        <q-item-label class="right">合计：{{props.value.actualTotal}} ¥</q-item-label>
      </div>
    </q-card-section>

  </q-card>

<!--  <q-card flat bordered class="q-ma-sm">-->
<!--    <q-card-section>-->
<!--      <q-item>-->
<!--        <q-item-section>-->
<!--          <q-item-label>{{ props.value.propName }}<q-chip  color="blue"  :label="props.value.rule ==1 ? '规格':'参数'" size="xs"></q-chip></q-item-label>-->
<!--          <q-item-label caption>          <q-chip  color="yellow"  v-for="(v,index) in props.value.prodPropValues" :key="index" :label="v.propValue"></q-chip>-->
<!--          </q-item-label>-->
<!--        </q-item-section>-->

<!--        <q-item-section side top>-->
<!--          <q-item-label caption><q-btn flat label="编辑" @click="router.push('/admin/shop/spec/edit?id=' + props.value.propId)"/>-->
<!--            <q-btn flat label="删除" @click="onDel(props.value.propId)"/></q-item-label>-->
<!--        </q-item-section>-->
<!--      </q-item>-->
<!--    </q-card-section>-->
<!--  </q-card>-->
</template>

<style scoped>

</style>
