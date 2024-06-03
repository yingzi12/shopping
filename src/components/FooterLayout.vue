<template>
  <q-separator color="orange" inset />
  <q-footer bordered class="bg-grey-3 text-primary">
<!--      <q-toolbar class="glossy">-->
<!--        <q-toolbar-title>Footer</q-toolbar-title>-->
<!--      </q-toolbar>-->
    <div class="row">
      <div class="col-2"> </div>
      <div class="col-auto" style="margin: 0px">
        <div class="footter" style="margin: 0px;text-align: center;">
            <router-link to="">关于Black White</router-link>|
            <router-link to="">联系我们</router-link>|
            <router-link to="">帮助中心</router-link>|
            <router-link to="">提交建议</router-link>|
            <router-link to="">举报中心</router-link>|
             <router-link to="">漏洞提交</router-link>|
        </div>
        <div class="footerText text-weight-thin"> <p>Copyright © 2002-2022 www.51x.com All Rights Reserved 版权所有 Black White Number</p></div>
        <div class="footerText text-weight-thin"><p>购物卡，礼品卡，充值卡，账号 Gift cards, gift cards, recharge cards, account numbers</p></div>
      </div>
      <div class="col-2"></div>
    </div>
  </q-footer>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.footerText{
  margin: 0px;
  text-align: center;
}
.footerText p{
  margin: 0px;

}
</style>
