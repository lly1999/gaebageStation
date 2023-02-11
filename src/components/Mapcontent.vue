<template>


  <!-- <div class="content-l">
    <div class="container">
      <dv-border-box6 style="height:25vh;padding:5px">

        <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">红星垃圾站本日趋势统计</h5>
        <div class="card-body" style="padding:5px ;">
          <dv-charts v-model:option="config_hongxing" style="width:25vw;height: 23vh;" />
        </div>

      </dv-border-box6>

      <dv-border-box7 style="height:30vh;padding:5px">
        <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">西华垃圾站本日趋势统计</h5>
        <div class="card-body" style="padding:5px ;">
          <dv-charts v-model:option="config_xihua" style="width:25vw;height: 23vh;" />
        </div>
      </dv-border-box7>
      <dv-border-box6 style="height:25vh;padding:5px">

        <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">本日报警垃圾站</h5>
        <div class="card-body" style="padding:5px ;">
        </div>
        

      </dv-border-box6>
    </div>
  </div> -->


  <div class="content-mid">

    <!-- <div class="card text-white bg-primary mb-3 person-box ">
      <div class="card-body"> -->
        <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">
          <li style="font-size:25px;padding:5px">
            金牛区垃圾今日数据：垃圾净重{{ total_jinniu.toFixed(2) }}吨
          </li>
          <li>
            红星垃圾站今日数据：垃圾净重{{ total_hongxing.toFixed(2) }}吨
          </li>
          <li>
            西华垃圾站今日数据：垃圾净重{{ total_xihua.toFixed(2) }}吨
          </li>
        </h5>
      <!-- </div>
    </div> -->
  </div>
  <!-- <div class=" content-r">
    <div class="container">
      <dv-border-box7 style="height:30vh;padding:5px">
        <div dv-bg>
          <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">统计数据</h5>
          <dv-capsule-chart :config="config_xzzf" style="width:25vw;height:20vh" />
        </div>
      </dv-border-box7>
      <dv-border-box7 style="height:30vh;padding:5px">
        <div dv-bg>
          <h5 class="card-title" style="font-size:25px;padding:5px ;text-align: center;">统计数据</h5>
          <div>
            <dv-capsule-chart :config="config_ggzp" style="width:25vw;height:20vh" />
          </div>
        </div>
      </dv-border-box7>

    </div>

  </div> -->

</template>


<script setup>
import { reactive, ref, onBeforeMount } from 'vue';
import { ScrollBoard, DigitalFlop } from '@kjgl77/datav-vue3'
import { BorderBox6 as DvBorderBox6 } from '@kjgl77/datav-vue3'
import { BorderBox7 as DvBorderBox7 } from '@kjgl77/datav-vue3'
import { getPage, getQuery } from '@/api/content.js'

import Charts from '@jiaminghi/charts'
var time = (new Date).getTime();

const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
const tomorrow = new Date(time + 1 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time + 1 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + (new Date(time + 1 * 24 * 60 * 60 * 1000).getDate())
const total_hongxing = ref(0)
const total_xihua = ref(0)
const total_jinniu = ref(0)
const yAxis_hongxing = ref([0, 0, 0, 0, 0, 0])
const yAxis_xihua = ref([0, 0, 0, 0, 0, 0])
const total_jinniu_fixed = ref('')
const key_map = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
  , '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
let test = [1, 2, 2, 4, 5, 6]
var period_total = 0
var current = 0

const period_data = reactive({
  zero_four: 0,
  four_eight: 0,
  eight_twelve: 0,
  twelve_sixteen: 0,
  sixteen_twenty: 0,
  twenty_zero: 0,

})
const period_data_xihua = reactive({
  zero_four: 0,
  four_eight: 0,
  eight_twelve: 0,
  twelve_sixteen: 0,
  sixteen_twenty: 0,
  twenty_zero: 0,

})
yAxis_hongxing.value.splice(0, yAxis_hongxing.length)
yAxis_xihua.value.splice(0, yAxis_xihua.length)

var scroll_data_szcg_all = []
function refreshData() {
  total_jinniu.value = 0
  getQuery('红星', 'transporter', today, tomorrow, 1, 10000).then(function (resp) {
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value
    }
    total_hongxing.value = Math.floor((total_hongxing.value / 1000) * 100) / 100
    total_jinniu.value = (total_hongxing.value + total_jinniu.value)
  })
  getQuery('西华', 'transporter', today, tomorrow, 1, 10000).then(function (resp) {
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100
    total_jinniu.value = total_xihua.value + total_jinniu.value

    total_jinniu.value = (Math.floor(total_jinniu.value * 100) / 100)


  })
}
setInterval(refreshData, 60000)



