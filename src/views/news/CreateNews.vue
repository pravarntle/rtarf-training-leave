<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>เขียนข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CSelect
          label="ประเภทข่าว"
          placeholder="กรุณาเลือกประเภทข่าว"
          :options="newsOptions"
          :value.sync="form.newsType"
          @change="onNewsTypeChange"
          horizontal
        />
        <CSelect
          label="หมวดหมู่ข่าว"
          :placeholder="form.newsType === '' ? '' : 'กรุณาเลือกหมวดหมู่ข่าว'"
          :options="subNewsOptions"
          :value.sync="form.subNewsType"
          :disabled="form.newsType === ''"
          @change="onNewsSubOfSubTypeChange"
          horizontal
        />
        <CSelect
          label="หมวดหมู่ข่าวย่อย"
          :placeholder="
            form.subNewsType === '' ? '' : 'กรุณาเลือกหมวดหมู่ข่าวย่อย'
          "
          :options="subOfSubNewsOptions"
          :value.sync="form.subOfSubNewsType"
          v-if="form.newsType === 'ข่าวในประเทศ'"
          horizontal
        />
        <CCard body-wrapper v-if="form.subNewsType !== ''">
          <h4 class="mb-4">ร่างข่าว</h4>
          <CInput
            label="ชื่อผู้เขียน"
            v-model="form.writer"
            horizontal
            disabled
          />
          <CInput label="หัวข้อข่าว" v-model="form.subject" horizontal />
          <CTextarea
            label="เนื้อหาข่าว"
            rows="6"
            v-model="form.body"
            horizontal
          />
          <CInputFile
            label="อัปโหลดรูปภาพประกอบ"
            @change="onFileSelected"
            :placeholder="fileSelected.name"
            custom
            horizontal
            multiple
          >
          </CInputFile>
          <div v-if="fileSelected !== ''">
            <small>upload status</small>
            <CProgress :value="uploadProgress" color="info" />
          </div>
          <CCard body-wrapper v-if="fileSelected.length > 0" class="mt-4">
            <h5>รูปภาพที่อัปโหลด</h5>
            <CRow v-if="fileLoad" class="text-center align-items-center">
              <template v-for="(file, index) in fileSelected">
                <CCol class="mt-3" md="3" :key="index">
                  <CCard body-wrapper>
                    <CImg width="100" height="100" :src="`${file.url}`" />
                  </CCard>
                  <CTextarea
                    placeholder="คำอธิบายรูปภาพ"
                    v-model="fileSelected[index].title"
                  ></CTextarea>
                  <CRow class="text-center">
                    <CCol>
                      <CButton
                        color="primary"
                        variant="ghost"
                        size="sm"
                        class="mr-2"
                        @click="goLeft(index)"
                        :disabled="index === 0"
                        ><chevron-left-icon
                          size="1.5x"
                          class="custom-class"
                        ></chevron-left-icon
                      ></CButton>
                      {{ index + 1 }}
                      <CButton
                        color="primary"
                        variant="ghost"
                        size="sm"
                        class="ml-2"
                        @click="goRight(index)"
                        :disabled="index === fileSelected.length - 1"
                        ><chevron-right-icon
                          size="1.5x"
                          class="custom-class"
                        ></chevron-right-icon
                      ></CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        class="ml-3"
                        @click="removeFile(index)"
                        ><trash-icon
                          size="1.2x"
                          class="custom-class"
                        ></trash-icon
                      ></CButton>
                    </CCol>
                  </CRow>
                </CCol>
              </template>
            </CRow>
          </CCard>
        </CCard>
      </CCardBody>
      <CCardFooter>
        <CButton
          v-if="fileSelected.length == 0"
          color="success"
          class="float-right"
          :disabled="validateSave"
          @click.prevent="onComplete()"
          >บันทึก</CButton
        >
        <CButton
          v-else
          color="success"
          class="float-right"
          @click.prevent="startUpload()"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>
    <CElementCover :opacity="0.8" v-if="pageLoad" />
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import { authHeader } from "@/helpers/auth-header";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from "vue-feather-icons";
import axios from "axios";
export default {
  name: "",
  components: {
    jogetService,
    alfrescoService,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
    authHeader
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      form: {
        newsType: "",
        subNewsType: "",
        subOfSubNewsType: "",
        writer: "",
        subject: "",
        body: "",
        alfNodeId: "",
        status: "รอตรวจสอบ"
      },
      authHeader: authHeader(),
      cyberOptions: [
        {
          value: "ข่าวไซเบอร์",
          label: "ข่าวไซเบอร์",
          subObject: [
            { value: "ทั่วไป", label: "ทั่วไป" },
            { value: "ภัยคุกคาม", label: "ภัยคุกคาม" }
          ]
        }
      ],
      internationalOptions: [
        {
          value: "ข่าวต่างประเทศ",
          label: "ข่าวต่างประเทศ",
          subObject: [
            { value: "ภูมิภาคเอเชีย-แปซิฟิค", label: "ภูมิภาคเอเชีย-แปซิฟิค" },
            {
              value: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง",
              label: "ภูมิภาคเอเชียใต้ เอเชียกลาง ตะวันออกกลาง"
            },
            {
              value: "ภูมิภาคยุโรป อเมริกา แอฟริกา",
              label: "ภูมิภาคยุโรป อเมริกา แอฟริกา"
            }
          ]
        }
      ],
      localOptions: [
        {
          value: "ข่าวในประเทศ",
          label: "ข่าวในประเทศ",
          subObject: [
            {
              value: "ข่าวความมั่นคงพื้นที่ภายใน ",
              label: "ข่าวความมั่นคงพื้นที่ภายใน ",
              subOfSubObject: [
                { value: "กลุ่มพลังมวลชน", label: "กลุ่มพลังมวลชน" },
                { value: "สถานการณ์ จชต.", label: "สถานการณ์ จชต." }
              ]
            },
            {
              value: "ข่าวความมั่นคงพื้นที่ชายแดน",
              label: "ข่าวความมั่นคงพื้นที่ชายแดน",
              subOfSubObject: [
                {
                  value: "การลักลอบเข้าเมืองโดยผิดกฎหมาย",
                  label: "การลักลอบเข้าเมืองโดยผิดกฎหมาย"
                },
                {
                  value: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ",
                  label: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ"
                },
                {
                  value: "ยาเสพติด",
                  label: "ยาเสพติด"
                }
              ]
            },
            {
              value: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ",
              label: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ",
              subOfSubObject: [
                { value: "การก่อการร้าย", label: "การก่อการร้าย" },
                { value: "อาชญากรรมข้ามชาติ", label: "อาชญากรรมข้ามชาติ" }
              ]
            }
          ]
        }
      ],
      newsOptions: [],
      subNewsOptions: [],
      subOfSubNewsOptions: [],
      pageLoad: false,
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      defaultNewsNode: `${process.env.VUE_APP_DEFAULT_NEWS}`,
      fileSelected: [],
      uploadProgress: 0,
      fileLoad: true
    };
  },
  computed: {
    validateSave: function() {
      if (this.form.newsType === "ข่าวในประเทศ") {
        if (
          this.form.newsType === "" ||
          this.form.subNewsType === "" ||
          this.form.subOfSubNewsType === "" ||
          this.form.subject === "" ||
          this.form.body === ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.form.newsType === "" ||
          this.form.subNewsType === "" ||
          this.form.subject === "" ||
          this.form.body === ""
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  created() {
    this.ticket = this.User.ticket;
    this.form.writer = this.User.displayName;
    this.getWritingPermission();
  },
  methods: {
    async getWritingPermission() {
      let newsOptions = [];
      console.log(this.User);
      await this.User.jogetGroups.forEach(item => {
        if (item.name === "Cyber Writing News") {
          newsOptions = [...newsOptions, ...this.cyberOptions];
        }
        if (item.name === "International Writing News") {
          newsOptions = [...newsOptions, ...this.internationalOptions];
        }
        if (item.name === "Locale Writing News") {
          newsOptions = [...newsOptions, ...this.localOptions];
        }
      });
      this.newsOptions = newsOptions;
    },
    onNewsTypeChange() {
      this.newsOptions.forEach(item => {
        if (item.value === this.form.newsType) {
          this.subNewsOptions = item.subObject;
        }
      });
    },
    onNewsSubOfSubTypeChange() {
      this.subNewsOptions.forEach(item => {
        if (item.value === this.form.subNewsType) {
          this.subOfSubNewsOptions = item.subOfSubObject;
        }
      });
    },

    // Upload a File
    onFileSelected(files) {
      var fileStart = [...files].map(item => {
        return {
          file: item,
          url: URL.createObjectURL(item)
        };
      });
      this.fileSelected.push(...fileStart);
    },
    removeFile(index) {
      this.fileSelected.splice(index, 1);
    },
    async startUpload() {
      var fileStartUpload = this.fileSelected.map(item => item.file);
      console.log("fileStateUpload", fileStartUpload);
      const date = new Date();
      const folderName = `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
      // console.log(folderName, this.defaultNewsNode, this.ticket);
      await alfrescoService
        .createFolder(folderName, this.defaultNewsNode, this.User.aTicket)
        .then(res => {
          this.form.alfNodeId = res.data.id;
          fileStartUpload.forEach((item, index) => {
            this.fileUpload(item, this.form.alfNodeId).then(async res => {
              if (res.status === 201) {
                const nodeId = res.data.id;
                const updateStatus = await this.fileProperty(
                  nodeId,
                  index,
                  this.fileSelected[index].title
                );

                console.log(updateStatus);
              }
              if (index == fileStartUpload.length - 1) {
                this.onComplete();
              }
            });
          });
        });
    },
    async fileUpload(file, destination) {
      const formData = new FormData();
      formData.append("filedata", file);
      // formData.append("destination", `workspace://SpacesStore/${destination}`);
      return await axios.post(
        encodeURI(
          `${process.env.VUE_APP_BACKEND_URL}/nodes/${destination}/children`
        ),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...this.authHeader
          },
          onUploadProgress: uploadEvent => {
            this.uploadProgress = parseInt(
              Math.round((uploadEvent.loaded / uploadEvent.total) * 100)
            );
          }
        }
      );
    },
    async fileProperty(nodeId, description, title = "") {
      var properties = {
        "cm:description": description
      };
      if (title) {
        properties["cm:title"] = title;
      }
      return await alfrescoService.updateNode(
        nodeId,
        properties,
        this.User.aTicket
      );
    },

    // End Upload

    // Move Array Position
    async goLeft(index) {
      this.fileLoad = false;
      const currentPosition = this.fileSelected[index];
      const previousPosition = this.fileSelected[index - 1];
      this.fileSelected[index] = previousPosition;
      this.fileSelected[index - 1] = currentPosition;
      this.fileLoad = true;
      console.log("goLeft", this.fileSelected);
    },
    async goRight(index) {
      this.fileLoad = false;
      const currentPosition = this.fileSelected[index];
      const nextPosition = this.fileSelected[index + 1];
      this.fileSelected[index] = nextPosition;
      this.fileSelected[index + 1] = currentPosition;
      this.fileLoad = true;
      console.log("goRight", this.fileSelected);
    },
    // End Move

    async onComplete() {
      this.pageLoad = true;
      await jogetService
        .startProcess("RoyalThaiCommunication", "createNewsProcess")
        .then(async res => {
          const processId = res.data.processId;
          const activityResult = await jogetService.getCurrentActivity(
            processId
          );
          console.log(activityResult);
          this.form.processId = processId;
          console.log(this.form);
          jogetService
            .jsonSubmit(
              "RoyalThaiCommunication",
              "createNews",
              processId,
              this.form
            )
            .then(async res => {
              // console.log("create news", res);
              if (res.data.id) {
                // console.log(activityResult.data.activityId)
                const variable = [
                  {
                    paramName: "news_type",
                    paramValue: this.form.newsType
                  }
                ];
                await jogetService
                  .processCompleteWithVariable(
                    activityResult.data.activityId,
                    variable
                  )
                  .then(res => {
                    if (res.data.status === "completed") {
                      this.$router.push({ name: "Dashboard" });
                    }
                  });
              }
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style></style>
