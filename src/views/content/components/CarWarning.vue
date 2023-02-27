<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        车辆运输实时监测
      </h5>
    </el-header>
    <el-main>
      <div class="car-transport-header" style="margin-top: 0vh">
        <!-- <h5 class="card-title" style="font-size: 25px; padding: 5px">
          车辆运载垃圾量：高于20%
        </h5> -->
        <div class="car-transport-header-search" style="margin-top: 10px">
          <el-select
            v-model="queryCarNum"
            placeholder="选择车牌信息"
            style="font-size: 25px"
            size="large"
          >
            <el-option-group>
              <el-option
                v-for="car in carListRenhe"
                :key="car.carNumber"
                :label="car.carNumber"
                :value="car.carNumber"
              >
                <span>{{ car.carNumber }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ car.sitename }}</span
                >
              </el-option>
            </el-option-group>
          </el-select>

          <el-button
            type="primary"
            size="large"
            @click="car_search"
            style="margin-left: 10px"
            >搜索</el-button
          >
        </div>
      </div>
      <el-table
        :data="data_total.slice((currentPage - 1) * 10, currentPage * 10)"
        :size="large"
        width="100%"
        id="#vcfResult"
        :row-class-name="tableRowClassName" 
      >
        <el-table-column property="status" label="状态" width="300px" />
        <el-table-column property="day" label="时间" width="300px" />
        <el-table-column property="siteName" label="站点" width="150" />
        <el-table-column property="carNumber" label="承运车辆" width="150">
          <template #default="scope">
            <el-button
              size="medium"
              type="primary"
              link
              @click="handleEdit(scope.$index, scope.row)"
              >{{ scope.row.carNumber }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="todayAmount"
          label="过去4小时内运输垃圾总量/kg"
          width="300"
        />
        <el-table-column
          property="predictAmount"
          label="运输垃圾预测量/kg"
          width="250"
        />

        <el-table-column property="driver" label="司机" width="200" />
        <el-table-column property="tel" label="司机电话" width="200" />
        <el-table-column property="wechat" label="司机微信" width="200" />
      </el-table>
      <div class="float-end" style="margin-top: 10px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="totalRecords"
          :current-page="currentPage"
          @current-change="getTransport"
        />
      </div>

      <!-- <el-table
        :data="less_total.slice((less_currentPage - 1) * 10,less_currentPage * 10)"
        :size="large"
        width="100%"
        id="#vcfResult"
        style="padding-top:10vh"
      >
        <el-table-column property="day" label="时间" width="300px" />
        <el-table-column property="siteName" label="站点" width="150" />
        <el-table-column property="carNumber" label="承运车辆" width="150">
          <template #default="scope">
            <el-button
              size="medium"
              type="primary"
              link
              @click="handleEdit(scope.$index, scope.row)"
              >{{ scope.row.carNumber }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="todayAmount"
          label="过去4小时内运输垃圾总量/kg"
          width="300"
        />
        <el-table-column
          property="predictAmount"
          label="运输垃圾预测量/kg"
          width="250"
        />

        <el-table-column property="driver" label="司机" width="200" />
        <el-table-column property="tel" label="司机电话" width="200" />
        <el-table-column property="wechat" label="司机微信" width="200" />
      </el-table>
      <div class="float-end" style="margin-top: 10px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="less_totalRecords"
          :current-page="less_currentPage"
          @current-change="getLessTransport"
        />
      </div> -->
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import Charts from "@jiaminghi/charts";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";

import { getCars } from "@/api/content";
import { getCarGps } from "@/api/content";
// ==========================================================================================================sunny
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from "vue";
//===============================================================================================================
import axios from "axios";
import {
  getPage,
  getQuery,
  getAllGp,
  getTransportCars,
} from "@/api/content.js";

// ==========================================================================================================sunny
// 导入echarts
import * as echarts from "echarts";

import { useStore } from "vuex";
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import moment from "moment";

let totalRecords = ref(1000);
let currentPage = ref(1);
let less_totalRecords = ref(1000);
let less_currentPage = ref(1);

// const data_total = ref([]);
const queryCarNum = ref("");

let car_transport_select_way = ref("");
let car_transport_select_value = ref("");

// ==========================================================
const carData = ref([]);

const carListRenhe = ref([]);
// 车牌号列表
const getAllSiteCar = (site_name) => {
  axios({
    url: "/api/car-by-site/" + site_name,
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      carData.value = data;
      var car = {
        carNumber: "全部",
        sitename: "所有站点",
      };
      carListRenhe.value.push(car);
      for (var i = 0; i < carData.value.length; i++) {
        if (carData.value[i].siteName == "红星") {
          var car = {
            carNumber: carData.value[i].carNumber,
            sitename: carData.value[i].siteName,
          };
          carListRenhe.value.push(car);
        }
      }
      for (var i = 0; i < carData.value.length; i++) {
        if (carData.value[i].siteName == "西华") {
          var car = {
            carNumber: carData.value[i].carNumber,
            sitename: carData.value[i].siteName,
          };
          carListRenhe.value.push(car);
        }
      }
      for (var i = 0; i < carData.value.length; i++) {
        if (
          carData.value[i].siteName == "红花堰" &&
          carData.value[i].carNumber != ""
        ) {
          var car = {
            carNumber: carData.value[i].carNumber,
            sitename: carData.value[i].siteName,
          };
          carListRenhe.value.push(car);
        }
      }
      for (var i = 0; i < carData.value.length; i++) {
        if (carData.value[i].siteName == "五块石") {
          var car = {
            carNumber: carData.value[i].carNumber,
            sitename: carData.value[i].siteName,
          };
          carListRenhe.value.push(car);
        }
      }
      for (var i = 0; i < carData.value.length; i++) {
        if (carData.value[i].siteName == "五里墩") {
          var car = {
            carNumber: carData.value[i].carNumber,
            sitename: carData.value[i].siteName,
          };
          carListRenhe.value.push(car);
        }
      }
      console.log("数据长度：" + data.length);
    }
  });
};
getAllSiteCar("all");
const router = useRouter();
// 点击车牌号展示该车辆相关信息
const handleEdit = (index, row) => {
  var carNumber = row.carNumber;
  router.push({ name: "cardetailinfo", query: { carNumber: carNumber } });
  console.log(index, carNumber);
};
//=============================================================

const transport_today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
var transport_start = transport_today;
console.log("transport_start" + transport_start);

const data_total = reactive([]);
const less_total = reactive([]);

const getCarWarning = (start, end, pageNum, pageSize) => {
  axios({
    url:
      "/api/dump-record/car_data/all_site/" +
      start +
      "/" +
      end +
      "/" +
      pageNum +
      "/" +
      pageSize,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      queryCarNum.value = [];
      data_total.splice(0, data_total.length);
      var data = resp.data.data.records;
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (
          data[car].todayAmount >= data[car].predictAmount * 0.8 &&
          data[car].todayAmount <= data[car].predictAmount * 1.2
        ) {
          console.log("低于预测值20%");
          var currentCar = {
            status: "正常",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (data[car].todayAmount > data[car].predictAmount * 1.2) {
          console.log("高于预测值20%");
          var currentCar = {
            status: "高于预测值20%",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (data[car].todayAmount < data[car].predictAmount * 0.8) {
          console.log("低于预测值20%");
          var currentCar = {
            status: "低于预测值20%",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }

      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 10;
      currentPage.value = pageNum;
    }
  });
};

const getTransport = (pageNum) => {
  // 当前页
  currentPage.value = pageNum;
};

// const getLessCarWarning = (start, end, pageNum, pageSize) => {
//   axios({
//     url:
//       "/api/dump-record/car_data/all_site/" +
//       start +
//       "/" +
//       end +
//       "/" +
//       pageNum +
//       "/" +
//       pageSize,

//     method: "get",
//   }).then(function (resp) {
//     if (resp.status == 200) {
//       queryCarNum.value = [];
//       less_total.splice(0, less_total.length);
//       var data = resp.data.data.records;

//       for (var car in data) {
//         if (data[car].todayAmount == null) {
//           data[car].todayAmount = 0;
//         }
//         if (data[car].todayAmount < data[car].predictAmount * 0.8) {
//           console.log("低于预测值20%");
//           var currentCar = {
//             day: start + " 至 " + end,
//             siteName: data[car].siteName,
//             carNumber: data[car].carNumber,
//             todayAmount: data[car].todayAmount,
//             predictAmount: data[car].predictAmount,
//           };
//           less_total.push(currentCar);
//         }
//       }

//       less_totalRecords.value = less_total.length;
//       less_pageCount = parseInt(less_total.length) % 10;
//       less_currentPage.value = pageNum;
//     }
//   });
// };
// const getLessTransport = (pageNum) => {
//   console.log("调用一次！")
//   // 当前页
//   less_currentPage.value = pageNum;

// };

function upDateList() {
  var time = new Date().getTime();
  // 获取当前时间，转化时间戳为正常格式
  var end =
    new Date().getHours().toString().padStart(2, 0) +
    ":" +
    new Date().getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date().getSeconds().toString().padStart(2, 0);

  var start =
    new Date(time - 4 * 60 * 60 * 1000).getHours().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getSeconds().toString().padStart(2, 0);
  getCarWarning(start, end, 1, 10000);
  // getLessCarWarning(start, end, 1, 10000);
}

upDateList();
// 每隔一分钟更新一次
setInterval(upDateList, 60000);

const car_search = () => {
  var time = new Date().getTime();
  // 获取当前时间，转化时间戳为正常格式
  var end =
    new Date().getHours().toString().padStart(2, 0) +
    ":" +
    new Date().getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date().getSeconds().toString().padStart(2, 0);

  var start =
    new Date(time - 4 * 60 * 60 * 1000).getHours().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getSeconds().toString().padStart(2, 0);

  // var CarSiteName = ref();
  if (queryCarNum.value == "全部") {
    getCarWarning(start, end, 1, 10000);
  } else {
    for (var i = carListRenhe.value.length - 1; i > 0; i--) {
      // console.log("carListRenhe:" + carListRenhe.value[i].carNumber);

      if (carListRenhe.value[i].carNumber == queryCarNum.value) {
        console.log("进入！" + queryCarNum.value);
        searchCarWarning(queryCarNum.value, start, end);
      }
    }
  }
};

const searchCarWarning = (carNumber, start, end) => {
  axios({
    url: "/api/dump-record/car_data/" + carNumber + "/" + start + "/" + end,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      data_total.splice(0, data_total.length);

      for (var car in data) {
        if (carNumber == data[car].carNumber) {
          if (data[car].todayAmount == null) {
            data[car].todayAmount = 0;
          }
          if (
            data[car].todayAmount >= data[car].predictAmount * 0.8 &&
            data[car].todayAmount <= data[car].predictAmount * 1.2
          ) {
            console.log("低于预测值20%");
            var currentCar = {
              status: "正常",
              day: start + " 至 " + end,
              siteName: data[car].siteName,
              carNumber: data[car].carNumber,
              todayAmount: data[car].todayAmount,
              predictAmount: data[car].predictAmount,
            };
          }
          if (data[car].todayAmount > data[car].predictAmount * 1.2) {
            console.log("高于预测值20%");
            var currentCar = {
              status: "高于预测值20%",
              day: start + " 至 " + end,
              siteName: data[car].siteName,
              carNumber: data[car].carNumber,
              todayAmount: data[car].todayAmount,
              predictAmount: data[car].predictAmount,
            };
          }
          if (data[car].todayAmount < data[car].predictAmount * 0.8) {
            console.log("低于预测值20%");
            var currentCar = {
              status: "低于预测值20%",
              day: start + " 至 " + end,
              siteName: data[car].siteName,
              carNumber: data[car].carNumber,
              todayAmount: data[car].todayAmount,
              predictAmount: data[car].predictAmount,
            };
          }

          data_total.push(currentCar);
        }
      }

      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 10;
      currentPage.value = pageNum;
    }
  });
};
const tableRowClassName = (row) => {
        if (row.row.status == "高于预测值20%") {
        return 'more_rowstyle';
  }
              if (row.row.status == "正常") {
        return 'rowstyle';
  }
              if (row.row.status == "低于预测值20%") {
        return 'less_rowstyle';
      }
}
</script>
<style>
.el-table .rowstyle {
  background: rgb(186, 233, 186);
}

.el-table .more_rowstyle {
  background: rgb(230, 187, 194);
}

.el-table .less_rowstyle {
  background: rgb(230, 225, 168);
}
</style>