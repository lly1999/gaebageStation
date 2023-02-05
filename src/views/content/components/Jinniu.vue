<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        垃圾大站（红星，西华）总量数据统计
      </h5>
    </el-header>
    <el-main>
      <div class="card-header"></div>
      <div class="card-body">
        <div>
          <h5 class="card-title" style="font-size: 25px; padding: 5px">
            垃圾大站总量趋势统计
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
            <!-- <h5 class="card-title" style="font-size:25px;padding:5px ;">垃圾大站今日总量</h5>
                <li style="font-size:25px;padding:5px">
                </li> -->
            <!-- <dv-charts :option="config_today" style="width:50vw;height: 30vh;" /> -->
            <!-- <el-date-picker v-model="value" type="daterange" unlink-panels range-separator="到"
                    start-placeholder="选择开始时间" end-placeholder="选择结束时间" :shortcuts="shortcuts" @change="changeDate"
                    size="large" />
                <el-table :data="data" :size="large" width="100%">
                    <el-table-column property="exactDate" label="处理时间" width="200px" />
                    <el-table-column property="carNumber" label="承运车辆" width="150" />
                    <el-table-column property="netWeight" label="垃圾净重/kg" width="200" />
                    <el-table-column property="grossWeight" label="垃圾毛重/kg" width="200" />
                    <el-table-column property="tareWeight" label="垃圾皮重/kg" width="200" />
                    <el-table-column property="transporter" label="承运单位" width="300" />



                </el-table> -->
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
      </div>
      <!-- <div class="float-end" style="margin-top: 10px">
                <el-pagination background layout="total, prev, pager, next, jumper" :total="total_records"
                    :current-page="current_page" @current-change="pull_page" />
            </div> -->
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
  getQuery("红星", "transporter", start, end, 1, 10000).then(function (resp) {
    total_records.value = resp.length;

    console.log((total_records.value = resp.length));
    page_count = parseInt(resp.length) % 10;
  });
  getQuery("红星", "transporter", start, end, 1, 10).then(function (resp) {
    total_records.value = resp.length;
    page_count = parseInt(resp.length) % 10;
    data.value = resp;
  });
}
var time = new Date().getTime();
var weekTime = new Date(time - 7 * 24 * 60 * 60 * 1000);
var month_time = new Date(time - 31 * 24 * 60 * 60 * 1000);
const week_before =
  weekTime.getFullYear() +
  "-" +
  (weekTime.getMonth() + 1) +
  "-" +
  weekTime.getDate();
const month_before =
  month_time.getFullYear() +
  "-" +
  (month_time.getMonth() + 1) +
  "-" +
  month_time.getDate();
const current_time =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate() +
  "T" +
  new Date().getHours() +
  ":" +
  new Date().getMinutes() +
  ":" +
  new Date().getSeconds();
