<template>
  <CRow>
    <CCol sm="12" lg="4">
      <CWidgetIcon
        :header="`${allInternationalNews.length} (ทั้งหมด) / ${internationalNewsWaitReview.length} (รอการตรวจสอบ)`"
        text="ข่าวต่างประเทศ"
        color="primary"
      >
        <CIcon name="cil-settings"/>
      </CWidgetIcon>
    </CCol>
    <CCol sm="12" lg="4">
      <CWidgetIcon
        :header="`${allLocalNews.length} (ทั้งหมด) / ${localNewsWaitReview.length} (รอการตรวจสอบ)`"
        text="ข่าวในประเทศ"
        color="success"
      >
        <CIcon name="cil-settings"/>
      </CWidgetIcon>
    </CCol>
    <CCol sm="12" lg="4">
      <CWidgetIcon
        :header="`${allCyberNews.length} (ทั้งหมด) / ${cyberNewsWaitReview.length} (รอการตรวจสอบ)`"
        text="ข่าวไซเบอร์"
        color="info"
      >
        <CIcon name="cil-settings"/>
      </CWidgetIcon>
    </CCol>
  </CRow>
</template>

<script>
import { jogetService } from '@/helpers/joget-helper'

export default {
  name: 'WidgetsDropdown',
  components: { jogetService, },
  data() {
    return {
      allInternationalNews: [],
      internationalNewsWaitReview: [],
      allLocalNews: [],
      localNewsWaitReview: [],
      allCyberNews: [],
      cyberNewsWaitReview: [],
    }
  },
  created() {
    this.getAllInternationNews()
      .then((res) => {
        this.allInternationalNews = res.data.data
      })
    
    this.getInternationWaitReview()
      .then((res) => {
        this.internationalNewsWaitReview = res.data.data
      })

    this.getAllLocalNews()
      .then((res) => {
        this.allLocalNews = res.data.data
      })
    
    this.getLocalWaitReview()
      .then((res) => {
        this.localNewsWaitReview = res.data.data
      })

    this.getAllCyberNews()
      .then((res) => {
        this.allCyberNews = res.data.data
      })
    
    this.getCyberWaitReview()
      .then((res) => {
        this.cyberNewsWaitReview = res.data.data
      })
  },
  methods: {
    async getAllInternationNews() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวต่างประเทศ'
        }
      ]
      return await jogetService.list('RoyalThaiCommunication', 'list_news', searchData)
    },
    async getInternationWaitReview() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวต่างประเทศ'
        },
        {
          paramName: 'd-3656798-fn_status',
          paramValue: 'รอตรวจสอบ'
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
    async getLocalWaitReview() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวในประเทศ'
        },
        {
          paramName: 'd-3656798-fn_status',
          paramValue: 'รอตรวจสอบ'
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
    async getCyberWaitReview() {
      const searchData = [
        {
          paramName: 'd-3656798-fn_newsType',
          paramValue: 'ข่าวไซเบอร์'
        },
        {
          paramName: 'd-3656798-fn_status',
          paramValue: 'รอตรวจสอบ'
        }
      ]
      return await jogetService.list('RoyalThaiCommunication', 'list_news', searchData)
    },
  }
}
</script>
