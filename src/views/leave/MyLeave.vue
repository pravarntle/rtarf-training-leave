<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ใบลาของ {{ userdata.fullname }}</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="leaveList"
          :fields="fields"
        >
          
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { jogetService } from '@/helpers/joget-helper'
export default {
  data() {
    return {
      userdata: JSON.parse(localStorage.getItem('rtarfUser')),
      leaveList: [],
      fields: [
        { key: 'dateCreated', label: 'วันที่ยื่นใบลา' },
        { key: 'leaveType', label: 'ประเภทการลา' },
        { key: 'startDate', label: 'ลาตั้งแต่วันที่' },
        { key: 'endDate', label: 'ลาถึงวันที่' },
        { key: 'totalDay', label: 'จำนวนวันลา' },
        { key: 'action', label: '' },
      ]
    }
  },
  created() {
    this.getLeaveList()
  },
  methods: {
    async getLeaveList() {
      const searchData = [
        {
          paramName: 'd-7781282-fn_requesterName',
          paramValue: this.userdata.fullname
        }
      ]
      const leaveList = await jogetService.list('leaveAppTatat', 'list_leaveList', searchData)
      this.leaveList = leaveList.data.data
    }
  }
}
</script>