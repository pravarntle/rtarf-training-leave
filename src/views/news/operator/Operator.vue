<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>
          ตารางรายการข่าวประจำวันที่เผยแพร่
          <strong>
            <CBadge color="info">
              {{ dailyNewsList.length }}
            </CBadge></strong
          >
        </h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="dailyNewsList"
          :fields="dailyNewsFields"
          :loading="tableLoading"
          column-filter
          table-filter
          items-per-page-select
          :items-per-page="10"
          hover
          sorter
          pagination
          :responsive="false"
        >
          <template #no-items-view>
            <div class="d-flex justify-content-center">
              ไม่พบรายการข่าวประจำวันที่เผยแพร่
            </div>
          </template>
          <template #over-table> </template>
          <template #index="{ index }">
            <td>
              {{ index + 1 }}
            </td>
          </template>
          <template #action="{ item }">
            <CButton
              color="info"
              size="sm"
              @click="toView(item)"
            >
              ดูข่าว
            </CButton>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { jogetService } from "@/helpers/joget-helper";
import { freeSet } from "@coreui/icons";

export default {
  name: "Inventorys",
  components: {
    jogetService,
    freeSet
  },
  data() {
    return {
      axiosOptions: {
        headers: authHeader()
      },
      AuthUser: JSON.parse(localStorage.getItem("AuthUser")),
      tableLoading: false,
      infoAuth: [],
      dailyNewsList: [],
      dailyNewsFields: [
        { key: "index", label: "#", _style: "width:5%" },
        {
          key: "docDate",
          label: "วันที่เอกสาร",
          _style: "min-width:10%"
        },
        {
          key: "docId",
          label: "เลขที่เอกสาร",
          _style: "min-width:10%"
        },
        {
          key: "collector",
          label: "ผู้รวบรวม",
          _style: "min-width:10%"
        },

        { key: "action", label: "", _style: "width:5%;" }
      ]
    };
  },
  created() {
    this.tableLoading = true;
    this.infoAuth = JSON.parse(localStorage.getItem("rtarfUser"));
    this.getDailyNewsList();
  },
  methods: {
    async getDailyNewsList() {
      let start = 0;
      let hasMoreItems = false;
      let dailyNewsList = [];
      do {
        const searchData = [
          {
            paramName: "start",
            paramValue: start
          },
          {
            paramName: "publishStatus",
            paramValue: "เผยแพร่"
          }
        ];
        await jogetService
          .list("RoyalThaiCommunication", "list_dailyNews", searchData)
          .then(res => {
            let total = res.data.total;

            this.dailyNewsList = res.data.data;
            this.dailyNewsList.push(...dailyNewsList);
            start = start + 100;
            if (total > start) {
              hasMoreItems = true;
            } else {
              hasMoreItems = false;
            }
          });
        this.tableLoading = false;
      } while (hasMoreItems);
    },
    toView(item) {
      this.$router.push("/operator/view/" + item.processId);
    }
  }
};
</script>
