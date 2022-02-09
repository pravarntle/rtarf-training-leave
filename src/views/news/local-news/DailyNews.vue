<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>รวมข่าวในประเทศประจำวัน</h4>
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
          <tab-content title="ข่าวความมั่นคงพื้นที่ภายใน" icon="">
            <div>
              <CButton
                @click="newsListInternalModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวความมั่นคงพื้นที่ภายใน
              </CButton>

              <CRow v-if="internalNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsInternalMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวความมั่นคงพื้นที่ภายในประจำวัน"
                color="info"
                :show.sync="newsListInternalModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListInternal.length > 0"
                  :items="newsListInternal"
                  :fields="newsListInternalFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListInternal(item)"
                        :checked="
                          internalNews.map(data => data.id).indexOf(item.id) !=
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
                    @click="newsListInternalModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow
              v-for="(news, index) in internalNews"
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
                      @click="removeNewsListInternal(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>หมวดหมู่ข่าวย่อย</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subOfSubNewsType }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
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
                        index < newsListInternal.length - 1 ? false : true
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
                <CRow v-if="news.fileList && carouselsInternalMode">
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
                <CRow v-if="news.fileList && !carouselsInternalMode">
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

          <tab-content title="ข่าวความมั่นคงพื้นที่ชายแดน" icon="">
            <div>
              <CButton
                @click="newsListBorderLandModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวความมั่นคงพื้นที่ชายแดน
              </CButton>

              <CRow v-if="borderLandNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsBorderLandMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวความมั่นคงพื้นที่ชายแดนประจำวัน"
                color="info"
                :show.sync="newsListBorderLandModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListBorderLand.length > 0"
                  :items="newsListBorderLand"
                  :fields="newsListBorderLandFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListBorderLand(item)"
                        :checked="
                          borderLandNews
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
                    @click="newsListBorderLandModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow
              v-for="(news, index) in borderLandNews"
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
                      @click="removeNewsborderLandNews(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>หมวดหมู่ข่าวย่อย</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subOfSubNewsType }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
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
                        index < newsListBorderLand.length - 1 ? false : true
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
                <CRow v-if="news.fileList && carouselsBorderLandMode">
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
                <CRow v-if="news.fileList && !carouselsBorderLandMode">
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

          <tab-content title="ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ" icon="">
            <div>
              <CButton
                @click="newsListSpecialModal = true"
                color="info"
                block
                class="mb-3"
              >
                เลือกข่าวก่อการร้ายและอาชญากรรมข้ามชาติ
              </CButton>

              <CRow v-if="specialNews.length > 0" lass="mb-3">
                <CCol>
                  <CSwitch
                    class="float-right"
                    color="primary"
                    size="sm"
                    variant="3d"
                    :checked.sync="carouselsSpecialMode"
                  />
                </CCol>
                <CCol>
                  <span class="float-left text-dark">Carousel Mode</span>
                </CCol>
              </CRow>

              <CModal
                title="ข่าวก่อการร้ายและอาชญากรรมข้ามชาติประจำวัน"
                color="info"
                :show.sync="newsListSpecialModal"
                size="xl"
              >
                <CDataTable
                  v-if="newsListSpecial.length > 0"
                  :items="newsListSpecial"
                  :fields="newsListSpecialFields"
                >
                  <template #no-items-view>
                    <h5 class="text-center mt-3">ไม่พบรายการ</h5>
                  </template>
                  <template #chooseItem="{ item }">
                    <td>
                      <CInputCheckbox
                        custom
                        @update:checked="filterNewsListSpecial(item)"
                        :checked="
                          specialNews.map(data => data.id).indexOf(item.id) !=
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
                    @click="newsListSpecialModal = false"
                    >ปิด</CButton
                  >
                </template>
              </CModal>
            </div>
            <CRow
              v-for="(news, index) in specialNews"
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
                      @click="removeNewsListSpecial(index)"
                      class="ml-1"
                    >
                      ลบ
                    </CButton></CCol
                  >
                </CRow>
                <CRow class="mb-2">
                  <CCol md="2">
                    <b>หมวดหมู่ข่าวย่อย</b>
                  </CCol>
                  <CCol>
                    <b>{{ news.subOfSubNewsType }}</b>
                  </CCol>
                  <CCol md="1"> </CCol>
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
                        index < newsListSpecial.length - 1 ? false : true
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
                <CRow v-if="news.fileList && carouselsSpecialMode">
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
                <CRow v-if="news.fileList && !carouselsSpecialMode">
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
      newsListInternal: [],
      newsListInternalFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subOfSubNewsType", label: "หมวดหมู่ข่าวย่อย" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      newsListInternalModal: false,
      newsListBorderLandModal: false,
      newsListSpecialModal: false,
      newsListBorderLand: [],
      newsListBorderLandFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subOfSubNewsType", label: "หมวดหมู่ข่าวย่อย" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      newsListSpecial: [],
      newsListSpecialFields: [
        { key: "chooseItem", label: "เลือก", _style: "width:5%" },
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "subOfSubNewsType", label: "หมวดหมู่ข่าวย่อย" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "body", label: "เนื้อหา" },
        { key: "writer", label: "ผู้เขียนข่าว" }
      ],
      practitionerList: [],
      practitioner: [],
      acknowledgmentList: [],
      acknowledgment: [],
      reload: true,
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
      docDate: "",
      internalNews: [],
      borderLandNews: [],
      specialNews: [],
      carouselsInternalMode: true,
      carouselsBorderLandMode: true,
      carouselsSpecialMode: true
    };
  },
  created() {
    this.reload = false;

    this.ticket = this.User.ticket;
    this.getNewsListInternal().then(res => {
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
      this.newsListInternal = newsList;
      console.log("newsList", this.newsListInternal);
    });

    this.getNewsListBorderLand().then(res => {
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
      this.newsListBorderLand = newsList;
      console.log("this.newsListBorderLand", this.newsListBorderLand);
    });

    this.getNewsListSpecial().then(res => {
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
      this.newsListSpecial = newsList;
      console.log("this.newsListSpecial", this.newsListSpecial);
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
    filterNewsListInternal(item) {
      const index = this.internalNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.internalNews.splice(index, 1)
        : this.internalNews.push(item);
    },
    removeNewsListInternal(index) {
      this.internalNews.splice(index, 1);
    },
    filterNewsListBorderLand(item) {
      const index = this.borderLandNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.borderLandNews.splice(index, 1)
        : this.borderLandNews.push(item);
    },
    removeNewsborderLandNews(index) {
      this.borderLandNews.splice(index, 1);
    },
    filterNewsListSpecial(item) {
      const index = this.specialNews
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1
        ? this.specialNews.splice(index, 1)
        : this.specialNews.push(item);
    },
    removeNewsListSpecial(index) {
      this.specialNews.splice(index, 1);
    },
    getFileList(fileNode) {
      return alfrescoService.getNodeChild(fileNode, this.User.aTicket);
    },
    goUp(news, index) {
      if (news.subNewsType === "ข่าวความมั่นคงพื้นที่ภายใน") {
        this.internalNews.splice(index, 1);
        this.internalNews.splice(index - 1, 0, news);
        console.log("picture Up", this.internalNews);
      } else if (news.subNewsType === "ข่าวความมั่นคงพื้นที่ชายแดน") {
        this.borderLandNews.splice(index, 1);
        this.borderLandNews.splice(index - 1, 0, news);
      } else if (news.subNewsType === "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ") {
        this.specialNews.splice(index, 1);
        this.specialNews.splice(index - 1, 0, news);
      }
    },
    goDown(news, index) {
      if (news.subNewsType === "ข่าวความมั่นคงพื้นที่ภายใน") {
        this.internalNews.splice(index, 1);
        this.internalNews.splice(index + 1, 0, news);
        console.log("picture down", this.internalNews);
      } else if (news.subNewsType === "ข่าวความมั่นคงพื้นที่ชายแดน") {
        this.borderLandNews.splice(index, 1);
        this.borderLandNews.splice(index + 1, 0, news);
      } else if (news.subNewsType === "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ") {
        this.specialNews.splice(index, 1);
        this.specialNews.splice(index + 1, 0, news);
      }
    },
    getNewsListInternal() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListBorderLand() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getNewsListSpecial() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
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
        .startProcess("RoyalThaiCommunication", "mergeLocaleNews")
        .then(async res => {
          const processId = res.data.processId;
          const mergeData = {
            collector: this.User.username,
            processId: processId,
            publishStatus: "รอตรวจสอบ",
            newsType: "ข่าวในประเทศ",
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
              if (this.internalNews.length > 0) {
                this.internalNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("internalNews", formData);
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
              if (this.borderLandNews.length > 0) {
                this.borderLandNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("borderLandNews", formData);
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
              if (this.specialNews.length > 0) {
                this.specialNews.forEach(async (news, index) => {
                  const formData = {
                    newsIndex: index + 1,
                    dailyNewsProcessId: dailyNewsProcessId
                  };
                  console.log("specialNews", formData);
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
