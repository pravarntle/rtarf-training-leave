<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>
          ตารางรายการผู้ปฏิบัติ/ผู้รับทราบ
          <strong>
            <CBadge color="info">
              {{ rankList.length }}
            </CBadge></strong
          >
        </h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="rankList"
          :fields="rankFields"
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
              ไม่พบรายการผู้ปฏิบัติ/ผู้รับทราบ
            </div>
          </template>
          <template #over-table>
            <CButton
              class="mb-3"
              size="sm"
              color="success"
              @click="addRankModal = true"
              >เพิ่มผู้ปฏิบัติ/ผู้รับทราบ</CButton
            >
          </template>
          <template #index="{ index }">
            <td>
              {{ index + 1 }}
            </td>
          </template>
          <template #action="{ item }">
            <CButton
              color="warning"
              size="sm"
              @click="openEditItem(item)"
              class="ml-1"
            >
              <CIcon name="cil-pencil" />
            </CButton>
            <CButton
              color="danger"
              size="sm"
              class="ml-1"
              @click="checkDelete(item)"
            >
              <CIcon name="cil-trash" />
            </CButton>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CModal
      title="เพิ่มรายการผู้ปฏิบัติ/ผู้รับทราบ"
      color="info"
      :show.sync="addRankModal"
      size="xl"
    >
      <CInput
        label="ชื่อผู้ปฏิบัติ/ผู้รับทราบ"
        horizontal
        v-model="newRank.rank"
        placeholder="ชื่อผู้ปฏิบัติ/ผู้รับทราบ"
      />
      <!-- <CInput
        label="อีเมล"
        horizontal
        v-model="newRank.email"
        placeholder="อีเมล"
      />
      <CTextarea
        label="เบอร์โทรศัพท์"
        horizontal
        v-model="newRank.phone"
        placeholder="เบอร์โทรศัพท์"
      /> -->
      <CTextarea
        label="รายละเอียด"
        horizontal
        v-model="newRank.description"
        placeholder="รายละเอียด"
      />
      <template #footer>
        <CButton color="secondary" @click="addRankModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="success" @click="addNewRank()">บันทึก</CButton>
      </template>
    </CModal>
    <!-- delete account modal -->
    <CModal
      title="ต้องการลบผู้ปฏิบัติ/ผู้รับทราบหรือไม่"
      color="danger"
      :show.sync="deleteRankModal"
      centered
    >
      <template #footer>
        <CButton color="secondary" @click="deleteRankModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="danger" @click="deleteRank()">ลบ</CButton>
      </template>
    </CModal>

    <CModal
      title="แก้ไขรายการผู้ปฏิบัติ/ผู้รับทราบ"
      color="warning"
      :show.sync="editRankModal"
      size="xl"
    >
      <CInput
        label="ชื่อผู้ปฏิบัติ/ผู้รับทราบ"
        horizontal
        v-model="editRank.rank"
        placeholder="ชื่อผู้ปฏิบัติ/ผู้รับทราบ"
      />
      <!-- <CInput
        label="อีเมล"
        horizontal
        v-model="editRank.email"
        placeholder="อีเมล"
      />
      <CTextarea
        label="เบอร์โทรศัพท์"
        horizontal
        v-model="editRank.phone"
        placeholder="เบอร์โทรศัพท์"
      /> -->
      <CTextarea
        label="รายละเอียด"
        horizontal
        v-model="editRank.description"
        placeholder="รายละเอียด"
      />
      <template #footer>
        <CButton color="secondary" @click="editRankModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="warning" @click="editRankList()">แก้ไข</CButton>
      </template>
    </CModal>
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
      deleteRankModal: false,
      addRankModal: false,
      editRankModal: false,
      infoAuth: [],
      id: "",
      rankList: [],
      rankFields: [
        { key: "index", label: "#", _style: "width:5%" },
        {
          key: "id",
          label: "รหัสผู้ปฏิบัติ/ผู้รับทราบ",
          _style: "min-width:5%"
        },
        {
          key: "rank",
          label: "ชื่อผู้ปฏิบัติ/ผู้รับทราบ",
          _style: "min-width:10%"
        },
        {
          key: "description",
          label: "รายละเอียด",
          _style: "min-width:10%"
        },
        {
          key: "rankStatus",
          label: "สถานะ",
          _style: "min-width:10%"
        },
        { key: "action", label: "", _style: "width:5%;" }
      ],
      newRank: {
        rank: "",
        description: "",
        // email: "",
        // phone: "",
        createBy: "",
        modiflyBy: ""
      },
      editRank: {
        id: "",
        rank: "",
        //     email: "",
        //     phone: "",
        description: "",
        modiflyBy: ""
      }
    };
  },
  created() {
    this.tableLoading = true;
    this.infoAuth = JSON.parse(localStorage.getItem("rtarfUser"));
    this.newRank.createBy = this.infoAuth.displayName;
    this.newRank.modiflyBy = this.infoAuth.displayName;
    this.editRank.modiflyBy = this.infoAuth.displayName;
    console.log(this.infoAuth);
    this.getRankList();
  },
  methods: {
    async getRankList() {
      let start = 0;
      let hasMoreItems = false;
      let rankList = [];
      do {
        const searchData = [
          {
            paramName: "start",
            paramValue: start
          },
          {
            paramName: "rankStatus",
            paramValue: "active"
          }
        ];
        await jogetService
          .list("RoyalThaiCommunication", "list_ranks", searchData)
          .then(res => {
            let total = res.data.total;

            this.rankList = res.data.data;
            this.rankList.push(...rankList);
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
    async addNewRank() {
      console.log(this.newRank);
      await jogetService
        .formSubmit("RoyalThaiCommunication", "ranks", "", this.newRank)
        .then(res => {
          this.addRankModal = false;
          this.clearRank();
          this.getRankList();
        });
    },
    clearRank() {
      this.newRank.rank = "";
      this.newRank.description = "";
    },
    openEditItem(item) {
      this.editRankModal = true;
      this.editRank.id = item.id;
      this.editRank.name = item.name;
      this.editRank.description = item.description;
      this.editRank.branch = item.branch;
      this.editRank.phone = item.phone;
      this.editRank.email = item.email;
      console.log("editRank", this.editRank);
    },
    async editRankList() {
      await jogetService
        .formSubmit(
          "RoyalThaiCommunication",
          "ranks",
          this.editRank.id,
          this.editRank
        )
        .then(res => {
          this.getRankList();
          this.editRankModal = false;
        });
    },
    checkDelete(item) {
      this.deleteRankModal = true;
      this.id = item.id;
    },
    async deleteRank() {
      this.tableLoading = true;
      let id = this.id;
      console.log("id", id);
      const formData = {
        rankStatus: "cancel"
      };
      await jogetService
        .formSubmit("RoyalThaiCommunication", "ranks", id, formData)
        .then(res => {
          this.getRankList();
          this.deleteRankModal = false;
          this.tableLoading = false;
        });
    }
  }
};
</script>
