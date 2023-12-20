import { defineStore } from 'pinia'

//   此处 定义数据查看面板的 store

interface DataScanState {
  itemlog: keyVal[]
  moneylog: keyVal[]
}

interface keyVal {
  key: string
  value: string
}

export const useDatascanStore = defineStore('datascan', {
  state: (): DataScanState => {
    return {
      itemlog: [],
      moneylog: []
    }
  },
  getters: {
    getItemlog(): keyVal[] {
      return this.itemlog
    },
    getMoneylog(): keyVal[] {
      return this.moneylog
    }
  },
  actions: {
    setItemlog(arr: keyVal[]) {
      this.itemlog = arr
    },
    setMoneylog(arr: keyVal[]) {
      this.moneylog = arr
    }
  },
  persist: true
})
