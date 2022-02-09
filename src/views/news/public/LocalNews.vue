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

        <h5 class="mt-5">๑. ข่าวความมั่นคงพื้นที่ภายใน</h5>
        <h6>๑.๑ กลุ่มพลังมวลชน</h6>
        <div v-if="publicPowerGroupList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in publicPowerGroupList"
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
        <h6>๑.๒ สถานการณ์ จชต.</h6>
        <div v-if="southernBorderList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in southernBorderList"
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

        <h5 class="mt-5">๒. ข่าวความมั่นคงพื้นที่ชายเแดน</h5>
        <h6>๒.๑ การลักลอบเข้าเมืองโดยผิดกฎหมาย</h6>
        <div v-if="smugglingPersonsList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in smugglingPersonsList"
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
        <h6>๒.๒ การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ</h6>
        <div v-if="smugglingProductsList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in smugglingProductsList"
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
        <h6>๒.๓ ยาเสพติด</h6>
        <div v-if="drugList.length > 0">
          <CRow class="mt-3" v-for="(news, index) in drugList" :key="index">
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

        <h5 class="mt-5">๓. ข่าวก่อการร้ายและอาชญากรรมข้ามขาติ</h5>
        <h6>๓.๑ การก่อการร้าย</h6>
        <div v-if="terrorismList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in terrorismList"
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
        <h6>๓.๒ อาชญากรรมข้ามชาติ</h6>
        <div v-if="transnationalCrimeList.length > 0">
          <CRow
            class="mt-3"
            v-for="(news, index) in transnationalCrimeList"
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
  name: "LocalNews",
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
      publicPowerGroupList: [],
      southernBorderList: [],
      smugglingPersonsList: [],
      smugglingProductsList: [],
      drugList: [],
      terrorismList: [],
      transnationalCrimeList: [],
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

    this.getPublicPowerGroupList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.publicPowerGroupList = newsList;
    });
    this.getSouthernBorderList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.southernBorderList = newsList;
    });
    this.getSmugglingPersonsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.smugglingPersonsList = newsList;
    });
    this.getSmugglingProductsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.smugglingProductsList = newsList;
    });
    this.getDrugList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.drugList = newsList;
    });

    this.getTerrorismList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.terrorismList = newsList;
    });
    this.getTransnationalCrimeList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId === this.processId) {
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
      this.transnationalCrimeList = newsList;
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
    getPublicPowerGroupList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "กลุ่มพลังมวลชน"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSouthernBorderList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "สถานการณ์ จชต."
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSmugglingPersonsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบเข้าเมืองโดยผิดกฎหมาย"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSmugglingProductsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getDrugList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "ยาเสพติด"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getTerrorismList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การก่อการร้าย"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getTransnationalCrimeList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.processId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "อาชญากรรมข้ามชาติ"
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
