<template>
  <div>项目审核</div>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="待审核项目" name="1">
        <WaitItems />
      </el-collapse-item>
      <el-collapse-item title="已审核项目" name="2">
        <Reviewed />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import WaitItems from './WaitItems.vue'
import Reviewed from './Reviewed.vue'
const activeName = ref('1')
</script>
