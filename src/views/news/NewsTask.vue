<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>รายการงานของฉัน</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable :items="tasks" :fields="tasksField" :noItemsView="{}">
          <template #no-items-view>
            <h5 class="text-center mt-4">ไม่พบรายการ</h5>
          </template>

          <template #dateCreated="{ item }">
            <td>
              {{ convertDate(item.dateCreated) }}
              <!-- {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }} -->
            </td>
          </template>

          <template #timeCreated="{ item }">
            <td>{{ convertTime(item.dateCreated.split(" ")) }} น.</td>
          </template>

          <template #processName="{ item }">
            <td v-if="item.processName !== 'Create News Process'">
              ขั้นตอนการรวบรวมและตรวจสอบข่าว
            </td>
            <td v-else-if="item.processName === 'Create News Process'">
              ขั้นตอนการเขียนและตรวจสอบข่าว
            </td>
          </template>

          <template #actions="{ item }">
            <td>
              <CButton
                :color="getStatus(item.activityName)"
                size="sm"
                class="mb-3 mr-1"
                @click="
                  onActionClick(
                    item.processId,
                    item.processName,
                    item.activityName
                  )
                "
              >
                {{ item.activityName }}
              </CButton>
              <CButton
                v-if="
                  item.activityName == 'ตรวจสอบข่าว' ||
                    item.activityName == 'แก้ไขข่าว'
                "
                color="danger"
                size="sm"
                class="mb-3 mr-1"
                @click="openDeleteNewsModal(item.processId)"
                >ลบ</CButton
              >
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal
      title="ลบข่าว"
      size="sm"
      color="danger"
      centered
      :show.sync="deleteNewsModal"
    >
      ต้องการลบข่าวหรือไม่
      <template #footer>
        <CButton color="secondary" @click="deleteNewsModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="danger" @click="deleteNews()">ลบ</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import thaiMonth from "@/assets/json/thaidate.json";
