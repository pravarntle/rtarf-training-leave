<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>รวมข่าวต่างประเทศประจำวัน</h4>
      </CCardHeader>
      <CCardBody>
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
            <div>
              <CButton
                @click="newsListAsiaPacificModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวภูมิภาคเอเชีย-แปซิฟิค
              </CButton>

              <CRow v-if="asiaPacificNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsAsiaPacificMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวภูมิภาคเอเชีย-แปซิฟิคประจำวัน"
                color="info"
                :show.sync="newsListAsiaPacificModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListAsiaPacific.length > 0"
                  :items="newsListAsiaPacific"
                  :fields="newsListAsiaPacificFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListAsiaPacific(item)"
                        :checked="
                          asiaPacificNews
                            .map(data => data.id)
                            .indexOf(item.id) != -1
                        "
                      />
                    </td>
                  </template>
                  <template #index="{index}">
                    <td>
                      {{ index + 1 }}
                    </td>
                  </template>
                  <template #dateCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleDateString("th-TH")
                      }}
                    </td>
                  </template>
                  <template #timeCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleTimeString("th-TH")
                      }}
                      น.
                    </td>
                  </template>
                  <template #writer="{item}">
                    <td>
                      {{ item.writer }}
                    </td>
                  </template>
                  <template #newsType="{item}">
                    <td>
                      {{ item.newsType }}
                    </td>
                  </template>
                  <template #subject="{item}">
                    <td>
                      {{ item.subject }}
                    </td>
                  </template>
                </CDataTable>
                <template #footer>
                  <CButton
                    color="secondary"
                    @click="newsListAsiaPacificModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow
              v-for="(news, index) in asiaPacificNews"
              :key="index"
              class="mb-1"
            >
              <CCol>
                <CRow class="mb-12">
                  <CCol md="2">
                    <b>ลำดับที่</b>
                  </CCol>
                  <CCol md="2">
                    <b>{{ index + 1 }}</b>
                  </CCol>
                  <CCol class="d-flex align-items-end flex-column" md="8">
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeNewsListAsiaPacific(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>พาดหัวข่าว</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subject }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>เนื้อหา</b>
                  </CCol>
                  <CCol>
                    {{ news.body }}
                  </CCol>
                  <CCol md="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
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
                <CRow v-if="news.fileList && carouselsAsiaPacificMode">
                  <CCol :md="{ size: '6', offset: '1' }">
                    <CCarousel
                      arrows
                      :interval="5000"
                      indicators
                      animate
                      :height="carouselHeight"
                    >
                      <CCarouselItem
                        v-for="(file, index) in news.fileList"
                        :key="index"
                        :image="{
                          src: `${url}/nodes/${file.id}/content/${User.aTicket}`
                        }"
                      />
                    </CCarousel>
                  </CCol>
                </CRow>
                <CRow v-if="news.fileList && !carouselsAsiaPacificMode">
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
                            disabled
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                        </CCard>
                      </CCol>
                    </template>
                  </CRow>
                </CRow>
                <hr />
              </CCol>
            </CRow>
          </tab-content>

          <tab-content
            title="ข่าวภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
            icon=""
          >
            <div>
              <CButton
                @click="newsListEastAsiaModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง
              </CButton>

              <CRow v-if="eastAsiaNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsEastAsiaMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลางประจำวัน"
                color="info"
                :show.sync="newsListEastAsiaModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListEastAsia.length > 0"
                  :items="newsListEastAsia"
                  :fields="newsListEastAsiaFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListEastAsia(item)"
                        :checked="
                          eastAsiaNews.map(data => data.id).indexOf(item.id) !=
                            -1
                        "
                      />
                    </td>
                  </template>
                  <template #index="{index}">
                    <td>
                      {{ index + 1 }}
                    </td>
                  </template>
                  <template #dateCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleDateString("th-TH")
                      }}
                    </td>
                  </template>
                  <template #timeCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleTimeString("th-TH")
                      }}
                      น.
                    </td>
                  </template>
                  <template #writer="{item}">
                    <td>
                      {{ item.writer }}
                    </td>
                  </template>
                  <template #newsType="{item}">
                    <td>
                      {{ item.newsType }}
                    </td>
                  </template>
                  <template #subject="{item}">
                    <td>
                      {{ item.subject }}
                    </td>
                  </template>
                </CDataTable>
                <template #footer>
                  <CButton
                    color="secondary"
                    @click="newsListEastAsiaModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow
              v-for="(news, index) in eastAsiaNews"
              :key="index"
              class="mb-1"
            >
              <CCol>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>ลำดับที่</b>
                  </CCol>
                  <CCol md="2">
                    <b>{{ index + 1 }}</b>
                  </CCol>
                  <CCol class="d-flex align-items-end flex-column" md="8">
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeNewsListEastAsia(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>พาดหัวข่าว</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subject }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>เนื้อหา</b>
                  </CCol>
                  <CCol>
                    {{ news.body }}
                  </CCol>
                  <CCol md="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
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
                <CRow v-if="news.fileList && carouselsEastAsiaMode">
                  <CCol :md="{ size: '6', offset: '1' }">
                    <CCarousel
                      arrows
                      :interval="5000"
                      indicators
                      animate
                      :height="carouselHeight"
                    >
                      <CCarouselItem
                        v-for="(file, index) in news.fileList"
                        :key="index"
                        :image="{
                          src: `${url}/nodes/${file.id}/content/${User.aTicket}`
                        }"
                      />
                    </CCarousel>
                  </CCol>
                </CRow>
                <CRow v-if="news.fileList && !carouselsEastAsiaMode">
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
                            disabled
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                        </CCard>
                      </CCol>
                    </template>
                  </CRow>
                </CRow>

                <hr />
              </CCol>
            </CRow>
          </tab-content>

          <tab-content title="ข่าวภูมิภาคยุโรป อเมริกา แอฟริกา" icon="">
            <div>
              <CButton
                @click="newsListEuropeModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวภูมิภาคยุโรป อเมริกา แอฟริกา
              </CButton>

              <CRow v-if="europeNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsEuropeMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวภูมิภาคยุโรป อเมริกา แอฟริกาประจำวัน"
                color="info"
                :show.sync="newsListEuropeModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListEurope.length > 0"
                  :items="newsListEurope"
                  :fields="newsListEuropeFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListEurope(item)"
                        :checked="
                          europeNews.map(data => data.id).indexOf(item.id) != -1
                        "
                      />
                    </td>
                  </template>
                  <template #index="{index}">
                    <td>
                      {{ index + 1 }}
                    </td>
                  </template>
                  <template #dateCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleDateString("th-TH")
                      }}
                    </td>
                  </template>
                  <template #timeCreated="{item}">
                    <td>
                      {{
                        new Date(item.dateCreated).toLocaleTimeString("th-TH")
                      }}
                      น.
                    </td>
                  </template>
                  <template #writer="{item}">
                    <td>
                      {{ item.writer }}
                    </td>
                  </template>
                  <template #newsType="{item}">
                    <td>
                      {{ item.newsType }}
                    </td>
                  </template>
                  <template #subject="{item}">
                    <td>
                      {{ item.subject }}
                    </td>
                  </template>
                </CDataTable>
                <template #footer>
                  <CButton
                    color="secondary"
                    @click="newsListEuropeModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow v-for="(news, index) in europeNews" :key="index" class="mb-1">
              <CCol>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>ลำดับที่</b>
                  </CCol>
                  <CCol md="2">
                    <b>{{ index + 1 }}</b>
                  </CCol>
                  <CCol class="d-flex align-items-end flex-column" md="8">
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeNewsListEurope(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>พาดหัวข่าว</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subject }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>เนื้อหา</b>
                  </CCol>
                  <CCol>
                    {{ news.body }}
                  </CCol>
                  <CCol md="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
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
                <CRow v-if="news.fileList && carouselsEuropeMode">
                  <CCol :md="{ size: '6', offset: '1' }">
                    <CCarousel
                      arrows
                      :interval="5000"
                      indicators
                      animate
                      :height="carouselHeight"
                    >
                      <CCarouselItem
                        v-for="(file, index) in news.fileList"
                        :key="index"
                        :image="{
                          src: `${url}/nodes/${file.id}/content/${User.aTicket}`
                        }"
                      />
                    </CCarousel>
                  </CCol>
                </CRow>
                <CRow v-if="news.fileList && !carouselsEuropeMode">
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
                            disabled
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                        </CCard>
                      </CCol>
                    </template>
                  </CRow>
                </CRow>
                <hr />
              </CCol>
            </CRow>
          </tab-content>

          <tab-content title="รายละเอียดข่าว">
            <div v-if="reload">
              <CRow>
                <CCol md="3">
                  <label for="">ผู้รับปฏิบัติ</label>
                </CCol>
                <CCol md="8">
                  <CMultiSelect
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
          </tab-content>
        </form-wizard>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import { ChevronsUpIcon, ChevronsDownIcon } from "vue-feather-icons";
