<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        红花堰垃圾站数据统计
      </h5>
    </el-header>
    <el-main>
            <div class="site_name-header">
        <h5 class="card-title" style="font-size: 25px; padding: 5px">
          垃圾量统计(日/周/月)
        </h5>
        <div class="site_name-header-search">
          <el-select
            v-model="site_name_select_way"
            class="m-2"
            placeholder="选择查询方式"
            clearable
            size="large"
          >
            <el-option
              v-for="item in site_name_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-date-picker
            v-if="site_name_select_way == 'week'"
            v-model="site_name_select_value"
            type="week"
            format="[Week] ww"
            placeholder="请选择某一周"
            size="large"
          />
          <el-date-picker
            v-if="site_name_select_way == 'month'"
            v-model="site_name_select_value"
            type="month"
            placeholder="请选择某个月"
            size="large"
          />

          <el-date-picker
            v-if="site_name_select_way == 'day'"
            v-model="site_name_select_value"
            type="date"
            placeholder="请选择日期"
            size="large"
          />

          <el-button
            v-if="site_name_select_way != ''"
            type="primary"
            :icon="Search"
            @click="search_site_name"
            size="large"
            >搜索
          </el-button>
          <dv-charts
            :option="site_name_total"
            style="width: 95%; height: 40vh; margin: auto"
          />
        </div>
      </div>
      <div class="card-header"></div>
      <div class="card-body">
        <div>
          <h5 class="card-title" style="font-size: 25px; padding: 5px">
            垃圾趋势统计
          </h5>
          <div class="card-body">
            <!-- <dv-active-ring-chart :config="config_jgzm" style="width:25vw;height: 20vh;" /> -->
            <dv-charts
              :option="config_jgzm"
              style="width: 95%; height: 40vh; margin: auto"
            />
          </div>
        </div>
        <div class="data-view" style="width:100%;">
          <div class="card-Left" style="width:40%;">
            <h5 class="card-title" style="font-size: 25px; padding: 5px">
              垃圾站当前报警
            </h5>
            <h4 class="card-title" style="font-size: 25px; padding: 5px">
              当前状态：<el-tag
                class="mx-1"
                :type="alert_tag.type"
                size="large"
                style="font-size: x-large"
              >
                {{ alert_tag.name }}
              </el-tag>
            </h4>
            <dv-charts
              :option="config_alert"
              style="width: 95%; height: 35vh; margin: auto"
            />
          </div>
          <!-- ================================================================ sunny ========================================================sunny -->
          <div class="card-Right" style="width:60%;">
            <h5 class="card-title" style="font-size: 25px; padding: 5px">
              过去一周各时段垃圾净重平均值统计
            </h5>
            <!-- <div id="avgTime_Line"></div> -->
            <dv-charts
              :option="avgTime_Line"
              style="width: 95%; height: 39vh; margin: auto; padding-top: 4vh"
            />
          </div>

          <!-- ===================================================================================================================================== -->
        </div>
        <div>
          <h5 class="card-title" style="font-size: 25px; padding: 5px">
            垃圾记录
          </h5>
          <el-date-picker
            v-model="value"
            type="daterange"
            unlink-panels
            range-separator="到"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            :shortcuts="shortcuts"
            @change="changeDate"
            size="large"
          />
          <!-- <el-button @click="excuteQuery" size="large" type="primary" style="padding:20px">查询</el-button> -->
          <el-table :data="data" :size="large" width="100%">
            <el-table-column
              property="exactDate"
              label="处理时间"
              width="200px"
            />
            <el-table-column label="承运车辆" width="150">
              <template #default="scope">
                <el-button
                  size="medium"
                  type="primary"
                  link
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.carNumber }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              property="netWeight"
              label="垃圾净重/kg"
              width="150"
            />
            <el-table-column
              property="grossWeight"
              label="垃圾毛重/kg"
              width="150"
            />
            <el-table-column
              property="tareWeight"
              label="垃圾皮重/kg"
              width="150"
            />
            <el-table-column
              property="transporter"
              label="承运单位"
              width="300"
            />
            <el-table-column property="driver" label="司机" width="300" />
            <el-table-column property="tel" label="司机电话" width="300" />
            <el-table-column property="wechat" label="司机微信" width="300" />
          </el-table>
        </div>
        <div class="float-end" style="margin-top: 10px">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total_records"
            :current-page="current_page"
            @current-change="pull_page"
          />
        </div>
      </div>
            <div class="car-transport-header" style="margin-top: 8vh">
        <h5 class="card-title" style="font-size: 25px; padding: 5px">
          运输垃圾的车辆列表
        </h5>
        <div class="car-transport-header-search">
          <el-input
            style="width: 18%"
            class="select-text-box"
            v-model="queryCarNum"
            placeholder="请输入车牌号"
            clearable
            size="large"
          >
          </el-input>
          <el-select
            v-model="car_transport_select_way"
            class="m-2"
            placeholder="选择查询方式"
            clearable
            size="large"
          >
            <el-option
              v-for="item in car_transport_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-if="car_transport_select_way == 'week'"
            v-model="car_transport_select_value"
            type="week"
            format="[Week] ww"
            placeholder="请选择某一周"
            size="large"
            @change="search_car_transport"
          />
          <el-date-picker
            v-if="car_transport_select_way == 'month'"
            v-model="car_transport_select_value"
            type="month"
            placeholder="请选择某个月"
            size="large"
            @change="search_car_transport"
          />

          <el-date-picker
            v-if="car_transport_select_way == 'day'"
            v-model="car_transport_select_value"
            type="date"
            placeholder="请选择日期"
            size="large"
            @change="search_car_transport"
          />
          <el-button type="primary" size="large" @click="exportExcels"
            >导出</el-button
          >
        </div>

        <el-table
          :data="data_total.slice((currentPage - 1) * 10, currentPage * 10)"
          :size="large"
          width="100%"
          id="#vcfResult"
        >
          <el-table-column property="day" label="时间" width="300px" />
          <el-table-column property="siteName" label="站点" width="150" />
          <el-table-column property="carNumber" label="承运车辆" width="150">
          </el-table-column>
          <el-table-column property="frequency" label="运输次数" width="150" />
          <el-table-column
            property="totalWeight"
            label="运输总量/kg"
            width="150"
          />
          <el-table-column
            property="avgWeight"
            label="单次平均运输量/kg"
            width="200"
          />

          <el-table-column property="driver" label="司机" width="300" />
          <el-table-column property="tel" label="司机电话" width="300" />
          <el-table-column property="wechat" label="司机微信" width="300" />
        </el-table>
      </div>
      <div class="float-end" style="margin-top: 10px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="totalRecords"
          :current-page="currentPage"
          @current-change="getTransport"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import Charts from "@jiaminghi/charts";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";



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
import MapContent from "@/components/Mapcontent.vue";
import { getPage, getQuery } from "@/api/content.js";
// ==========================================================================================================sunny
// 导入echarts
import * as echarts from "echarts";

