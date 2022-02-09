<template>
  <CChartPie
    :datasets="defaultDatasets"
    :labels="['พื้นที่ว่าง (GB)', 'ใช้ไป (GB)']"
  />
</template>

<script>
import { CChartPie } from '@coreui/vue-chartjs'

export default {
  name: 'CChartPieStorageReport',
  components: { CChartPie },
  data() {
    return {
      storage: 78
    }
  },
  computed: {
    defaultDatasets () {
      return [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
          ],
          data: [54, 24],
        }
      ]
    }
  }
}
</script>