import { FormWizard, TabContent } from "vue-form-wizard";
import { DatePicker } from "v-calendar";
import moment from "moment";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
export default {
  name: "",
  components: {
    "v-date-picker": DatePicker,
    jogetService,
    alfrescoService,
    ChevronsUpIcon,
    ChevronsDownIcon,
    FormWizard,
    TabContent
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      newsListAsiaPacific: [],
      newsListAsiaPacificFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      newsListAsiaPacificModal: false,
      newsListEastAsiaModal: false,
      newsListEuropeModal: false,
      newsListEastAsia: [],
      newsListEastAsiaFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      newsListEurope: [],
      newsListEuropeFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      mergeNews: [],
      practitionerList: [],
      practitioner: [],
      acknowledgmentList: [],
      acknowledgment: [],
      reload: true,
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
      docDate: "",
      asiaPacificNews: [],
      eastAsiaNews: [],
      europeNews: [],
      carouselsAsiaPacificMode: true,
      carouselsEastAsiaMode: true,
      carouselsEuropeMode: true
    };
  },
  created() {
    this.reload = false;
    this.ticket = this.User.ticket;
    this.getNewsListAsiaPacific().then(res => {
      let newsList = [];
      res.data.data.forEach(async item => {
        if (item.dailyNewsProcessId === "") {
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            console.log("file", file.data);
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
        }
      });
      this.newsListAsiaPacific = newsList;
      console.log("newsList", this.newsListAsiaPacific);
    });

    this.getNewsListEastAsia().then(res => {
      let newsList = [];
      res.data.data.forEach(async item => {
        if (item.dailyNewsProcessId === "") {
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            console.log("file", file.data);
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
        }
      });
      this.newsListEastAsia = newsList;
      console.log("this.newsListEastAsia", this.newsListEastAsia);
    });

    this.getNewsListEurope().then(res => {
      let newsList = [];
      res.data.data.forEach(async item => {
        console.log(item);
        if (item.dailyNewsProcessId === "") {
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            console.log("file", file.data);
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
        }
      });
      this.newsListEurope = newsList;
      console.log("this.newsListEurope", this.newsListEurope);
    });
    this.getRank();
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
    filterNewsListAsiaPacific(item) {
      const index = this.asiaPacificNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.asiaPacificNews.splice(index, 1)
        : this.asiaPacificNews.push(item);
    },
    removeNewsListAsiaPacific(index) {
      this.asiaPacificNews.splice(index, 1);
    },
    filterNewsListEastAsia(item) {
      const index = this.eastAsiaNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.eastAsiaNews.splice(index, 1)
        : this.eastAsiaNews.push(item);
    },
    removeNewsListEastAsia(index) {
      this.eastAsiaNews.splice(index, 1);
    },
    filterNewsListEurope(item) {
      const index = this.europeNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.europeNews.splice(index, 1)
        : this.europeNews.push(item);
    },
    removeNewsListEurope(index) {
      this.europeNews.splice(index, 1);
    },
    getFileList(fileNode) {
      return alfrescoService.getNodeChild(fileNode, this.User.aTicket);
    },
    goUp(news, index) {
      if (news.subNewsType === "ภูมิภาคเอเชีย-แปซิฟิค") {
        this.asiaPacificNews.splice(index, 1);
        this.asiaPacificNews.splice(index - 1, 0, news);
        console.log("picture Up", this.asiaPacificNews);
      } else if (
        news.subNewsType === "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
      ) {
        this.eastAsiaNews.splice(index, 1);
        this.eastAsiaNews.splice(index - 1, 0, news);
      } else if (news.subNewsType === "ภูมิภาคยุโรป อเมริกา แอฟริกา") {
        this.europeNews.splice(index, 1);
        this.europeNews.splice(index - 1, 0, news);
      }
    },
    goDown(news, index) {
      if (news.subNewsType === "ภูมิภาคเอเชีย-แปซิฟิค") {
        this.asiaPacificNews.splice(index, 1);
        this.asiaPacificNews.splice(index + 1, 0, news);
        console.log("picture down", this.asiaPacificNews);
      } else if (
        news.subNewsType === "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
      ) {
        this.eastAsiaNews.splice(index, 1);
        this.eastAsiaNews.splice(index + 1, 0, news);
      } else if (news.subNewsType === "ภูมิภาคยุโรป อเมริกา แอฟริกา") {
        this.europeNews.splice(index, 1);
        this.europeNews.splice(index + 1, 0, news);
      }
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
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListEastAsia() {
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
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListEurope() {
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
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    async onComplete() {
      await jogetService
        .startProcess("RoyalThaiCommunication", "mergeInternationalNews")
        .then(async res => {
          const processId = res.data.processId;
          const mergeData = {
            collector: this.User.username,
            processId: processId,
            publishStatus: "รอตรวจสอบ",
            newsType: "ข่าวต่างประเทศ",
            docId: this.docId,
            docDate: this.docDate,
            practitioner: this.practitioner,
            acknowledgment: this.acknowledgment
          };
          jogetService
            .formSubmit(
              "RoyalThaiCommunication",
              "mergeNews",
              processId,
              mergeData
            )
            .then(res => {
              const dailyNewsProcessId = processId;
              if (this.asiaPacificNews.length > 0) {
                this.asiaPacificNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("asiaPacificNews", formData);
                  await jogetService
                    .formSubmit(
                      "RoyalThaiCommunication",
                      "createNews",
                      news.id,
                      formData
                    )
                    .then(res => {});
                });
              }
              if (this.eastAsiaNews.length > 0) {
                this.eastAsiaNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("eastAsiaNews", formData);
                  await jogetService
                    .formSubmit(
                      "RoyalThaiCommunication",
                      "createNews",
                      news.id,
                      formData
                    )
                    .then(res => {});
                });
              }
              if (this.europeNews.length > 0) {
                this.europeNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("europeNews", formData);
                  await jogetService
                    .formSubmit(
                      "RoyalThaiCommunication",
                      "createNews",
                      news.id,
                      formData
                    )
                    .then(res => {});
                });
              }
              this.completeProcess();
            });
        });
    },
    completeProcess() {
      this.$router.push({ name: "Dashboard" });
    }
  }
};
</script>

<style></style>
