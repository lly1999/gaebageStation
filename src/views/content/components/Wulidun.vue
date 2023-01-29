<template>
    <el-container>
        <el-header style="font-size:25px;padding:5px ;">
            <h5 class="card-title" style="font-size:30px;padding:5px ;">五里墩垃圾站数据统计</h5>
        </el-header>
        <el-main>
            <div class="card-header"></div>
            <div class="card-body">
                <h5 class="card-title" style="font-size:25px;padding:5px ;">垃圾趋势统计</h5>
                <div class="card-body" style="padding:5px ;">
                    <!-- <dv-active-ring-chart :config="config_jgzm" style="width:25vw;height: 20vh;" /> -->
                    <dv-charts :option="config_jgzm" style="width:50vw;height: 30vh;" />
                </div>
                <h5 class="card-title" style="font-size:25px;padding:5px ;">垃圾站当前报警</h5>
                <h4 class="card-title" style="font-size:25px;padding:5px ;">当前状态：<el-tag class="mx-1"
                        :type="alert_tag.type" size="large" style="font-size:x-large">
                        {{ alert_tag.name }}
                    </el-tag>
                </h4>
                <dv-charts :option="config_alert" style="width:30vw;height: 30vh;" />
                <h5 class="card-title" style="font-size:25px;padding:5px ;">垃圾记录</h5>
                <el-date-picker v-model="value" type="daterange" unlink-panels range-separator="到"
                    start-placeholder="选择开始时间" end-placeholder="选择结束时间" :shortcuts="shortcuts" @change="changeDate"
                    size="large" />
                <!-- <el-button @click="excuteQuery" size="large" type="primary" style="padding:20px">查询</el-button> -->
                <el-table :data="data" :size="large" width="100%">
                    <el-table-column property="exactDate" label="处理时间" width="200px" />
                    <el-table-column label="承运车辆" width="150">
                        <template #default="scope">
                            <el-button size="medium" type="primary" link @click="handleEdit(scope.$index, scope.row)">{{
                                scope.row.carNumber
                            }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column property="netWeight" label="垃圾净重/kg" width="150" />
                    <el-table-column property="grossWeight" label="垃圾毛重/kg" width="150" />
                    <el-table-column property="tareWeight" label="垃圾皮重/kg" width="150" />
                    <el-table-column property="transporter" label="承运单位" width="300" />
                    <el-table-column property="driver" label="司机" width="300" />
                    <el-table-column property="tel" label="司机电话" width="300" />
                    <el-table-column property="wechat" label="司机微信" width="300" />



                </el-table>
            </div>
            <div class="float-end" style="margin-top: 10px">
                <el-pagination background layout="total, prev, pager, next, jumper" :total="total_records"
                    :current-page="current_page" @current-change="pull_page" />
            </div>

        </el-main>
    </el-container>


</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import axios from 'axios';
import { getPage, getQuery } from '@/api/content.js'
const value = ref('')
const shortcuts = [
    {
        text: '今天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [today, tomorrow]
        },
    },
    {
        text: '过去一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [week_before, tomorrow]
        },
    },
    {
        text: '上个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [month_before, tomorrow]
        },
    },

]
function changeDate() {
    start = value.value[0].getFullYear() + '-' + (value.value[0].getMonth() + 1) + '-' + value.value[0].getDate()
    console.log(start)
    end = value.value[1].getFullYear() + '-' + (value.value[1].getMonth() + 1) + '-' + value.value[1].getDate()
    getQuery('五里墩', 'transporter', start, end, 1, 10000).then(function (resp) {
        total_records.value = resp.length

        console.log(total_records.value = resp.length)
        page_count = parseInt(resp.length) % 10;
        // patrols.value.splice(0, patrols.value.length);
        // total_records.value = parseInt(resp.total);
        // page_count = parseInt(resp.data.data.pages);
        // ifShowQueryResult.value = false;
    })
    getQuery('五里墩', 'transporter', start, end, 1, 10).then(function (resp) {

        total_records.value = resp.length
        page_count = parseInt(resp.length) % 10;
        data.value = resp
    })
}
var time = (new Date).getTime();
var weekTime = new Date(time - 7 * 24 * 60 * 60 * 1000);
var month_time = new Date(time - 31 * 24 * 60 * 60 * 1000);
const week_before = weekTime.getFullYear() + '-' + (weekTime.getMonth() + 1) + '-' + weekTime.getDate()
const month_before = month_time.getFullYear() + '-' + (month_time.getMonth() + 1) + '-' + month_time.getDate()