const month_avg = ref(0);
const month_total = ref(0);
const alert_tag = ref({ name: "正常", type: "success" });
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
const total_hongxing = ref(2);
const total_xihua = ref(2);
const total = ref(2);
const week_avg = ref(0);
const yAxis_alert = ref([0, 0]);
const yAxis_line = ref([0, 0, 0, 0, 0, 0]);
const yAxis_week = ref([0, 0, 0, 0, 0, 0, 0]);
const yAxis_total = ref([0, 0, 0, 0, 0, 0, 0]);
const period_data = reactive({
  zero_four: 0,
  four_eight: 0,
  eight_twelve: 0,
  twelve_sixteen: 0,
  sixteen_twenty: 0,
  twenty_zero: 0,
});
onBeforeMount(() => {
  var count = 0;
  //本日数据统计
  getQuery(
    "红星",
    "transporter",
    today + "T00%3A00%3A00",
    today + "T04%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    yAxis_total.value.splice(0, 6);

    for (let i = 0; i < resp.length; i++) {
      period_data.zero_four = resp[i].netWeight + period_data.zero_four;
    }
  });
  getQuery(
    "西华",
    "transporter",
    today + "T00%3A00%3A00",
    today + "T04%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.zero_four = resp[i].netWeight + period_data.zero_four;
    }
    period_data.zero_four =
      Math.floor((period_data.zero_four / 1000) * 100) / 100;
    yAxis_total.value[0] = period_data.zero_four;
  });
  getQuery(
    "红星",
    "transporter",
    today + "T04%3A00%3A00",
    today + "T08%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.four_eight = resp[i].netWeight + period_data.four_eight;
    }
    period_data.four_eight =
      Math.floor((period_data.four_eight / 1000) * 100) / 100;
  });
  getQuery(
    "西华",
    "transporter",
    today + "T04%3A00%3A00",
    today + "T08%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.four_eight = resp[i].netWeight + period_data.four_eight;
    }
    period_data.four_eight =
      Math.floor((period_data.four_eight / 1000) * 100) / 100;
    yAxis_total.value[1] = period_data.four_eight;
  });
  getQuery(
    "红星",
    "transporter",
    today + "T08%3A00%3A00",
    today + "T12%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.eight_twelve = resp[i].netWeight + period_data.eight_twelve;
    }
    period_data.eight_twelve =
      Math.floor((period_data.eight_twelve / 1000) * 100) / 100;
  });
  getQuery(
    "西华",
    "transporter",
    today + "T08%3A00%3A00",
    today + "T12%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.eight_twelve = resp[i].netWeight + period_data.eight_twelve;
    }
    period_data.eight_twelve =
      Math.floor((period_data.eight_twelve / 1000) * 100) / 100;
    yAxis_total.value[2] = period_data.eight_twelve;
  });

  getQuery(
    "红星",
    "transporter",
    today + "T12%3A00%3A00",
    today + "T16%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.twelve_sixteen =
        resp[i].netWeight + period_data.twelve_sixteen;
    }
    period_data.twelve_sixteen =
      Math.floor((period_data.twelve_sixteen / 1000) * 100) / 100;
  });
  getQuery(
    "西华",
    "transporter",
    today + "T12%3A00%3A00",
    today + "T16%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.twelve_sixteen =
        resp[i].netWeight + period_data.twelve_sixteen;
    }
    period_data.twelve_sixteen =
      Math.floor((period_data.twelve_sixteen / 1000) * 100) / 100;

    yAxis_total.value[3] = period_data.twelve_sixteen;
  });
  getQuery(
    "红星",
    "transporter",
    today + "T16%3A00%3A00",
    today + "T20%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.sixteen_twenty =
        resp[i].netWeight + period_data.sixteen_twenty;
    }
    period_data.sixteen_twenty =
      Math.floor((period_data.sixteen_twenty / 1000) * 100) / 100;
  });
  getQuery(
    "西华",
    "transporter",
    today + "T16%3A00%3A00",
    today + "T20%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.sixteen_twenty =
        resp[i].netWeight + period_data.sixteen_twenty;
    }
    period_data.sixteen_twenty =
      Math.floor((period_data.sixteen_twenty / 1000) * 100) / 100;

    yAxis_total.value[4] = period_data.four_eight;
  });
  getQuery(
    "红星",
    "transporter",
    today + "T20%3A00%3A00",
    today + "T24%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.twenty_zero = resp[i].netWeight + period_data.twenty_zero;
    }
    period_data.twenty_zero =
      Math.floor((period_data.twenty_zero / 1000) * 100) / 100;
  });
  getQuery(
    "西华",
    "transporter",
    today + "T20%3A00%3A00",
    today + "T24%3A00%3A00",
    1,
    10000
  ).then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      period_data.twenty_zero = resp[i].netWeight + period_data.twenty_zero;
    }
    period_data.twenty_zero =
      Math.floor((period_data.twenty_zero / 1000) * 100) / 100;

    yAxis_total.value[1] = period_data.four_eight;
  });

  //过去一周的统计数据
  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[0] =
      (yAxis_week.value[0] + total_hongxing.value).toFixed(0) * 1;
  });
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
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;

    yAxis_week.value[0] = yAxis_week.value[0] + total_xihua.value;
    yAxis_week.value[0] = Number(
      (Math.floor(yAxis_week.value[0] * 100) / 100).toFixed(0)
    );
  });
  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[1] =
      (yAxis_week.value[1] + total_hongxing.value).toFixed(0) * 1;
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
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;
    yAxis_week.value[1] = yAxis_week.value[1] + total_xihua.value;
    yAxis_week.value[1] = Number(
      (Math.floor(yAxis_week.value[1] * 100) / 100).toFixed(0)
    );
  });
  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[2] =
      (yAxis_week.value[2] + total_hongxing.value).toFixed(0) * 1;
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
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;
    yAxis_week.value[2] = yAxis_week.value[2] + total_xihua.value;
    yAxis_week.value[2] = Number(
      (Math.floor(yAxis_week.value[2] * 100) / 100).toFixed(0)
    );
  });

  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[3] =
      (yAxis_week.value[3] + total_hongxing.value).toFixed(0) * 1;
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
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;
    yAxis_week.value[3] = yAxis_week.value[3] + total_xihua.value;
    yAxis_week.value[3] = Number(
      (Math.floor(yAxis_week.value[3] * 100) / 100).toFixed(0)
    );
  });
  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[4] =
      (yAxis_week.value[4] + total_hongxing.value).toFixed(0) * 1;
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
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;
    yAxis_week.value[4] = yAxis_week.value[4] + total_xihua.value;
    yAxis_week.value[4] = Number(
      (Math.floor(yAxis_week.value[4] * 100) / 100).toFixed(0)
    );
  });
  getQuery(
    "红星",
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[5] =
      (yAxis_week.value[5] + total_hongxing.value).toFixed(0) * 1;
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
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[5] = yAxis_week.value[5] + total_hongxing.value;
    yAxis_week.value[5] = Number(
      (Math.floor(yAxis_week.value[5] * 100) / 100).toFixed(0)
    );
  });

  getQuery("红星", "transporter", today, tomorrow, 1, 10000).then(function (
    resp
  ) {
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value;
    }
    total_hongxing.value =
      Math.floor((total_hongxing.value / 1000) * 100) / 100;
    yAxis_week.value[6] =
      (yAxis_week.value[6] + total_hongxing.value).toFixed(0) * 1;
    yAxis_alert.value[1] = yAxis_week.value[6];

    total_records.value = resp.length;
    page_count = parseInt(resp.length) % 10;
  });
  getQuery("西华", "transporter", today, tomorrow, 1, 10000).then(function (
    resp
  ) {
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value;
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100;
    yAxis_week.value[6] = yAxis_week.value[6] + total_xihua.value;
    yAxis_week.value[6] = Number(
      (Math.floor(yAxis_week.value[6] * 100) / 100).toFixed(0)
    );
    total.value = yAxis_week.value[6];
    yAxis_alert.value[1] = yAxis_week.value[6];
  });
  getQuery("红星", "transporter", today, tomorrow, 1, 10).then(function (resp) {
    data.value = resp;
  });

  // 计算报警信息
  var total_avg = 0;
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
    getQuery("红星", "transporter", cal_day, cal_time, 1, 10000).then(function (
      resp
    ) {
      for (let i = 0; i < resp.length; i++) {
        month_total.value = resp[i].netWeight + month_total.value;
      }
      getQuery("西华", "transporter", cal_day, cal_time, 1, 10000).then(
        function (resp) {
          for (let i = 0; i < resp.length; i++) {
            month_total.value = resp[i].netWeight + month_total.value;
          }
          if (count == 6) {
            yAxis_alert.value[0] =
              (month_total.value / 1000 / 6).toFixed(0) * 1;
            var alert_status = Math.abs(
              yAxis_alert.value[0] - yAxis_week.value[6]
            );

            // console.log(Number((yAxis_alert.value[0] * 0.15).toFixed(0)))
            if (
              alert_status < Number((yAxis_alert.value[0] * 0.2).toFixed(0))
            ) {
              alert_tag.value.type = "success";
              alert_tag.value.name = "正常";
            } else if (
              alert_status > Number((yAxis_alert.value[0] * 0.2).toFixed(0))
            ) {
              var alert_status_signed =
                yAxis_alert.value[0] - yAxis_week.value[6];
              console.log(alert_status_signed > 0);

              if (alert_status_signed > 0) {
                alert_tag.value.name = "低于预测值的20%";
                alert_tag.value.type = "danger";
              } else {
                alert_tag.value.name = "超过预测值的20%";
                alert_tag.value.type = "danger";
              }
            }
            // else if (alert_status > Number((yAxis_alert.value[0] * 0.3).toFixed(0))) {
            //     alert_tag.value.name = '警告，与预估值相差大于' + yAxis_alert.value[0] * 0.3 + '吨,目前相差' + alert_status + '吨'
            //     alert_tag.value.type = 'danger'
            // }
          }
        }
      );
    });
  }

  /**
   * 先调用getQuery统计西华的不同时段垃圾净重量平均值，并绘制到图表上
   * 再调用getQuery统计红星的，并在统计某一个时段的垃圾净重量平均值之后加上图表上已展示出来的西华对应时段的垃圾净重量平均值
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
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (0 <= result && result < 4) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value = Math.floor((total.value / 1000) * 100) / 100 / 7;
    yAxis_line.value[0] = Number(total.value.toFixed(0));

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

  getQuery(
    "红星",
    "transporter",
    new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() +
      "-" +
      (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) +
      "-" +
      new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
    new Date(time).getFullYear() +
      "-" +
      (new Date(time).getMonth() + 1) +
      "-" +
      new Date(time).getDate(),
    1,
    10000
  ).then(function (resp) {
    total.value = 0;
    // console.log(categoryOption.series[0].data[0].value)
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (0 <= result && result < 4) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    //加上的categoryOption.series[0].data[0].value是图表上对应时段的数据，也就是西华该时段的一周垃圾净重量的平均值
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[0].value;
    categoryOption.series[0].data[0].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);

    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (4 <= result && result < 8) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[1].value;
    categoryOption.series[0].data[1].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);

    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (8 <= result && result < 12) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[2].value;
    categoryOption.series[0].data[2].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);

    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (12 <= result && result < 16) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[3].value;
    categoryOption.series[0].data[3].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);

    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (16 <= result && result < 20) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[4].value;
    categoryOption.series[0].data[4].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);

    total.value = 0;
    for (let i = 0; i < resp.length; i++) {
      let index = resp[i].exactDate.indexOf("T");
      let result = Number(resp[i].exactDate.substr(index + 1, 2));
      if (20 <= result && result < 24) {
        total.value = resp[i].netWeight + total.value;
      }
    }
    total.value =
      Math.floor((total.value / 1000) * 100) / 100 / 7 +
      categoryOption.series[0].data[5].value;
    categoryOption.series[0].data[5].value = Number(total.value.toFixed(0));
    category_chart.setOption(categoryOption);
  });
});
const pull_page = (page) => {
  // Object.keys(patrolInfo).map(key => {
  //     delete patrolInfo[key]
  // });
  current_page.value = page;
  getQuery("红星", "transporter", start, end, page, 10).then(function (resp) {
    data.value = resp;
    ifShowQueryResult.value = false;
  });
};
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
      data: yAxis_week,
      type: "bar",
      label: {
        show: true,
        formatter: "{value} 吨",
      },
    },
  ],
});
const config_today = reactive({
  title: {
    text: "",
  },
  xAxis: {
    name: "时间段",
    data: [
      "0点-4点",
      "4点-8点",
      "8点-12点",
      "12点-16点",
      "16点-20点",
      "20点-24点",
    ],
  },
  yAxis: {
    name: "垃圾净重/吨",
    data: "value",
    min: 0,
    interval: 50,
  },
  series: [
    {
      data: yAxis_total,
      type: "line",
      label: {
        show: true,
        formatter: "{value} 吨",
        style: {},
      },
    },
  ],
});
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
//     left: '0%',
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
//     interval: 30,
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

//   /**
//    * 先调用getQuery统计西华的不同时段垃圾净重量平均值，并绘制到图表上
//    * 再调用getQuery统计红星的，并在统计某一个时段的垃圾净重量平均值之后加上图表上已展示出来的西华对应时段的垃圾净重量平均值
//    */
//   getQuery(
//     '西华',
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

