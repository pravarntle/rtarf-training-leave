<template>
  <div>
    <!-- Widget -->
    <CRow>
      <CCol col="6">
        <CWidgetIcon
          :header="countFiles"
          text="Files"
          color="gradient-primary"
          :icon-padding="false"
        >
          <CIcon name="cil-file" width="24" />
        </CWidgetIcon>
      </CCol>

      <CCol col="6">
        <CWidgetIcon
          :header="countFolders"
          text="Folders"
          color="gradient-warning"
          :icon-padding="false"
        >
          <CIcon name="cil-folder" width="24" />
        </CWidgetIcon>
      </CCol>
    </CRow>

    <!-- Table -->
    <CCard>
      <CCardHeader>
        <strong style="color: #321fdb">{{ currentFolder.name }}</strong>

        <div style="margin-top: 10px; opacity: 0.7">
          <span>Path :</span>
          <span :key="index" v-for="(item, index) in breadCrumb">
            <CLink @click="openFilePage(item.id)"> {{ item.name }} </CLink>/
          </span>
          <span>
            <CLink disabled>
              {{ currentFolder.name }}
            </CLink>
          </span>
        </div>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="list"
          :fields="fields"
          column-filter
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          :responsive="false"
          sorter
          :loading="isTableLoaded"
          :noItemsView="{ noItems: 'ไม่มีข้อมูล', noResults: 'ไม่พบข้อมูล' }"
          hover
          striped
          border
          pagination
          cleaner
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #over-table>
            <div style="margin-bottom: 10px">
              <CButton
                color="primary"
                shape="pill"
                :disabled="
                  isRootPath || isTableLoaded || !currentFolder.parentId
                "
                @click="openFilePage(currentFolder.parentId)"
                ><CIcon name="cil-arrow-left" /> ย้อนกลับ</CButton
              >&nbsp;
              <CButton
                color="primary"
                shape="pill"
                :disabled="
                  isTableLoaded || !permissionCheck(currentFolder, 'create')
                "
                @click="modalStatus.newFolder = true"
                ><CIcon name="cil-folder" /> สร้างโฟลเดอร์ใหม่</CButton
              >&nbsp;
              <CButton
                color="primary"
                shape="pill"
                :disabled="
                  isTableLoaded || !permissionCheck(currentFolder, 'create')
                "
                @click="modalStatus.upload = true"
                ><CIcon name="cil-file" /> อัปโหลด</CButton
              >
            </div>
          </template>
          <template #name="{ item }">
            <td
              style="cursor: pointer"
              @click="item.isFile ? property(item.id) : openFilePage(item.id)"
            >
              <CRow>
                <CCol md="2">
                  <CIcon
                    height="42"
                    :style="`color: ${item.isFile ? '#3c4b64' : '#f9b115'}`"
                    :name="item.isFile ? 'cil-file' : 'cil-folder'"
                  />
                </CCol>
                <CCol>
                  {{ item.name }}
                  {{ item.title }}
                  <br />
                  Description:
                  {{ item.description }}
                </CCol>
              </CRow>
            </td>
          </template>
          <template #modifiedAt="{ item }">
            <td>
              {{ new Date(item.modifiedAt).toLocaleDateString() }}
              {{ new Date(item.modifiedAt).toLocaleTimeString() }}
            </td>
          </template>
          <template #actions="{ item }">
            <td>
              <CDropdown color="primary" toggler-text="Actions" class="m-2">
                <!-- move -->
                <CDropdownItem
                  v-c-tooltip="'ย้าย'"
                  :disabled="!permissionCheck(item, 'delete')"
                  @click="
                    selectId = item.id;
                    modalStatus.move = true;
                  "
                  ><CIcon name="cil-cursor" />&nbsp;ย้าย</CDropdownItem
                >
                <!-- copy -->
                <CDropdownItem
                  v-c-tooltip="'คัดลอก'"
                  @click="
                    selectId = item.id;
                    modalStatus.copy = true;
                  "
                  ><CIcon name="cil-copy" />&nbsp;คัดลอก</CDropdownItem
                >
                <!-- remove -->
                <CDropdownItem
                  v-c-tooltip="'ลบ'"
                  :disabled="!permissionCheck(item, 'delete')"
                  @click="
                    selectId = item.id;
                    modalStatus.remove = true;
                  "
                  ><CIcon name="cil-trash" />&nbsp;ลบ</CDropdownItem
                >
                <!-- attachment -->
                <CDropdownItem
                  v-c-tooltip="'แนบไฟล์'"
                  v-if="item.isFile"
                  @click="
                    selectId = item.id;
                    modalStatus.association = true;
                  "
                  ><CIcon name="cil-trash" />&nbsp;แนบไฟล์</CDropdownItem
                >
              </CDropdown>
            </td>
          </template>
          <template #actions-filter> <p></p> </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <!-- Remove Modal -->
    <CModal
      :show.sync="modalStatus.remove"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger"
    >
      คุณต้องการลบรายการที่เลือกนี้หรือไม่ ?
      <template #header>
        <h6 class="modal-title">ลบรายการ</h6>
        <CButtonClose @click="modalStatus.remove = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="modalStatus.remove = false" color="danger"
          >ยกเลิก</CButton
        >
        <CButton @click="remove()" color="success">ตกลง</CButton>
      </template>
    </CModal>

    <!-- New Folder Modal -->
    <CModal
      :show.sync="modalStatus.newFolder"
      :no-close-on-backdrop="true"
      :centered="true"
      title="สร้างโฟลเดอร์ใหม่"
      size="lg"
      color="primary"
    >
      <CInput label="ชื่อ" horizontal v-model="properties.name" />
      <CInput label="หัวข้อ" horizontal v-model="properties.title" />
      <CTextarea label="คำอธิบาย" horizontal v-model="properties.description" />
      <template #header>
        <h6 class="modal-title">สร้างโฟลเดอร์ใหม่</h6>
        <CButtonClose
          @click="modalStatus.newFolder = false"
          class="text-white"
        />
      </template>
      <template #footer>
        <CButton @click="modalStatus.newFolder = false" color="danger"
          >ยกเลิก</CButton
        >
        <CButton
          :disabled="!properties.name"
          @click="createFolder()"
          color="success"
          >ตกลง</CButton
        >
      </template>
      <CElementCover :opacity="0.8" v-show="modalLoaded" />
    </CModal>

    <!-- Upload Modal -->
    <CModal
      :show.sync="modalStatus.upload"
      :no-close-on-backdrop="true"
      :centered="true"
      title="อัปโหลด"
      size="lg"
      color="primary"
    >
      <div class="row">
        <label class="col-sm-3">อัปโหลดไฟล์</label>
        <input
          type="file"
          class="col-sm-9"
          ref="fileInput"
          @change="uploadHandler()"
        />
      </div>

      <hr />
      <CInput label="ชื่อ" horizontal v-model="properties.name" />
      <CInput label="หัวข้อ" horizontal v-model="properties.title" />
      <CTextarea label="คำอธิบาย" horizontal v-model="properties.description" />
      <template #header>
        <h6 class="modal-title">อัปโหลด</h6>
        <CButtonClose @click="modalStatus.upload = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="modalStatus.upload = false" color="danger"
          >ยกเลิก</CButton
        >
        <CButton
          color="success"
          :disabled="!file || !properties.name"
          @click="upload()"
          >ตกลง</CButton
        >
      </template>
      <CElementCover :opacity="0.8" v-show="modalLoaded" />
    </CModal>

    <!-- Properties Modal -->
    <CModal
      v-if="modalStatus.properties"
      :show.sync="modalStatus.properties"
      :no-close-on-backdrop="true"
      :centered="true"
      size="xl"
      color="primary"
    >
      <Properties v-if="selectId != ''" :id="selectId" />
      <template #header>
        <h6 class="modal-title">รายละเอียดเอกสาร</h6>
        <CButtonClose
          @click="modalStatus.properties = false"
          class="text-white"
        />
      </template>
      <template #footer>
        <CButton @click="modalStatus.properties = false" color="secondary"
          >ปิด</CButton
        >
      </template>
    </CModal>

    <!-- Move File Modal -->
    <CModal
      v-if="modalStatus.move"
      :show.sync="modalStatus.move"
      :no-close-on-backdrop="true"
      :centered="true"
      size="lg"
      color="primary"
    >
      <Destination
        :button="{ label: 'ย้ายเอกสาร' }"
        :from="{ destination: currentFolder.id, selected: selectId }"
        :onComplete="moveFile"
      />
      <template #header>
        <h6 class="modal-title">ย้ายเอกสาร</h6>
        <CButtonClose @click="modalStatus.move = false" class="text-white" />
      </template>
      <template #footer><div /></template>
    </CModal>

    <!-- Copy File Modal -->
    <CModal
      v-if="modalStatus.copy"
      :show.sync="modalStatus.copy"
      :no-close-on-backdrop="true"
      :centered="true"
      size="lg"
      color="primary"
    >
      <Destination
        :button="{ label: 'คัดลอกเอกสาร' }"
        :from="{ destination: currentFolder.id, selected: selectId }"
        :onComplete="copyFile"
      />
      <template #header>
        <h6 class="modal-title">คัดลอกเอกสาร</h6>
        <CButtonClose @click="modalStatus.copy = false" class="text-white" />
      </template>
      <template #footer><div /></template>
    </CModal>

    <!-- Association -->
    <CModal
      v-if="modalStatus.association"
      :show.sync="modalStatus.association"
      :no-close-on-backdrop="true"
      :centered="true"
      size="lg"
      color="primary"
    >
      <div class="row">
        <label class="col-sm-3">อัปโหลดไฟล์</label>
        <input
          type="file"
          class="col-sm-9"
          ref="fileInput"
          @change="uploadHandler()"
        />
      </div>

      <hr />
      <CInput label="ชื่อ" horizontal v-model="properties.name" />
      <CInput label="หัวข้อ" horizontal v-model="properties.title" />
      <CTextarea label="คำอธิบาย" horizontal v-model="properties.description" />
      <hr />
      <Destination
        :button="{ label: 'อัปโหลด' }"
        :from="{ destination: '', selected: selectId }"
        :onComplete="addAssociationFiles"
      />
      <template #header>
        <h6 class="modal-title">แนบไฟล์</h6>
        <CButtonClose
          @click="modalStatus.association = false"
          class="text-white"
        />
      </template>
      <template #footer><div /></template>
    </CModal>
  </div>