let total_records = ref(1000);
let current_page = ref(1);
let page_count = 0;
const data = ref([])
const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
const tomorrow = new Date(time + 1 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time + 1 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + (new Date(time + 1 * 24 * 60 * 60 * 1000).getDate())
var start = today
var end = tomorrow
const total = ref(2)
const router = useRouter()

const yAxis = ref([0, 0, 0, 0, 0, 0])
const month_total = ref(0)
const yAxis_alert = ref([0, 0])
const alert_tag = ref(
    { name: '正常', type: 'success' },
)
const config_alert = reactive({
    title: {
        text: '垃圾报警对比'
    },
    xAxis: {
        name: '日期',
        data: [
            '垃圾预测量',
            today + ' 今日目前垃圾量',
        ]
    },
    yAxis: {
        name: '垃圾净重',
        data: 'value',
        min: 0,
        interval: 15,
    },
    series: [
        {
            data: yAxis_alert,
            type: 'bar', label: {
                show: true,
                formatter: '{value} 吨'
            }
        }
    ]
})
onBeforeMount(() => {

    getQuery('五里墩', 'transporter',
        new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
        1,
        10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100
            yAxis.value[0] = Number(total.value.toFixed(0))


        })
    getQuery('五里墩', 'transporter',
        new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(), 1, 10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100
            yAxis.value[1] = Number(total.value.toFixed(0))

        })
    getQuery('五里墩', 'transporter',
        new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
        1, 10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100
            yAxis.value[2] = Number(total.value.toFixed(0))

            // patrols.value.splice(0, patrols.value.length);
            // total_records.value = parseInt(resp.total);
            // page_count = parseInt(resp.data.data.pages);
            // ifShowQueryResult.value = false;
        })
    getQuery('五里墩', 'transporter',
        new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(), 1, 10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100
            yAxis.value[3] = Number(total.value.toFixed(0))

            // patrols.value.splice(0, patrols.value.length);
            // total_records.value = parseInt(resp.total);
            // page_count = parseInt(resp.data.data.pages);
            // ifShowQueryResult.value = false;
        })
    getQuery('五里墩', 'transporter',
        new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(), 1, 10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100
            yAxis.value[4] = Number(total.value.toFixed(0))

            // patrols.value.splice(0, patrols.value.length);
            // total_records.value = parseInt(resp.total);
            // page_count = parseInt(resp.data.data.pages);
            // ifShowQueryResult.value = false;
        })
    getQuery('五里墩', 'transporter',
        new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(),
        new Date(time).getFullYear() + '-' + (new Date(time).getMonth() + 1) + '-' + new Date(time).getDate(),
        1, 10000).then(function (resp) {
            total.value = 0;
            for (let i = 0; i < resp.length; i++) {
                total.value = resp[i].netWeight + total.value
            }
            total.value = Math.floor((total.value / 1000) * 100) / 100


            yAxis.value[5] = Number(total.value.toFixed(0))


            // patrols.value.splice(0, patrols.value.length);
            // total_records.value = parseInt(resp.total);
            // page_count = parseInt(resp.data.data.pages);
            // ifShowQueryResult.value = false;
        })
    getQuery('五里墩', 'transporter', today, tomorrow, 1, 10000).then(function (resp) {
        total.value = 0;
        for (let i = 0; i < resp.length; i++) {
            total.value = resp[i].netWeight + total.value
        }
        total.value = Math.floor((total.value / 1000) * 100) / 100

        yAxis.value[6] = Number(total.value.toFixed(0))
        yAxis_alert.value[1] = yAxis.value[6]
        total_records.value = resp.length
        page_count = parseInt(resp.length) % 10;
        var count = 0
        for (let i = 1; i < 7; i++) {
            count++
            var cal_day = new Date(time - i * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - i * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + (new Date(time - i * 24 * 60 * 60 * 1000).getDate())
            var cal_time = new Date(time - i * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - i * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + (new Date(time - i * 24 * 60 * 60 * 1000).getDate() + "T" + new Date(time - i * 24 * 60 * 60 * 1000).getHours() + ":" + new Date(time - i * 24 * 60 * 60 * 1000).getMinutes() + ":" + new Date(time - i * 24 * 60 * 60 * 1000).getSeconds())
            getQuery('五里墩', 'transporter', cal_day, cal_time, 1, 10000).then(function (resp) {

                for (let i = 0; i < resp.length; i++) {
                    month_total.value = resp[i].netWeight + month_total.value
                }

                if (count == 6) {
                    yAxis_alert.value[0] = ((month_total.value / 1000 / 6).toFixed(0)) * 1
                    var alert_status = Math.abs(yAxis_alert.value[0] - yAxis.value[6])


                    if (alert_status < Number((yAxis_alert.value[0] * 0.2).toFixed(0))) {
                        alert_tag.value.type = 'success'
                        alert_tag.value.name = '正常'
                    }
                    else if (alert_status >= Number((yAxis_alert.value[0] * 0.2).toFixed(0))) {
                        var alert_status_signed = yAxis_alert.value[0] - yAxis.value[6]
                        if (alert_status_signed > 0) {
                            alert_tag.value.name = '低于预测值的20%'
                            alert_tag.value.type = 'danger'
                        }

                        else {
                            alert_tag.value.name = '超过预测值的20%'
                            alert_tag.value.type = 'danger'
                        }
                    }
                    // else if (alert_status >= Number((yAxis_alert.value[0] * 0.3).toFixed(0))) {
                    //     alert_tag.value.name = '警告，与预估值相差大于' + yAxis_alert.value[0] * 0.3 + '吨,目前相差' + alert_status + '吨'
                    //     alert_tag.value.type = 'danger'
                    // }
                }




            })
        }
        // patrols.value.splice(0, patrols.value.length);
        // total_records.value = parseInt(resp.total);
        // page_count = parseInt(resp.data.data.pages);
        // ifShowQueryResult.value = false;
    })
    getQuery('五里墩', 'transporter', today, tomorrow, 1, 10).then(function (resp) {

        data.value = resp
        // patrols.value.splice(0, patrols.value.length);
        // total_records.value = parseInt(resp.total);
        // page_count = parseInt(resp.data.data.pages);
        // ifShowQueryResult.value = false;
    })

})
const pull_page = page => {

    // Object.keys(patrolInfo).map(key => {
    //     delete patrolInfo[key]
    // });
    current_page.value = page;
    getQuery('五里墩', 'transporter', start, end, page, 10).then(function (resp) {
        data.value = resp
        ifShowQueryResult.value = false;
    })
}