//   getQuery(
//     '红星',
//     'transporter',
//     new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() +
//       '-' +
//       (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) +
//       '-' +
//       new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
//     new Date(time).getFullYear() +
//       '-' +
//       (new Date(time).getMonth() + 1) +
//       '-' +
//       new Date(time).getDate(),
//     1,
//     10000
//   ).then(function (resp) {
//     total.value = 0
//     // console.log(categoryOption.series[0].data[0].value)
//     for (let i = 0; i < resp.length; i++) {
//       let index = resp[i].exactDate.indexOf('T')
//       let result = Number(resp[i].exactDate.substr(index + 1, 2))
//       if (0 <= result && result < 4) {
//         total.value = resp[i].netWeight + total.value
//       }
//     }
//     //加上的categoryOption.series[0].data[0].value是图表上对应时段的数据，也就是西华该时段的一周垃圾净重量的平均值
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[0].value
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
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[1].value
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
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[2].value
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
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[3].value
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
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[4].value
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
//     total.value =
//       Math.floor((total.value / 1000) * 100) / 100 / 7 +
//       categoryOption.series[0].data[5].value
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
  display: flex;
  /* justify-content:space-between; */
}
.card-Left {
  width: 40%;
}
.card-Right {
  width: 60%;
  /* padding-left:2vw; */
}
#avgTime_Line {
  /* padding-left:2vw; */
  height: 22vw;
  /* width:50%; */
}
.card-body {
  width: 100%;
}
</style>
