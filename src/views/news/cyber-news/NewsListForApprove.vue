<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>รายการที่รอตรวจสอบ</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="assignmentList"
          :fields="assignmentField"
          :noItemsView="{}"
        >
          <template #no-items-view>
            <h5 class="text-center mt-3">ไม่พบรายการ</h5>
          </template>
          <template #index="{index}">
            <td width="5%">
              {{ index + 1 }}
            </td>
          </template>
          <template #dateCreated="{item}">
            <td width="20%">
              {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }}
            </td>
          </template>
          <template #timeCreated="{item}">
            <td width="20%">
              {{ new Date(item.dateCreated).toLocaleTimeString("th-TH") }} น.
            </td>
          </template>
          <template #action="{item}">
            <td width="20%">
              <CButton
                color="info"
                size="sm"
                class="float-right"
                @click="action(item)"
                ><inbox-icon
                  size="1.5x"
                  class="custom-class"
                  style="padding-bottom: 2px;"
                ></inbox-icon>
                ตรวจสอบข่าว</CButton
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
      assignmentList: [],
      assignmentField: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ทำรายการ" },
        { key: "timeCreated", label: "เวลา" },
        { key: "collector", label: "ผู้รวบรวมข่าว" },
        { key: "activityName", label: "สถานะดำเนินการ" },
        { key: "action", label: "" }
      ]
    };
  },
  created() {
    jogetService.getMyAssignment().then(res => {
      let assignmentList = [];
      if (res.data.total > 1) {
        res.data.data.forEach(item => {
          if (item.processName === "Merge Cyber News Process") {
            assignmentList.push(item);
          }
        });
      } else {
        if (res.data.data.processName === "Merge Cyber News Process") {
          assignmentList.push(res.data.data);
        }
      }
      this.getDailyNewsList().then(res => {
        let itemList = [];
        assignmentList.forEach(item => {
          res.data.data.forEach(news => {
            if (item.processId === news.processId) {
              item.collector = news.collector;
              itemList.push(item);
            }
          });
        });
        this.assignmentList = itemList;
        console.log('assignmentList',this.assignmentList);
      });
    });
  },
  methods: {
    convertTime(time) {
      if (time[2] === "PM") {
        const splitTime = time[1].split(":");
        const newTime = `${Number(splitTime[0]) + 12}:${splitTime[1]}`;
        return newTime;
      } else {
        return time[1];
      }
    },
    getDailyNewsList() {
      const searchData = [
        {
          paramName: "d-7725097-fn_publishStatus",
          paramValue: "รอตรวจสอบ"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_dailyNews",
        searchData
      );
    },
    action(item) {
      console.log(item);
      this.$router.push({
        name: "Cyber Daily News - Approve",
        query: { processId: item.processId, activityName: item.activityName }
      });
    }
  }
};
</script>

<style></style>
