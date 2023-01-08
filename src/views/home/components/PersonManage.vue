<template>


    <el-skeleton 
        :loading="loading" 
        animated>
        <template #default>
            <template v-for="tableItem in tableData">
                <el-table :data="tableItem.data" class="table" :fit="false">
                    <el-table-column 
                        v-for="i in tableItem.headerNames.length"
                        
                        :label="tableItem.headerNames[i - 1]"
                        :prop="tableItem.dataNames[i - 1]" width="160"/>
                    <el-table-column
                    fixed="right"
                    label="操作"
                    width="300">
                    <template #default="scope">
     <el-button
       link
          size="mini"
          type="primary"
          @click="allocateFence(scope.$index)" plain text style="font-size:20px">分配围栏</el-button>                 
      <!-- <el-button
          size="mini"
          type="primary"
          @click.prevent="editFence(scope.$index)" plain text style="font-size:20px">设置状态</el-button>
      -->
          <el-button 
       link
          size="mini"
          type="primary"
          @click="call(scope.$index)" plain text style="font-size:20px"><el-icon style="vertical-align: middle"><PhoneFilled /></el-icon></el-button>                 
      <el-button
          size="mini"
          type="primary"
          @click.prevent="vxCall(scope.$index)" plain text style="font-size:20px"> <el-image class="logo-icon" :src="require('@/assets/home/icon32_wx_logo.png')" :size="50"></el-image></el-button>
          <el-button
       link
          size="mini"
          type="danger"
          @click="deletePerson(scope.$index)" plain text style="font-size:20px">删除</el-button>    
        
        </template>
          
    
    </el-table-column>
   

                </el-table>
            </template>
        </template>
        
    </el-skeleton>

  <el-form 
  :rules="rules" ref="ruleFormRef"
  :model="form" label-width="120px" style="max-width: 500px">
    <el-form-item label="id" width="100px">
      <el-input v-model="form.id" />
    </el-form-item>
    <el-form-item label="新增人员" width="100px"
    :rules="[
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 10, message: '姓名长度不合法', trigger: 'blur' },
  ]">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="选择分配围栏"
    >
      <el-select v-model="form.fenceId" placeholder="选择编号">
        <el-option label="抚琴街道" value="2" />
        <el-option label="编号2" value="beijing" />
      </el-select>
      </el-form-item>
      <el-form-item label="职务" :rules="[
    {
      required: true,
      message: '请输入职务',
      trigger: 'blur',
    },
  ]" >
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="街道" :rules=rules.street>
      <el-input v-model="form.street" />
    </el-form-item>
    <el-form-item label="手机号" :rules="rules.tel">
      <el-input v-model="form.tel" />
    </el-form-item>
    <el-form-item label="微信号" :rules="[
    {
      required: true,
      message: '请输入人员的微信号',
      trigger: 'blur',
    },
  ]">
      <el-input v-model="form.vx"/>
    </el-form-item>
    
    
    <!-- <el-form-item label="状态">
      <el-radio-group v-model="form.work">
        <el-radio label="执勤中" />
        <el-radio label="休息中" />
      </el-radio-group>
    </el-form-item> -->
    
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>

  <el-dialog v-model="dialogFormVisible" title="分配围栏">
    <template #default>
            <template v-for="tableItem in tableDataFence">
                <el-table :data="tableItem.data" class="table" :fit="false" max-height="300px">
                <el-table-column type="selection" width="55" />
                    <el-table-column 
                        v-for="i in tableItem.headerNames.length-2"
                        :label="tableItem.headerNames[i - 1]"
                        :prop="tableItem.dataNames[i - 1]" width="200"/>
                    <!-- <el-table-column label="操作" width="200">
        <template #default="scope">           
       <el-button
       link
          size="mini"
          type="primary"
          @click="showFence(scope.$index)" >查看</el-button>  
                       
      <el-button
          size="mini"
          type="primary"
          @click.prevent="inEditFence(scope.$index)" plain text>编辑</el-button>
          <el-button 
          size="mini"
          type="danger"
          @click="deleteFence(scope.$index,scope.row)" text>删除</el-button>
          </template>
    </el-table-column> -->
    
                </el-table>
            </template>
        </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >将人员分配到选中围栏</el-button
        >
      </span>
    </template>
  </el-dialog>
    

</template>
<script setup>
  import {House, ArrowDown, Setting, Link,PhoneFilled} from "@element-plus/icons-vue";
import { onBeforeMount, ref,reactive } from 'vue';
import {  getPerson,createPerson,deletePersonById,getFenceList } from '@/api/home.js';
import { ElMessageBox,ElMessage } from 'element-plus'
const dialogFormVisible = ref(false)
const ruleFormRef = ref('')
const location_default=[[104.08492764442998,30.68480125658667],[104.08365351,30.68295086],[104.08072097,30.67860853],[104.07885946,30.67566969],[104.08209799,30.67371765],[104.08337302,30.67305968],[104.08548955,30.67295001],[104.08640756,30.67242363],[104.08737657,30.67130496],[104.08969711,30.67003284],[104.0931397,30.67437556],[104.09503929080208,30.676760482514343],[104.09404708576766,30.67709813178603],[104.09319526012625,30.67755346424976],[104.0889016588199,30.67973288126206],[104.08985310259258,30.68114865339007],[104.0938978905621,30.68731587980966],[104.09245489514863,30.68739105990879],[104.0919520352031,30.68761668238092],[104.0918208562049,30.688086727916605],[104.0918864482493,30.688387556150783],[104.09254236028306,30.689384044611078],[104.09228000018922,30.689929289719906],[104.09147104977237,30.690530936791273],[104.09136174494047,30.690662456906992],[104.09212697248623,30.69177172328108],[104.0929359243766,30.692016136609283],[104.09350438084842,30.692316942063513],[104.09385420724126,30.694121809071444],[104.09182090408228,30.695193436775803],[104.09136177019272,30.695381440708015],[104.09109940851961,30.69573864741584],[104.09179904282321,30.695851449326277],[104.09271731864521,30.69718626435893],[104.08160700326367,30.69738300807923],[104.08141413765587,30.69424306967441],[104.0814098548041,30.69276580457567],[104.08130353615583,30.69150605378136],[104.08120577754372,30.690324399215953],[104.0808427664515,30.689480117960123],[104.08065301312334,30.68907571576189],[104.08072726502077,30.688522317039517],[104.08089227124948,30.688359135434162],[104.08147804205797,30.687741882389425],[104.08221231450686,30.687117533057464],[104.0832518478065,30.686195177378128],[104.08371386027875,30.68581204757918],[104.0851906559503,30.685166395415408],[104.08492764442998,30.68480125658667]]
var fenceList = []