import { useStore } from "vuex";
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import moment from "moment";

const store = useStore();
// let total_records = ref(1000);
// let current_page = ref(1);
// let page_count = 0;

let totalRecords = ref(1000);
let currentPage = ref(1);
let pageCount = 0;
// const data = ref([]);
// const data_total = ref([]);
const queryCarNum = ref("");

let car_transport_select_way = ref("");
let car_transport_select_value = ref("");
let site_name_select_way = ref("");
let site_name_select_value = ref("");

const car_transport_option = [
  {
    value: "day",
    label: "按天查询",
  },
  {
    value: "week",
    label: "按周查询",
  },
  {
    value: "month",
    label: "按月查询",
  },
];
const site_name_option = [
  {
    value: "day",
    label: "按天查询",
  },
  {
    value: "week",
    label: "按周查询",
  },
  {
    value: "month",
    label: "按月查询",
  },
];

var json_data = ref();
var start = ref("");
var end = ref("");
const transport_today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
var transport_start = transport_today;
console.log("transport_start" + transport_start);
const search_car_transport = () => {
  var carNumber = "all";
  if (queryCarNum.value.trim() != "") {
    carNumber = queryCarNum.value.trim();
  }

  console.log("查到的值：" + carNumber);
  if (car_transport_select_value.value == "") {
    ElMessage({
      message: "请选择相应日期",
      type: "error",
    });
  } else {
    var d = new Date(car_transport_select_value.value);
    var start_day =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    start = start_day;
    var month = d.getMonth() + 1;
    if (car_transport_select_way.value == "day") {
      end = start_day;
    }
    if (car_transport_select_way.value == "week") {
      const endTime = new Date(
        new Date(car_transport_select_value.value).getTime() +
          3600 *
            1000 *
            24 *
            (6 - new Date(car_transport_select_value.value).getDay())
      );
      end = moment(endTime).format("YYYY-MM-DD");
    }
    if (car_transport_select_way.value == "month") {
      const end_month = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      end = moment(end_month).format("YYYY-MM-DD");
    }

    getTransportList(start, end, "红花堰", 1, 10000, carNumber);
    car_transport_select_way.value = "";
  }
};
const data_total = reactive([]);
var renhe_car = new Map();
const getTransportList = (
  start,
  end,
  site_name,
  pageNum,
  pageSize,
  carNumber
) => {
  axios({
    url:
      "/api/dump-record/dump_car/" +
      start +
      "/" +
      end +
      "/" +
      site_name +
      "/" +
      pageNum +
      "/" +
      pageSize,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      data_total.splice(0, data_total.length);
      var data = resp.data.data.records;

      if (carNumber == "all") {
        for (var car in data) {
          var currentCar = {
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            avgWeight: data[car].avgWeight,
            frequency: data[car].frequency,
            totalWeight: data[car].totalWeight,
          };
          data_total.push(currentCar);
          json_data.value = data_total;
        }
      } else {
        for (var car in data) {
          if (carNumber == data[car].carNumber) {
            var currentCar = {
              day: start + " 至 " + end,
              siteName: data[car].siteName,
              carNumber: data[car].carNumber,
              avgWeight: data[car].avgWeight,
              frequency: data[car].frequency,
              totalWeight: data[car].totalWeight,
            };
            data_total.push(currentCar);

            json_data.value = data_total;
          }
        }
      }
      console.log("数据长度：" + data.length);
      totalRecords.value = data.length;
      pageCount = parseInt(data.length) % 10;
      currentPage.value = pageNum;
    }
  });
};

