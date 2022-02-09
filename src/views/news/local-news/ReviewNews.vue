<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>ตรวจสอบข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CInput label="ชื่อผู้ร่าง" v-model="form.writer" horizontal disabled />
        <CInput
          label="หมวดหมู่ข่าว"
          v-model="form.subNewsType"
          horizontal
          disabled
        />
        <CInput
          label="หมวดหมู่ข่าวย่อย"
          v-model="form.subOfSubNewsType"
          horizontal
          disabled
        />
        <CInput
          label="หัวข้อข่าว"
          v-model="form.subject"
          horizontal
          :disabled="!edit"
        />
        <CTextarea
          label="เนื้อหาข่าว"
          rows="10"
          v-model="form.body"
          horizontal
          :disabled="!edit"
        />
        <CCard
          body-wrapper
          v-if="fileList.length > 0 && carouselsMode"
          class="mt-4"
        >
          <CSwitch
            class="float-right"
            color="primary"
            size="sm"
            variant="3d"
            :checked.sync="carouselsMode"
          />
          <span class="float-right mr-2 text-dark">Carousel Mode</span>
          <h5 class="mb-5">รูปภาพประกอบ</h5>
          <CRow>
            <CCol :md="{ size: '8', offset: '2' }">
              <CCarousel
                arrows
                :interval="5000"
                indicators
                animate
                height="450px"
              >
                <div v-for="(file, index) in fileList" :key="index">
                  <CCarouselItem
                    :image="{
                      src: `${url}/nodes/${file.id}/content/${User.aTicket}`
                    }"
                  />
                </div>
              </CCarousel>
            </CCol>
          </CRow>
        </CCard>
        <CCard
          body-wrapper
          v-if="fileList.length > 0 && !carouselsMode"
          class="mt-4"
        >
          <CSwitch
            class="float-right"
            color="primary"
            size="sm"
            variant="3d"
            :checked.sync="carouselsMode"
            :disabled="edit"
          />
          <span class="float-right mr-2 text-dark">Carousel Mode</span>
          <h5 class="mb-5">รูปภาพประกอบ</h5>
          <CRow class="text-center align-items-center">
            <template v-for="(file, index) in fileList">
              <CCol class="mt-3" md="3" :key="index">
                <CCard body-wrapper>
                  <CImg
                    width="100%"
                    :src="`${url}/nodes/${file.id}/content/${User.aTicket}`"
                  />
                  <CTextarea
                    :disabled="!edit"
                    v-model="file.properties['cm:title']"
                  ></CTextarea>
                </CCard>
                <CRow class="text-center" v-if="edit">
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
                      ><trash-icon size="1.2x" class="custom-class"></trash-icon
                    ></CButton>
                  </CCol>
                </CRow>
              </CCol>
            </template>
          </CRow>
        </CCard>
        <CRow>
          <CCol>
            <CButton
              color="info"
              class="float-right"
              @click="
                edit = true;
                carouselsMode = false;
              "
              v-if="!edit"
              ><edit-2-icon
                size="1.5x"
                class="custom-class mr-1"
                style="padding-bottom: 2px;"
              ></edit-2-icon>
              เปิดการแก้ไข</CButton
            >
            <CButton
              color="success"
              class="float-right"
              @click="onSaveClick"
              v-if="edit"
              ><save-icon
                size="1.5x"
                class="custom-class mr-1"
                style="padding-bottom: 2px;"
              ></save-icon>
              บันทึกการแก้ไข</CButton
            >
          </CCol>
        </CRow>
        <CCard body-wrapper v-if="!edit" class="mt-3">
          <h5 class="mb-4">ส่วนการตรวจสอบ</h5>
          <CCard body-wrapper>
            <CCardHeader>ประวัติการอนุมัติ</CCardHeader>
            <CCardBody>
              <CDataTable
                :items="newsCommentList"
                :fields="newsCommentFields"
                :items-per-page="5"
              >
                <template #index="{index}">
                  <td>
                    {{ index + 1 }}
                  </td>
                </template>
                <template #no-items-view>
                  <h6>ไม่พบรายการ</h6>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
          <CInput
            label="ผู้ตรวจสอบ"
            v-model="action.reviewer"
            horizontal
            disabled
          />
          <CSelect
            label="ผลการตรวจสอบ"
            placeholder="กรุณาเลือกรายการ"
            :options="[
              { value: 'ผ่านการตรวจสอบ', label: 'ผ่านการตรวจสอบ' },
              { value: 'ส่งกลับเพื่อแก้ไข', label: 'ส่งกลับเพื่อแก้ไข' }
            ]"
            :value.sync="action.status"
            horizontal
          />
          <CTextarea
            label="ความคิดเห็น"
            rows="3"
            v-model="action.reviewerComment"
            placeholder="กรุณาแสดงความคิดเห็น"
            horizontal
          />
        </CCard>
      </CCardBody>
      <CCardFooter>
        <CButton
          color="success"
          class="float-right"
          :disabled="edit || !action.status"
          @click.prevent="onComplete()"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>
    <CElementCover :opacity="0.8" v-if="pageLoad" />
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import {
  Edit2Icon,
  SaveIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "vue-feather-icons";
export default {
  name: "",
  components: {
    jogetService,
    alfrescoService,
    Edit2Icon,
    SaveIcon,
    TrashIcon,
    ChevronRightIcon,
    ChevronLeftIcon
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      recordId: this.$route.query.recId,
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      ticket: "",
      edit: false,
      form: "",
      newsData: "",
      action: {
        status: "",
        reviewer: "",
        reviewerComment: ""
      },
      pageLoad: false,
      fileNode: "",
      fileList: [],
      carouselsMode: true,
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
  created() {
    this.ticket = this.User.ticket;
    this.getNewsData().then(res => {
      const form = res.data.data[0];
      this.newsData = form;
      this.form = {
        writer: form.writer,
        subNewsType: form.subNewsType,
        subOfSubNewsType: form.subOfSubNewsType,
        subject: form.subject,
        body: form.body
      };
      this.action = {
        reviewerComment: "",
        reviewer: this.User.username
      };

      this.fileNode = form.alfNodeId;
      this.getFileList();
      console.log(this.newsData);
      this.getNewsComment();
    });
  },
  methods: {
    getNewsData() {
      const searchData = [
        {
          paramName: "d-3656798-fn_id",
          paramValue: this.recordId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    async getNewsComment() {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: this.recordId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", "rtarfNewsCommentList", searchData)
        .then(res => {
          this.newsCommentList = res.data.data;
          console.log("newsCommentList", this.newsCommentList);
        });
    },
    async getFileList() {
      alfrescoService
        .getNodeChild(this.fileNode, this.User.aTicket)
        .then(res => {
          this.fileList = res.data.list;
          this.fileList.sort(function(a, b) {
            a.descIndex = Number(a.properties["cm:description"]);
            b.descIndex = Number(b.properties["cm:description"]);
            return a.descIndex - b.descIndex;
          });
        });
    },
    async fileProperty(nodeId, description, title = "") {
      var properties = {
        "cm:description": description
      };
      console.log("title", title);
      if (title) {
        properties["cm:title"] = title;
      }
      console.log("nodeId", nodeId);
      console.log("properties", properties);
      return await alfrescoService.updateNode(
        nodeId,
        properties,
        this.User.aTicket
      );
    },
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
        this.getFileList();
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
        this.getFileList();
      }
    },
    async deleteFile(index) {
      const currentPosition = this.fileList[index];
      alfrescoService
        .deleteNode(currentPosition.id, this.User.aTicket)
        .then(res => {
          this.fileList.forEach(async (item, itemIndex) => {
            if (Number(item.properties["cm:description"]) > index) {
              await this.fileProperty(
                item.id,
                Number(item.properties["cm:description"]) - 1
              ).then(res => {
                if (res.status === 200) {
                  console.log(`Index ${itemIndex} is updated`);
                }

                if (itemIndex >= this.fileList.length - 1) {
                  this.getFileList();
                }
              });
            } else {
              this.getFileList();
            }
          });
        });
    },
    // End Move
    onSaveClick() {
      jogetService
        .formSubmit(
          "RoyalThaiCommunication",
          "createNews",
          this.newsData.id,
          this.form
        )
        .then(res => {
          if (res.data.id) {
            this.edit = false;
            console.log("fileList", this.fileList);
            this.fileList.forEach(async (item, index) => {
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
          }
        });
    },
    async onComplete() {
      this.pageLoad = true;

      let approveStatus = "";
      if (this.action.status === "ผ่านการตรวจสอบ") {
        approveStatus = "approve";
      } else if (this.action.status === "ส่งกลับเพื่อแก้ไข") {
        approveStatus = "reject";
      }
      jogetService
        .formSubmit(
          "RoyalThaiCommunication",
          "createNews",
          this.newsData.id,
          this.action
        )
        .then(res => {
          var formData = {
            comment: this.action.reviewerComment,
            name: this.action.reviewer,
            approveStatus: this.action.status,
            ref1: this.newsData.id,
            ref2: "รีวิวข่าว"
          };
          jogetService.formSubmit(
            "RoyalThaiCommunication",
            "newsComment",
            "",
            formData
          );
          if (res.data.id) {
            jogetService
              .getCurrentActivity(this.newsData.processId)
              .then(async res => {
                const activityId = res.data.activityId;
                const variable = [
                  {
                    paramName: "review_news",
                    paramValue: approveStatus
                  }
                ];
                await jogetService
                  .processCompleteWithVariable(activityId, variable)
                  .then(res => {
                    if (res.data.status === "completed") {
                      this.pageLoad = false;
                      this.$router.push({ name: "Dashboard" });
                    }
                  });
              });
          }
        });
    }
  }
};
</script>

<style></style>
