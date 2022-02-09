<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>ปรับปรุงข่าวปรับปรุงข่าวต่างประเทศประจำวัน</h4>
      </CCardHeader>
      <CCardBody>
        <CCard>
          <CCardHeader>ผลการอนุมัติ</CCardHeader>
          <CCardBody>
            <CDataTable
              :items="newsCommentList"
              :fields="newsCommentFields"
              :noItemsView="{}"
              :items-per-page="5"
            >
              <template #index="{index}">
                <td>
                  {{ index + 1 }}
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
        <form-wizard
          title=""
          subtitle=""
          @on-complete="onComplete"
          color="#3d3dff"
          shape="tab"
          back-button-text="ย้อนกลับ"
          next-button-text="ถัดไป"
          finish-button-text="บันทึก"
        >
          <tab-content title="ข่าวภูมิภาคเอเชีย-แปซิฟิค" icon="">
            <div v-if="reload">
              <CCard
                v-for="(news, index) in newsListAsiaPacific"
                :key="index"
                body-wrapper
              >
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeAsiaPacificNews(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < newsListAsiaPacific.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index)"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                            <CTextarea
                              placeholder="คำอธิบายรูปภาพ"
                              v-model="news.newFile[index].title"
                            ></CTextarea>
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileAsiaPacificNews(index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CTextarea
                            :disabled="!news.edit"
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
                                ><chevron-left-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-left-icon
                              ></CButton>
                              {{ index + 1 }}
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="ml-2"
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
                                ><chevron-right-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-right-icon
                              ></CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content
            title="ข่าวภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
            icon=""
          >
            <div v-if="reload">
              <CCard
                v-for="(news, index) in newsListEastAsia"
                :key="index"
                body-wrapper
              >
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeEastAsiaNews(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < newsListEastAsia.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'eastAsia')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                            <CTextarea
                              placeholder="คำอธิบายรูปภาพ"
                              v-model="news.newFile[index].title"
                            ></CTextarea>
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileEastAsiaNews(index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                            <CTextarea
                              :disabled="!news.edit"
                              v-model="file.properties['cm:title']"
                            ></CTextarea>
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
                                ><chevron-left-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-left-icon
                              ></CButton>
                              {{ index + 1 }}
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="ml-2"
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
                                ><chevron-right-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-right-icon
                              ></CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content title="ข่าวภูมิภาคยุโรป อเมริกา แอฟริกา" icon="">
            <div v-if="reload">
              <CCard
                v-for="(news, index) in newsListEurope"
                :key="index"
                body-wrapper
              >
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeEuropeNews(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < newsListEurope.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'europe')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                            <CTextarea
                              placeholder="คำอธิบายรูปภาพ"
                              v-model="news.newFile[index].title"
                            ></CTextarea>
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileEuropeNews(index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                            <CTextarea
                              :disabled="!news.edit"
                              v-model="file.properties['cm:title']"
                            ></CTextarea>
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
                                ><chevron-left-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-left-icon
                              ></CButton>
                              {{ index + 1 }}
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="ml-2"
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
                                ><chevron-right-icon
                                  size="1.5x"
                                  class="custom-class"
                                ></chevron-right-icon
                              ></CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
                                ><trash-icon
                                  size="1.2x"
                                  class="custom-class"
                                ></trash-icon
                              ></CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      </template>
                    </CRow>
                  </CCard>
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content title="รายละเอียดการปรับปรุงข่าว">
            <CCard body-wrapper class="pb-3 pt-3">
              <CRow class="mt-3">
                <CCol md="3">
                  <label for="">การบันทึก</label>
                </CCol>
                <CCol md="8">
                  <CInputRadioGroup
                    :options="[
                      { value: 'temporary', label: 'บันทึก' },
                      { value: 'saveAndSend', label: 'บันทึกและส่ง' }
                    ]"
                    :checked.sync="recording"
                    inline
                    custom
                  />
                </CCol>
              </CRow>
              <CInput
                label="ชื่อผู้ปรับปรุงข่าว"
                v-model="approver.name"
                horizontal
                disabled
              />
              <CTextarea
                rows="3"
                v-model="approver.approveComment"
                placeholder="อธิบายการแก้ไขเพิ่มเติม"
              />
            </CCard>
          </tab-content>
        </form-wizard>
      </CCardBody>
    </CCard>
    <CModal color="success" size="sm" :show.sync="successUploadModal" centered>
      <h6 class="text-center">File Uploaded</h6>
      <template #footer>
        <CButton
          color="success"
          class="float-right"
          @click="
            successUploadModal = false;
            uploadProgress = 0;
          "
          >ตกลง</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import {
  ChevronsUpIcon,
  ChevronsDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from "vue-feather-icons";
import axios from "axios";
import { FormWizard, TabContent } from "vue-form-wizard";
import { DatePicker } from "v-calendar";
import moment from "moment";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { authHeader } from "@/helpers/auth-header";

export default {
  name: "",
  components: {
    "v-date-picker": DatePicker,
    jogetService,
    alfrescoService,
    ChevronsUpIcon,
    ChevronsDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
    FormWizard,
    TabContent,
    authHeader
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      newsListAsiaPacific: [],
      newsListEastAsia: [],
      newsListEurope: [],
      mergeNewsProcessId: this.$route.query.data,
      mergeNews: [],
      pageLoad: false,
      form: {
        processId: "",
        newsProcessId: ""
      },
      headerInputDate: "",
      attributes: [
        {
          highlight: true
        }
      ],
      ticket: "",
      carouselHeight: "300px",
      docId: "",
      docDate: new Date(),
      uploadProgress: 0,
      successUploadModal: false,
      mergeNewsList: [], // รายการข่าวที่จะรวม
      newsCommentList: [],
      newsCommentFields: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ตรวจสอบ" },
        { key: "name", label: "ผู้ตรวจสอบ" },
        { key: "comment", label: "ความคิดเห็น" },
        { key: "ref2", label: "ขั้นตอน" },
        { key: "approveStatus", label: "ผลอนุมัติ" }
      ],
      reload: true,
      authHeader: authHeader(),
      approver: {
        name: "",
        approveStatus: "-",
        approveComment: ""
      },
      deleteNewsList: [],
      recording: "temporary"
    };
  },
  created() {
    this.ticket = this.User.ticket;
    this.approver.name = this.User.username;
    this.getNewsListAsiaPacific().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.edit = false;
          item.newFile = [];
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.newsListAsiaPacific = newsList;
    });

    this.getEastAsiaNewsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.newsListEastAsia = newsList;
    });

    this.getEuropeNewsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.newsListEurope = newsList;
    });
    this.getMergeNewsList().then(res => {
      this.mergeNewsList = res.data.data[0];
    });
    this.getNewsCommentList().then(res => {
      this.newsCommentList = res.data.data;
    });
  },
  methods: {
    async removeAsiaPacificNews(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.newsListAsiaPacific[index].id,
        formData
      );
      this.newsListAsiaPacific.splice(index, 1);
    },
    async removeEastAsiaNews(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.newsListEastAsia[index].id,
        formData
      );
      this.newsListEastAsia.splice(index, 1);
    },
    async removeEuropeNews(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.newsListEurope[index].id,
        formData
      );
      this.newsListEurope.splice(index, 1);
    },
    getFileList(fileNode) {
      return alfrescoService.getNodeChild(fileNode, this.User.aTicket);
    },
    startUpload(news, index) {
      this.pageLoading = true;
      let checkIndex = 0;
      var fileStartUpload = news.newFile.map(item => item.file);
      fileStartUpload.forEach((item, index) => {
        this.fileUpload(item, news.alfNodeId).then(async res => {
          console.log("res", res);
          const fileIndex = news.newFile.length++;
          console.log("fileIndex", fileIndex);
          const nodeId = res.data.id;
          console.log("nodeId", nodeId);
          await this.fileProperty(
            nodeId,
            fileIndex,
            news.newFile[index].title
          ).then(async res => {
            checkIndex = checkIndex + 1;
            console.log("checkIndex", checkIndex);
            if (checkIndex === fileStartUpload.length) {
              console.log("test");
              this.pageLoading = false;
              this.uploadProgress = 0;
              // this.successUploadModal = true;
              // this.newsListAsiaPacific[newIndex].newFile = [];
              // this.newsListEastAsia[newIndex].newFile = [];
              this.updateFileList(news);
              news.newFile = [];
            }
          });
        });
      });
    },
    async fileUpload(file, destination) {
      const formData = new FormData();
      formData.append("filedata", file);
      // formData.append("destination", `workspace://SpacesStore/${destination}`);
      return await axios.post(
        encodeURI(
          `${process.env.VUE_APP_BACKEND_URL}/nodes/${destination}/children`
        ),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...this.authHeader
          },
          onUploadProgress: uploadEvent => {
            this.uploadProgress = parseInt(
              Math.round((uploadEvent.loaded / uploadEvent.total) * 100)
            );
          }
        }
      );
    },
    async fileProperty(nodeId, description, title = "") {
      var properties = {
        "cm:description": description
      };
      if (title) {
        properties["cm:title"] = title;
      }
      return await alfrescoService.updateNode(
        nodeId,
        properties,
        this.User.aTicket
      );
    },
    async updateFileList(news) {
      alfrescoService
        .getNodeChild(news.alfNodeId, this.User.aTicket)
        .then(res => {
          news.fileList = res.data.list;
          news.fileList.sort(function(a, b) {
            a.descIndex = Number(a.properties["cm:description"]);
            b.descIndex = Number(b.properties["cm:description"]);
            return a.descIndex - b.descIndex;
          });
        });
    },
    goUp(news, index) {
      this.reload = false;
      if (news.subNewsType === "ภูมิภาคเอเชีย-แปซิฟิค") {
        const current = { ...this.newsListAsiaPacific[index] };
        const next = { ...this.newsListAsiaPacific[index - 1] };
        this.newsListAsiaPacific[index] = { ...next };
        this.newsListAsiaPacific[index - 1] = { ...current };
        this.newsListAsiaPacific[index].newsIndex = current.newsIndex;
        this.newsListAsiaPacific[index - 1].newsIndex = next.newsIndex;
        // .newsIndex.splice(index, 1);
        // this.newsListAsiaPacific.newsIndex.splice(index - 1, 0, news);
      } else if (
        news.subNewsType === "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
      ) {
        const current = { ...this.newsListEastAsia[index] };
        const next = { ...this.newsListEastAsia[index - 1] };
        this.newsListEastAsia[index] = { ...next };
        this.newsListEastAsia[index - 1] = { ...current };
        this.newsListEastAsia[index].newsIndex = current.newsIndex;
        this.newsListEastAsia[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "ภูมิภาคยุโรป อเมริกา แอฟริกา") {
        const current = { ...this.newsListEurope[index] };
        const next = { ...this.newsListEurope[index - 1] };
        this.newsListEurope[index] = { ...next };
        this.newsListEurope[index - 1] = { ...current };
        this.newsListEurope[index].newsIndex = current.newsIndex;
        this.newsListEurope[index - 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    goDown(news, index) {
      this.reload = false;
      if (news.subNewsType === "ภูมิภาคเอเชีย-แปซิฟิค") {
        const current = { ...this.newsListAsiaPacific[index] };
        const next = { ...this.newsListAsiaPacific[index + 1] };
        this.newsListAsiaPacific[index] = { ...next };
        this.newsListAsiaPacific[index + 1] = { ...current };
        this.newsListAsiaPacific[index].newsIndex = current.newsIndex;
        this.newsListAsiaPacific[index + 1].newsIndex = next.newsIndex;
      } else if (
        news.subNewsType === "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
      ) {
        const current = { ...this.newsListEastAsia[index] };
        const next = { ...this.newsListEastAsia[index + 1] };
        this.newsListEastAsia[index] = { ...next };
        this.newsListEastAsia[index + 1] = { ...current };
        this.newsListEastAsia[index].newsIndex = current.newsIndex;
        this.newsListEastAsia[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "ภูมิภาคยุโรป อเมริกา แอฟริกา") {
        const current = { ...this.newsListEurope[index] };
        const next = { ...this.newsListEurope[index + 1] };
        this.newsListEurope[index] = { ...next };
        this.newsListEurope[index + 1] = { ...current };
        this.newsListEurope[index].newsIndex = current.newsIndex;
        this.newsListEurope[index + 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    // Upload a File
    async onFileSelected(index, type = "asiaPacific") {
      var files = event.target.files;
      var fileStart = [...files].map(item => {
        return {
          file: item,
          url: URL.createObjectURL(item)
        };
      });
      if (type === "asiaPacific") {
        this.newsListAsiaPacific[index].newFile.push(...fileStart);
      } else if (type === "eastAsia") {
        this.newsListEastAsia[index].newFile.push(...fileStart);
      } else if (type === "europe") {
        this.newsListEurope[index].newFile.push(...fileStart);
      }
    },
    removeFileAsiaPacificNews(index) {
      this.newsListAsiaPacific[index].newFile.splice(index, 1);
    },
    removeFileEastAsiaNews(index) {
      this.newsListEastAsia[index].newFile.splice(index, 1);
    },
    removeFileEuropeNews(index) {
      this.newsListEurope[index].newFile.splice(index, 1);
    },
    // Move Array Position
    async goLeft(news, index) {
      const currentPosition = news.fileList[index];
      const previousPosition = news.fileList[index - 1];
      let updateStatus = 0;
      await this.fileProperty(currentPosition.id, index - 1).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      await this.fileProperty(previousPosition.id, index).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      if (updateStatus > 1) {
        this.updateFileList(news);
      }
    },
    async goRight(news, index) {
      const currentPosition = news.fileList[index];
      const nextPosition = news.fileList[index + 1];
      let updateStatus = 0;
      await this.fileProperty(currentPosition.id, index + 1).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      await this.fileProperty(nextPosition.id, index).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      if (updateStatus > 1) {
        this.updateFileList(news);
      }
    },
    async deleteFile(news, index) {
      const currentPosition = news.fileList[index];
      alfrescoService
        .deleteNode(currentPosition.id, this.User.aTicket)
        .then(res => {
          this.updateFileList(news);
          this.fileList.forEach(async (item, itemIndex) => {
            if (Number(item.properties["cm:description"]) > index) {
              await this.fileProperty(
                item.id,
                Number(item.properties["cm:description"]) - 1
              ).then(res => {});
            }
          });
        });
    },
    // End Move
    getNewsCommentList() {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "rtarfNewsCommentList",
        searchData
      );
    },
    getMergeNewsList() {
      const searchData = [
        {
          paramName: "d-7725097-fn_id",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_dailyNews",
        searchData
      );
    },
    getNewsListAsiaPacific() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวต่างประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคเอเชีย-แปซิฟิค"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getEastAsiaNewsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวต่างประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getEuropeNewsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวต่างประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคยุโรป อเมริกา แอฟริกา"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    async onSaveClick(news) {
      console.log(news);
      await jogetService
        .formSubmit("RoyalThaiCommunication", "createNews", news.id, news)
        .then(res => {
          news.fileList.forEach(async (item, index) => {
            // console.log('item',item.["cm:title"]);
            console.log("index", index);
            const alfNodeId = item.id;
            console.log("alfNodeId", alfNodeId);
            await this.fileProperty(
              alfNodeId,
              index,
              item.properties["cm:title"]
            );
          });
        });
    },
    async onComplete() {
      const processId = this.mergeNewsProcessId;
      let formData = "";

      formData = {
        comment: this.approver.approveComment,
        name: this.approver.name,
        approveStatus: this.approver.approveStatus,
        ref1: processId,
        ref2: "ปรับปรุงข่าว"
      };
      console.log("formData", formData);

      jogetService.formSubmit(
        "RoyalThaiCommunication",
        "newsComment",
        "",
        formData
      );

      const mergeData = {
        collector: this.User.username,
        processId: processId,
        publishStatus: "รอตรวจสอบ",
        newsType: "ข่าวต่างประเทศ",
        docId: this.docId,
        docDate: this.docDate
      };
      jogetService
        .formSubmit("RoyalThaiCommunication", "mergeNews", processId, mergeData)
        .then(res => {
          const dailyNewsProcessId = processId;
          if (this.newsListAsiaPacific.length > 0) {
            this.newsListAsiaPacific.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.newsListEastAsia.length > 0) {
            this.newsListEastAsia.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.newsListEurope.length > 0) {
            this.newsListEurope.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }

          if (this.recording == "saveAndSend") {
            jogetService.getCurrentActivity(dailyNewsProcessId).then(res => {
              const activityId = res.data.activityId;
              const variable = [
                {
                  paramName: "improve",
                  paramValue: "yes"
                },
                {
                  paramName: "status_1",
                  paramValue: ""
                }
              ];
              jogetService.processCompleteWithVariable(activityId, variable);
              this.completeProcess();
            });
          } else if (this.recording == "temporary") {
            this.completeProcess();
          }
        });
    },
    completeProcess() {
      this.$router.push({ name: "Cyber News" });
    }
  }
};
</script>

<style></style>