getTransportList(transport_start, transport_start, "红花堰", 1, 10000, "all");

const getTransport = (pageNum) => {
  // 当前页
  currentPage.value = pageNum;
};

const exportExcels = () => {
  const titleArr = [
    "时间",
    "站点名称",
    "车牌号",
    "运输次数",
    "运输总量/kg",
    "单次平均运输量/kg",
  ]; //表头中文名
  exportExcel(
    json_data.value,
    "红花堰站运输垃圾的车辆列表 ",
    titleArr,
    "sheetName"
  );
};

function exportExcel(json, name, titleArr, sheetName) {
  /* convert state to workbook */
  var data = new Array();
  var keyArray = new Array();
  const getLength = function (obj) {
    var count = 0;
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  };
  for (const key1 in json) {
    if (json.hasOwnProperty(key1)) {
      const element = json[key1];
      var rowDataArray = new Array();
      for (const key2 in element) {
        if (element.hasOwnProperty(key2)) {
          const element2 = element[key2];
          rowDataArray.push(element2);
          if (keyArray.length < getLength(element)) {
            keyArray.push(key2);
          }
        }
      }
      data.push(rowDataArray);
    }
  }
  // keyArray为英文字段表头
  data.splice(0, 0, keyArray, titleArr);
  console.log("data", data);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  // 此处隐藏英文字段表头
  var wsrows = [{ hidden: true }];
  ws["!rows"] = wsrows; // ws - worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* generate file and send to client */
  XLSX.writeFile(wb, name + ".xlsx");
}

