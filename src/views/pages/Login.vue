<template>
  <div
    class="c-app flex-row align-items-center"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer>
      <CRow class="justify-content-center">
        <CCol lg="4">
          <CCard class="p-4">
            <CCardBody>
              <CRow>
                <CCol :lg="{ size: '10', offset: '1' }">
                  <CImg
                    :src="logo"
                    class="mr-4"
                    width="90%"
                    height="auto"
                    align="center"
                    block
                  />
                </CCol>
              </CRow>
              <CForm @keyup.enter="login">
                <h2 style="text-align: center; color: blue; margin-top: 15px">
                  กองบัญชาการกองทัพไทย
                </h2>
                <h5
                  style="text-align: center; color: blue; margin-bottom: 40px"
                >
                  Royal Thai Armed Forces Headquaters
                </h5>
                <!-- <h3 class="mt-4" style="text-align: center;">เข้าสู่ระบบ</h3> -->
                <!-- <p class="text-muted" style="text-align: center;">Sign In to your account</p> -->
                <CInput
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="user.userId"
                >
                  <template #prepend-content
                    ><CIcon name="cil-user"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="curent-password"
                  v-model="user.password"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <CRow class="mt-4">
                  <CCol>
                    <CButton
                      color="primary"
                      size="lg"
                      block
                      class="px-4"
                      @click="login"
                      >Login</CButton
                    >
                  </CCol>
                  <!-- <CCol col="6" class="text-right"> -->
                  <!-- <CButton color="link" class="px-0"
                      >Forgot password?</CButton
                    > -->
                  <!-- </CCol> -->
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CElementCover :opacity="0.8" v-show="loading" />
    </CContainer>
    <CModal
      title="เกิดข้อผิดพลาด"
      color="danger"
      size="lg"
      :show.sync="loginErrorModal"
      centered
    >
      <p>ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</p>
      <template #footer>
        <CButton
          color="danger"
          class="float-right pl-4 pr-4"
          @click="loginErrorModal = false"
          >ปิด</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import logo from "@/assets/logo/logo.png";
import md5 from "md5";
import axios from "axios";
export default {
  name: "Login",
  component: {
    md5,
  },
  data() {
    return {
      user: {
        userId: "",
        password: "",
      },
      logo: logo,
      hashed: "",
      loginErrorModal: false,
      loading: false,
    };
  },
  created() {},
  methods: {
    login() {
      this.loading = true;
      const loginData = {
        username: this.user.userId,
        password: this.user.password,
      };
      // await axios.post(`${process.env.VUE_APP_ALF_URL}alfresco/s/api/login`, loginData)
      //   .then((res) => {
      //     console.log(res)
      //   })
      const base64 = Buffer.from(`${this.user.userId}:${this.user.password}`,
        "utf8"
      ).toString("base64");
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, "", {headers: { Authorization: `Basic ${base64}` },})
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.data;
            console.log(data)
            this.$joget.defaults.headers.common["Authorization"] =
              "Bearer " + data.token;
            localStorage.setItem("rtarfUser", JSON.stringify(data));
            this.loading = false;
            this.$router.push({ name: "Dashboard" });
          } else if (res.status !== 200) {
            this.loading = false
            this.loginErrorModal = true
          }
        }).catch((err) => {
          console.log(err)
          this.loading = false;
          this.loginErrorModal = true;
        });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");
* {
  font-family: "Sarabun", sans-serif !important;
}
</style>