<template>
  <el-dialog v-model="dialogVisible" width="600px" center>
    <!-- 1.一个用于获取上传文件的input，type="file"，并且监听onchange事件  -->
    <!-- <div> -->
    <!-- <input type="file" accept="image/*" id="imgReader" @change="loadingImg" /> -->
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :auto-upload="false"
      :on-change="loadingImg"
    >
      <template #trigger>
        <el-button type="primary">选择图片</el-button>
      </template>

      <template #tip>
        <div class="el-upload__tip"> 请上传jpg/png格式图片,且小于2000kb </div>
      </template>
    </el-upload>

    <!-- 2.一个用于给Cropper.js覆盖使用的img  -->
    <div style="">
      <img id="cropImg" />
    </div>

    <!-- 3.两个用于预览的div  -->
    <div class="previewText">裁剪预览</div>
    <div style="display: flex; justify-content: space-around">
      <div class="previewBox"></div>
      <div class="previewBoxRound"></div>
    </div>
    <!-- </div> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload"> 确认上传 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { uploadAvatorApi } from '../../api/login/index'

const CROPPER = ref(null) //创建一个cropper的全局对象

const loadingImg = (file) => {
  // console.log('🚀 ~ file: Cropper.vue:54 ~ loadingImg ~ eve:', eve)
  let rawFile = file.raw
  // return
  //读取上传文件
  let reader = new FileReader()
  if (rawFile) {
    //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
    reader.readAsDataURL(rawFile)
    reader.onload = (e) => {
      let dataURL = reader.result
      //将img的src改为刚上传的文件的转换格式
      document.querySelector('#cropImg').src = dataURL

      const image = document.getElementById('cropImg')

      //创建cropper实例-----------------------------------------
      CROPPER.value = new Cropper(image, {
        aspectRatio: 16 / 16,
        viewMode: 0,
        minContainerWidth: 300,
        minContainerHeight: 300,
        dragMode: 'crop',
        preview: [document.querySelector('.previewBox'), document.querySelector('.previewBoxRound')]
      })
    }
  }
}

const GetData = () => {
  //getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
  CROPPER.value
    .getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    .toBlob(async (blob) => {
      //然后调用浏览器原生的toBlob方法将canvas数据转换成blob数据
      //之后就可以愉快的将blob数据发送至后端啦，可根据自己情况进行发送，我这里用的是axios
      const formData = new FormData()
      // 第三个参数为文件名，可选填.
      formData.append('file', blob /*, 'example.png' */)
      // let config = {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // }
      let headers = { 'Content-Type': 'multipart/form-data' }
      let res = await uploadAvatorApi(formData, headers)
      console.log('🚀 ~ file: Cropper.vue:101 ~ .toBlob ~ res:', res)
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

const submitUpload = () => {
  GetData()
}
let dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
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