// =============================================================================sunny
const site_name_yAxis = ref([0, 0, 0, 0, 0]);
const site_name_date = ref(["0", 0, 0, 0, 0]);
var today_time = moment().format("YYYY-MM-DD");
site_name_date.value[0] = moment().add(-2, "d").format("YYYY-MM-DD");
site_name_date.value[1] = moment().add(-1, "d").format("YYYY-MM-DD");
site_name_date.value[2] = today_time;
site_name_date.value[3] = moment().add(+1, "d").format("YYYY-MM-DD");
site_name_date.value[4] = moment().add(+2, "d").format("YYYY-MM-DD");

const site_name_sum = ref(0);
// 过去一周各时段垃圾净重平均值统计
const site_name_total = reactive({
  title: {
    text: "红花堰站垃圾总量",
  },
  xAxis: {
    name: "日期",
    data: site_name_date,
  },
  yAxis: {
    name: "垃圾净重",
    data: "value",
    min: 0,
    // maxinterval: 1000,
  },
  series: [
    {
      data: site_name_yAxis,
      type: "bar",
      label: {
        show: true,
        formatter: "{value} 吨",
      },
    },
  ],
});

// =====================================================================================
// 站点天，周，月，季度统计
const search_site_name = () => {
  var start;
  var end;
  if (site_name_select_value.value == "") {
    ElMessage({
      message: "请选择相应日期",
      type: "error",
    });
  } else {
    var d = new Date(site_name_select_value.value);
    var start_day =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    if (site_name_select_way.value == "day") {
      site_name_date.value[0] = moment(start_day)
        .add(-2, "d")
        .format("YYYY-MM-DD");
      site_name_date.value[1] = moment(start_day)
        .add(-1, "d")
        .format("YYYY-MM-DD");
      site_name_date.value[2] = start_day;
      site_name_date.value[3] = moment(start_day)
        .add(+1, "d")
        .format("YYYY-MM-DD");
      site_name_date.value[4] = moment(start_day)
        .add(+2, "d")
        .format("YYYY-MM-DD");
      for (var date = 0; date < 5; date++) {
        getSiteNameList(
          site_name_date.value[date],
          site_name_date.value[date],
          "红花堰",
          1,
          10000,
          date
        );
      }
      site_name_date.value[2] = "当天：" + site_name_date.value[2];
    }
    if (site_name_select_way.value == "week") {
      site_name_date.value[0] = moment(start_day).day(-14).format("YYYY-MM-DD");
      site_name_date.value[1] = moment(start_day).day(-7).format("YYYY-MM-DD");
      site_name_date.value[2] = moment(start_day).day(0).format("YYYY-MM-DD");
      site_name_date.value[3] = moment(start_day).day(7).format("YYYY-MM-DD");
      site_name_date.value[4] = moment(start_day).day(14).format("YYYY-MM-DD");
      for (var date = 0; date < 5; date++) {
        start = site_name_date.value[date];
        end = moment(site_name_date.value[date]).day(6).format("YYYY-MM-DD");
        getSiteNameList(start, end, "红花堰", 1, 10000, date);
        site_name_date.value[date] = start + " 至 " + end;
      }
      site_name_date.value[2] = "当周：" + site_name_date.value[2];
    }
    if (site_name_select_way.value == "month") {
      site_name_date.value[0] = moment(start_day)
        .month(moment(start_day).month() - 2)
        .startOf("month")
        .format("YYYY-MM-DD");
      site_name_date.value[1] = moment(start_day)
        .month(moment(start_day).month() - 1)
        .startOf("month")
        .format("YYYY-MM-DD");
      site_name_date.value[2] = moment(start_day)
        .startOf("month")
        .format("YYYY-MM-DD");
      site_name_date.value[3] = moment(start_day)
        .month(moment(start_day).month() + 1)
        .startOf("month")
        .format("YYYY-MM-DD");
      site_name_date.value[4] = moment(start_day)
        .month(moment(start_day).month() + 2)
        .startOf("month")
        .format("YYYY-MM-DD");
      for (var date = 0; date < 5; date++) {
        start = site_name_date.value[date];
        end = moment(site_name_date.value[date])
          .endOf("month")
          .format("YYYY-MM-DD");
        getSiteNameList(start, end, "红花堰", 1, 10000, date);
        site_name_date.value[date] = moment(site_name_date.value[date])
          .startOf("month")
          .format("YYYY-MM");
      }
      site_name_date.value[2] = "当月：" + site_name_date.value[2];
    }
    // console.log("查询到的日期：" + start_day);

    // getSiteNameList(start, end, "红花堰", 1, 10000);
    site_name_select_way.value = "";
  }
};

