<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>ปรับปรุงข่าวไซเบอร์ประจำวัน</h4>
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
          <tab-content title="ข่าวทั่วไป" icon="">
            <div v-if="reload">
              <CCard
                v-for="(news, index) in cyberNormalNewsList"
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
                      @click="removeCyberNormalNews(index)"
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
                        index < cyberNormalNewsList.length - 1 ? false : true
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
                                @click="removeFileCyberNormalNews(index)"
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
          <tab-content title="ข่าวภัยคุกคาม" icon="">
            <div v-if="reload">
              <CCard
                v-for="(news, index) in cyberThreatNewsList"
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
                      @click="removeCyberThreatNews(index)"
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
                        index < cyberThreatNewsList.length - 1 ? false : true
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
                      @change="onFileSelected(index, 'threat')"
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
                                @click="removeFileCyberThreatNews(index)"
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
            <div v-if="reload">
              <CCard body-wrapper class="pb-3 pt-3">
                <div>
                  <CRow>
                    <CCol md="3">
                      <label for="">ผู้รับปฏิบัติ</label>
                    </CCol>
                    <CCol md="8">
                      <CMultiSelect
                        v-if="practitioner.length > 0"
                        @update="practitionerOption"
                        :options="practitionerList"
                        :search="true"
                        :selected="practitioner"
                        :selection="true"
                        optionsEmptyPlaceholder="No options placeholder"
                        selectionType="tags"
                        searchPlaceholder="เลือกผู้รับปฏิบัติ"
                      />
                    </CCol>
                  </CRow>
                  <CRow class="mt-3">
                    <CCol md="3">
                      <label for="">ผู้รับทราบ</label>
                    </CCol>
                    <CCol md="8">
                      <CMultiSelect
                        v-if="acknowledgment.length > 0"
                        @update="acknowledgmentOption"
                        :options="acknowledgmentList"
                        :search="true"
                        :selected="acknowledgment"
                        :selection="true"
                        optionsEmptyPlaceholder="No options placeholder"
                        selectionType="tags"
                        searchPlaceholder="เลือกผู้รับทราบ"
                      />
                    </CCol>
                  </CRow>
                </div>
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
                  class="mt-3"
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
            </div>
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
      cyberNormalNewsList: [],
      cyberThreatNewsList: [],

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
      practitionerList: [],
      practitioner: [],
      acknowledgmentList: [],
      acknowledgment: [],
      recording: "temporary"
    };
  },
  created() {
    this.reload = false;
    this.ticket = this.User.ticket;
    this.approver.name = this.User.username;
    this.getRank();
    this.getCyberNormalNewsList().then(res => {
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
      this.cyberNormalNewsList = newsList;
    });

    this.getCyberThreatNewsList().then(res => {
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
      this.cyberThreatNewsList = newsList;
    });
    this.getMergeNewsList().then(res => {
      this.mergeNewsList = res.data.data[0];
      this.acknowledgment = this.mergeNewsList.acknowledgment.split(",");
      this.practitioner = this.mergeNewsList.practitioner.split(",");
      this.docId = this.mergeNewsList.docId;
    });
    this.getNewsCommentList().then(res => {
      this.newsCommentList = res.data.data;
    });
  },
  methods: {
    async getRank() {
      await jogetService
        .list("RoyalThaiCommunication", "list_ranks")
        .then(res => {
          res.data.data.forEach((item, index) => {
            this.acknowledgmentList.push({
              value: item.rank,
              text: item.rank
            });
            this.practitionerList.push({
              value: item.rank,
              text: item.rank
            });
          });
        });
      this.reload = true;
    },
    acknowledgmentOption(rank) {
      this.acknowledgment = rank;
    },
    practitionerOption(rank) {
      this.practitioner = rank;
    },
    async removeCyberNormalNews(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.cyberNormalNewsList[index].id,
        formData
      );
      this.cyberNormalNewsList.splice(index, 1);
    },
    async removeCyberThreatNews(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.cyberThreatNewsList[index].id,
        formData
      );
      this.cyberThreatNewsList.splice(index, 1);
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
              // this.cyberNormalNewsList[newIndex].newFile = [];
              // this.cyberThreatNewsList[newIndex].newFile = [];
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
      if (news.subNewsType === "ทั่วไป") {
        const current = { ...this.cyberNormalNewsList[index] };
        const next = { ...this.cyberNormalNewsList[index - 1] };
        this.cyberNormalNewsList[index] = { ...next };
        this.cyberNormalNewsList[index - 1] = { ...current };
        this.cyberNormalNewsList[index].newsIndex = current.newsIndex;
        this.cyberNormalNewsList[index - 1].newsIndex = next.newsIndex;
        // .newsIndex.splice(index, 1);
        // this.cyberNormalNewsList.newsIndex.splice(index - 1, 0, news);
      } else if (news.subNewsType === "ภัยคุกคาม") {
        const current = { ...this.cyberThreatNewsList[index] };
        const next = { ...this.cyberThreatNewsList[index - 1] };
        this.cyberThreatNewsList[index] = { ...next };
        this.cyberThreatNewsList[index - 1] = { ...current };
        this.cyberThreatNewsList[index].newsIndex = current.newsIndex;
        this.cyberThreatNewsList[index - 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    goDown(news, index) {
      this.reload = false;
      if (news.subNewsType === "ทั่วไป") {
        const current = { ...this.cyberNormalNewsList[index] };
        const next = { ...this.cyberNormalNewsList[index + 1] };
        this.cyberNormalNewsList[index] = { ...next };
        this.cyberNormalNewsList[index + 1] = { ...current };
        this.cyberNormalNewsList[index].newsIndex = current.newsIndex;
        this.cyberNormalNewsList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "ภัยคุกคาม") {
        const current = { ...this.cyberThreatNewsList[index] };
        const next = { ...this.cyberThreatNewsList[index + 1] };
        this.cyberThreatNewsList[index] = { ...next };
        this.cyberThreatNewsList[index + 1] = { ...current };
        this.cyberThreatNewsList[index].newsIndex = current.newsIndex;
        this.cyberThreatNewsList[index + 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    // Upload a File
    async onFileSelected(index, type = "normal") {
      var files = event.target.files;
      var fileStart = [...files].map(item => {
        return {
          file: item,
          url: URL.createObjectURL(item)
        };
      });
      if (type === "normal") {
        this.cyberNormalNewsList[index].newFile.push(...fileStart);
      } else {
        this.cyberThreatNewsList[index].newFile.push(...fileStart);
      }
    },
    removeFileCyberNormalNews(index) {
      this.cyberNormalNewsList[index].newFile.splice(index, 1);
    },
    removeFileCyberThreatNews(index) {
      this.cyberThreatNewsList[index].newFile.splice(index, 1);
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
    getCyberNormalNewsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวไซเบอร์"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ทั่วไป"
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
    getCyberThreatNewsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวไซเบอร์"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภัยคุกคาม"
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
        newsType: "ข่าวไซเบอร์",
        docId: this.docId,
        docDate: this.docDate,
        practitioner: this.practitioner,
        acknowledgment: this.acknowledgment
      };
      jogetService
        .formSubmit("RoyalThaiCommunication", "mergeNews", processId, mergeData)
        .then(res => {
          const dailyNewsProcessId = processId;
          if (this.cyberNormalNewsList.length > 0) {
            this.cyberNormalNewsList.forEach(async (news, index) => {
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
          if (this.cyberThreatNewsList.length > 0) {
            this.cyberThreatNewsList.forEach(async (news, index) => {
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
