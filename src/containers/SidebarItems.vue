<script>
import { jogetService } from "@/helpers/joget-helper";
import { freeSet } from "@coreui/icons";
import icons from "@/assets/icons/icons.js";
import DailyNewsVue from "../views/news/cyber-news/DailyNews.vue";
export default {
  name: "nav",
  components: {
    jogetService,
    freeSet,
    icons
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser"))
    };
  },
  computed: {
    sidebarItems() {
      return this.sidebarMenu();
    }
  },
  created() {
    // this.getAllMyAssignment();
  },
  methods: {
    // async getAllMyAssignment() {
    //   await jogetService.getMyAssignment().then(res => {
    //     this.$store.commit("set", ["assignmentCount", res.data.total]);
    //   });
    // },
    // checkPermission(groupName) {
    //   let hasPermission = false;
    //   this.User.jogetGroups.forEach(jogetGroups => {
    //     if (jogetGroups.name === groupName) {
    //       hasPermission = true;
    //     }
    //   });
      // return hasPermission;
    // },
    sidebarMenu() {
      const menu = [
        {
          _name: "CSidebarNav",
          _children: [
            {
              _name: "CSidebarNavItem",
              name: "แดชบอร์ด",
              to: "/dashboard",
              icon: "cilChartPie"
            },
            {
              _name: "CSidebarNavItem",
              name: "แบบฟอร์มใบลา",
              to: "/leave/form",
            },
            {
              _name: "CSidebarNavItem",
              name: "ใบลารอการอนุมัติ",
              to: "/leave/list",
            },
            {
              _name: "CSidebarNavItem",
              name: "ประวัติการลาของฉัน",
              to: "/leave/my-leave",
            }
          ]
        }
      ];

      return menu;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");
* {
  font-family: "Sarabun", sans-serif !important;
}
</style>
