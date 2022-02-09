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
              :value.sync="form.leaveType"
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
        <CInputFile
          label="ไฟล์แนบ"
          @change="onFileSelect"
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
import axios from 'axios'
import { jogetService } from '@/helpers/joget-helper'
export default {
  data() {
    return {
      userdata: JSON.parse(localStorage.getItem('rtarfUser')),
      form: {
        requesterName: '',
        startDate: new Date(),
        endDate: new Date(),
        leaveType: '',
        totalDay: 0,
        remark: '',
      },
      leaveType: [
        { value: 'ลาป่วย', label: 'ลาป่วย' },
        { value: 'ลากิจ', label: 'ลากิจ' },
        { value: 'ลาพักร้อน', label: 'ลาพักร้อน' },
      ],
      fileUpload: '',
    }
  },
  created() {
    this.form.requesterName = this.userdata.fullname
  },
  methods: {
    async onSave() {
      const axiosData = {
        username: process.env.VUE_APP_PORTAL_USER,
        password: process.env.VUE_APP_PORTAL_PASSWORD
      }
      const alfrescoResponse = await axios.post(`${process.env.VUE_APP_ALF_URL}alfresco/s/api/login`, axiosData)
      const ticket = await alfrescoResponse.data.data.ticket

      const formData = new FormData()
      formData.append('filedata', this.fileUpload)
      formData.append('destination', `workspace://SpacesStore/${process.env.VUE_APP_DEFAULT_PATH}`)

      const fileResponse = await axios.post(encodeURI(`${process.env.VUE_APP_ALF_URL}alfresco/s/api/upload?alf_ticket=${ticket}`), formData, { headers: { 'Content-Type': 'multipart/form-data' }})
      
      this.form.alfNodeId = await fileResponse.data.nodeRef.substring(24)

      try {
        const process = await jogetService.startProcess('leaveAppTatat', 'leaveProcess')
        const processId = process.data.processId
        const form = await jogetService.jsonSubmit('leaveAppTatat', 'formLeaveRequest', processId, this.form)
        console.log(form)
      } catch (err) {
        
      }
    },
    onFileSelect(files) {
      this.fileUpload = files[0]
      console.log(this.fileUpload)
    }
  }
}
</script>