<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>News</h4>
        <CButton @click="deleteAllNews()">ลบข่าวทั้งหมด</CButton>
        <CButton @click="deleteAllMergeNews()">ลบรวมข่าวทั้งหมด</CButton>
        <CButton @click="deleteAllCommentNews()">ลบคอมเม้นข่าวทั้งหมด</CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="news"
          :fields="newsField"
          :noItemsView="{}"
          column-filter
          table-filter
          :items-per-page="10"
        >
          <template #actions="{item}">
            <td>
              <CInputCheckbox
                custom
                class="my-2"
                @update:checked="filter(item)"
                :checked="news.map(data => data.id).indexOf(item.id) != -1"
              />
            </td>
            <td>
              <CButton
                color="danger"
                size="sm"
                class="mb-3 mr-1"
                @click="deleteNews(item)"
                >ลบ</CButton
              >
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>
        <h4>Merge News</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="mergeNews"
          :fields="mergeNewsField"
          :noItemsView="{}"
          column-filter
          table-filter
          :items-per-page="10"
        >
          <template #actions="{item}">
            <td>
              <CInputCheckbox
                custom
                class="my-2"
                @update:checked="filter(item)"
                :checked="mergeNews.map(data => data.id).indexOf(item.id) != -1"
              />
            </td>
            <td>
              <CButton
                color="danger"
                size="sm"
                class="mb-3 mr-1"
                @click="deleteMergeNews(item)"
                >ลบ</CButton
              >
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>
        <h4>Comments News</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="commentNews"
          :fields="commentNewsField"
          :noItemsView="{}"
          column-filter
          table-filter
          :items-per-page="10"
        >
          <template #actions="{item}">
            <td>
              <CInputCheckbox
                custom
                class="my-2"
                @update:checked="filter(item)"
                :checked="
                  commentNews.map(data => data.id).indexOf(item.id) != -1
                "
              />
            </td>
            <td>
              <CButton
                color="danger"
                size="sm"
                class="mb-3 mr-1"
                @click="deleteCommentNews(item)"
                >ลบ</CButton
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
import thaiMonth from "@/assets/json/thaidate.json";
export default {
  components: {
    jogetService
  },
  data() {
    return {
      infoAuth: [],
      news: [],
      newsField: [
        { key: "id", label: "id" },
        { key: "subject", label: "subject" },
        { key: "dateCreated", label: "วันที่ได้รับมอบหมาย" },
        { key: "actions", label: "ดำเนินการ" }
      ],
      mergeNews: [],
      mergeNewsField: [
        { key: "id", label: "id" },
        { key: "subject", label: "subject" },
        { key: "dateCreated", label: "วันที่ได้รับมอบหมาย" },
        { key: "actions", label: "ดำเนินการ" }
      ],
      commentNews: [],
      commentNewsField: [
        { key: "id", label: "id" },
        { key: "subject", label: "subject" },
        { key: "dateCreated", label: "วันที่ได้รับมอบหมาย" },
        { key: "actions", label: "ดำเนินการ" }
      ],
      thaiMonth: thaiMonth.thmonth,
      deleteNewsModal: false,
      deleteId: ""
    };
  },
  created() {
    this.infoAuth = JSON.parse(localStorage.getItem("rtarfUser"));
    this.getAllNews();
    this.getAllMergeNews();
    this.getAllCommentNews();
  },
  methods: {
    async getAllNews() {
      const searchData = [];
      await jogetService
        .list("RoyalThaiCommunication", "list_news", searchData)
        .then(res => {
          console.log(res.data.data);
          this.news = res.data.data;
        });
    },
    async deleteAllNews() {
      this.news.forEach(async item => {
        console.log(item.id);
        await jogetService.formDelete(
          "RoyalThaiCommunication",
          "createNews",
          item.id
        );
      });
    },
    async deleteAllMergeNews() {
      this.mergeNews.forEach(async item => {
        console.log(item.id);
        await jogetService.formDelete(
          "RoyalThaiCommunication",
          "mergeNews",
          item.id
        );
      });
    },
    async deleteAllCommentNews() {
      this.commentNews.forEach(async item => {
        console.log(item.id);
        await jogetService.formDelete(
          "RoyalThaiCommunication",
          "newsComment",
          item.id
        );
      });
    },
    async deleteNews(item) {
      console.log(item.id);
      jogetService
        .formDelete("RoyalThaiCommunication", "createNews", item.id)
        .then(res => {});
    },
    async getAllMergeNews() {
      const searchData = [];
      await jogetService
        .list("RoyalThaiCommunication", "list_dailyNews", searchData)
        .then(res => {
          console.log(res.data.data);
          this.mergeNews = res.data.data;
        });
    },
    async deleteMergeNews(item) {
      console.log(item.id);
      jogetService
        .formDelete("RoyalThaiCommunication", "mergeNews", item.id)
        .then(res => {});
    },
    async getAllCommentNews() {
      const searchData = [];
      await jogetService
        .list("RoyalThaiCommunication", "rtarfNewsCommentList", searchData)
        .then(res => {
          console.log(res.data.data);
          this.commentNews = res.data.data;
        });
    },
    async deleteCommentNews(item) {
      console.log(item.id);
      jogetService
        .formDelete("RoyalThaiCommunication", "newsComment", item.id)
        .then(res => {});
    },
    filter(item) {
      const index = this.itemList
        .map(function(e) {
          return e.id;
        })
        .indexOf(item.id);
      index !== -1 ? this.itemList.splice(index, 1) : this.itemList.push(item);
    },
    onItemSelected(item) {
      this.itemList.push(item);
    },
    removeItem(index) {
      this.itemList.splice(index, 1);
    },
    getStatus(status) {
      switch (status) {
        case "รีวิวข่าว":
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
