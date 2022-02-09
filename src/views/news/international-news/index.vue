<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>รายการข่าวต่างประเทศประจำวัน</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="newsList"
          :fields="newsField"
          :noItemsView="{}"
          sorter
          pagination
        >
          <template #no-items-view>
            <h5 class="text-center mt-3">ไม่พบรายการ</h5>
          </template>
          <template #index="{index}">
            <td>
              {{ index + 1 }}
            </td>
          </template>
          <template #dateCreated="{item}">
            <td>
              {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }}
            </td>
          </template>
          <template #timeCreated="{item}">
            <td>
              {{ new Date(item.dateCreated).toLocaleTimeString("th-TH") }} น.
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
          <template #action="{item}">
            <td>
              <CButton
                color="info"
                size="sm"
                class="float-right"
                @click="review(item)"
                ><inbox-icon
                  size="1.5x"
                  class="custom-class"
                  style="padding-bottom: 2px;"
                ></inbox-icon>
                ตรวจสอบ</CButton
              >
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { InboxIcon } from "vue-feather-icons";
export default {
  name: "",
  components: {
    jogetService,
    InboxIcon
  },
  data() {
    return {
      newsList: [],
      newsField: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ร่าง" },
        { key: "timeCreated", label: "เวลา" },
        { key: "writer", label: "ผู้เขียนข่าว" },
        { key: "subNewsType", label: "หมวดหมู่ข่าว" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "status", label: "สถานะ" },
        { key: "action", label: "" }
      ]
    };
  },
  created() {
    jogetService.getMyAssignment().then(res => {
      let assignmentList = [];
      if (res.data.total > 1) {
        assignmentList = res.data.data;
      } else {
        assignmentList.push(res.data.data);
      }
      this.getNews().then(res => {
        const newsList = res.data.data;
        let myAssignmentList = [];
        assignmentList.forEach(item => {
          newsList.forEach(news => {
            if (item.processId === news.processId) {
              myAssignmentList.push(news);
            }
          });
        });
        this.newsList = myAssignmentList;
        console.log("newsList", this.newsList);
      });
    });
  },
  methods: {
    getNews() {
      const searchData = [
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวต่างประเทศ"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    review(item) {
      this.$router.push({
        name: "Review - International News",
        query: { recId: item.id }
      });
    }
  }
};
</script>

<style></style>
