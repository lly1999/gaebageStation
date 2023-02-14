<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-4 col-md-3">
        <div class="card person-basic-img">
          <div class="card-body">
            <img
              class="img-responsive"
              src="@/assets/img/default-person.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="col-sm-7 col-md-8">
        <div class="card person-basic-info">
          <div class="card-header">
            车辆信息
            <div class="float-end">
              <!-- <el-button type="info" @click="patrolLocation()"
                >跳转定位</el-button
              > -->
              <el-button type="info" @click="selectDate()">轨迹查询</el-button>
            </div>
          </div>
          <div class="card-body info-box" style="width: 60%; margin-top: 8vh;margin-bottom: 7vh;">
            <el-form
              :model="detail_info"
              label-position="right"
              label-width="8vw"
              id="info-form"
              :disabled="true"
              size="large"
            >
              <el-form-item label="车牌号">
                <el-input
                  style="cursor: text"
                  class="info-input"
                  v-model="detail_info.carNumber"
                >
                </el-input>
              </el-form-item>

              <el-form-item label="司机姓名">
                <el-input v-model="detail_info.name"></el-input>
              </el-form-item>

              <el-form-item label="司机电话">
                <el-input v-model="detail_info.telephone"></el-input>
              </el-form-item>

              <el-form-item label="所属公司">
                <el-input v-model="detail_info.company" />
              </el-form-item>

              <el-form-item label="最后记录gps时间">
                <el-input v-model="detail_info.lastTime" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- <el-dialog v-model="selectDateDialogVisable" title="日期选择" width="30%"
            :before-close="handleSelectDateDialogClose">
            <el-date-picker v-model="dateSelected" type="datetimerange" :shortcuts="shortcuts" range-separator="-"
                start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
            <div style="margin-top: 2vh;">(为空默认查当天)</div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="patrolTrace">
                        确定
                    </el-button>
                    <el-button @click="selectDateDialogVisable = false">取消</el-button>

                </span>
            </template>
        </el-dialog> -->
  </div>
</template>
<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted, h } from "vue";
import { TdtMap } from "vue-tianditu";
import "vue-tianditu/lib/style.css";
import { getCars } from "@/api/content";
import { getCarGps } from "@/api/content";
import { getCarsLocation } from "@/api/home";
import { ElMessage, ElDialog, tabBarProps } from "element-plus";
import { useRoute,useRouter } from "vue-router";
import moment from "moment";
const carValue = ref("川ABS126");
const carData = ref([]);
const carList = ref([]);
const carListTianfu = ref([]);
const carListRenhe = ref([]);
const route = useRoute();
const router = useRouter();

var renhe_car = new Map();
var tianfu_car = new Map();

var time = new Date().getTime();
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

onBeforeMount(() => {
  getCars().then(function (resp) {
    for (let i = 0; i < resp.length; i++) {
      //统计天府环境和仁和星牛的车
      if (resp[i].company == "仁和星牛") {
        //去掉车牌号中多余的空格
        resp[i].carNumber = trim(resp[i].carNumber);
        //将车牌号中的字母都设置为大写，防止登记车牌时写错
        if (!renhe_car.has(resp[i].carNumber.toUpperCase())) {
          renhe_car.set(resp[i].carNumber.toUpperCase(), "仁和星牛");
        }
      }
      if (resp[i].company == "天府环境") {
        //去掉车牌号中多余的空格
        resp[i].carNumber = trim(resp[i].carNumber);
        //将车牌号中的字母都设置为大写，防止登记车牌时写错
        if (!tianfu_car.has(resp[i].carNumber.toUpperCase())) {
          tianfu_car.set(resp[i].carNumber.toUpperCase(), "天府环境");
        }
      }
    }
  });
  //删除字符串中多余的空格
  function trim(ele) {
    if (typeof ele === "string") {
      return ele.split(" ").join("");
    } else {
      console.error(
        `${typeof ele} is not the expected type, but the string type is expected`
      );
    }
  }
});

let detail_info = reactive({
  carNumber: "",
  name: "",
  telephone: "",
  company: "",
  lastTime: "",
});
var cardetail_today;
const getPersonInfo = () => {
  if (route.query.carNumber) {
    var carNumber = route.query.carNumber;
          detail_info.carNumber = carNumber;
      detail_info.name = "待完善";
      detail_info.telephone = "待完善";

    getCars().then(function (resp) {
      for (let i = 0; i < resp.length; i++) {
        if (carNumber == resp[i].carNumber) {
          detail_info.company = resp[i].company;
        }
      }
    })
cardetail_today=moment()
        .add(-5, "d")
        .format("YYYY-MM-DD");
        console.log("这个月前一天"+cardetail_today)
    getCarGps(carNumber, cardetail_today, tomorrow).then((resp) => {

      detail_info.lastTime = resp[resp.length - 1].exactDate;

    });
  }
};


const selectDate = () => {
  var carNumber = detail_info.carNumber;
  router.push({ name: "carRecord", query: { carNumber: carNumber } });
  console.log(carNumber);
};
getPersonInfo();
</script>
<style scoped>
/* .container { */
    /* margin-left: 16vw; */
/* } */

.person-basic-info {
    margin-top: 8vh;
}

.person-basic-img {
    margin-top: 8vh;
}

.info-box {
    margin-left: 7vw;
    margin-right: 7vw;
}

.case-box {
    margin-left: 7vw;
}

.person-issue-box {
    margin-top: 2vh;
}

.card-header {
    font-size: 1.5rem;
}


.case-box-body {
    margin-top: 1vh;
    width: 20vw;
}

.img-responsive {
    max-width: 100%;
    height: auto;
}

:deep(.el-form-item__label) {
    font-size: 1rem;
}

:deep(.is-disabled .el-input__inner) {
    cursor: text;
}

:deep(.el-input.is-disabled) {
    cursor: text;
}

</style>
