<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>รายละเอียดข่าว</h4>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="ประเภทข่าว"
          v-model="form.newsType"
          horizontal
          disabled
        />
        <CInput
          label="หมวดหมู่ข่าว"
          v-model="form.subNewsType"
          horizontal
          disabled
        />
        <CInput label="สถานะ" v-model="form.status" horizontal disabled />
        <h4 class="mb-4">ร่างข่าว</h4>
        <CInput
          label="ชื่อผู้เขียน"
          v-model="form.writer"
          horizontal
          disabled
        />
        <CInput label="หัวข้อข่าว" v-model="form.subject" horizontal disabled />
        <CTextarea
          label="เนื้อหาข่าว"
          rows="10    "
          v-model="form.body"
          disabled
          horizontal
        />

        <CCard
          body-wrapper
          v-if="fileList.length > 0 && carouselsMode"
          class="mt-4"
        >
          <CSwitch
            class="float-right"
            color="primary"
            size="sm"
            variant="3d"
            :checked.sync="carouselsMode"
          />
          <span class="float-right mr-2 text-dark">Carousel Mode</span>
          <h5 class="mb-5">รูปภาพประกอบ</h5>
          <CRow>
            <CCol :md="{ size: '8', offset: '2' }">
              <CCarousel
                arrows
                :interval="5000"
                indicators
                animate
                height="450px"
              >
                <CCarouselItem
                  v-for="(file, index) in fileList"
                  :key="index"
                  :image="{
                    src: `${url}/nodes/${file.id}/content/${User.aTicket}`
                  }"
                />
              </CCarousel>
            </CCol>
          </CRow>
        </CCard>
        <CCard
          body-wrapper
          v-if="fileList.length > 0 && !carouselsMode"
          class="mt-4"
        >
          <CSwitch
            class="float-right"
            color="primary"
            size="sm"
            variant="3d"
            :checked.sync="carouselsMode"
          />
          <span class="float-right mr-2 text-dark">Carousel Mode</span>
          <h5 class="mb-5">รูปภาพประกอบ</h5>
          <CRow class="text-center align-items-center">
            <template v-for="(file, index) in fileList">
              <CCol class="mt-3" md="3" :key="index">
                <CCard body-wrapper>
                  <CImg
                    width="100%"
                    :src="`${url}/nodes/${file.id}/content/${User.aTicket}`"
                  />
                </CCard>
              </CCol>
            </template>
          </CRow>
        </CCard>
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="pageLoad" />
    </CCard>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
export default {
  name: "viewNews",
  components: {
    jogetService,
    alfrescoService
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      carouselsMode: true,
      form: {
        id: "",
        newsType: "",
        subNewsType: "",
        writer: "",
        subject: "",
        body: "",
        alfNodeId: "",
        status: ""
      },
      newsOptions: [
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
        },
        {
          value: "ข่าวในประเทศ",
          label: "ข่าวในประเทศ",
          subObject: [
            { value: "ข่าวความมั่นคงพื้นที่ภายใน", label: "ข่าวความมั่นคงพื้นที่ภายใน" },
            { value: "ข่าวความมั่นคงพื้นที่ชายแดน", label: "ข่าวความมั่นคงพื้นที่ชายแดน" },
            { value: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ", label: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ" }
          ]
        },
        {
          value: "ข่าวไซเบอร์",
          label: "ข่าวไซเบอร์",
          subObject: [
            { value: "ทั่วไป", label: "ทั่วไป" },
            { value: "ภัยคุกคาม", label: "ภัยคุกคาม" }
          ]
        }
      ],
      subNewsOptions: [],
      pageLoad: false,
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      defaultNewsNode: `${process.env.VUE_APP_DEFAULT_NEWS}`,
      fileSelected: "",
      uploadProgress: 0,
      uploadIndex: 0,
      successUploadModal: false,
      fileList: [],
      newsList: []
    };
  },
  computed: {
    validateSave: function() {
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
  },
  created() {
    const newsId = this.$route.query.data;
    this.ticket = this.User.ticket;
    const date = new Date();
    const folderName = `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    alfrescoService
      .createFolder(folderName, this.defaultNewsNode, this.User.aTicket)
      .then(res => {
        this.form.alfNodeId = res.data.id;
      });
    this.getNewsEdit(newsId);
  },
  methods: {
    async getNewsEdit(newsId) {
      const searchData = [
        {
          paramName: "d-3656798-fn_processId",
          paramValue: newsId
        }
      ];
      await jogetService
        .list("RoyalThaiCommunication", "list_news", searchData)
        .then(res => {
          this.form.id = res.data.data[0].id;
          this.form.newsType = res.data.data[0].newsType;
          this.form.subNewsType = res.data.data[0].subNewsType;
          this.form.subject = res.data.data[0].subject;
          this.form.body = res.data.data[0].body;
          this.form.alfNodeId = res.data.data[0].alfNodeId;
          this.form.writer = res.data.data[0].writer;
          this.form.status = res.data.data[0].status;
          console.log(res.data.data[0]);
          this.updateFileList();
        });
    },
    onNewsTypeChange() {
      this.newsOptions.forEach(item => {
        if (item.value === this.form.newsType) {
          this.subNewsOptions = item.subObject;
        }
      });
    },
    // Upload a File
    onFileSelected(files) {
      this.fileSelected = files[0];
    },

    async fileProperty(nodeId, description) {
      const properties = {
        "cm:description": description
      };
      return await alfrescoService.updateNode(
        nodeId,
        properties,
        this.User.aTicket
      );
    },
    async updateFileList() {
      alfrescoService
        .getNodeChild(this.form.alfNodeId, this.User.aTicket)
        .then(res => {
          this.fileList = res.data.list;
          this.fileList.sort(function(a, b) {
            a.descIndex = Number(a.properties["cm:description"]);
            b.descIndex = Number(b.properties["cm:description"]);
            return a.descIndex - b.descIndex;
          });
        });
    }
  }
};
</script>

<style></style>
