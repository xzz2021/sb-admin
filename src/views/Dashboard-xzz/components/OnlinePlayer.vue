<script setup lang="tsx">
import { onlinePlayersOptions } from '@/views/Dashboard-xzz/echarts-data'
import { Ref, ref } from 'vue'
import { Echart } from '../../../components/Echart'
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

const loading = ref(false)

let selectDate: Ref<any> = ref('')
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
onMounted(() => {
  selectDate.value = new Date()
  let myChart = echarts.init(document.getElementById('onlinePlayerChart'))
  onlinePlayersOptions && myChart.setOption(onlinePlayersOptions)
})

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
          <span>当前在线人数: 126</span>
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
        <div id="onlinePlayerChart"></div>
        <Echart :options="onlinePlayersOptions" :height="350" />
      </ElSkeleton>
    </ElCard>
  </ElCol>
</template>
