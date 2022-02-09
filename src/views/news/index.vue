<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>รายการข่าวทั้งหมด</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="newsList"
          :fields="newsField"
          :noItemsView="{}"
          sorter
          pagination
          column-filter
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
            <td>
              {{ new Date(item.dateCreated).toLocaleDateString("th-TH") }}
              <br />
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
          <template #status="{item}">
            <td>
              <span v-if="item.status === 'รอตรวจสอบ'" style="color: red;">{{
                item.status
              }}</span>
              <span
                v-else-if="item.status === 'ผ่านการตรวจสอบ'"
                style="color: green;"
                >{{ item.status }}</span
              >
              <span
                v-else-if="item.status === 'ส่งกลับเพื่อแก้ไข'"
                style="color: #e29c06;"
                >{{ item.status }}</span
              >
              <span v-else-if="item.status === 'ยกเลิก'" style="color: red">{{
                item.status
              }}</span>
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
        { key: "writer", label: "ผู้เขียนข่าว" },
        { key: "subNewsType", label: "หมวดหมู่ข่าว" },
        { key: "subject", label: "พาดหัวข่าว" },
        { key: "status", label: "สถานะ" }
      ]
    };
  },
  created() {
    jogetService.list("RoyalThaiCommunication", "list_news").then(res => {
      this.newsList = res.data.data;
    });
  },
  methods: {
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
