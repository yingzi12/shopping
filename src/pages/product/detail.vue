<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {Cookies, useQuasar} from "quasar";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {api} from "boot/axios";
import PayaplCard from "pages/system/payment.vue";
import mShopCard from "components/shop/mUserShopCardComponent.vue"

const router = useRouter(); // 使用 Vue Router 的 useRouter 函数
const amount=ref(0.0);
const intro=ref("");

const token = Cookies.get("token");

// 接收url里的参数
const route = useRoute();
const aid = ref(route.query.aid);
const userId = ref(route.query.userId);

const $q = useQuasar();

const imgTotal = ref(0);
const videoTotal = ref(0);
const isSee = ref(false);
const imageList = ref([]);
const videoList = ref([]);

const isCollection = ref(2)
const isRefreshing = ref(false)
const isFullScreen = ref(false);
const isDialog = ref(false);
const offsetPage = ref(1);
const pageNum = ref(0);

const currentIndex = ref(0);
const onLoad = async (index: number, done: () => void) => {
  if (!isSee.value || disableInfiniteScroll.value) {
    done();
    return;
  }

  try {
    pageNum.value=index;
    isRefreshing.value = true
    await getList(index + offsetPage.value);

  } catch (error) {
    console.error(error);
    disableInfiniteScroll.value = true;
  } finally {
    isRefreshing.value = false;
    done();
  }
}

// 使用防抖包装 onLoad 保持不变
const debouncedOnLoad = debounce(onLoad, 300);
//下拉设置
const disableInfiniteScroll = ref(true); // 初始设置为 true
// 防抖函数定义
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
const shop = ref({});
const title = ref("Black White")

const description = ref('Black White 美女 写真 摄影 秀人网 Photo Gallery, Beauty, Photo, Photography, Showman.com.')
const ortTile = ref("Black White")
const orgDec = ref("Black White")
const orgImgae = ref("Black White")

const tagList=ref([]);

async function getInfo() {
  // 滚动到顶部
  const response = await api.get("/usershop/getInfo/" + aid.value, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    shop.value = data.data;
    isCollection.value=shop.value.isCollection
    amount.value=shop.value.amount
    if(shop.value.tags != null){
      tagList.value=shop.value.tags.split(";");
    }
    title.value = "Black White-" + shop.value.title
    ortTile.value = shop.value.title
    orgDec.value = shop.value.description
    orgImgae.value = shop.value.imgUrl

    imgTotal.value = shop.value.numberPhotos
    videoTotal.value = shop.value.numberVideo
    const imgList = shop.value.imageList
    const vieList = shop.value.videoList
    imageList.value.push(...imgList);
    videoList.value.push(...vieList);
    if(data.data.isSee){
      disableInfiniteScroll.value = false;
      isSee.value = data.data.isSee;
    }

    getDetail(shop.value.userId);
  }
}

