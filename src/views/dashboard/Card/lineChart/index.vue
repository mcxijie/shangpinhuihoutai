<script>
import * as echarts from 'echarts';

export default {
  name: '',
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false,
      },
      series: [{
        data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
        type: 'line',
        itemStyle: {
          opacity: 0
        },
        lineStyle: {
          color: 'purple'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'purple'
            }, {
              offset: 1,
              color: '#fff'
            }],
            global: false
          }
        }
      }],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    })
  }
}
</script>

<template>
  <div ref="charts" class="charts">

  </div>
</template>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
