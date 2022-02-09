<template>
  <CSidebar
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <!-- <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 642 134"
      /> -->
      <CImg
        class="c-sidebar-brand-full pt-2 pb-2"
        name="logo"
        :src="logo"
        block
        width="90%"
        height="auto"
      />
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>
    <CRenderFunction flat :contentToRender="sidebarItems"/>
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />
    <CModal
      title="เกิดข้อผิดพลาด"
      color="danger"
      size="lg"
      :show.sync="reSigninModal"
      :closeOnBackdrop="false"
      centered
    >
      <span style="color: black;">เนื่องจากไม่มีการตอบสนองระบบเป็นเวลานาน หรือเซสชั่นของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่</span>
      <template #footer>
        <CButton color="danger" class="float-right" @click="reSignin">ตกลง</CButton>
      </template>
    </CModal>
  </CSidebar>
  
</template>

<script>
import axios from 'axios'
import logo from '@/assets/logo/logo.png'
import SidebarItems from './SidebarItems'
import { authHeader } from '@/helpers/auth-header'
export default {
  name: 'TheSidebar',
  extends: SidebarItems,
  data() {
    return {
      axiosHeader: {
        headers: authHeader()
      },
      reSigninModal: false,
      logo: logo,
    }
  },
  computed: {
    show () {
      this.checkToken()
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    }
  },
  methods: {
    async checkToken() {
      await axios.post(`${process.env.VUE_APP_BACKEND_URL}/check/token`, '', this.axiosHeader)
        .then((res) => {
          if (res.data.status === 403 || res.data.status === 401) {
            this.reSigninModal = true
          }
        })
    },
    reSignin() {
      localStorage.removeItem('rtarfUser')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

