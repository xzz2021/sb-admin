import mitt from 'mitt'
import { onBeforeUnmount } from 'vue'

interface Option {
  eventname: string // 事件名称
  callback: Fn // 回调
}

const emitter = mitt()

export const useEmittXzz = (option?: Option) => {
  if (option) {
    emitter.on(option.eventname, option.callback)
    // 不能 在卸载时 移除
    // onBeforeUnmount(() => {
    //   emitter.off(option.eventname)
    // })
  } else {
    // emitter.emit(option.eventname)
    // console.log('🚀 ~ file: useEmittXzz.ts:14 ~ useEmittXzz ~ option.eventname:', option.eventname)
  }

  return {
    emitter
  }
}
