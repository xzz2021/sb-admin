import { Ref, onMounted, reactive, ref } from 'vue'
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
// import { EChartsOption } from 'echarts/types/dist/shared'
import { EChartsOption } from 'echarts'
import { get12Hours } from '@/api/home'

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

// interface UseTableConfig {
//   fetchDataApi: () => Promise<{
//     // data?: any
//     list?: any[]
//     total?: number
//   }>
//   fetchDelApi?: () => Promise<boolean>
// }

export const useTimeEchart = (_config: any) => {
  const onlinePlayersOptions: EChartsOption | any = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%']
      },
      confine: true //  解决 浮层 展示 被遮挡 问题
      // appendToBody: true
    },
    title: {
      left: 'center',
      text: '在线人数'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: '在线数量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []
      }
    ],
    grid: {
      left: 100,
      right: 160,
      containLabel: true
    }
  }
  const optionsData: EChartsOption | any = reactive(onlinePlayersOptions)
  const currentPlayers: Ref<number> = ref(null)

  //   watch(
  //     () => currentPage.value,
  //     () => {
  //       methods.getList()
  //     }
  //   )

  //   watch(
  //     () => pageSize.value,
  //     () => {
  //       // 当前页不为1时，修改页数后会导致多次调用getList方法
  //       if (unref(currentPage) === 1) {
  //         methods.getList()
  //       } else {
  //         currentPage.value = 1
  //         methods.getList()
  //       }
  //     }
  //   )

  onMounted(() => {
    // 挂载时获取 初始 12小时数据
    methods.getList()
  })

  const methods = {
    async getList() {
      try {
        //  默认 获取  12小时之前的 数据
        const res = await get12Hours()
        if (res && res.data) {
          const latest12hoursData = res.data
          const echartData = latest12hoursData.map((item) => {
            return [item.SaveTime * 1000, item.OnlieRoleCount]
          })
          currentPlayers.value = echartData[echartData.length - 1][1]
          optionsData.series[0].data = echartData
        }
      } catch (error) {}
    }
  }

  return {
    echartMethods: methods,
    echartState: {
      optionsData,
      currentPlayers
    }
  }
}