async function getList(page: number) {
  // queryParams.value.aid = aid.value;
  // queryParams.value.pageNum = page;
  try {
    const response = await api.get(`/userImage/list?aid=${aid.value}&pageNum=` + page, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = response.data;
    if (data.code === 200) {
      const imgList = data.data;
      imageList.value.push(...imgList);

      // 判断是否还有更多数据需要加载
      if (imgList.length === 0 || imageList.value.length >= imgTotal.value) {
        disableInfiniteScroll.value = true;
      }
    } else {
      disableInfiniteScroll.value = true;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

async function onCollection() {
  if ( isCollection.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isCollection.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/admin/userCollection/on?aid=${aid.value}&ctype=2`)
  const data = response.data;
  if (data.code == 200) {
    isCollection.value=1;
  }else{
    isCollection.value=2;
  }
}

const isLike=ref(0);
async function onLike() {
  if ( isLike.value==1) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }else{
    isLike.value=1;
  }
  // 滚动到顶部
  const response = await api.get(`/usershop/like?aid=${aid.value}`)
  const data = response.data;
  if (data.code == 200) {
    isLike.value = 1;
  }else{
    isLike.value = 0;
  }
}
async function closeCollection() {
  if ( isCollection.value==2) {
    return; // 如果已经在处理收藏请求，则不执行任何操作
  }
  // 滚动到顶部
  const response = await api.get(`/admin/userCollection/close?aid=${aid.value}&ctype=2`)
  const data = response.data;
  if (data.code == 200) {
    isCollection.value=2;
  }
}

const randomList = ref([]);

async function getRandom() {
  const response = await api.get('/usershop/random', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = response.data;
  if (data.code === 200) {
    randomList.value = data.data
  }
}

getRandom();
getInfo();

const paypalDialog = ref(false);

function openPayPalDialog (){
  //console.log("------------openPayPalDialog---------------------------")
  if(token !== null && token !== '' && token !== undefined ) {
    paypalDialog.value = true;
  }else {
    $q.dialog({
      title: '通知',
      message: '请先登录，点击ok跳转登录.',
      ok: {
        push: true
      },
      cancel: {
        push: true
      },
    }).onOk(async () => {
      router.push('/login'); // Redirect to login page
    }).onCancel(async () => {
      // router.push('/users/shop'); // Redirect to login page
    });
  }
};

const userNickname=ref("");
const userIsAttention=ref(0);
const userIntro=ref("");
const userImgUrl=ref("");
async function getDetail(uId) {
  const response = await api.get(`/systemUser/info?userId=${uId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = response.data;
  if (data.code == 200) {
    userNickname.value=data.data.nickname;
    userIsAttention.value=data.data.isAttention
    userIntro.value = data.data.intro;
    userImgUrl.value = data.data.imgUrl ;
    userId.value=data.data.id;
  }
}

// //console.log(token)
// 监听isSee的值
watch(isSee, (newValue, oldValue) => {
  if (newValue === true) {
    //console.log(` onLoad  isSee:${isSee.value}  disableInfiniteScroll:${disableInfiniteScroll.value}  1`)
    onLoad(0, () => {
    });
    // getVideoList();
  }
}, {immediate: true}); // immediate: true 确保在挂载时立即触发一次
const refreshImages = async () => {
  // Logic to refresh images
  // For example, reset your image list and call the API to fetch the first set of images
  imageList.value = [];
  await debouncedOnLoad(0, () => {});
};

function getImageUrl(imgUrl) {
  if (imgUrl != null && imgUrl !== undefined && imgUrl !== '') {
    return `${$q.config.sourceWeb}${imgUrl}`;
  }
  return `/empty.png`; // Default image URL when imgUrl is null, undefined, or empty
}
// function navigateToUserPage() {
//   // 假设this.userId是你要跳转到的用户的ID
//   router.push(`userDetail?userId=${userId.value}`);
// }
function openFullScreen(index) {
  // console.log(`------------openFullScreen------------${imageList.value.length}--`)
  // console.log(index)
  currentIndex.value = index;
  isFullScreen.value = true;
  isDialog.value=true;
}

function handleKeyPress(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      previousSlide();
      break;
    case 'ArrowRight':
      nextSlide();
      break;
  }
}
function previousSlide() {
  // console.log(`=========previousSlide======${currentIndex.value}======${imageList.value.length }========`)
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    // 如果已经是第一张幻灯片，则循环到最后一张
    currentIndex.value = imageList.value.length - 1;
  }
}

function nextSlide() {
  // console.log(`=========nextSlide======${currentIndex.value}======${imageList.value.length }========`)
  if (currentIndex.value < imageList.value.length - 1) {
    currentIndex.value++;
  } else {
    offsetPage.value=offsetPage.value+1;
    getList(pageNum.value+offsetPage.value);
    if(disableInfiniteScroll.value) {
      // 如果已经是最后一张幻灯片，则循环到第一张
      currentIndex.value = 0;
    }else {
      currentIndex.value++;
    }
  }
}
// 监听isSee的值
watch(isSee, (newValue, oldValue) => {
  if (newValue === true) {
    //console.log(` onLoad  isSee:${isSee.value}  disableInfiniteScroll:${disableInfiniteScroll.value}  1`)
    onLoad(0, () => {
    });
    // getVideoList();
  }
}, {immediate: true}); // immediate: true 确保在挂载时立即触发一次
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
})
</script>
<template>
  <q-page>
    <q-breadcrumbs class="text-brown q-ma-md">
      <template v-slot:separator>
        <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
        />
      </template>

      <q-breadcrumbs-el label="用户" icon="widgets"  to="/usershop/index"/>
      <q-breadcrumbs-el label="排行榜" icon="navigation" to="/usershop/order" />
      <q-breadcrumbs-el :label="shop.title" icon="description"  />
    </q-breadcrumbs>
    <div class="q-pa-xs">
      <div class="text-center">
        <q-card flat bordered class="q-ma-sm">
          <q-card-section>
            <img :src="getImageUrl(shop.imgUrl)" class="m-shop-card-image">
          </q-card-section>
          <q-card-section>
            <div class="text-h6">
              <q-item-label class="text-caption two-line-clamp">{{ shop.title }}</q-item-label>
              <q-item-label class="text-caption two-line-clamp">
                <a :href="'/users/detail?userId=' + shop.userId">
                  <p class="text-caption two-line-clamp">{{ shop.userName }}</p>
                </a>
              </q-item-label>
              <q-item-label class="text-caption two-line-clamp">
                <p class="text-caption two-line-clamp">{{ shop.girl }}</p>
              </q-item-label>
            </div>
            <div> <span v-if="shop.charge == 1" class="text-primary" >免费</span>
              <span v-if="shop.charge == 2" class="text-primary" >VIP免费</span>
              <span v-if="shop.charge == 3" class="text-primary" >VIP折扣</span>
              <span v-if="shop.charge == 4" class="text-primary" >VIP独享</span>
              <span  v-if="shop.charge == 5" class="text-primary" >统一</span>
              ·
              <span v-if="shop.charge == 2 || shop.charge == 3 ||shop.charge == 5 ">价格:{{shop.price }}</span>
              <span v-if="shop.charge == 3">VIP价格: 0 </span>
              <span v-if="shop.charge == 4 || shop.charge == 5">VIP价格: {{shop.vipPrice }} </span>
            </div>

          </q-card-section>
          <q-card-section>
            <div class="q-gutter-sm q-mb-xs">
          <span class="text-h6">
            {{ shop.countSee ==null? 0: shop.countSee}}次
            <q-badge outline align="middle" color="teal" >
              查看
            </q-badge>
          </span>
              <span class="text-h6">
            {{ shop.countLike==null?  0: shop.countLike}}次
            <q-badge outline align="middle" color="teal ">
              点赞
            </q-badge>
          </span>
              <span class="text-h6">
            {{ shop.countFllow ==null?  0: shop.countFllow }}人
            <q-badge outline align="middle" color="teal" >
              关注
            </q-badge>
          </span>
            </div>

          </q-card-section>
          <q-card-section class="row items-center justify-evenly">
            <q-btn round :color="isLike ==1?'red':'blue'" icon="thumb_up"  @click="onLike"  />
            <q-btn round :color="isCollection !=1 ?'blue':'red'" icon="favorite"  @click="isCollection !=1 ? onCollection() :closeCollection()"/>
            <q-btn round  v-if="!shop.isSee" color="blue" glossy text-color="black" icon="shopping_cart" @click="openPayPalDialog()"/>
            <q-btn round color="red" icon="error" />
          </q-card-section>
          <q-card-section class="">
            <div>
              {{shop.intro}}
            </div>
            <div>
              {{shop.payIntro}}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div>
        <q-th>视频列表（{{ videoTotal }}）</q-th>
        <div class="q-pa-xs">
          <div class="row justify-center q-gutter-sm">
            <q-intersection
                v-for="(video,index) in videoList"
                :key="index"
                class="example-item"
                transition="scale"
            >
              <q-card bordered class="q-ma-sm" flat>
                <img  class="vedioimage"  :src="getImageUrl(video.imgUrl)">
                <q-card-section>
                  <q-btn v-if="video.isFree == 2" color="primary" icon="visibility" square>预览
                    <span v-if="video.status == -1" style="color: red" >锁定</span>
                  </q-btn>
                  <q-btn v-if="video.isFree == 1" color="primary" icon="sunny" square>正式
                    <span v-if="video.status == -1" style="color: red">锁定</span>
                  </q-btn>
                  <q-btn v-if="video.status != -1" color="blue" >
                    <a :href="'/usershop/playvideo?aid=' + shop.id+'&vid='+video.id">播放</a>
                  </q-btn>

                </q-card-section>
              </q-card>
            </q-intersection>

          </div>
        </div>
      </div>
      <div>
        <q-th>图片列表（{{ imgTotal }}）</q-th>
        <q-pull-to-refresh @refresh="refreshImages">
          <q-infinite-scroll :disable="disableInfiniteScroll" :offset="250" @load="debouncedOnLoad">
            <div v-for="(image, index) in imageList" :key="index" class="caption" @click="openFullScreen(index)">

              <div style="width: 100%; ">
                <q-img v-if="image.status != -1" :src="getImageUrl(image.imgUrl)" class="responsive-image m-image"/>
                <q-img  v-if="image.status == -1" src="/lock_image.jpg" class="responsive-image m-image"/>
              </div>
            </div>

            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px"/>
              </div>
            </template>
          </q-infinite-scroll>
        </q-pull-to-refresh>
        <div v-if="isFullScreen" >
          <div class="fullscreen-image-container">
            <q-carousel
                class="fullscreen-image"
                swipeable
                animated
                v-model="currentIndex"
                ref="carousel"
                infinite
                fullscreen
            >
              <q-carousel-slide v-for="(img, idx) in imageList"
                                :name="idx"
                                :key="`carousel-${idx}`"
              >
                <div class="image-container">
                  <img :src="getImageUrl(img.imgUrl)" style="object-fit: contain;height: 100%;" class="m-image"/>
                </div>
              </q-carousel-slide>

              <template v-slot:control>
                <q-carousel-control
                    position="bottom-right"
                    :offset="[18, 18]"
                    class="q-gutter-xs"
                >
                  <q-btn
                      push round dense color="orange" text-color="black" icon="arrow_left"
                      @click="previousSlide"
                  />
                  <q-btn
                      push round dense color="orange" text-color="black" icon="arrow_right"
                      @click="nextSlide"
                  />
                  <q-btn
                      push round dense color="white" text-color="primary"
                      :icon="isFullScreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="isFullScreen = !isFullScreen"
                  />
                </q-carousel-control>
              </template>

            </q-carousel>
          </div>
        </div>

      </div>
      <div style=" text-align: center;font-size: large">
        <a v-if="shop.pre != null " :href='"/usershop/detail?aid="+shop.pre.id'
           style="margin: 20px;font-size: large">{{ shop.pre.title }}</a>
        <a v-if="shop.next != null " :href='"/usershop/detail?aid="+shop.next.id'
           style="margin: 20px;font-size: large">{{ shop.next.title }}</a>
      </div>
      <div>
        <div class="scroll-container">
          <div class="scroll-content">
            <!-- 这里放置你需要滚动的内容 -->
            <div v-for="(value ,index)  in randomList" :key="index" class="scroll-item">
              <m-shop-card  :shop="value" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="paypalDialog">
    <PayaplCard :amount="shop.amount" :productId="shop.id" :kind="4" :intro="shop.intro" :productName="shop.title" :url='"/usershop/detail?aid="+aid'/>
  </q-dialog>
</template>


<style lang="sass" scoped>
.my-card-container
  display: flex
  justify-content: center
  align-items: center
  height: 100%


.my-card
  width: 100%
  max-width: 900px

.responsive-image
  max-width: 980px
  height: auto
  margin: 0 auto

.caption
  display: flex
  justify-content: center
  align-items: center
  padding: 10px

.head-iamge
  height: 400px
  width: 260px

.head-iamge img
  object-fit: cover

.example-item
  height: 273px
  width: 150px

.two-line-clamp
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis

.q-card-section
  padding: 8px

.text-caption
  margin: 0
  font-size: 0.8em

.container
  max-width: 500px
  margin: 0 auto
  padding: 20px
  text-align: center

.headImage
  max-width: 200px
  height: 302px
.vedioimage
  width: 300px
  height: 200px
</style>
<style lang="scss" scoped>
.fullscreen-image {
  max-width: 100%; /* 设置照片的最大宽度为容器的宽度 */
  max-height: 100%; /* 设置照片的最大高度为容器的高度 */
  object-fit: contain; /* 确保照片按比例缩放并完全显示在容器内 */
}
.fullscreen-image-container {
  width: 100%; /* 设置容器的宽度为100%，确保填满父容器 */
  height: 100%; /* 设置容器的高度为100%，确保填满父容器 */
  overflow: hidden; /* 确保超出部分被隐藏 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保图片容器与父容器高度相同 */
}
</style>