export default {
  components: {
    jogetService
  },
  data() {
    return {
      infoAuth: [],
      tasks: [],
      tasksField: [
        { key: "processName", label: "ชื่อกระบวนการ" },
        { key: "dateCreated", label: "วันที่ได้รับมอบหมาย" },
        { key: "timeCreated", label: "เวลา" },
        { key: "actions", label: "ดำเนินการ" }
      ],
      thaiMonth: thaiMonth.thmonth,
      deleteNewsModal: false,
      deleteId: ""
    };
  },
  created() {
    this.infoAuth = JSON.parse(localStorage.getItem("rtarfUser"));
    this.getAllMyAssignment();
    console.log("ทดลองวันปัจจุบัน", new Date());
  },
  methods: {
    convertDate(date) {
      if (new Date(date).toLocaleDateString("th-TH") === "Invalid Date") {
        const getDate = date.split(" ");
        return getDate[0];
      } else {
        return new Date(date).toLocaleDateString("th-TH");
      }
    },
    convertTime(time) {
      if (time[2] === "PM") {
        const splitTime = time[1].split(":");
        const newTime = `${Number(splitTime[0]) + 12}:${splitTime[1]}`;
        return newTime;
      } else {
        return time[1];
      }
    },
    async getAllMyAssignment() {
      await jogetService.getMyAssignment().then(res => {
        if (res.data.total > 1) {
          this.tasks = res.data.data;
          console.log("tasks", this.tasks);
        } else {
          this.tasks.push(res.data.data);
          console.log("tasks", this.tasks);
        }
      });
    },
    async onActionClick(processId, processName, activityName) {
      console.log("processName", processName);
      let listId = "";
      let paramId = "";
      if (
        processName === "Merge Cyber News Process" ||
        processName === "Merge International News Process" ||
        processName === "Merge Locale News Process"
      ) {
        listId = "list_dailyNews";
        paramId = "d-7725097-fn_processId";
      } else if (processName === "Create News Process") {
        listId = "list_news";
        paramId = "d-3656798-fn_processId";
      }
      const searchData = [
        {
          paramName: paramId,
          paramValue: processId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", listId, searchData)
        .then(res => {
          const newsData = res.data.data[0];
          console.log("newsData", newsData);
          let routerName = "";
          if (activityName === "ตรวจสอบข่าว") {
            if (newsData.newsType === "ข่าวต่างประเทศ") {
              routerName = "Review - International News";
            } else if (newsData.newsType === "ข่าวในประเทศ") {
              routerName = "Review - Local News";
            } else if (newsData.newsType === "ข่าวไซเบอร์") {
              routerName = "Review - Cyber News";
            }
            this.$router.push({
              name: routerName,
              query: { recId: newsData.id }
            });
          } else if (activityName === "กรอกรายละเอียดข่าว") {
            if (newsData.newsType === "ข่าวต่างประเทศ") {
              routerName = "International Daily News - Fill Detail News";
            } else if (newsData.newsType === "ข่าวในประเทศ") {
              routerName = "Local Daily News - Fill Detail News";
            } else if (newsData.newsType === "ข่าวไซเบอร์") {
              routerName = "Cyber Daily News - Fill Detail News";
            }
            this.$router.push({
              name: routerName,
              query: { processId: newsData.processId }
            });
          } else if (activityName === "แก้ไขข่าว") {
            this.newsEditPage(processId);
          } else if (activityName === "ปรับปรุงข่าว (แก้ไข)") {
            console.log("ปรับปรุงข่าว (แก้ไข)", newsData.newsType);
            if (newsData.newsType == "ข่าวต่างประเทศ") {
              this.newsInternationalWritingEditPage(processId);
            } else if (newsData.newsType == "ข่าวในประเทศ") {
              this.newsLocalWritingEditPage(processId);
            } else if (newsData.newsType == "ข่าวไซเบอร์") {
              this.newsCyberWritingEditPage(processId);
            }
          } else if (activityName === "ปรับปรุงข่าว (รวบรวม)") {
            console.log("ปรับปรุงข่าว (รวบรวม)", newsData.newsType);
            if (newsData.newsType == "ข่าวต่างประเทศ") {
              this.newsInternationalMergeEditPage(processId);
            } else if (newsData.newsType == "ข่าวในประเทศ") {
              this.newsLocalMergeEditPage(processId);
            } else if (newsData.newsType == "ข่าวไซเบอร์") {
              this.newsCyberMergeEditPage(processId);
            }
          } else if (activityName === "เลขาฯ ตรวจสอบความเรียบร้อย") {
            if (newsData.newsType === "ข่าวต่างประเทศ") {
              routerName = "Cyber Daily News - Check News";
            } else if (newsData.newsType === "ข่าวในประเทศ") {
              routerName = "Cyber Daily News - Check News";
            } else if (newsData.newsType === "ข่าวไซเบอร์") {
              routerName = "Cyber Daily News - Check News";
            }
            this.$router.push({
              name: routerName,
              query: { processId: newsData.processId }
            });
          } else {
            if (newsData.newsType === "ข่าวต่างประเทศ") {
              routerName = "International Daily News - Approve";
            } else if (newsData.newsType === "ข่าวในประเทศ") {
              routerName = "Local Daily News - Approve";
            } else if (newsData.newsType === "ข่าวไซเบอร์") {
              routerName = "Cyber Daily News - Approve";
            }
            this.$router.push({
              name: routerName,
              query: { processId: newsData.processId }
            });
          }
        });
    },
    openDeleteNewsModal(item) {
      this.deleteNewsModal = true;
      this.deleteId = item;
      console.log(this.deleteId);
    },
    async deleteNews() {
      this.pageLoad = true;
      const recordId = this.deleteId;
      const formData = {
        status: "ยกเลิก"
      };

      await jogetService
        .jsonSubmit("RoyalThaiCommunication", "createNews", recordId, formData)
        .then(res => {
          jogetService.getCurrentActivity(recordId).then(res => {
            const activityId = res.data.activityId;
            jogetService.processComplete(activityId).then(res => {
              this.deleteNewsModal = false;
              this.getAllMyAssignment();
            });
          });
        });
    },
    getStatus(status) {
      switch (status) {
        case "ตรวจสอบข่าว":
          return "info";
        case "กรอกรายละเอียดข่าว":
          return "primary";
        case "แก้ไขข่าว":
          return "warning";
        case "ปรับปรุงข่าว (แก้ไข)":
          return "warning";
        case "ปรับปรุงข่าว (รวบรวม)":
          return "warning";
        case "ผช.ผอ.กอง ตรวจสอบข่าว":
          return "info";
        case "ผอ.กอง ตรวจสอบข่าว":
          return "info";
        case "รองผอ.สนข.ตรวจสอบข่าว":
          return "info";
        case "ผอ.สนข.ตรวจสอบข่าว":
          return "info";
        default:
          "primary";
      }
    },
    newsInternationalMergeEditPage(item) {
      this.$router.push({
        name: "International Daily News - Edit Merge News",
        query: { data: item }
      });
    },
    newsLocalMergeEditPage(item) {
      this.$router.push({
        name: "Local Daily News - Edit Merge News",
        query: { data: item }
      });
    },
    newsCyberMergeEditPage(item) {
      this.$router.push({
        name: "Cyber Daily News - Edit Merge News",
        query: { data: item }
      });
    },
    newsEditPage(item) {
      this.$router.push({
        name: "Edit News",
        query: { data: item }
      });
    },
    newsInternationalWritingEditPage(item) {
      this.$router.push({
        name: "International Daily News - Edit Writing News",
        query: { data: item }
      });
    },
    newsLocalWritingEditPage(item) {
      this.$router.push({
        name: "Local Daily News - Edit Writing News",
        query: { data: item }
      });
    },
    newsCyberWritingEditPage(item) {
      this.$router.push({
        name: "Cyber Daily News - Edit Writing News",
        query: { data: item }
      });
    }
  }
};
</script>
