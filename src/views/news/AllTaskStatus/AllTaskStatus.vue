<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>สถานะงานของฉัน</h4>
      </CCardHeader>
      <CCardBody>
        <CTabs variant="tabs" fill :active-tab="0">
          <CTab title="สถานะข่าว">
            <CDataTable
              :items="news"
              :fields="newsField"
              :noItemsView="{}"
              column-filter
              table-filter
              :items-per-page="10"
            >
              <template #index="{index}">
                <td width="5%">
                  {{ index + 1 }}
                </td>
              </template>
              <template #dateCreated="{item}">
                <td>
                  {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }}
                </td>
              </template>
              <template #status="{ item }">
                <td>
                  <span v-if="item.status === 'รอตรวจสอบ'" class="text-info">{{
                    item.status
                  }}</span>
                  <span
                    v-else-if="item.status === 'ผ่านการตรวจสอบ'"
                    class="text-success"
                    >เสร็จสิ้น</span
                  >
                  <span
                    v-else-if="item.status === 'ส่งกลับเพื่อแก้ไข'"
                    class="text-warning"
                    >{{ item.status }}</span
                  >
                  <span
                    v-else-if="item.status === 'ยกเลิก'"
                    class="text-danger"
                    >{{ item.status }}</span
                  >
                </td>
              </template>
              <template #action="{item}">
                <td>
                  <CButton @click="viewNewsActivity(item.processId)"
                    >ดูข่าว</CButton
                  >
                  <CButton @click="statusActivity(item)">เช็คสถานะ</CButton>
                </td>
              </template>
            </CDataTable>
            <CModal
              :title="'สถานะ' + statusTitle"
              color="info"
              :show.sync="statusModal"
              size="lg"
            >
              <CImg
                :src="statusPic"
                class="mr-4"
                width="90%"
                height="auto"
                align="center"
                block
              />
              <template #footer>
                <CButton color="secondary" @click="statusModal = false"
                  >ปิด</CButton
                >
              </template>
            </CModal>
          </CTab>
          <CTab title="สถานะรวมข่าว">
            <CDataTable
              :items="dailyNews"
              :fields="dailyNewsField"
              :noItemsView="{}"
              column-filter
              table-filter
              :items-per-page="10"
            >
              <template #index="{index}">
                <td width="5%">
                  {{ index + 1 }}
                </td>
              </template>
              <template #dateCreated="{item}">
                <td>
                  {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }}
                </td>
              </template>
              <template #docDate="{item}">
                <td>
                  {{
                    item.docDate != ""
                      ? new Date(item.docDate).toLocaleDateString("th-TH")
                      : ""
                  }}
                </td>
              </template>
              <template #publishStatus="{ item }">
                <td>
                  <span
                    v-if="item.publishStatus === 'รอตรวจสอบ'"
                    class="text-info"
                    >{{ item.publishStatus }}</span
                  >
                  <span
                    v-else-if="item.publishStatus === 'เผยแพร่'"
                    class="text-success"
                    >เสร็จสิ้น</span
                  >
                  <span
                    v-else-if="item.publishStatus === 'รอรายละเอียด'"
                    class="text-primary"
                    >{{ item.publishStatus }}</span
                  >
                </td>
              </template>
              <template #action="{item}">
                <td>
                  <CButton
                    color="info"
                    size="sm"
                    @click="viewDailyNewsActivity(item)"
                    >ดูข่าว</CButton
                  >
                  <CButton @click="publishStatusActivity(item)"
                    >เช็คสถานะ</CButton
                  >
                </td>
              </template>
            </CDataTable>
            <CModal
              :title="'สถานะ' + publishStatusTitle"
              color="info"
              :show.sync="publishStatusModal"
              size="lg"
            >
              <CImg
                :src="publishStatusPic"
                class="mr-4"
                width="90%"
                height="auto"
                align="center"
                block
              />
              <template #footer>
                <CButton color="secondary" @click="publishStatusModal = false"
                  >ปิด</CButton
                >
              </template>
            </CModal>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import thaiMonth from "@/assets/json/thaidate.json";
import img1n1 from "@/assets/img/timeline_1_เขียนข่าว.png";
import img1n2 from "@/assets/img/timeline_2_ตรวจข่าว.png";
import img1n3 from "@/assets/img/timeline_3_เสร็จสิ้น.png";
import img2n1 from "@/assets/img/timeline_รวบรวมข่าว.png";
import img2n2 from "@/assets/img/timeline_ตรวจสอบอนุมัติโดยผช.ผอ.กองฯ.png";
import img2n3 from "@/assets/img/timeline_ตรวจสอบอนุมัติโดย ผอ. กองฯ.png";
import img2n4 from "@/assets/img/timeline_ตรวจสอบอนุมัติโดย รองผอ. สนข_.png";
import img2n5 from "@/assets/img/timeline_เลขาฯ ตรวจสอบข่าว.png";
import img2n6 from "@/assets/img/timeline_ตรวจสอบอนุมัติโดย ผอ. สนข_.png";
import img2n7 from "@/assets/img/timeline_ธุรการออกเลขหนังสือ.png";
import img2n8 from "@/assets/img/timeline_รวบรวม_เสร็จสิ้น.png";

