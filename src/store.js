import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const userData = JSON.parse(localStorage.getItem("rtarfUser"));

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  asideShow: false,
  darkMode: false,

  rtarfUser: {
    username: userData ? userData.username : "",
    hashed: userData ? userData.hashed : null,
    fullname: userData ? userData.displayName : "",
    department: userData ? userData.department : "",
    token: userData ? userData.token : "",
    ticket: userData ? userData.ticket : "",
    isAdmin: userData ? userData.isAdmin : false,
    iat: userData ? userData.iat : null,
    jogetGroups: userData ? userData.jogetGroups : [],
  },

  assignmentCount: 0,
};

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  },
  toggle(state, variable) {
    state[variable] = !state[variable];
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