</template>

<script>
const fields = [
  { key: "name", label: "Name", _style: "min-width:40%" },
  { key: "modifiedAt", label: "Modified Date", _style: "min-width:20%;" },
  { key: "actions", label: "Actions", _style: "min-width:20%;" },
];

import Properties from "./Properties";

import Destination from "./Destination";

import axios from "axios";

const user = JSON.parse(localStorage.getItem("rtarfUser"));

const request = axios.create({
  headers: { Authorization: "Basic " + window.btoa(user.aTicket) }
});

export default {
  components: {
    Properties,
    Destination,
  },
  async created() {
    // const id = () => {
    //   if (this.$route.query.id) {
    //     return this.$route.query.id;
    //   } else {
    //     switch (this.$route.name) {
    //       case "My Files":
    //         return "-my-";
    //       case "Shared Files":
    //         return "-shared-";
    //       case "Repository":
    //         return "-root-";
    //     }
    //   }
    // };
    await this.getList(this.$route.params.id);
  },
  computed: {
    countFiles() {
      return this.list.filter((item) => item.isFile).length.toString();
    },
    countFolders() {
      return this.list.filter((item) => item.isFolder).length.toString();
    },
    isRootPath() {
      if (this.$route.query.id) {
        const folderName = () => {
          switch (this.$route.name) {
            case "My Files":
              return user.username;
            case "Shared Files":
              return "Shared";
            case "Repository":
              return "Company Home";
          }
        };
        if (this.currentFolder.path.elements) {
          return (
            this.currentFolder.path.elements.filter(
              (item) => item.name == folderName()
            ).length == 0
          );
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    breadCrumb() {
      if (this.currentFolder.path.elements) {
        const folderName = () => {
          switch (this.$route.name) {
            case "My Files":
              return user.username;
            case "Shared Files":
              return "Shared";
            case "Repository":
              return "Company Home";
          }
        };
        const index = this.currentFolder.path.elements.findIndex(
          (item) => item.name == folderName()
        );
        if (index != -1) {
          return this.currentFolder.path.elements.slice(
            index,
            this.currentFolder.path.elements.length
          );
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  },
  watch: {
    "modalStatus.newFolder": function (value) {
      if (!value) {
        this.clearProperties();
      }
    },
    "modalStatus.upload": function (value) {
      if (!value) {
        this.clearProperties();
        this.$refs["fileInput"].value = null;
      }
    },
    "$route.query.id": function (value) {
      if (!value) {
        const id = () => {
          switch (this.$route.name) {
            case "My Files":
              return "-my-";
            case "Shared Files":
              return "-shared-";
            case "Repository":
              return "-root-";
          }
        };
        this.getList(id());
      } else {
        this.getList(value);
      }
    },
  },
  data() {
    return {
      list: [],
      fields,

      file: null,

      currentFolder: {
        id: "",
        name: "Loading...",
        path: {
          elements: [],
        },
      },

      properties: {
        name: "",
        title: "",
        description: "",
      },

      modalStatus: {
        remove: false,
        move: false,
        copy: false,
        newFolder: false,
        upload: false,
        properties: false,

        association: false,
      },

      isTableLoaded: false,
      modalLoaded: false,

      selectId: "",
    };
  },
  methods: {
    async getList(id) {
      try {
        this.isTableLoaded = true;
        const currentFolder = await request.get(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${id}?include=allowableOperations,path,properties`
        );
        if (currentFolder.response) {
          throw currentFolder.response;
        }

        this.currentFolder = await currentFolder.data.entry;

        let hasMoreItems = false,
          maxItems = 1000,
          skipCount = 0,
          responseList = [];
        do {
          const { data: list } = await request.get(
            `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${id}/children?maxItems=${maxItems}&skipCount=${skipCount}&include=properties,allowableOperations,aspectNames`
          );

          responseList.push(
            ...list.list.entries.map((e) => {
              if (e.entry.hasOwnProperty("properties")) {
                Object.assign(e.entry, {
                  title: e.entry.properties.hasOwnProperty("cm:title")
                    ? `(${e["entry"]["properties"]["cm:title"]})`
                    : "",
                  description: e.entry.properties.hasOwnProperty(
                    "cm:description"
                  )
                    ? e["entry"]["properties"]["cm:description"]
                    : "-",
                });
              } else {
                Object.assign(e.entry, {
                  title: "",
                  description: "-",
                });
              }
              return e.entry;
            })
          );
          hasMoreItems = await list.list.pagination.hasMoreItems;
          skipCount += maxItems;
        } while (hasMoreItems);
        this.list = responseList;
        this.isTableLoaded = false;
      } catch (error) {
        if (error.status === 404) {
          this.$router.replace(this.$route.path);
        }
        this.isTableLoaded = false;
      }
    },
    createFolder() {
      this.modalLoaded = true;
      request
        .post(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.currentFolder.id}/children?autoRename=true`,
          {
            name: this.properties.name,
            nodeType: "cm:folder",
            properties: {
              "cm:title": this.properties.title,
              "cm:description": this.properties.description,
            },
          }
        )
        .then(() => {
          this.modalStatus.newFolder = false;
          this.getList(this.currentFolder.id);
        });
      this.modalLoaded = false;
    },
    remove() {
      request
        .delete(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.selectId}`
        )
        .then(() => {
          this.modalStatus.remove = false;
          this.getList(this.currentFolder.id);
        });
    },
    uploadHandler() {
      this.file = event.currentTarget.files[0];
      if (this.file) {
        this.properties.name = this.file.name.substring(
          0,
          this.file.name.lastIndexOf(".")
        );
      } else {
        this.clearProperties();
      }
    },
    async upload(id = "") {
      var nodeId = id ? id : this.currentFolder.id;

      this.modalLoaded = true;
      let formData = new FormData();
      formData.append(
        "filedata",
        this.file,
        this.properties.name +
          this.file.name.slice(this.file.name.lastIndexOf("."))
      );
      const { data } = await request.post(
        `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${nodeId}/children?autoRename=true`,
        formData
      );
      await request
        .put(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${data.entry.id}`,
          {
            properties: {
              "cm:title": this.properties.title,
              "cm:description": this.properties.description,
            },
          }
        )
        .then(() => {
          this.modalStatus.upload = false;
          this.getList(nodeId);
        });
      this.modalLoaded = false;
      return {
        id: data.entry.id,
        name:
          this.properties.name +
          this.file.name.slice(this.file.name.lastIndexOf(".")),
      };
    },
    async addAssociationFiles(destination) {
      this.modalLoaded = true;
      this.modalStatus.association = true;
      const targetIndex = this.list.findIndex(
        (item) => item.id == this.selectId
      );
      if (!this.list[targetIndex].aspectNames.includes("LIMS:associations")) {
        await request.put(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.selectId}`,
          { aspectNames: "LIMS:associations" }
        );
      }
      const upload = await this.upload(destination.id);

      var associationList = this.list[targetIndex].properties
        ? this.list[targetIndex].properties["LIMS:associationFiles"]
          ? this.list[targetIndex].properties["LIMS:associationFiles"]
          : []
        : [];

      associationList.push(`${upload.id}:${upload.name}`);

      await request.put(
        `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.selectId}`,
        {
          properties: {
            "LIMS:associationFiles": associationList,
          },
        }
      );
      this.modalLoaded = false;
      this.modalStatus.association = false;
    },
    moveFile(destination) {
      request
        .post(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.selectId}/move`,
          {
            targetParentId: destination.id,
          }
        )
        .then(() => {
          this.modalStatus.move = false;
          this.getList(this.currentFolder.id);
        });
    },
    copyFile(destination) {
      request
        .post(
          `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${this.selectId}/copy`,
          {
            targetParentId: destination.id,
          }
        )
        .then(() => {
          this.modalStatus.copy = false;
        });
    },
    clearProperties() {
      this.properties = {
        name: "",
        title: "",
        description: "",
      };
    },
    property(id) {
      this.selectId = id;
      this.modalStatus.properties = true;
    },
    permissionCheck(file, value) {
      return (
        file.hasOwnProperty("allowableOperations") &&
        file.allowableOperations.indexOf(value) != -1
      );
    },
    openFilePage(id) {
      this.getList(id);
      this.$router.push({
        name: this.$route.name,
        query: {
          id,
        },
      });
    },
  },
};
</script>