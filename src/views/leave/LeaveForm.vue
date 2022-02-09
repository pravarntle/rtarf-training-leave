<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>แบบฟอร์มใบลา</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CInput
              label="ชื่อผู้ขอลา"
              v-model="form.requesterName"
              disabled
            />
          </CCol>
          <CCol>
            <CInput
              label="วันที่ยื่นใบลา"
              :value="new Date().toLocaleDateString('th-TH')"
              disabled
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CSelect
              label="ประเภทการลา"
              placeholder="กรุณาเลือกประเภทการลา"
              :options="leaveType"
            />
          </CCol>
          <CCol>
            
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput
              label="ลาตั้งแต่วันที่"
              type="date"
              v-model="form.startDate"
            />
          </CCol>
          <CCol>
            <CInput
              label="ลาถึงวันที่"
              type="date"
              v-model="form.endDate"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput
              label="รวมวันลา"
              v-model="form.totalDay"
              append="วัน"
              disabled
            />
          </CCol>
          <CCol>
            
          </CCol>
        </CRow>
        <CTextarea
          label="หมายเหตุ"
          rows="4"
          v-model="form.remark"
        />
      </CCardBody>
      <CCardFooter>
        <CButton color="danger" class="float-right pl-4 pr-4 ml-2" @click="$router.push({ name: 'Dashboard' })">ยกเลิก</CButton>
        <CButton color="primary" class="float-right pl-4 pr-4 ml-2" @click="onSave">บันทึก</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { jogetService } from '@/helpers/joget-helper'
export default {
  data() {
    return {
      userdata: JSON.parse(localStorage.getItem('rtarfUser')),
      form: {
        requesterName: '',
        startDate: new Date(),
        endDate: new Date(),
        totalDay: 0,
        remark: '',
      },
      leaveType: [
        { value: 'ลาป่วย', label: 'ลาป่วย' },
        { value: 'ลากิจ', label: 'ลากิจ' },
        { value: 'ลาพักร้อน', label: 'ลาพักร้อน' },
      ]
    }
  },
  created() {
    this.form.requesterName = this.userdata.fullname
  },
  methods: {
    async onSave() {
      try {
        const process = await jogetService.startProcess('leaveAppTatat', 'leaveProcess')
        const processId = process.data.processId
        const form = await jogetService.jsonSubmit('leaveAppTatat', 'formLeaveRequest', processId, this.form)
        console.log(form)
      } catch (err) {
        
      }
    }
  }
}
</script>