onBeforeMount(() => {
  getQuery('红星', 'transporter', today, tomorrow, 1, 10000).then(function (resp) {
    total_hongxing.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_hongxing.value = resp[i].netWeight + total_hongxing.value
    }
    total_hongxing.value = (Math.floor((total_hongxing.value / 1000) * 100) / 100)
    total_jinniu.value = (total_hongxing.value + total_jinniu.value)
  })
  getQuery('西华', 'transporter', today, tomorrow, 1, 10000).then(function (resp) {
    total_xihua.value = 0;
    for (let i = 0; i < resp.length; i++) {
      total_xihua.value = resp[i].netWeight + total_xihua.value
    }
    total_xihua.value = Math.floor((total_xihua.value / 1000) * 100) / 100
    total_jinniu.value = total_xihua.value + total_jinniu.value

    total_jinniu.value = (Math.floor(total_jinniu.value * 100) / 100)
    total_jinniu_fixed.value = total_jinniu.value.toFixed(2)

  })
  // for (let i = 0; i < 23; i++) {
  //   getQuery('红星', 'transporter',
  //     today + 'T' + key_map[i] + '%3A00%3A00',
  //     today + 'T' + key_map[i + 1] + '%3A00%3A00',
  //     1, 10000).then(function (resp) {

  //       for (let i = 0; i < resp.length; i++) {
  //         current = resp[i].netWeight + current
  //       }
  //       current = Math.floor((current / 1000) * 100) / 100
  //       period_total += current
  //       console.log(period_total, i)

  //     })
  // }
  // getQuery('红星', 'transporter',
  //   today + 'T00%3A00%3A00',
  //   today + 'T04%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     yAxis_hongxing.value.splice(0, 6)

  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.zero_four = resp[i].netWeight + period_data.zero_four
  //     }
  //     period_data.zero_four = Math.floor((period_data.zero_four / 1000) * 100) / 100

  //     yAxis_hongxing.value.splice(0, 0, period_data.zero_four)


  //   })
  // getQuery('红星', 'transporter',
  //   today + 'T04%3A00%3A00',
  //   today + 'T08%3A00%3A00',
  //   1, 10000).then(function (resp) {

  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.four_eight = resp[i].netWeight + period_data.four_eight
  //     }
  //     period_data.four_eight = Math.floor((period_data.four_eight / 1000) * 100) / 100

  //     yAxis_hongxing.value.splice(1, 0, period_data.four_eight)

  //   })
  // getQuery('红星', 'transporter',
  //   today + 'T08%3A00%3A00',
  //   today + 'T12%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.eight_twelve = resp[i].netWeight + period_data.eight_twelve
  //     }
  //     period_data.eight_twelve = Math.floor((period_data.eight_twelve / 1000) * 100) / 100
  //     yAxis_hongxing.value.splice(2, 0, period_data.eight_twelve)
  //   })
  // getQuery('红星', 'transporter',
  //   today + 'T12%3A00%3A00',
  //   today + 'T16%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.twelve_sixteen = resp[i].netWeight + period_data.twelve_sixteen
  //     }
  //     period_data.twelve_sixteen = Math.floor((period_data.twelve_sixteen / 1000) * 100) / 100

  //     yAxis_hongxing.value.splice(3, 0, period_data.twelve_sixteen)

  //   })
  // getQuery('红星', 'transporter',
  //   today + 'T16%3A00%3A00',
  //   today + 'T20%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.sixteen_twenty = resp[i].netWeight + period_data.sixteen_twenty
  //     }
  //     period_data.sixteen_twenty = Math.floor((period_data.sixteen_twenty / 1000) * 100) / 100

  //     yAxis_hongxing.value.splice(4, 0, period_data.sixteen_twenty)


  //   })
  // getQuery('红星', 'transporter',
  //   today + 'T20%3A00%3A00',
  //   today + 'T24%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data.twenty_zero = resp[i].netWeight + period_data.twenty_zero
  //     }
  //     period_data.twenty_zero = Math.floor((period_data.twenty_zero / 1000) * 100) / 100

  //     yAxis_hongxing.value.splice(5, 0, period_data.twenty_zero)


  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T00%3A00%3A00',
  //   today + 'T04%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     yAxis_xihua.value.splice(0, 6)

  //     yAxis_xihua.value.splice(0, yAxis_xihua.length)
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.zero_four = resp[i].netWeight + period_data_xihua.zero_four
  //     }
  //     period_data_xihua.zero_four = Math.floor((period_data_xihua.zero_four / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(0, 0, period_data_xihua.zero_four)
  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T04%3A00%3A00',
  //   today + 'T08%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.four_eight = resp[i].netWeight + period_data_xihua.four_eight
  //     }
  //     period_data_xihua.four_eight = Math.floor((period_data_xihua.four_eight / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(1, 0, period_data_xihua.four_eight)
  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T08%3A00%3A00',
  //   today + 'T12%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.eight_twelve = resp[i].netWeight + period_data_xihua.eight_twelve
  //     }
  //     period_data_xihua.eight_twelve = Math.floor((period_data_xihua.eight_twelve / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(2, 0, period_data_xihua.eight_twelve)
  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T12%3A00%3A00',
  //   today + 'T16%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.twelve_sixteen = resp[i].netWeight + period_data_xihua.twelve_sixteen
  //     }
  //     period_data_xihua.twelve_sixteen = Math.floor((period_data_xihua.twelve_sixteen / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(3, 0, period_data_xihua.twelve_sixteen)
  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T16%3A00%3A00',
  //   today + 'T20%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.sixteen_twenty = resp[i].netWeight + period_data_xihua.sixteen_twenty
  //     }
  //     period_data_xihua.sixteen_twenty = Math.floor((period_data_xihua.sixteen_twenty / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(4, 0, period_data_xihua.sixteen_twenty)
  //   })
  // getQuery('西华', 'transporter',
  //   today + 'T20%3A00%3A00',
  //   today + 'T24%3A00%3A00',
  //   1, 10000).then(function (resp) {
  //     for (let i = 0; i < resp.length; i++) {
  //       period_data_xihua.sixteen_twenty = resp[i].netWeight + period_data_xihua.sixteen_twenty
  //     }
  //     period_data_xihua.sixteen_twenty = Math.floor((period_data_xihua.sixteen_twenty / 1000) * 100) / 100
  //     yAxis_xihua.value.splice(5, 0, period_data_xihua.twenty_zero)
  //   })

})

