<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader
            ><h5 class="text-center">
              รายงานข้อมูลการใช้พื้นที่บนเครื่องแม่ข่าย
            </h5></CCardHeader
          >
          <CCardBody>
            <CChartPieStorageReport />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol></CCol>
    </CRow>
    <!-- <CCard v-if="!loading">
      <CCardBody>
        <CRow>
          <CCol
            md="4"
            sm="12"
            v-for="(category, index) in categoryList"
            :key="index"
          >
            <CCard body-wrapper>
              <CRow>
                <CCol col="10">{{ category.name }}</CCol>
                <CCol
                  ><CBadge color="primary" style="font-size: 14px">{{
                    category.total
                  }}</CBadge></CCol
                >
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard> -->

    <CCard>
      <CRow>
        <CCol>
          <CChartBarFolderReport />
        </CCol>
      </CRow>
    </CCard>

    <CElementCover :opacity="0.8" v-show="loading" />
  </div>
</template>
<script>
const fields = [
  { key: "name", label: "Name", _style: "min-width:40%" },
  { key: "modifiedAt", label: "Modified Date", _style: "min-width:20%;" },
];
import axios from "axios";
import Properties from "@/views/file/Properties";
import CChartPieStorageReport from "@/views/audit/CChartPieStorageReport"
import CChartBarFolderReport from "@/views/audit/CChartBarFolderReport"

const user = JSON.parse(localStorage.getItem("rtarfUser"));
const request = axios.create({
  headers: { Authorization: "Basic " + window.btoa(user.aTicket) },
});

export default {
  components: {
    Properties,
    CChartPieStorageReport,
    CChartBarFolderReport,
  },
  data() {
    return {
      categoryList: [],
      loading: false,
    };
  },
  async created() {
    this.setTotal();
  },
  methods: {
    async search(query, fields = [], include = [], language = "afts") {
      try {
        let hasMoreItems = false,
          maxItems = 1000,
          skipCount = 0,
          arr = [];

        do {
          const data = {
            query: {
              query: query,
              language,
            },
            paging: {
              maxItems,
              skipCount,
            },
            fields,
            include,
          };
          const response = await request.post(
            `${process.env.VUE_APP_ALFRESCO_API}search/versions/1/search`,
            data
          );
          arr.push(...response.data.list.entries.map((item) => item.entry));
          hasMoreItems = response.data.list.pagination.hasMoreItems;
          skipCount += maxItems;
        } while (hasMoreItems);
        return arr;
      } catch (error) {
        return [];
      }
    },
    async setTotal() {
      this.loading = true;
      this.categoryList = await this.search("TYPE: 'cm:category'", [
        "id",
        "name",
      ]);
      var id_list = this.categoryList
        .map((item) => {
          return `'${item.id}'`;
        })
        .toString()
        .replaceAll(",", " OR ");

      const response = await this.search(
        `cm:categories: (${id_list})`,
        ["id", "properties"],
        ["properties"]
      );

      this.categoryList.map((item) => {
        item.total = response.filter((e) =>
          e.properties["cm:categories"].includes(item.id)
        ).length;
        return item;
      });

      this.loading = false;
    },
  },
};
</script>