const getSiteNameList = (start, end, site_name, pageNum, pageSize, date) => {
  axios({
    url:
      "/api/dump-record/dump_car/" +
      start +
      "/" +
      end +
      "/" +
      site_name +
      "/" +
      pageNum +
      "/" +
      pageSize,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data.records;
      site_name_sum.value = 0;
      for (let i = 0; i < data.length; i++) {
        site_name_sum.value = data[i].totalWeight + site_name_sum.value;
      }

      site_name_sum.value =
        Math.floor((site_name_sum.value / 1000) * 100) / 100;
      console.log("总量：" + Number(site_name_sum.value.toFixed(0)));

      site_name_yAxis.value[date] = Number(site_name_sum.value.toFixed(0));
    }
  });
};
const recent_days_total = (site_name_date) => {
  for (var date = 0; date < 5; date++) {
    getSiteNameList(
      site_name_date.value[date],
      site_name_date.value[date],
      "红花堰",
      1,
      10000,
      date
    );
  }
};
recent_days_total(site_name_date);

//===============================================================================================================
//===============================================================================================================
const value = ref("");
const shortcuts = [
  {
    text: "今天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [today, tomorrow];
    },
  },
  {
    text: "过去一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [week_before, tomorrow];
    },
  },
  {
    text: "上个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [month_before, tomorrow];
    },
  },
];
const today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();

const month_total = ref(0);
const yAxis_alert = ref([0, 0]);
const yAxis_line = ref([0, 0, 0, 0, 0, 0]);
const alert_tag = ref({ name: "正常", type: "success" });
const config_alert = reactive({
  title: {
    text: "垃圾报警对比",
  },
  xAxis: {
    name: "日期",
    data: ["垃圾预测量", today + " 今日目前垃圾量"],
  },
  yAxis: {
    name: "垃圾净重",
    data: "value",
    min: 0,
    interval: 30,
  },
  series: [
    {
      data: yAxis_alert,
      type: "bar",
      label: {
        show: true,
        formatter: "{value} 吨",
      },
    },
  ],
});

// =============================================================================sunny
// 过去一周各时段垃圾净重平均值统计
const avgTime_Line = reactive({
  title: {
    text: "各时段垃圾平均净重",
  },
  xAxis: {
    name: "日期",
    data: ["0-4点", "4-8点", "8-12点", "12-16点", "16-20点", "20-24点"],
  },
  yAxis: {
    name: "垃圾净重",
    data: "value",
    min: 0,
    interval: 20,
  },
  series: [
    {
      data: yAxis_line,
      type: "line",
      label: {
        show: true,
        formatter: "{value} 吨",
      },
    },
  ],
});
// =====================================================================================

