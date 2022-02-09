<template>
  <div>
    <CRow>
      <CCol>
        <CDropdown
          color="light"
          :toggler-text="thaiMonth[month]"
          class="m-2 float-right"
        >
          <div v-for="(month, index) in thaiMonth" :key="index">
            <CDropdownItem @click="changeMonth(index)">{{ month }}</CDropdownItem>
          </div>
        </CDropdown>
      </CCol>
    </CRow>
    <CChartBar
      :datasets="defaultDatasets"
      :options="defaultOptions"
      :labels="days"
    />
  </div>
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'
import { jogetService } from '@/helpers/joget-helper'

// function random (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }

export default {
  name: 'MainChartExample',
  components: {
    CChartBar,
    jogetService,
  },
  data() {
    return {
      date: new Date(),
      month: '',
      thaiMonth: [ 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      days: [],
      allInternationalNews: [],
      allLocalNews: [],
      allCyberNews: [],
      internationData: [],
    }
  },
  created() {
    this.getCurrentMonth()
    this.getDaysInMonth()

    this.getAllInternationNews()
      .then((res) => {
        this.allInternationalNews = res.data.data
      })

    this.getAllLocalNews()
      .then((res) => {
        this.allLocalNews = res.data.data
      })
    
    this.getAllCyberNews()
      .then((res) => {
        this.allCyberNews = res.data.data
      })
    
  },
  computed: {
    defaultDatasets () {
      const internalNews = '#321FDB'
      const localNews = '#2EB85C'
      const cyberNews = '#3399FF'

      const data1 = this.allInternationalNews
      const data2 = this.allLocalNews
      const data3 = this.allCyberNews

      let internationalData = []
      this.days.forEach((day) => {
        let count = 0
        data1.forEach((news) => {
          if ((Number(day) === new Date(news.dateCreated).getDate()) && (this.month === new Date(news.dateCreated).getMonth())) {
            count += 1
          }
        })
        internationalData.push(count)
      })

      let localData = []
      this.days.forEach((day) => {
        let count = 0
        data2.forEach((news) => {
          if ((Number(day) === new Date(news.dateCreated).getDate()) && (this.month === new Date(news.dateCreated).getMonth())) {
            count += 1
          }
        })
        localData.push(count)
      })

      let cyberData = []
      this.days.forEach((day) => {
        let count = 0
        data3.forEach((news) => {
          if ((Number(day) === new Date(news.dateCreated).getDate()) && (this.month === new Date(news.dateCreated).getMonth())) {
            count += 1
          }
        })
        cyberData.push(count)
      })
      return [
        {
          label: 'ข่าวต่างประเทศ',
          backgroundColor: internalNews,
          borderColor: internalNews,
          pointHoverBackgroundColor: internalNews,
          borderWidth: 2,
          data: internationalData
        },
        {
          label: 'ข่าวในประเทศ',
          backgroundColor: localNews,
          borderColor: localNews,
          pointHoverBackgroundColor: localNews,
          borderWidth: 2,
          data: localData
        },
        {
          label: 'ข่าวไซเบอร์',
          backgroundColor: cyberNews,
          borderColor: cyberNews,
          pointHoverBackgroundColor: cyberNews,
          borderWidth: 1,
          data: cyberData
        }
      ]
    },
    defaultOptions () {
      return {
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 10,
              stepSize: Math.ceil(15 / 3),
              max: 15
            },
            gridLines: {
              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    }
  },
  methods: {
    getCurrentMonth() {
      this.month = this.date.getMonth()
    },
    getDaysInMonth() {
      const daysInMonth = this.daysInMonth(this.month+1, this.date.getFullYear())
      let days = []
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(`${i}`)
      }
      this.days = days
    },
    changeMonth(index) {
      this.month = index
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate()
    },
    async getAllInternationNews() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวต่างประเทศ'
        }
      ]
      return await jogetService.list('RoyalThaiCommunication', 'list_news', searchData)
    },
    async getAllLocalNews() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวในประเทศ'
        }
      ]
      return await jogetService.list('RoyalThaiCommunication', 'list_news', searchData)
    },
    async getAllCyberNews() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวไซเบอร์'
        }
      ]
      return await jogetService.list('RoyalThaiCommunication', 'list_news', searchData)
    },
  }
}
</script>