const config_jgzm = reactive({
    title: {
        text: '过去一周垃圾趋势'
    },
    xAxis: {
        name: '日期',
        data: [
            new Date(time - 6 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 6 * 24 * 60 * 60 * 1000).getDate(),
            new Date(time - 5 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 5 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 5 * 24 * 60 * 60 * 1000).getDate(),
            new Date(time - 4 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 4 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 4 * 24 * 60 * 60 * 1000).getDate(),
            new Date(time - 3 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 3 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 3 * 24 * 60 * 60 * 1000).getDate(),
            new Date(time - 2 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 2 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 2 * 24 * 60 * 60 * 1000).getDate(),
            new Date(time - 1 * 24 * 60 * 60 * 1000).getFullYear() + '-' + (new Date(time - 1 * 24 * 60 * 60 * 1000).getMonth() + 1) + '-' + new Date(time - 1 * 24 * 60 * 60 * 1000).getDate(),
            today,
        ]
    },
    yAxis: {
        name: '垃圾净重',
        data: 'value',
        min: 0,
        interval: 15,
    },
    series: [
        {
            data: yAxis,
            type: 'bar', label: {
                show: true,
                formatter: '{value} 吨'
            }
        }
    ]
})
const handleEdit = (index, row) => {
    var carNumber = row.carNumber
    router.push({ name: 'carRecord', query: { carNumber: carNumber } })
    console.log(index, row.carNumber)
}
</script>