function allocateFence(index){
  dialogFormVisible.value = true
  let person = tableData.value[0].data
console.log(person[index].id)
}
function deletePerson(index){
  ElMessageBox({
        title: '提示', //MessageBox 标题
        message: '您的权限是管理员，是否确定删除当前项?', //MessageBox 消息正文内容
        confirmButtonText: '确定', //确定按钮的文本内容
        cancelButtonText: '取消', //取消按钮的文本内容
        showCancelButton: true, //是否显示取消按钮
        closeOnClickModal: false, //是否可通过点击遮罩关闭
        type: 'warning', //消息类型，用于显示图标
    }).then(() => {
      
deletePersonById(person[index].id)
const tableItem = tableData.value;
    
  tableItem[0].data.splice(index, 1)
        ElMessage.success('删除成功!');
    }).catch(() => {
        ElMessage.info('已取消删除!');
    });
  }

function onSubmit(){
  {{
    
    ElMessageBox({
        title: '提示', //MessageBox 标题
        message: '您的权限是管理员，是否确定添加当前人员?', //MessageBox 消息正文内容
        confirmButtonText: '确定', //确定按钮的文本内容
        cancelButtonText: '取消', //取消按钮的文本内容
        showCancelButton: true, //是否显示取消按钮
        closeOnClickModal: false, //是否可通过点击遮罩关闭
        type: 'warning', //消息类型，用于显示图标
    }).then(()=>{
        const tableItem = tableData.value;
        
        createPerson(form)
        tableItem[0].data.push(JSON.parse(JSON.stringify(form)))

        ElMessage.success('添加成功!');
}

);
    
}}
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      {{
        
        
    ElMessageBox({
        title: '提示', //MessageBox 标题
        message: '您的权限是管理员，请确认要添加的信息，是否确定添加当前人员?', //MessageBox 消息正文内容
        confirmButtonText: '确定', //确定按钮的文本内容
        cancelButtonText: '取消', //取消按钮的文本内容
        showCancelButton: true, //是否显示取消按钮
        closeOnClickModal: false, //是否可通过点击遮罩关闭
        type: 'warning', //消息类型，用于显示图标
    }).then(()=>{
        const tableItem = tableData.value;
        
        createPerson(form)
        tableItem[0].data.push(JSON.parse(JSON.stringify(form)))

        ElMessage.success('添加成功!');
}

);
    
}}
    } else {
      console.log('提交错误！', fields)
    }
  })
}


// {{
    
//     ElMessageBox({
//         title: '提示', //MessageBox 标题
//         message: '您的权限是管理员，是否确定添加当前人员?', //MessageBox 消息正文内容
//         confirmButtonText: '确定', //确定按钮的文本内容
//         cancelButtonText: '取消', //取消按钮的文本内容
//         showCancelButton: true, //是否显示取消按钮
//         closeOnClickModal: false, //是否可通过点击遮罩关闭
//         type: 'warning', //消息类型，用于显示图标
//     }).then(()=>{
//         const tableItem = tableData.value;
        
//         //createPerson(form)
//         tableItem[0].data.push(JSON.parse(JSON.stringify(form)))

//         ElMessage.success('添加成功!');
// }

// );
    
// }}



const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 10, message: '姓名长度不合法', trigger: 'blur' },
  ],
  title: [
    {
      required: true,
      message: '请输入职务',
      trigger: 'change',
    },
  ],
  street: [
    {
      required: true,
      message: '请输入人员所属的街道',
      trigger: 'blur',
    },
  ],
  tel: [
    {
      required: true,
      message: '请输入人员的电话',
      trigger: 'blur',
    },{ min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
  ],
  vx: [
    {
      required: true,
      message: '请输入人员的微信号',
      trigger: 'change',
    },
  ],
  
})
const form= reactive({ 
          id:'',
          name: '',
          fenceId: '',
          title: '',
          tel:'',
          vx: '',
          street: '',
          location:(location_default[Math.floor(Math.random() * 48)]).toString()
        })
const loading = ref(true)
const tableData = ref([])
const tableDataFence=ref([])
onBeforeMount(() => {
    getPerson().then(data => {
        tableData.value = data
    }).finally(() => {
        loading.value = false
    })
    getFenceList().then(data => {
        tableDataFence.value = data
        fenceList =tableDataFence.value[0].data 
      console.log(fenceList)
      })
        
    
})
</script>

<style scoped>
.table{
    size: large;
    margin-bottom: 1em;
    font-size: 20px;
}
</style>