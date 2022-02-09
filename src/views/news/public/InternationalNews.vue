<template>
  <div>
    <CCard>
      <CCardBody>
        <!-- <CCard body-wrapper> -->
        <h4 class="text-center mb-3">สรุปข่าวประจำวันทางด้านไซเบอร์</h4>
        <table>
          <tr>
            <td class="p-2" width="50%">ที่ {{ dailyNewsData.docId }}</td>
            <td class="p-2" width="50%">
              วันที่
              {{
                dailyNewsData.docDate != ""
                  ? convertDigit(
                      `${new Date(dailyNewsData.docDate).getDate()} ${
                        thaiMonth[new Date(dailyNewsData.docDate).getMonth()]
                      } ${new Date(dailyNewsData.docDate).getFullYear() + 543}`
                    )
                  : ""
              }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              ผู้รับปฏิบัติ {{ dailyNewsData.practitioner }}<br />
              ผู้รับทราบ {{ dailyNewsData.acknowledgment }}
            </td>
          </tr>
        </table>

        <h5 class="mt-5">๑.ภูมิภาคเอเชีย-แปซิฟิค</h5>
        <div v-if="newsListAsiaPacificList.length > 0">
          <CCard body-wrapper>
            <CRow
              class="mt-3"
              v-for="(news, index) in newsListAsiaPacificList"
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
                <CCard
                  class="mt-2"
                  body-wrapper
                  v-if="news.fileList && news.fileList.length > 0"
                >
                  <h6 class="mb-2">ภาพประกอบ</h6>
                  <CRow class="text-center align-items-center">
                    <template v-for="(file, index) in news.fileList">
                      <CCol class="mt-2" md="6" sm="12" :key="index">
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
                      </CCol>
                    </template>
                  </CRow>
                </CCard>
              </CCol>
            </CRow>
          </CCard>
        </div>
        <div v-else>
          <CRow>
            <CCol>
              <p style="text-indent: 20px;">ไม่มีรายการข่าว</p>
            </CCol>
          </CRow>
        </div>

        <h5 class="mt-5">๒.ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง</h5>
        <div v-if="newsListEastAsiaList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in newsListEastAsiaList"
            :key="index"
          >
            <CCol>
              <CRow>
                <CCol>
                  <p style="text-indent: 20px;">
                    <b>{{ news.subject }}</b>
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
              <CCard class="mt-2" body-wrapper v-if="news.fileList && news.fileList.length > 0">
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

        <h5 class="mt-5">๓.ภูมิภาคยุโรป อเมริกา แอฟริกา</h5>
        <div v-if="newsListEuropeList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in newsListEuropeList"
            :key="index"
          >
            <CCol>
              <CRow>
                <CCol>
                  <p style="text-indent: 20px;">
                    <b>{{ news.subject }}</b>
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
              <CCard class="mt-2" body-wrapper v-if="news.fileList && news.fileList.length > 0">
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
      </CCardBody>
    </CCard>
    <CElementCover :opacity="0.8" v-if="pageLoad" />
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import thaiMonth from "@/assets/json/thaidate.json";
export default {
  name: "InternationalNews",
  components: {
    jogetService
  },
  props: {
    processId: String
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      //   processId: this.$route.query.processId,
      dailyNewsData: "",
      assignmentData: "",
      newsListAsiaPacificList: [],
      newsListEastAsiaList: [],
      newsListEuropeList: [],
      thaiDigit: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
      approver: {
        name: "",
        approveStatus: ""
      },
      pageLoad: false,
      thaiMonth: thaiMonth.thmonth,
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`
    };
  },
  created() {
    this.ticket = this.User.ticket;
    this.approver.name = this.User.username;
    this.getDailyNewsData().then(res => {
      res.data.data.forEach(item => {
        if (item.processId === this.processId) {
          this.dailyNewsData = item;
        }
      });
    });

    this.getNewsListAsiaPacificList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
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
      this.newsListAsiaPacificList = newsList;
    });
    this.getNewsListEastAsiaList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
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
      this.newsListEastAsiaList = newsList;
    });

    this.getNewsListEuropeList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
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
      this.newsListEuropeList = newsList;
    });
    //   })
  },
  methods: {
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
      return alfrescoService.getNodeChild(fileNode, this.ticket);
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
    getNewsListAsiaPacificList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคเอเชีย-แปซิฟิค"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListEastAsiaList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListEuropeList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ภูมิภาคยุโรป อเมริกา แอฟริกา"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
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
