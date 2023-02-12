<template>
  <el-container class="dcontainer">
    <!-- 导航栏 -->
    <Header style="height:70px " :icon="null">

      <!-- 系统名字 -->
      <template #title>
        <span class="text-title">金牛区生活垃圾全生命周期管家</span>
      </template>
      <!-- 时间 -->

      <template #time>
        <div class="text-week">
          今天是: {{ date }} {{ week }}
        </div>
      </template>

      <!-- 用户信息 -->
      <template #userinfo>
        <div class="router">
          <el-button class="buttonToMap" plain link color="fff" @click="toMap" size="large">前往地图主页</el-button>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ user.username + "（" + user.role + "）" }}
            <el-icon>
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </Header>
    <el-container class="data-container">
      <el-aside>
        <el-menu class="menu" default-active="1">
          <!--有二级菜单，则以子菜单的形式展示;没有二级菜单，则以菜单项显示-->
          <template v-for="(item, idx) in menuList">
            <template v-if="item.submenu.length != 0">
              <el-sub-menu :index="idx + ''" :key="idx" collapse="true">
                <template #title>
                  <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                  <!-- <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/> -->
                  <span style="font-size:20px">{{ item.title }}</span>
                </template>
                <el-menu-item v-for="(subitem, subidx) in item.submenu" :index="idx + '-' + subidx" :key="subidx"
                  @click="displayContent(subitem.to)">
                  <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                  <!-- <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/> -->
                  <span style="font-size:20px">{{ subitem.title }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="idx" :key="idx" @click="displayContent(item.to)">
                <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                <!-- <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/> -->
                <span style="font-size:20px">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </template>
          <!-- <el-menu-item>
              <el-icon><component :is="Link"></component></el-icon>
              <span style="font-size:20px"><a href="http://101.37.246.72/denglu_xzzf.exe" target="_blank">跳转主页</a></span>
            </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
  
<script setup>
import { useRouter, useRoute } from "vue-router";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
import { ref, onMounted, reactive, onBeforeMount } from "vue";

// 由于<script setup>使用动态组件时，:is属性的值是对象实例，而不是组件名
// 而menuList里的icon是组件名，因此这里做一个映射
const icons = {
  House, Setting
}
const user = reactive({
  username: '张三',
  role: '管理员'
})
//日期 周
let date = new Date().toLocaleDateString();
var a = new Array("日", "一", "二", "三", "四", "五", "六");
var str = new Date().getDay();
var week = "星期" + a[str];
function toSystem(item) {
  router.push({ name: item.to, params: item.systemName })
}
//部门列表, 从后端获取
onMounted(() => {
// 默认跳转到jinniu子组件
  router.push('/content/jinniu');
  //从地图主页跳转到content下的其他子组件
  if (route.query.carNumber) {
    var carNumber=route.query.carNumber
    router.push({ path: "/content/carDetailInfo", query: {carNumber: carNumber } });
  }
})


// 系统列表
const systems = ref([])

//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(-1)
const choosedDeptName = ref()
//选中部门对应的子系统


// 跳转到to指定的子系统汇总页面
function show(to, subsysName) {
  if (to === '') {
    ll
    ElMessage({
      showClose: true,
      message: '正在开发中...'
    })
  } else {
    router.push({ name: to, params: { subsysName } })
  }
}
function toMap() {
  router.push('/home')
}

// 设置子系统名字
const route = useRoute()
const subsysName = ref(route.params.subsysName)

// 导航栏的返回上一级按键
const router = useRouter()
function goback() {
  router.push('/home')
}
function logout() {
  //TODO 清除登录信息
  router.push('/login')
}
//   onMounted(()=>router.push('/xzzf/qdkq'))

// 这个应该从后台请求获得
const menuList = [
  // { icon: '02,01', title: '金牛区汇总统计分析', to: 'jinniu', submenu: [] },
  {
    icon: '01,04', title: '各站点统计分析', to: 'jinniu', submenu:
      [{ icon: '', title: '大站汇总分析', to: 'jinniu' },
      { icon: '', title: '红星', to: 'hongxing' },
      { icon: '', title: '西华', to: 'xihua' },
      { icon: '', title: '红花堰', to: 'honghuayan' },
      { icon: '', title: '五块石', to: 'wukuaishi' },
      { icon: '', title: '五里墩', to: 'wulidun' },

      ]
  },

  // { icon: '03,16', title: '垃圾预测', to: 'qdkq', submenu: [] },
  { icon: '03,17', title: '垃圾焚烧数据校对', to: 'ljfs', submenu: [] },
  { icon: '01,16', title: '车辆轨迹分析', to: 'carRecord', submenu: [] },


]
function displayContent(name) {
  router.push({ name })
}
function getIcon(idxStr) {
  const len = -30
  const x = parseInt(idxStr.split(',')[1] - 1) * len
  const y = parseInt(idxStr.split(',')[0] - 1) * len
  return {
    backgroundPositionX: x + 'px',
    backgroundPositionY: y + 'px'
  }
}
</script>
  
<style scoped src="@/assets/css/subsys.css">

</style>
<style scoped>
/* .logo-title{
    font-size: x-large;
  color: #fff;
  line-height: 20px;
}
.content{
    padding: 15px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;
} */
.menu-img-default {
  /**原图每个图标都是45 * 45，这里将其变成30 * 30,所以background-size的长宽都乘了2/3 */
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-image: url('@/assets/nav-icon.png');
  background-size: calc(1000px * 2 / 3) calc(1000px * 2 / 3);
}

.mapDiv {
  width: 100%;
  height: 100%;
}

.closeIcon {
  margin-left: 20px;
}

.text-week {
  margin-left: 20px;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 100%;
}

.text-title {
  margin-left: 20px;
  font-size: 30px;
  color: #fff;
  line-height: 30px;
  width: 30%;
  padding: 5px;
}

.el-descriptions-item {
  font-size: 20px;
}

.el-card {
  width: auto;
  padding: 20px;
  margin-top: 20px;
  font-size: 25px;
}

.buttonToMap {
  font-size: large;
  color: #fff;
}

.el-dropdown-link {
  font-size: 20px;
}

.table {
  size: large;
  margin-bottom: 1em;
  font-size: 25px;
  line-height: 30px;
}

.item {
  padding: 10px;
}

.router {
  padding: 15px;
  font-size: 25px;
  margin-left: 10px;
  margin-top: -3px;
  white-space: nowrap;
  letter-spacing: 3px;
}

.content {
  padding: 25px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;

}

.container {
  display: flex;
  flex-direction: column;
}

.navHeader {
  background-color: #fff;
  color: #004B8C;
  margin-left: -20px;
  margin-right: -20px;
  height: initial;
  display: flex;
}

.title {
  padding: 25px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;

}

.subsys {
  /**保持子系统栏与标题栏背景色一致 */
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  text-align: center;


}

.classification {
  /**保持子系统栏与标题栏背景色一致 */
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  text-align: center;


}

.main {
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  justify-content: center;
}

.logo-title {
  font-size: x-large;
  color: #fff;
  line-height: 60px;
}

.background {
  display: flex;
  flex-wrap: wrap;
  width: 200;
}

.subdepts {
  padding: 0px;
  font-size: 25px;
  margin-left: -5px;
  margin-top: 40px;
  white-space: nowrap;
  float: left;
  text-decoration: underline;
}

:deep(.amap-logo) {
  display: none;
  opacity: 0 !important;
}

:deep(.amap-copyright) {
  opacity: 0;
}
</style>