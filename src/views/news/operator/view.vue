<template>
  <div>
    <CCard>
      <CCardBody>
        <div v-if="dailyNewsData.newsType === 'ข่าวไซเบอร์'">
          <CyberNews :processId="processId" />
        </div>
        <div v-if="dailyNewsData.newsType === 'ข่าวต่างประเทศ'">
          <InternationalNews :processId="processId" />
        </div>
        <div v-if="dailyNewsData.newsType === 'ข่าวในประเทศ'">
          <LocalNews :processId="processId" />
        </div>
      </CCardBody>
    </CCard>
    <CElementCover :opacity="0.8" v-if="pageLoad" />
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import CyberNews from "@/views/news/public/CyberNews.vue";
import InternationalNews from "@/views/news/public/InternationalNews.vue";
import LocalNews from "@/views/news/public/LocalNews.vue";
export default {
  name: "",
  components: {
    jogetService,
    alfrescoService,
    CyberNews,
    InternationalNews,
    LocalNews
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      processId: this.$route.params.processId,
      dailyNewsData: "",
      assignmentData: "",
      thaiDigit: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
      thaiMonth: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
      ],
      thaiDay: [
        "วันอาทิตย์",
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์"
      ],
      approver: {
        name: "",
        approveStatus: ""
      },
      pageLoad: false,
      fileNode: "",
      fileList: "",
      ticket: "",
      url: `${process.env.VUE_APP_BACKEND_URL}`
    };
  },
  created() {
    console.log('params',this.route);
    this.ticket = this.User.ticket;
    this.approver.name = this.User.username;
    this.getDailyNewsData().then(res => {
      res.data.data.forEach(item => {
        if (item.processId === this.processId) {
          this.dailyNewsData = item;
        }
      });
    });
  },
  computed: {
    currentDate: function() {
      const date = new Date();
      const thaiDate = `${
        this.thaiDay[date.getDay()]
      }ที่ ${date.getDate()} เดือน${
        this.thaiMonth[date.getMonth()]
      } พ.ศ. ${date.getFullYear() + 543}`;
      return thaiDate;
    }
  },
  methods: {
    getDailyNewsData() {
      console.log(this.processId);
      const searchData = [
        {
          paramName: "d-7725097-fn_processId",
          paramValue: this.processId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_dailyNews",
        searchData
      );
    },
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  padding: 5px;
}
</style>