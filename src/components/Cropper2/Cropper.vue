<template>
  <el-dialog v-model="dialogVisible" width="600px" center destroy-on-close draggable>
    <!-- 1.一个用于获取上传文件的input，type="file"，并且监听onchange事件  -->
    <!-- <div> -->
    <!-- <input type="file" accept="image/*" id="imgReader" @change="loadingImg" /> -->
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      action="#"
      :auto-upload="false"
      :on-change="loadingImg"
      :show-file-list="false"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <template #trigger>
        <el-button type="primary">选择图片</el-button>
      </template>

      <template #tip>
        <div class="el-upload__tip"> 请上传jpg/png格式图片,且小于2000kb </div>
      </template>
    </el-upload>

    <!-- 2.一个用于给Cropper.js覆盖使用的img  -->
    <div>
      <img id="cropImg" />
    </div>

    <!-- 3.两个用于预览的div  -->
    <div v-if="currentPicName">
      <div class="previewText">裁剪预览</div>
      <div style="display: flex; justify-content: space-around">
        <div class="previewBox"></div>
        <div class="previewBoxRound"></div>
      </div>
    </div>
    <!-- </div> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clearDialog">取消</el-button>
        <el-button type="primary" @click="submitUpload"> 确认上传 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateAvatorApi, uploadAvatorApi } from '../../api/userinfo/index'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, type UploadInstance, type UploadProps, type UploadRawFile } from 'element-plus'
// import { Ref } from 'vue'

const userStore = useUserStore()

const CROPPER: Ref<Cropper | null> = ref(null) //创建一个cropper的全局对象

// const cropSrc: Ref<string> = ref('')

const currentPicName = ref('')
const loadingImg = (file) => {
  let rawFile = file.raw
  const userinfo = userStore.getUserInfo
  currentPicName.value = userinfo?.nickname + '_' + rawFile.name
  // return
  //读取上传文件
  if (rawFile) {
    CROPPER?.value?.destroy()
    let reader = new FileReader()
    //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
    reader.readAsDataURL(rawFile)
    reader.onload = (_e) => {
      let dataURL = (reader.result as string) || ''
      //将img的src改为刚上传的文件的转换格式
      let cropImg: HTMLImageElement = document.querySelector('#cropImg')!
      cropImg.src = dataURL
      // document.querySelector('#cropImg')!.src = dataURL

      const image: Partial<HTMLCanvasElement> = document.getElementById('cropImg')!

      // 创建cropper实例-----------------------------------------
      if (image) {
        // console.log('🚀 ~ file: Cropper.vue:87 ~ loadingImg ~ image:', image)
        CROPPER.value = new Cropper(image, {
          aspectRatio: 1 / 1,
          viewMode: 0,
          minContainerWidth: 300,
          minContainerHeight: 300,
          dragMode: 'crop',
          preview: [
            document.querySelector('.previewBox'),
            document.querySelector('.previewBoxRound')
          ]
        })
      }
    }
  }
}

const GetData = () => {
  //getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
  if (CROPPER.value) {
    CROPPER.value
      .getCroppedCanvas({
        maxWidth: 300,
        maxHeight: 300,
        // width: 300,
        // height: 300,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })
      .toBlob(async (blob) => {
        //然后调用浏览器原生的toBlob方法将canvas数据转换成blob数据
        //之后就可以愉快的将blob数据发送至后端啦，可根据自己情况进行发送，我这里用的是axios
        const formData = new FormData()
        // 第三个参数为文件名，可选填.
        formData.append('file', blob!, currentPicName.value)
        // let config = {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // }
        let headers = { 'Content-Type': 'multipart/form-data' }
        try {
          let res = await uploadAvatorApi(formData, headers)
          // console.log('🚀 ~ file: Cropper.vue:101 ~ .toBlob ~ res:', res)
          if (res && res.data && res.data.path) {
            const avator = res.data.path
            const userinfo = userStore.getUserInfo!
            userinfo.avator = avator ? 'http://127.0.1:3000/' + avator : ''
            userStore.setUserInfo(userinfo)
            try {
              const res = await updateAvatorApi({
                username: userinfo.username,
                avator: userinfo.avator
              })
              if (res && res.data && res.data.affected == 1) {
                //说明更新成功
                ElMessage.success('头像更新成功')
              }
            } catch (error) {}
            // console.log(
            //   '🚀 ~ file: Cropper.vue:127 ~ .toBlob ~ userStore.getUserInfo:',
            //   userStore.getUserInfo
            // )
            clearDialog()
          } else {
          }
        } catch (error) {
          console.log('🚀 ~ file: Cropper.vue:135 ~ .toBlob ~ error:', error)
        }
        // this.$axios
        //   .post(flow_mission_UploadFile(), param, config)
        //   .then((response) => {
        //     console.log(response)
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      })
  }
}

//  当重新选择文件时 清空现有文件信息
const uploadRef = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = Date.now() + file.uid
  uploadRef.value!.handleStart(file)
}

const submitUpload = () => {
  GetData()
}
let dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}
const clearDialog = async () => {
  dialogVisible.value = false
  const wait = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  await wait(1)
  currentPicName.value = ''
}
defineExpose({ openDialog })
</script>

<style scoped>
.previewBox,
.previewBoxRound {
  box-shadow: 0 0 5px #adadad;
  width: 100px;
  height: 100px;
  margin-top: 30px;
  overflow: hidden; /*这个超出设置为隐藏很重要，否则就会整个显示出来了*/
}
.previewBoxRound {
  border-radius: 50%; /*设置为圆形*/
}
</style>