function changeDate() {
  start =
    value.value[0].getFullYear() +
    "-" +
    (value.value[0].getMonth() + 1) +
    "-" +
    value.value[0].getDate();
  end =
    value.value[1].getFullYear() +
    "-" +
    (value.value[1].getMonth() + 1) +
    "-" +
    value.value[1].getDate();
  getQuery("红花堰", "transporter", start, end, 1, 10000).then(function (resp) {
    total_records.value = resp.length;

    console.log((total_records.value = resp.length));
    page_count = parseInt(resp.length) % 10;
    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery("红花堰", "transporter", start, end, 1, 10).then(function (resp) {
    total_records.value = resp.length;
    page_count = parseInt(resp.length) % 10;
    data.value = resp;
  });
}
var time = new Date().getTime();
var weekTime = new Date(time - 7 * 24 * 60 * 60 * 1000);
var month_time = new Date(time - 31 * 24 * 60 * 60 * 1000);
const week_before =
  weekTime.getFullYear() + "-" + weekTime.getMonth() + "-" + weekTime.getDate();
const month_before =
  month_time.getFullYear() +
  "-" +
  month_time.getMonth() +
  "-" +
  month_time.getDate();

let total_records = ref(1000);
let current_page = ref(1);
let page_count = 0;
const data = ref([]);
const tomorrow =
  new Date(time + 1 * 24 * 60 * 60 * 1000).getFullYear() +
  "-" +
  (new Date(time + 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
  "-" +
  new Date(time + 1 * 24 * 60 * 60 * 1000).getDate();
var start = today;
var end = tomorrow;
const total = ref(2);
const yAxis = ref([]);
const router = useRouter();

onBeforeMount(() => {
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;
    yAxis.value[0] = Number(total.value.toFixed(0));
  });
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;
    yAxis.value[1] = Number(total.value.toFixed(0));
  });
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;
    yAxis.value[2] = Number(total.value.toFixed(0));
    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;
    yAxis.value[3] = Number(total.value.toFixed(0));

    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;
    yAxis.value[4] = Number(total.value.toFixed(0));

    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time).getFullYear() +
      "-" +
      (new Date(time).getMonth() + 1) +
      "-" +
      new Date(time).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;

    yAxis.value[5] = Number(total.value.toFixed(0));

    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery("红花堰", "transporter", today, tomorrow, 1, 10000).then(function (
    resp
  ) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total.value = resp[i].netWeight + total.value;
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100;

    yAxis.value[6] = Number(total.value.toFixed(0));
    yAxis_alert.value[1] = yAxis.value[6];
    total_records.value = resp.length;
    page_count = parseInt(resp.length) % 10;
    var count = 0;
    for (let i = 1; i < 7; i++) {
      count++;
      var cal_day =
        new Date(time - i * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - i * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - i * 24 * 60 * 60 * 1000).getDate();
      var cal_time =
        new Date(time - i * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - i * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        (new Date(time - i * 24 * 60 * 60 * 1000).getDate() +
          "T" +
          new Date(time - i * 24 * 60 * 60 * 1000).getHours() +
          ":" +
          new Date(time - i * 24 * 60 * 60 * 1000).getMinutes() +
          ":" +
          new Date(time - i * 24 * 60 * 60 * 1000).getSeconds());
      getQuery("红花堰", "transporter", cal_day, cal_time, 1, 10000).then(
        function (resp) {
          for (let i = 0; i < resp.length; i++) {
            month_total.value = resp[i].netWeight + month_total.value;
          }

          if (count == 6) {
            yAxis_alert.value[0] =
              (month_total.value / 1000 / 6).toFixed(0) * 1;
            console.log(yAxis_alert.value[0])
              console.log(yAxis.value[6])
            var alert_status = Math.abs(yAxis_alert.value[0] - yAxis.value[6]);
            console.log(alert_status)
console.log(Number((yAxis_alert.value[0] * 0.2).toFixed(0)))
            if (
              alert_status <= Number((yAxis_alert.value[0] * 0.2))
            ) {
              alert_tag.value.type = "success";
              alert_tag.value.name = "正常";
            } else if (
              alert_status > Number((yAxis_alert.value[0] * 0.2))
            ) {
              var alert_status_signed = yAxis_alert.value[0] - yAxis.value[6];
              if (alert_status_signed > 0) {
                alert_tag.value.name = "低于预测值的20%";
                alert_tag.value.type = "danger";
              } else {
                alert_tag.value.name = "超过预测值的20%";
                alert_tag.value.type = "danger";
              }
            }
            // else if (alert_status >= Number((yAxis_alert.value[0] * 0.3).toFixed(0))) {
            //     alert_tag.value.name = '警告，与预估值相差大于' + yAxis_alert.value[0] * 0.3 + '吨,目前相差' + alert_status + '吨'
            //     alert_tag.value.type = 'danger'
            // }
          }
        }
      );
    }
    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery("红花堰", "transporter", today, tomorrow, 1, 10).then(function (
    resp
  ) {
    data.value = resp;
    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });

  // =================================================================================sunny
  /**
   * 通过接口获取后端数据
   * 查找开始时间是七天前凌晨开始，到今天凌晨，一共七天，比如今天是2023.02.01，则从2023.01.25凌晨开始，2023.02.01凌晨结束，不算今天的
   */
  getQuery(
    "红花堰",
    "transporter",
    new Date(time - 7 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 7 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 7 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time).getFullYear() +
      "-" +
      (new Date(time).getMonth() + 1) +
      "-" +
      new Date(time).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      //截取后台数据中的处理时间的几点，比如2023-02-01T03:20:41  截取字符串03并转换成数值3，表示3点
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (0 <= result && result < 4) {
        //满足00：00-04：00之间的垃圾求净重量的总量
        total.value = resp[i].netWeight + total.value;
      }
    }
    //七天的平均值
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    //更改图表上对应位置的数据
    yAxis_line.value[0] = Number(total.value.toFixed(0));

    //满足00：40-08：00之间的垃圾求净重量的总量
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (4 <= result && result < 8) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[1] = Number(total.value.toFixed(0));

    //满足08：00-12：00之间的垃圾求净重量的总量
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (8 <= result && result < 12) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[2] = Number(total.value.toFixed(0));

    //满足12：00-16：00之间的垃圾求净重量的总量
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (12 <= result && result < 16) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[3] = Number(total.value.toFixed(0));

    //满足16：00-20：00之间的垃圾求净重量的总量
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (16 <= result && result < 20) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[4] = Number(total.value.toFixed(0));

    //满足20：00-24：00之间的垃圾求净重量的总量
    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (20 <= result && result < 24) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[5] = Number(total.value.toFixed(0));
  });
  // ======================================================================================
});
const pull_page = (page) => {
  // Object.keys(patrolInfo).map(key => {
  //     delete patrolInfo[key]
  // });
  current_page.value = page;
  getQuery("红花堰", "transporter", start, end, page, 10).then(function (resp) {
    data.value = resp;
    ifShowQueryResult.value = false;
  });
};

