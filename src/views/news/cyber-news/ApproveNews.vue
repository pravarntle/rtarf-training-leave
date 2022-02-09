<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตรวจสอบข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CCard body-wrapper>
          <h4 class="text-center mb-3">สรุปข่าวประจำวันทางด้านไซเบอร์</h4>
          <table>
            <tr>
              <td class="p-2" width="50%">ที่</td>
              <td class="p-2" width="50%">
                วันที่
              </td>
            </tr>
            <tr>
              <td class="p-2">
                ผู้รับปฏิบัติ {{dailyNewsData.practitioner}}<br />
                ผู้รับทราบ {{dailyNewsData.acknowledgment}}
              </td>
            </tr>
          </table>

          <h5 class="mt-5">๑.ข่าวทั่วไป</h5>
          <div v-if="cyberNormalNewsList.length > 0">
            <CRow
              class="mt-3"
              v-for="(news, index) in cyberNormalNewsList"
              :key="index"
            >
              <CCol>
                <CRow>
                  <CCol>
                    <p style="text-indent: 20px;">
                      <b>๑.{{ thaiNum(index + 1) }} {{ news.subject }}</b>
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p
                      style="text-indent: 50px; margin-top: 0px; margin-bottom: 0px;"
                    >
                      {{ news.body }}
                    </p>
                  </CCol>
                </CRow>
                <CCard class="mt-2" body-wrapper v-if="news.fileList">
                  <h6 class="mb-2">ภาพประกอบ</h6>
                  <CRow class="text-center align-items-center">
                    <template v-for="(file, index) in news.fileList">
                      <CCol
                        class="mt-2"
                        lg="3"
                        md="4"
                        sm="6"
                        xs="12"
                        :key="index"
                      >
                        <CCard body-wrapper>
                          <CImg
                            width="100%"
                            :src="
                              `${url}/nodes/${file.id}/content/${User.aTicket}`
                            "
                          />
                          <CTextarea
                            disabled
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                        </CCard>
                      </CCol>
                    </template>
                  </CRow>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <div v-else>
            <CRow>
              <CCol>
                <p style="text-indent: 20px;">ไม่มีรายการข่าว</p>
              </CCol>
            </CRow>
          </div>

          <h5 class="mt-5">๒.ข่าวภัยคุกคาม</h5>
          <div v-if="cyberThreatNewsList.length > 0">
            <CRow
              class="mt-3"
              v-for="(news, index) in cyberThreatNewsList"
              :key="index"
            >
              <CCol>
                <CRow>
                  <CCol>
                    <p style="text-indent: 20px;">
                      <b>๒.{{ thaiNum(index + 1) }} {{ news.subject }}</b>
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p
                      style="text-indent: 50px; margin-top: 0px; margin-bottom: 0px;"
                    >
                      {{ news.body }}
                    </p>
                  </CCol>
                </CRow>
                <CCard class="mt-2" body-wrapper v-if="news.fileList">
                  <h6 class="mb-2">ภาพประกอบ</h6>
                  <CRow class="text-center align-items-center">
                    <template v-for="(file, index) in news.fileList">
                      <CCol
                        class="mt-2"
                        lg="3"
                        md="4"
                        sm="6"
                        xs="12"
                        :key="index"
                      >
                        <CCard body-wrapper>
                          <CImg
                            width="100%"
                            :src="
                              `${url}/nodes/${file.id}/content/${User.aTicket}`
                            "
                          />
                          <CTextarea
                            disabled
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                        </CCard>
                      </CCol>
                    </template>
                  </CRow>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <div v-else>
            <CRow>
              <CCol>
                <p style="text-indent: 20px;">ไม่มีรายการข่าว</p>
              </CCol>
            </CRow>
          </div>
        </CCard>
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
        <CCard body-wrapper class="pb-3 pt-3">
          <h5 class="mb-5">ส่วนของการอนุมัติ</h5>

          <CInput
            label="ชื่อผู้อนุมัติ"
            v-model="approver.name"
            horizontal
            disabled
          />
          <CSelect
            label="ผลการอนุมัติ"
            placeholder="กรุณาเลือก"
            :options="[
              { value: 'อนุมัติ', label: 'อนุมัติ' },
              { value: 'ส่งกลับผู้เขียนข่าว', label: 'ส่งกลับผู้เขียนข่าว' },
              { value: 'ส่งกลับผู้รวบรวมข่าว', label: 'ส่งกลับผู้รวบรวมข่าว' }
            ]"
            :value.sync="approver.approveStatus"
            horizontal
          />
          <CTextarea
            rows="3"
            v-model="approver.approveComment"
            placeholder="แสดงความคิดเห็น"
          />
        </CCard>
      </CCardBody>
      <CCardFooter>
        <CButton
          color="success"
          class="float-right"
          @click.prevent="onComplete()"
          :disabled="!approver.approveStatus"
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
import thaiMonth from "@/assets/json/thaidate.json";
export default {
  name: "",
  components: {
    jogetService
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      processId: this.$route.query.processId,
      dailyNewsData: "",
      assignmentData: "",
      cyberNormalNewsList: [],
      cyberThreatNewsList: [],
      newsListEurope: [],
      thaiDigit: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
      approver: {
        name: "",
        approveStatus: "",
        approveComment: ""
      },
      pageLoad: false,
      thaiMonth: thaiMonth.thmonth,
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`,
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
    this.approver.name = this.User.username;
    this.getDailyNewsData().then(res => {
      res.data.data.forEach(item => {
        if (item.processId === this.processId) {
          this.dailyNewsData = item;
          this.dailyNewsData.practitioner = this.dailyNewsData.practitioner
            .split(",")
            .join(" ");
          this.dailyNewsData.acknowledgment = this.dailyNewsData.acknowledgment
            .split(",")
            .join(" ");
        }
      });
    });
    jogetService.getAssignment(this.processId).then(async res => {
      this.pageLoad = true;
      this.assignmentData = res.data;

      this.cyberNormalNewsList = await this.getCyberNormalNews();
      this.cyberThreatNewsList = await this.getCyberThreatNews();
      this.getNewsCommentList();

      this.pageLoad = false;
    });
  },
  methods: {
    async getNewsCommentList() {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: this.processId
        }
      ];
      console.log("this.processId", this.processId);
      await jogetService
        .list("RoyalThaiCommunication", "rtarfNewsCommentList", searchData)
        .then(res => {
          this.newsCommentList = res.data.data;
          console.log("newsCommentList", this.newsCommentList);
        });
    },
    convertDigit(strDate) {
      let str = strDate.split(" ");
      let strConvert = str;
      for (let i = 0; i < 10; i++) {
        let nextLoop = true;
        while (nextLoop) {
          if (str[0].search(`${i}`) >= 0 || str[2].search(`${i}`) >= 0) {
            strConvert[0] = str[0].replace(`${i}`, this.thaiDigit[i]);
            str[0] = strConvert[0];
            strConvert[2] = str[2].replace(`${i}`, this.thaiDigit[i]);
            str[2] = strConvert[2];
          } else {
            nextLoop = false;
          }
        }
      }
      return `${strConvert[0]} ${strConvert[1]} ${strConvert[2]}`;
    },
    getFileList(fileNode) {
      return alfrescoService.getNodeChild(fileNode, this.User.aTicket);
    },
    thaiNum(digit) {
      return this.thaiDigit[digit];
    },
    getDailyNewsData() {
      const searchData = [
        {
          paramName: "d-7725097-fn_processId",
          paramValue: this.processId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_dailyNews",
        searchData
      );
    },
    async getCyberNormalNews() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ทั่วไป"
        }
      ];
      const getCyberNormalNews = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getCyberNormalNews.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
          if (item.alfNodeId !== "") {
            const getFile = await this.getFileList(item.alfNodeId);
            const fileList = getFile.data.list;
            fileList.sort(function(a, b) {
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
      return newsList;
    },
    async getCyberThreatNews() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภัยคุกคาม"
        }
      ];
      const getCyberThreatNews = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getCyberThreatNews.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
          if (item.alfNodeId !== "") {
            const getFile = await this.getFileList(item.alfNodeId);
            const fileList = getFile.data.list;
            fileList.sort(function(a, b) {
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
      return newsList;
    },
    async onComplete() {
      this.pageLoad = true;
      let formData = "";
      let variableStatus = "";
      let ref2 = "";

      let approveStatus = "";
      console.log("dailyNewsData", this.dailyNewsData);

      formData = {
        comment: this.approver.approveComment,
        name: this.approver.name,
        approveStatus: this.approver.approveStatus,
        ref1: this.dailyNewsData.id,
        ref2: this.assignmentData.activityName
      };
      console.log("formData", formData);

      jogetService.formSubmit(
        "RoyalThaiCommunication",
        "newsComment",
        "",
        formData
      );

      if (this.assignmentData.activityName === "ผช.ผอ.กอง ตรวจสอบข่าว") {
        formData = {
          approver1: this.approver.name
        };
        variableStatus = "status_1";
      } else if (this.assignmentData.activityName === "ผอ.กอง ตรวจสอบข่าว") {
        formData = {
          approver3: this.approver.name
        };
        variableStatus = "status_2";
      } else if (this.assignmentData.activityName === "รองผอ.สนข.ตรวจสอบข่าว") {
        formData = {
          approver4: this.approver.name
        };
        variableStatus = "status_3";
      } else if (this.assignmentData.activityName === "ผอ.สนข.ตรวจสอบข่าว") {
        formData = {
          approver5: this.approver.name,
          publishStatus: "รอรายละเอียด"
        };
        variableStatus = "status_4";
      }
      if (this.approver.approveStatus === "อนุมัติ") {
        approveStatus = "approve";
        jogetService
          .formSubmit(
            "RoyalThaiCommunication",
            "mergeNews",
            this.dailyNewsData.id,
            formData
          )
          .then(res => {
            const variable = [
              {
                paramName: variableStatus,
                paramValue: approveStatus
              }
            ];
            jogetService
              .processCompleteWithVariable(
                this.assignmentData.activityId,
                variable
              )
              .then(res => {
                this.$router.push({ name: "Dashboard" });
              });
          });
      } else {
        await jogetService.formSubmit(
          "RoyalThaiCommunication",
          "mergeNews",
          this.dailyNewsData.id,
          formData
        );
        if (this.approver.approveStatus === "ส่งกลับผู้เขียนข่าว") {
          approveStatus = "rejectToWriter";
        } else if (this.approver.approveStatus === "ส่งกลับผู้รวบรวมข่าว") {
          approveStatus = "rejectToCollector";
        }
        console.log(approveStatus);
        console.log("dailyNewsData", this.dailyNewsData.id);
        const variable = [
          {
            paramName: variableStatus,
            paramValue: approveStatus
          }
        ];
        jogetService.processCompleteWithVariable(
          this.assignmentData.activityId,
          variable
        );
        this.$router.push({ name: "Dashboard" });
      }
    }
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  padding: 5px;
}
table,
tr {
  border: 1px solid grey;
}
</style>
