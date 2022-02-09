<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>รายละเอียดข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CCard body-wrapper>
          <CCardHeader> <h5>กรอกรายละเอียดข่าว</h5> </CCardHeader>

          <CCardBody>
            <div v-if="reload">
              <CInput label="เลขที่เอกสาร" v-model="docId" horizontal />
              <CRow class="mt-3">
                <CCol md="3">
                  <label for="">วันที่</label>
                </CCol>
                <CCol md="8">
                  <v-date-picker
                    locale="th-TH"
                    :attributes="attributes"
                    v-model="docDate"
                    @update:from-page="getHeaderInputDate"
                  >
                    <template slot="header-title">
                      {{ headerInputDate }}
                    </template>
                    <CInput
                      id="showDate"
                      :placeholder="this.formatDateToShow(docDate)"
                    />
                  </v-date-picker>
                </CCol>
              </CRow>
            </div>
          </CCardBody>
        </CCard>

        <CCard body-wrapper>
          <template>
            <h4 class="text-center mb-3">สรุปสถานการณ์ข่าวในประเทศ</h4>
            <table>
              <tr>
                <td class="p-2">ที่ {{ docId }}</td>
                <td class="p-2">
                  วันที่
                  {{
                    convertDigit(
                      `${new Date(docDate).getDate()} ${
                        thaiMonth[new Date(docDate).getMonth()]
                      } ${new Date(docDate).getFullYear() + 543}`
                    )
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
          </template>
          <template>
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
          </template>
          <template>
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
          </div>          </template>
          <template>
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
          </div>          </template>
        </CCard>
        <CCard body-wrapper>
          <CCardHeader>
            <h5>ผลการอนุมัติ</h5>
          </CCardHeader>
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
        <CButton color="success" class="float-right" @click.prevent="onComplete"
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
import { DatePicker } from "v-calendar";
import moment from "moment";

export default {
  name: "",
  components: {
    jogetService,
    "v-date-picker": DatePicker,
    alfrescoService
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      processId: this.$route.query.processId,
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
      ],
      docId: "",
      practitionerList: [],
      practitioner: [],
      acknowledgmentList: [],
      acknowledgment: [],
      reload: true,
      docDate: new Date(),
      headerInputDate: "",
      attributes: [
        {
          highlight: true
        }
      ]
    };
  },
  created() {
    this.reload = false;
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
      this.getRank();

      this.publicPowerGroupList = await this.getPublicPowerGroupList();
      this.southernBorderList = await this.getSouthernBorderList();
      this.smugglingPersonsList = await this.getSmugglingPersonsList();
      this.smugglingProductsList = await this.getSmugglingProductsList();
      this.drugList = await this.getDrugList();
      this.terrorismList = await this.getTerrorismList();
      this.transnationalCrimeList = await this.getTransnationalCrimeList();
      this.getNewsCommentList();

      this.pageLoad = false;
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
    async getNewsCommentList() {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: this.processId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", "rtarfNewsCommentList", searchData)
        .then(res => {
          this.newsCommentList = res.data.data;
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
async getPublicPowerGroupList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "กลุ่มพลังมวลชน"
        }
      ];
      const getPublicPowerGroupList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getPublicPowerGroupList.data.data.forEach(async (item, index) => {
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
    async getSouthernBorderList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "สถานการณ์ จชต."
        }
      ];
      const getSouthernBorderList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getSouthernBorderList.data.data.forEach(async (item, index) => {
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
    async getSmugglingPersonsList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบเข้าเมืองโดยผิดกฎหมาย"
        }
      ];
      const getSmugglingPersonsList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getSmugglingPersonsList.data.data.forEach(async (item, index) => {
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
    async getSmugglingProductsList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ"
        }
      ];
      const getSmugglingProductsList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getSmugglingProductsList.data.data.forEach(async (item, index) => {
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
    async getDrugList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "ยาเสพติด"
        }
      ];
      const getDrugList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getDrugList.data.data.forEach(async (item, index) => {
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

    async getTerrorismList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การก่อการร้าย"
        }
      ];
      const getTerrorismList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getTerrorismList.data.data.forEach(async (item, index) => {
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
    async getTransnationalCrimeList() {
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
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "อาชญากรรมข้ามชาติ"
        }
      ];
      const getTransnationalCrimeList = await jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );

      let newsList = [];
      getTransnationalCrimeList.data.data.forEach(async (item, index) => {
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
    formatDateToShow(date = null) {
      var formatDate = "";
      if (date != null) {
        formatDate = moment(String(date))
          .add(543, "year")
          .format("DD/MM/YYYY");
      } else {
        formatDate = "วัน/เดือน/ปี";
      }
      return formatDate;
    },
    getHeaderInputDate(events) {
      switch (events.month) {
        case 1:
          this.headerInputDate = "มกราคม " + (events.year + 543);
          break;
        case 2:
          this.headerInputDate = "กุมภาพันธ์ " + (events.year + 543);
          break;
        case 3:
          this.headerInputDate = "มีนาคม " + (events.year + 543);
          break;
        case 4:
          this.headerInputDate = "เมษายน " + (events.year + 543);
          break;
        case 5:
          this.headerInputDate = "พฤษภาคม " + (events.year + 543);
          break;
        case 6:
          this.headerInputDate = "มิถุนายน " + (events.year + 543);
          break;
        case 7:
          this.headerInputDate = "กรกฎาคม " + (events.year + 543);
          break;
        case 8:
          this.headerInputDate = "สิงหาคม " + (events.year + 543);
          break;
        case 9:
          this.headerInputDate = "กันยายน " + (events.year + 543);
          break;
        case 10:
          this.headerInputDate = "ตุลาคม " + (events.year + 543);
          break;
        case 11:
          this.headerInputDate = "พฤศจิกายน " + (events.year + 543);
          break;
        case 12:
          this.headerInputDate = "ธันวาคม " + (events.year + 543);
          break;
        default:
          this.headerInputDate = "ข้อมูลผิดพลาด";
          break;
      }
    },
    async onComplete() {
      this.pageLoad = true;
      let formData = "";
      let variableStatus = "";
      variableStatus = "status_5";
      let ref2 = "";
      formData = {
        approver5: this.approver.name,
        publishStatus: "เผยแพร่",
        docId: this.docId,
        docDate: this.docDate
        // practitioner: this.practitioner,
        // acknowledgment: this.acknowledgment
      };
      let approveStatus = "";
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