const config_jgzm = reactive({
  title: {
    text: "过去一周垃圾趋势",
  },
  xAxis: {
    name: "日期",
    data: [
      new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
      new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
      new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(),
      new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
      new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(),
      new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() +
        "-" +
        (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
        "-" +
        new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(),
      today,
    ],
  },
  yAxis: {
    name: "垃圾净重",
    data: "value",
    min: 0,
    interval: 50,
  },
  series: [
    {
      data: yAxis,
      type: "bar",
      label: {
        show: true,
        formatter: "{value} 吨",
      },
    },
  ],
});
const handleEdit = (index, row) => {
  var carNumber = row.carNumber;
  router.push({ name: "carRecord", query: { carNumber: carNumber } });
  console.log(index, row.carNumber);
};
// ======================================================================================================sunny
// const fontSizeSwitch = (res) => {
//   let clientWidth =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth
//   if (!clientWidth) return
//   let fontSize = 100 * (clientWidth / 1707)
//   return res * fontSize
// }

// let category_chart = null
// let categoryOption = {
//   // 绘制图表
//   // title: {
//   //   text: 'ECharts 入门示例',
//   // },
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'shadow',
//     },
//   },
//   grid: {
//     left: '1%',
//     right: '10%',
//     bottom: '0%',
//     containLabel: true,
//   },

//   xAxis: {
//     data: ['0-4点', '4-8点', '8-12点', '12-16点', '16-20点', '20-24点'],

//     axisTick: {
//       alignWithLabel: true,
//     },
//     axisLabel: {
//       interval: 0,
//       rotate: 50,
//     },
//   },
//   yAxis: {
//     name: '垃圾净重',
//     //设置数轴显示内容的类型是数值
//     type: 'value',
//     //从0开始，刻度之间间隔10
//     min: 0,
//     interval: 10,
//     //显示竖轴的边框线
//     show: true,
//     axisLine: { show: true },
//     //显示刻度
//     axisTick: { show: true },
//     axisLabel: {
//       // fontSize: fontSizeSwitch(0.14),
//     },
//   },
//   //图表上显示不同颜色的折线表示什么意义，必须与下面series中name的名字对应才能显示出来！
//   // legend: {
//   //   data: ['一', '二','三','四','五','六','七'],
//   // },
//   //鼠标浮动在图表上会有具体内容展示
//   tooltip: {
//     trigger: 'axis',
//   },
//   series: [
//     {
//       //设置图表类型是折线图
//       name: '垃圾净重量平均值',
//       type: 'line',
//       data: [
//         { value: 0 },
//         { value: 0 },
//         { value: 0 },
//         { value: 0 },
//         { value: 0 },
//         { value: 0 },
//       ],
//       label: {
//         show: true,
//         position: 'top',
//         // fontSize: fontSizeSwitch(0.1),
//         formatter: '{c} 吨',
//       },
//     },
//   ],
// }
// const create_category_data = () => {
//   let chartDom = document.getElementById('avgTime_Line')
//   category_chart = echarts.init(chartDom)

//   category_chart.setOption(categoryOption)
//   window.addEventListener('resize', category_chart.resize)
//   console.log(categoryOption.series[0].data[0].value)
//   getQuery(
//     '红花堰',
//     'transporter',
//     new Date(time - 7 * 24 * 60 * 60 * 1000).getFullYear() +
//       '-' +
//       (new Date(time - 7 * 24 * 60 * 60 * 1000).getMonth() + 1) +
//       '-' +
//       new Date(time - 7 * 24 * 60 * 60 * 1000).getDate(),
//     new Date(time).getFullYear() +
//       '-' +
//       (new Date(time).getMonth() + 1) +
//       '-' +
//       new Date(time).getDate(),
//     1,
//     10000
//   ).then(function (resp) {
//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (0 <= result && result < 4) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[0].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)

//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (4 <= result && result < 8) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[1].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)

//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (8 <= result && result < 12) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[2].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)

//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (12 <= result && result < 16) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[3].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)

//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (16 <= result && result < 20) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[4].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)

//     total.value = 0
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (20 <= result && result < 24) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7
//     categoryOption.series[0].data[5].value = Number(total.value.toFixed(0))
//     category_chart.setOption(categoryOption)
//   })
// }

// // const ageGenderRequest = () => {

// // }

// onMounted(() => {
//   create_category_data()
// })

// onBeforeUnmount(() => {
//   window.removeEventListener('resize', category_chart.resize)
//   if (category_chart) {
//     category_chart.dispose()
//     category_chart = null
//   }
// })

// ===========================================================================================================
</script>

<style>
.data-view {
  width: 100%;
  /* display: flex; */
  /* justify-content:space-between; */
}
/* .card-Left {
  width: 10%;
  display:inline-block
}
.card-Right {
  width: 10%;
  display:inline-block
} */
#avgTime_Line {
  /* padding-left:2vw; */
  height: 22vw;
  /* width:50%; */
}
.card-body {
  width: 100%;
}
</style>