const config_ggzp = reactive({
  data: [


  ],
  colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
  unit: '店铺'
})

const config_xzzf = reactive({
  data: [


  ],
  colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
  unit: '案件'

})
const config_hongxing = reactive({
  title: {
    text: ''
  },
  xAxis: {
    name: '时间段',
    data: ['0点-4点', '4点-8点', '8点-12点', '12点-16点', '16点-20点', '20点-24点'],
    axisLabel: {
      style: {


        fontSize: 16,
        fill: '#FFFFFF'
      }
    },
    axisTick: {
      style: {
        fontSize: 16,
        fill: '#FFFFFF'
      }
    },
    nameTextStyle: {
      fontSize: 16,
      fill: '#FFFFFF'
    }
  },
  yAxis: {
    name: '垃圾净重/吨',
    data: 'value',
    min: 0,
    interval: 100,
    axisLabel: {
      style: {

        textBaseline: 'top',
        fontSize: 15,
        fill: '#FFFFFF'
      }
    },
    nameTextStyle: {
      fontSize: 16,
      fill: '#FFFFFF'
    }
  },
  series: [
    {
      data: yAxis_hongxing,
      type: 'line',
      label: {
        show: true,
        formatter: '{value} 吨',
        style: {
          fill: '#FFFFFF'
        }
      },
    }
  ]
})
const config_xihua = reactive({
  title: {
    text: ''
  },
  xAxis: {
    name: '时间段',
    data: ['0点-4点', '4点-8点', '8点-12点', '12点-16点', '16点-20点', '20点-24点'],
    axisLabel: {
      style: {


        fontSize: 16,
        fill: '#FFFFFF'
      }
    },
    axisTick: {
      style: {
        fontSize: 16,
        fill: '#FFFFFF'
      }
    },
    nameTextStyle: {
      fontSize: 16,
      fill: '#FFFFFF'
    }
  },
  yAxis: {
    name: '垃圾净重/吨',
    data: 'value',
    min: 0,
    interval: 50,
    axisLabel: {
      style: {

        textBaseline: 'top',
        fontSize: 15,
        fill: '#FFFFFF'
      }
    },
    nameTextStyle: {
      fontSize: 16,
      fill: '#FFFFFF'
    }
  },
  series: [
    {
      data: yAxis_xihua,
      type: 'line',
      label: {
        show: true,
        formatter: '{value} 吨',
        style: {
          fill: '#FFFFFF'
        }
      }
    }
  ]
})



</script>

<style scoped>
/* .content {
    position: absolute;
    top: 7vh;

    display: flex;
    z-index: 20;
} */

.content-l {
  left: 0;

  width: 25vw;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  height: 80vh;
  position: absolute;
  z-index: 20;
  user-select: none;
  color: white;
  background-color: #000000;
}

.content-l-top {
  height: 150px;

}

.content-mid {

  /* left: 36vw; */
  width: 100%;
  height: 12vh;
  background-color:black;
  position: absolute;
  z-index: 20;
  display: flex;
  flex-flow: wrap;
  user-select: none;
  opacity: 1;
  color: white;
  margin:auto;
  

}
.card-title{
  width:50%;
  margin:auto;
}

.content-r {

  right: 0;
  width: 25vw;
  /* background-color: rgba(0, 11, 61, 0.5); */
  background-color: #000000;
  padding-left: 3vh;
  padding-top: 3vh;
  padding-bottom: 3vh;
  padding-right: 1vh;
  display: flex;
  flex-direction: column;
  height: 80vh;
  position: absolute;
  z-index: 20;
  user-select: none;
  opacity: 1;
  color: white;

}

:deep(.DigitalFlop) {
  width: 25vw;
}

/* ===========================sunny */
.chart{
  height:100px;
  width:50px;
  background:burlywood;
}

li{
  list-style-type: none;
}
/* ============================ */
</style>


