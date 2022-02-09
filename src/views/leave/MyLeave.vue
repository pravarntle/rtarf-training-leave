<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ใบลาของฉัน</h4>
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
export default {
  data() {
    return {
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
    
  },
  methods: {
    
  }
}
</script>