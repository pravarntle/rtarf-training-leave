<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตรวจสอบข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CCard body-wrapper>
          <h4 class="text-center mb-3">สรุปสถานการณ์ข่าวในประเทศ</h4>
          <table>
            <tr>
              <td class="p-2" width="50%">ที่</td>
              <td class="p-2" width="50%">
                วันที่
              </td>
            </tr>
            <tr>
              <td class="p-2">
                ผู้รับปฏิบัติ {{ dailyNewsData.practitioner }}<br />
                ผู้รับทราบ {{ dailyNewsData.acknowledgment }}
              </td>
            </tr>
          </table>

          <h5 class="mt-5">๑. ข่าวความมั่นคงพื้นที่ภายใน</h5>
          <div v-if="newsListInternal.length > 0">
            <CRow
              class="mt-3"
              v-for="(news, index) in newsListInternal"
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

          <h5 class="mt-5">๒. ข่าวความมั่นคงพื้นที่ชายแดน</h5>
          <div v-if="newsListBorderLand.length > 0">
            <CRow
              class="mt-3"
              v-for="(news, index) in newsListBorderLand"
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

          <h5 class="mt-5">๓. ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ</h5>
          <div v-if="newsListSpecial.length > 0">
            <CRow
              class="mt-3"
              v-for="(news, index) in newsListSpecial"
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
      newsListInternal: [],
      newsListBorderLand: [],
      newsListSpecial: [],
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

      this.newsListInternal = await this.getNewsListInternal();
      this.newsListBorderLand = await this.getNewsListBorderLand();
      this.newsListSpecial = await this.getNewsListSpecial();
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
    async getNewsListInternal() {
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
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        }
      ];
      const getNewsListInternal = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getNewsListInternal.data.data.forEach(async (item, index) => {
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
    async getNewsListBorderLand() {
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
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        }
      ];
      const getNewsListBorderLand = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getNewsListBorderLand.data.data.forEach(async (item, index) => {
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

    async getNewsListSpecial() {
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
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
        }
      ];
      const getNewsListBorderLand = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getNewsListBorderLand.data.data.forEach(async (item, index) => {
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
      let ref2 = "";

      console.log("dailyNewsData", this.dailyNewsData);

      formData = {
        comment: this.approver.approveComment,
        name: this.approver.name,
        ref1: this.dailyNewsData.id,
        ref2: this.assignmentData.activityName
      };

      jogetService.formSubmit(
        "RoyalThaiCommunication",
        "newsComment",
        "",
        formData
      );

      formData = {
        review: this.approver.name
      };
      jogetService
        .formSubmit(
          "RoyalThaiCommunication",
          "mergeNews",
          this.dailyNewsData.id,
          formData
        )
        .then(res => {
          jogetService
            .processComplete(this.assignmentData.activityId)
            .then(res => {
              this.$router.push({ name: "Dashboard" });
            });
        });
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
