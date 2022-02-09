<template>
  <div>
    <div>
      <CCard>
        <CCardHeader class="text-center">
          <h4>แก้ไขเขียนข่าว</h4>
        </CCardHeader>
        <CCardBody>
          <CSelect
            label="ประเภทข่าว"
            placeholder="กรุณาเลือกประเภทข่าว"
            :options="newsOptions"
            :value.sync="form.newsType"
            @change="onNewsTypeChange"
            horizontal
          />
          <CSelect
            label="หมวดหมู่ข่าว"
            :placeholder="form.newsType === '' ? '' : 'กรุณาเลือกหมวดหมู่ข่าว'"
            :options="subNewsOptions"
            :value.sync="form.subNewsType"
            :disabled="form.newsType === ''"
            @change="onNewsSubOfSubTypeChange"
            horizontal
          />
          <CSelect
            label="หมวดหมู่ข่าวย่อย"
            :placeholder="
              form.subNewsType === '' ? '' : 'กรุณาเลือกหมวดหมู่ข่าวย่อย'
            "
            :options="subOfSubNewsOptions"
            :value.sync="form.subOfSubNewsType"
            v-if="form.newsType === 'ข่าวในประเทศ'"
            horizontal
          />
          <CCard body-wrapper v-if="form.subNewsType !== ''">
            <h4 class="mb-4">ร่างข่าว</h4>
            <CInput
              label="ชื่อผู้เขียน"
              v-model="form.writer"
              horizontal
              disabled
            />
            <CInput label="หัวข้อข่าว" v-model="form.subject" horizontal />
            <CTextarea
              label="เนื้อหาข่าว"
              rows="6"
              v-model="form.body"
              horizontal
            />
            <CInputFile
              label="อัปโหลดรูปภาพประกอบ"
              @change="onFileSelected"
              :placeholder="fileSelected.name"
              multiple
              custom
              horizontal
            >
            </CInputFile>
            <CRow class="mt-3 mb-2">
              <CCol>
                <CButton
                  color="info"
                  class="float-right pl-5 pr-5"
                  :disabled="fileSelected === '' ? true : false"
                  @click="startUpload"
                  >Upload</CButton
                >
              </CCol>
            </CRow>
            <div v-if="fileSelected !== ''">
              <small>upload status</small>
              <CProgress :value="uploadProgress" color="info" />
            </div>
            <CCard body-wrapper v-if="fileSelected.length > 0" class="mt-4">
              <h5>รูปภาพที่อัปโหลด</h5>
              <CRow class="text-center align-items-center">
                <template v-for="(file, index) in fileSelected">
                  <CCol class="mt-3" md="3" :key="index">
                    <CCard body-wrapper>
                      <CImg width="100" height="100" :src="`${file.url}`" />
                      <CTextarea
                        placeholder="คำอธิบายรูปภาพ"
                        v-model="fileSelected[index].title"
                      ></CTextarea>
                    </CCard>
                    <CRow class="text-center">
                      <CCol>
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          class="ml-3"
                          @click="removeFile(index)"
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
                <template v-for="(file, index) in fileList">
                  <CCol class="mt-3" md="3" :key="index">
                    <CCard body-wrapper>
                      <CImg
                        width="100%"
                        :src="`${url}/nodes/${file.id}/content/${User.aTicket}`"
                      />
                      <CTextarea
                        placeholder="คำอธิบายรูปภาพ"
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
                          @click="goLeft(index)"
                          :disabled="index === 0"
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
                          @click="goRight(index)"
                          :disabled="index === fileList.length - 1"
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
                          @click="deleteFile(index)"
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
          </CCard>

          <CCard body-wrapper>
            <CCardHeader>ผลการรีวิว</CCardHeader>
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
        </CCardBody>
        <CCardFooter>
          <CButton
            color="success"
            class="float-right"
            :disabled="validateSave"
            @click.prevent="onComplete()"
            >บันทึก</CButton
          >
        </CCardFooter>
        <CElementCover :opacity="0.8" v-if="pageLoad" />
      </CCard>
      <CModal
        color="success"
        size="sm"
        :show.sync="successUploadModal"
        centered
      >
        <h6 class="text-center">File Uploaded</h6>
        <template #footer>
          <CButton
            color="success"
            class="float-right"
            @click="
              successUploadModal = false;
              uploadProgress = 0;
              fileSelected = [];
              updateFileList();
            "
            >ตกลง</CButton
          >
        </template>
      </CModal>
      <CElementCover :opacity="0.8" v-show="pageLoading" />
    </div>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import { authHeader } from "@/helpers/auth-header";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from "vue-feather-icons";
