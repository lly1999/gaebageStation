<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        西华垃圾站数据统计
      </h5>
    </el-header>
    <el-main>
      <div class="card-header"></div>
      <!-- <div class="card-body"> -->
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
      <div class="data-view">
        <div class="card-Left">
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
        <div class="card-Right">
          <h5 class="card-title" style="font-size: 25px; padding: 5px">
            过去一周各时段垃圾净重平均值统计
          </h5>

          <!-- <div id="avgTime_Line"></div> -->
          <dv-charts
            :option="avgTime_Line"
            style="width: 95%; height: 35vh; margin: auto; padding-top: 5vh"
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
      <!-- </div> -->
    </el-main>
  </el-container>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import Charts from "@jiaminghi/charts";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
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
import { getPage, getQuery } from "@/api/content.js";
// ==========================================================================================================sunny
// 导入echarts
import * as echarts from "echarts";

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
  getQuery("西华", "transporter", start, end, 1, 10000).then(function (resp) {
    total_records.value = resp.length;

    console.log((total_records.value = resp.length));
    page_count = parseInt(resp.length) % 10;
    // patrols.value.splice(0, patrols.value.length);
    // total_records.value = parseInt(resp.total);
    // page_count = parseInt(resp.data.data.pages);
    // ifShowQueryResult.value = false;
  });
  getQuery("西华", "transporter", start, end, 1, 10).then(function (resp) {
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
const today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
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
const month_total = ref(0);
const router = useRouter();

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
    interval: 150,
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
    text: "垃圾报警对比",
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

onBeforeMount(() => {
  // 获取报警信息

  getQuery(
    "西华",
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
    "西华",
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
    "西华",
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
    "西华",
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
    "西华",
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
    "西华",
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
  getQuery("西华", "transporter", today, tomorrow, 1, 10000).then(function (
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
      getQuery("西华", "transporter", cal_day, cal_time, 1, 10000).then(
        function (resp) {
          for (let i = 0; i < resp.length; i++) {
            month_total.value = resp[i].netWeight + month_total.value;
          }

          if (count == 6) {
            yAxis_alert.value[0] =
              (month_total.value / 1000 / 6).toFixed(0) * 1;
            var alert_status = Math.abs(yAxis_alert.value[0] - yAxis.value[6]);

            if (
              alert_status < Number((yAxis_alert.value[0] * 0.2).toFixed(0))
            ) {
              alert_tag.value.type = "success";
              alert_tag.value.name = "正常";
            } else if (
              alert_status >= Number((yAxis_alert.value[0] * 0.2).toFixed(0))
            ) {
              var alert_status_signed = yAxis_alert.value[0] - yAxis.value[6];
              console.log(alert_status_signed);
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
  getQuery("西华", "transporter", today, tomorrow, 1, 10).then(function (resp) {
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
    "西华",
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
  getQuery("西华", "transporter", start, end, page, 10).then(function (resp) {
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
    interval: 200,
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
//调整字体大小
// const fontSizeSwitch = (res) => {
//   let clientWidth =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth
//   if (!clientWidth) return
//   let fontSize = 100 * (clientWidth / 1707)
//   return res * fontSize
// }

//全局定义图表
// let category_chart = null;

// //图表的基础模板
// let categoryOption = {
//   // 绘制图表
//   // title: {
//   //   text: 'ECharts 入门示例',
//   // },
//   tooltip: {
//     trigger: "axis",
//     axisPointer: {
//       type: "shadow",
//     },
//   },
//   grid: {
//     left: "10%",
//     right: "10%",
//     bottom: "0%",
//     containLabel: true,
//   },

//   xAxis: {
//     data: ["0-4点", "4-8点", "8-12点", "12-16点", "16-20点", "20-24点"],

//     axisTick: {
//       alignWithLabel: true,
//     },
//     axisLabel: {
//       interval: 0,
//       rotate: 50,
//     },
//   },
//   yAxis: {
//     name: "垃圾净重",
//     //设置数轴显示内容的类型是数值
//     type: "value",
//     //从0开始，刻度之间间隔10
//     min: 0,
//     interval: 20,
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
//     trigger: "axis",
//   },
//   series: [
//     {
//       name: "垃圾净重量平均值",
//       //设置图表类型是折线图
//       type: "line",
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
//         position: "top",
//         // fontSize: fontSizeSwitch(0.1),
//         //展示每个点的对应数值，这里必须是{c}才能显示数据
//         formatter: "{c} 吨",
//       },
//     },
//   ],
// };

// //Dom挂载完毕，可以拿到组件渲染后的 DOM节点，展示图表
// onMounted(() => {
//   create_category_data();
// });

/**
 * 获取后端数据，并动态展示在图表上
 */
// const create_category_data = () => {
//   let chartDom = document.getElementById("avgTime_Line");
//   //初始化图表
//   category_chart = echarts.init(chartDom);

//   //绘制图表
//   category_chart.setOption(categoryOption);
//   window.addEventListener("resize", category_chart.resize);

//   /**
//    * 通过接口获取后端数据
//    * 查找开始时间是七天前凌晨开始，到今天凌晨，一共七天，比如今天是2023.02.01，则从2023.01.25凌晨开始，2023.02.01凌晨结束，不算今天的
//    */
//   getQuery(
//     "西华",
//     "transporter",
//     new Date(time - 7 * 24 * 60 * 60 * 1000).getFullYear() +
//       "-" +
//       (new Date(time - 7 * 24 * 60 * 60 * 1000).getMonth() + 1) +
//       "-" +
//       new Date(time - 7 * 24 * 60 * 60 * 1000).getDate(),
//     new Date(time).getFullYear() +
//       "-" +
//       (new Date(time).getMonth() + 1) +
//       "-" +
//       new Date(time).getDate(),
//     1,
//     10000
//   ).then(function (resp) {
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       //截取后台数据中的处理时间的几点，比如2023-02-01T03:20:41  截取字符串03并转换成数值3，表示3点
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (0 <= result && result < 4) {
//         //满足00：00-04：00之间的垃圾求净重量的总量
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     //七天的平均值
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     //更改图表上对应位置的数据
//     categoryOption.series[0].data[0].value = Number(total.value.toFixed(0));
//     //更新页面上的图表
//     category_chart.setOption(categoryOption);

//     //满足00：40-08：00之间的垃圾求净重量的总量
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (4 <= result && result < 8) {
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     categoryOption.series[0].data[1].value = Number(total.value.toFixed(0));
//     category_chart.setOption(categoryOption);

//     //满足08：00-12：00之间的垃圾求净重量的总量
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (8 <= result && result < 12) {
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     categoryOption.series[0].data[2].value = Number(total.value.toFixed(0));
//     category_chart.setOption(categoryOption);

//     //满足12：00-16：00之间的垃圾求净重量的总量
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (12 <= result && result < 16) {
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     categoryOption.series[0].data[3].value = Number(total.value.toFixed(0));
//     category_chart.setOption(categoryOption);

//     //满足16：00-20：00之间的垃圾求净重量的总量
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (16 <= result && result < 20) {
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     categoryOption.series[0].data[4].value = Number(total.value.toFixed(0));
//     category_chart.setOption(categoryOption);

//     //满足20：00-24：00之间的垃圾求净重量的总量
//     total.value = 0;
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf("T");
//       let result = Number(resp[i].exactDate.substr(index + 1, 2));
//       if (20 <= result && result < 24) {
//         total.value = resp[i].netWeight + total.value;
//       }
//     }
//     total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
//     categoryOption.series[0].data[5].value = Number(total.value.toFixed(0));
//     category_chart.setOption(categoryOption);
//   });
// };

// const ageGenderRequest = () => {

// }

//Dom即将销毁，做一些清理操作
// onBeforeUnmount(() => {
//   window.removeEventListener("resize", category_chart.resize);
//   if (category_chart) {
//     category_chart.dispose();
//     category_chart = null;
//   }
// });

// ===========================================================================================================
</script>

<style>
.data-view {
  width: 100%;
  /* display: flex; */
  height: 422px;
  /* justify-content:space-between; */
}
.card-Left {
  width: 400px;
  height: 422px;
}
.card-Right {
  width: 60%;
  height: 422px;
  /* padding-left:2vw; */
}
#avgTime_Line {
  /* padding-left:2vw; */
  height: 422px;
  width: 90%;
}
.card-body {
  width: 100%;
}
</style>