export default {
  components: {
    jogetService
  },
  data() {
    return {
      statusPic: "",
      publishStatusPic: "",
      img1n1: img1n1,
      img1n2: img1n2,
      img1n3: img1n3,
      img2n1: img2n1,
      img2n2: img2n2,
      img2n3: img2n3,
      img2n4: img2n4,
      img2n5: img2n5,
      img2n6: img2n6,
      img2n7: img2n7,
      img2n8: img2n8,
      statusModal: false,
      publishStatusModal: false,
      statusTitle: "",
      publishStatusTitle: "",
      infoAuth: [],
      news: [],
      newsField: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่สร้าง" },
        { key: "newsType", label: "ประเภท" },
        { key: "subNewsType", label: "หมวดหมู่" },
        { key: "subOfSubNewsType", label: "หมวดหมู่ย่อย" },
        { key: "subject", label: "หัวข้อข่าว" },
        { key: "status", label: "สถานะ" },
        { key: "action", label: "ดำเนินการ" }
      ],
      dailyNews: [],
      dailyNewsField: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่สร้าง" },
        { key: "newsType", label: "ประเภท" },
        { key: "acknowledgment", label: "ผู้รับทราบ" },
        { key: "practitioner", label: "ผู้ปฏิบัติ" },
        { key: "docId", label: "เลขที่เอกสาร" },
        { key: "docDate", label: "วันที่เอกสาร" },
        { key: "publishStatus", label: "สถานะ" },
        { key: "action", label: "ดำเนินการ" }
      ],
      thaiMonth: thaiMonth.thmonth
    };
  },
  created() {
    this.infoAuth = JSON.parse(localStorage.getItem("rtarfUser"));
    this.getAllNews();
    this.getAllDailyNews();
  },
  methods: {
    async statusActivity(item) {
      if (item.status === "ผ่านการตรวจสอบ") {
        this.statusTitle = "เสร็จสิ้น";
        this.statusPic = img1n3;
      } else {
        const processId = item.processId;

        await jogetService.getCurrentActivity(processId).then(res => {
          this.statusTitle = res.data.activityName;
          switch (res.data.activityName) {
            case "ตรวจสอบข่าว":
              this.statusPic = img1n2;
              break;
            case "แก้ไขข่าว":
              this.statusPic = img1n1;
              break;
          }
        });
      }
      this.statusModal = true;
    },
    async publishStatusActivity(item) {
      if (item.publishStatusPic === "เผยแพร่") {
        this.publishStatusPic = img2n8;
        this.publishStatusTitle = "เสร็จสิ้น";
      } else {
        const processId = item.processId;
        await jogetService.getCurrentActivity(processId).then(res => {
          this.publishStatusTitle = res.data.activityName;

          switch (res.data.activityName) {
            case "ผช.ผอ.กอง ตรวจสอบข่าว":
              this.publishStatusPic = img2n2;
              break;
            case "ผอ.กอง ตรวจสอบข่าว":
              this.publishStatusPic = img2n3;
              break;
            case "รองผอ.สนข.ตรวจสอบข่าว":
              this.publishStatusPic = img2n4;
              break;
            case "เลขาฯ ตรวจสอบความเรียบร้อย":
              this.publishStatusPic = img2n5;
              break;
            case "ผอ.สนข.ตรวจสอบข่าว":
              this.publishStatusPic = img2n6;
              break;
            case "กรอกรายละเอียดข่าว":
              this.publishStatusPic = img2n7;
              break;
            case "ปรับปรุงข่าว (รวบรวม)":
              this.publishStatusPic = img2n1;
              break;
            case "ปรับปรุงข่าว (แก้ไข)":
              this.publishStatusPic = img2n1;
              break;
          }
        });
      }
      this.publishStatusModal = true;
    },
    async getAllNews() {
      const searchData = [
      ];
      await jogetService
        .list("RoyalThaiCommunication", "list_news", searchData)
        .then(res => {
          this.news = res.data.data;
        });
    },
    async getAllDailyNews() {
      const searchData = [
      ];
      await jogetService
        .list("RoyalThaiCommunication", "list_dailyNews", searchData)
        .then(res => {
          this.dailyNews = res.data.data;
        });
    },

    viewNewsActivity(item) {
      this.$router.push({
        name: "All Task Status - News View",
        query: { data: item }
      });
    },
    viewDailyNewsActivity(item) {
      this.$router.push("/allTaskStatusDailyNewsView/" + item.processId);
    },
    getStatus(status) {
      switch (status) {
        case "ผ่านการตรวจสอบ":
          return "info";
        case "รอรวบรวมข่าว":
          return "secondary";
        case "แก้ไขข่าว":
          return "warning";
        default:
          "primary";
      }
    }
  }
};
</script>