import axios from "axios";
export default {
  name: "",
  components: {
    jogetService,
    alfrescoService,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
    authHeader
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      pageLoading: false,
      form: {
        id: "",
        newsType: "",
        subNewsType: "",
        subOfSubNewsType: "",
        writer: "",
        subject: "",
        body: "",
        alfNodeId: "",
        status: "",
        processId: "",
        reviewer: "",
        reviewerComment: ""
      },
      approveComment: [],
      newsOptions: [
        {
          value: "ข่าวต่างประเทศ",
          label: "ข่าวต่างประเทศ",
          subObject: [
            { value: "ภูมิภาคเอเชีย-แปซิฟิค", label: "ภูมิภาคเอเชีย-แปซิฟิค" },
            {
              value: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง",
              label: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
            },
            {
              value: "ภูมิภาคยุโรป อเมริกา แอฟริกา",
              label: "ภูมิภาคยุโรป อเมริกา แอฟริกา"
            }
          ]
        },
        {
          value: "ข่าวในประเทศ",
          label: "ข่าวในประเทศ",
          subObject: [
            {
              value: "ข่าวความมั่นคงพื้นที่ภายใน",
              label: "ข่าวความมั่นคงพื้นที่ภายใน",
              subOfSubObject: [
                { value: "กลุ่มพลังมวลชน", label: "กลุ่มพลังมวลชน" },
                { value: "สถานการณ์ จชต.", label: "สถานการณ์ จชต." }
              ]
            },
            {
              value: "ข่าวความมั่นคงพื้นที่ชายแดน",
              label: "ข่าวความมั่นคงพื้นที่ชายแดน",
              subOfSubObject: [
                {
                  value: "การลักลอบเข้าเมืองโดยผิดกฎหมาย",
                  label: "การลักลอบเข้าเมืองโดยผิดกฎหมาย"
                },
                {
                  value: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ",
                  label: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ"
                },
                {
                  value: "ยาเสพติด",
                  label: "ยาเสพติด"
                }
              ]
            },
            {
              value: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ",
              label: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ",
              subOfSubObject: [
                { value: "การก่อการร้าย", label: "การก่อการร้าย" },
                { value: "อาชญากรรมข้ามชาติ", label: "อาชญากรรมข้ามชาติ" }
              ]
            }
          ]
        },
        {
          value: "ข่าวไซเบอร์",
          label: "ข่าวไซเบอร์",
          subObject: [
            { value: "ทั่วไป", label: "ทั่วไป" },
            { value: "ภัยคุกคาม", label: "ภัยคุกคาม" }
          ]
        }
      ],
      authHeader: authHeader(),
      subNewsOptions: [],
      pageLoad: false,
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      defaultNewsNode: `${process.env.VUE_APP_DEFAULT_NEWS}`,
      fileSelected: [],
      uploadProgress: 0,
      uploadIndex: 0,
      successUploadModal: false,
      fileList: [],
      newsList: [],
      newsCommentList: [],
      newsCommentFields: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ตรวจสอบ" },
        { key: "name", label: "ผู้ตรวจสอบ" },
        { key: "comment", label: "ความคิดเห็น" },
        { key: "ref2", label: "ขั้นตอน" },
        { key: "approveStatus", label: "ผลอนุมัติ" }
      ]
    };
  },
  computed: {
    validateSave: function() {
      if (
        this.form.newsType === "" ||
        this.form.subNewsType === "" ||
        this.form.subOfSubNewsType === "" ||
        this.form.subject === "" ||
        this.form.body === ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    const newsId = this.$route.query.data;
    this.ticket = this.User.ticket;
    this.form.writer = this.User.displayName;

    this.getNewsEdit(newsId);
    this.getNewsComment(newsId);
  },
  methods: {
    async getNewsComment(newsId) {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: newsId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", "rtarfNewsCommentList", searchData)
        .then(res => {
          this.newsCommentList = res.data.data;
        });
    },
    async getNewsEdit(newsId) {
      this.pageLoad = true;
      const searchData = [
        {
          paramName: "d-3656798-fn_processId",
          paramValue: newsId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", "list_news", searchData)
        .then(res => {
          this.form.id = res.data.data[0].id;
          this.form.newsType = res.data.data[0].newsType;
          this.form.subNewsType = res.data.data[0].subNewsType;
          this.form.subject = res.data.data[0].subject;
          this.form.subOfSubNewsType = res.data.data[0].subOfSubNewsType;
          this.form.body = res.data.data[0].body;
          this.form.alfNodeId = res.data.data[0].alfNodeId;
          this.form.processId = res.data.data[0].processId;
          this.form.reviewer = res.data.data[0].reviewer;
          this.form.reviewerComment = res.data.data[0].reviewerComment;
          this.form.status = "รอตรวจสอบ";
          const dailyNewsProcessId = res.data.data[0].dailyNewsProcessId;
          this.onNewsTypeChange();
          this.onNewsSubOfSubTypeChange();
          this.updateFileList();
          this.pageLoad = false;
          if (dailyNewsProcessId == !"") {
            const searchData = [
              {
                paramName: "d-7725097-fn_id",
                paramValue: dailyNewsProcessId
              }
            ];
            jogetService
              .list("RoyalThaiCommunication", "list_dailyNews", searchData)
              .then(res => {
                this.approveComment = res.data.data[0];
              });
          }
        });
    },
    onNewsTypeChange() {
      this.newsOptions.forEach(item => {
        if (item.value === this.form.newsType) {
          this.subNewsOptions = item.subObject;
        }
      });
    },
    onNewsSubOfSubTypeChange() {
      this.subNewsOptions.forEach(item => {
        if (item.value === this.form.subNewsType) {
          this.subOfSubNewsOptions = item.subOfSubObject;
          console.log(this.subOfSubNewsOptions);
        }
      });
    },
    // Upload a File
    onFileSelected(files) {
      console.log("file", files);
      var fileStart = [...files].map(item => {
        return {
          file: item,
          url: URL.createObjectURL(item)
        };
      });
      this.fileSelected.push(...fileStart);
    },
    removeFile(index) {
      this.fileSelected.splice(index, 1);
    },
    async startUpload() {
      this.pageLoading = true;
      let checkIndex = 0;
      var fileStartUpload = this.fileSelected.map(item => item.file);
      await fileStartUpload.forEach((item, index) => {
        this.fileUpload(item, this.form.alfNodeId).then(async res => {
          const fileIndex = this.fileList.length++;
          const nodeId = res.data.id;
          console.log("nodeId", nodeId);
          await this.fileProperty(
            nodeId,
            fileIndex,
            this.fileSelected[index].title
          ).then(async res => {
            checkIndex = (await checkIndex) + 1;
            if (checkIndex === fileStartUpload.length) {
              this.pageLoading = false;
              this.uploadProgress = 0;
              this.fileSelected = [];
              this.updateFileList();
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
    async updateFileList() {
      alfrescoService
        .getNodeChild(this.form.alfNodeId, this.User.aTicket)
        .then(res => {
          this.fileList = res.data.list;
          // console.log(this.fileList);
          this.fileList.sort(function(a, b) {
            a.descIndex = Number(a.properties["cm:description"]);
            b.descIndex = Number(b.properties["cm:description"]);
            return a.descIndex - b.descIndex;
          });
        });
    },
    // End Upload

    // Move Array Position
    async goLeft(index) {
      const currentPosition = this.fileList[index];
      const previousPosition = this.fileList[index - 1];
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
        this.updateFileList();
      }
    },
    async goRight(index) {
      const currentPosition = this.fileList[index];
      const nextPosition = this.fileList[index + 1];
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
        this.updateFileList();
      }
    },
    async deleteFile(index) {
      const currentPosition = this.fileList[index];
      await alfrescoService
        .deleteNode(currentPosition.id, this.User.aTicket)
        .then(res => {
          if (res.status === 204) {
            this.fileList.forEach(async (item, itemIndex) => {
              if (Number(item.properties["cm:description"]) > index) {
                await this.fileProperty(
                  item.id,
                  Number(item.properties["cm:description"]) - 1
                ).then(res => {
                  if (res.status === 200) {
                    // console.log(`Index ${itemIndex} is updated`);
                  }
                  if (itemIndex >= this.fileList.length - 1) {
                    this.updateFileList();
                  }
                });
              } else {
                this.updateFileList();
              }
            });
          }
        });
    },
    // End Move
    async onComplete() {
      // console.log("this.fileList", this.fileList);
      this.pageLoad = true;
      this.fileList.forEach(async (item, index) => {
        // console.log('item',item.["cm:title"]);
        console.log("index", index);
        const alfNodeId = item.id;
        console.log("alfNodeId", alfNodeId);
        await this.fileProperty(alfNodeId, index, item.properties["cm:title"]);
      });
      const recordId = this.form.id;
      jogetService
        .jsonSubmit("RoyalThaiCommunication", "createNews", recordId, this.form)
        .then(res => {
          jogetService
            .getCurrentActivity(this.form.processId)
            .then(async res => {
              const activityId = res.data.activityId;
              const variable = [
                {
                  paramName: "review_news",
                  paramValue: ""
                }
              ];
              await jogetService
                .processCompleteWithVariable(activityId, variable)
                .then(res => {
                  if (res.data.status === "completed") {
                    this.pageLoad = false;
                    this.$router.push({ name: "Cyber News" });
                  }
                });
            });
          if (res.data.id) {
            this.$router.push({ name: "Dashboard" });
          }
        });
    }
  }
};
</script>

<style></style>
