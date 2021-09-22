<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/reports'}">数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="echart-div" style="width:800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {}
  },
  methods: {},
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('echart-div'))

    // 数据
    const options = {
      title: {
        text: ''
      },
      tooltip: {},
      xAxis: {
        // boundaryGap: true,
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      this.$message.error('统计数据获取失败！')
      return
    }
    this.$message.success('统计数据获取成功！')

    const result = _.merge(res.data, options)
    // 绘制图表
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
