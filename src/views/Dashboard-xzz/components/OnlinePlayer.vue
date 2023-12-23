<script setup lang="tsx">
import { Ref, ref } from 'vue'
import { Echart } from '../../../components/Echart'
import { onMounted, watch } from 'vue'
import { getSpecifyDate } from '../../../api/home/index'
import { ElMessage } from 'element-plus'
import { useTimeEchart } from '@/hooks/web/useTimeEchart'

const { echartState } = useTimeEchart('aa')
const { optionsData, currentPlayers } = echartState

const loading = ref(false)

let selectDate: Ref<any> = ref('')
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

watch(
  () => selectDate.value,
  async (dateVal) => {
    const specifyUnix = +new Date(dateVal) / 1000
    // return
    if (dateVal == null) return
    try {
      let res = await getSpecifyDate({ unixtime: specifyUnix })
      if (res && res.data && res.data.length > 0) {
        const specifyDateData = res.data
        const echartData = specifyDateData.map((item) => {
          return [item.SaveTime * 1000, item.OnlieRoleCount]
        })
        optionsData.series[0].data = echartData
      } else {
        ElMessage({
          type: 'error',
          message: '当前选择的日期没有数据!'
        })
      }
    } catch (error) {}
  }
)
onMounted(async () => {})

const shortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: '前天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
      return date
    }
  }
]
</script>

<template>
  <ElCol :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-20px">
    <ElCard shadow="never">
      <template #header>
        <div class="flex justify-between">
          <span>当前在线人数: {{ currentPlayers }}</span>
          <ElLink type="primary" :underline="false">更多</ElLink>
        </div>
      </template>
      <ElSkeleton :loading="loading" animated>
        <el-date-picker
          v-model="selectDate"
          type="date"
          placeholder="请选择日期"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
        />
        <!-- <div id="onlinePlayerChart"></div> -->
        <Echart :options="optionsData" :height="350" />
      </ElSkeleton>
    </ElCard>
  </ElCol>
</template>
