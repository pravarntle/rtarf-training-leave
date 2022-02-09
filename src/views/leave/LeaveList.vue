<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ใบลารอการอนุมัติ</h4>
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
      leaveList: [],
      fields: [
        { key: 'dateCreated', label: 'วันที่ยื่นใบลา' },
        { key: 'requesterName', label: 'ชื่อผู้ขอลา' },
        { key: 'leaveType', label: 'ประเภทการลา' },
        { key: 'startDate', label: 'ลาตั้งแต่วันที่' },
        { key: 'endDate', label: 'ลาถึงวันที่' },
        { key: 'totalDay', label: 'จำนวนวันลา' },
        { key: 'action', label: '' },
      ]
    }
  },
  created() {
    
  },
  methods: {
    async getMyTasks() {
      const myTasks = await jogetService.getMyAssignment()
    }
    
  }
}
</script>