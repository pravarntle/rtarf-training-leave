<template>
  <div>
    <CCard>
      <CCardHeader class="text-center">
        <h4>ปรับปรุงข่าวในประเทศประจำวัน</h4>
      </CCardHeader>
      <CCardBody>
        <CCard>
          <CCardHeader>ผลการอนุมัติ</CCardHeader>
          <CCardBody>
            <CDataTable
              :items="newsCommentList"
              :fields="newsCommentFields"
              :noItemsView="{}"
              :items-per-page="5"
            >
              <template #index="{index}">
                <td>
                  {{ index + 1 }}
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
        <form-wizard
          title=""
          subtitle=""
          @on-complete="onComplete"
          color="#3d3dff"
          shape="tab"
          back-button-text="ย้อนกลับ"
          next-button-text="ถัดไป"
          finish-button-text="บันทึก"
        >
          <tab-content title="ข่าวความมั่นคงพื้นที่ภายใน" icon="">
            <div v-if="reload">
              <!-- 1.1 -->
              <CCard
                v-for="(news, index) in publicPowerGroupList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>กลุ่มพลังมวลชน</CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removePublicPowerGroupList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < publicPowerGroupList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index)"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                            <CTextarea
                              placeholder="คำอธิบายรูปภาพ"
                              v-model="fileSelected[index].title"
                            ></CTextarea>
                          </CCard>
                          <CTextarea
                            placeholder="คำอธิบายรูปภาพ"
                            v-model="news.newFile[index].title"
                          ></CTextarea>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFilePublicPowerGroupList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CTextarea
                            :disabled="!news.edit"
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
              <!-- 1.2 -->
              <CCard
                v-for="(news, index) in southernBorderList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>สถานการณ์ จชต.</CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeSouthernBorderList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < southernBorderList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'southernBorder')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                            <CTextarea
                              placeholder="คำอธิบายรูปภาพ"
                              v-model="fileSelected[index].title"
                            ></CTextarea>
                          </CCard>
                          <CTextarea
                            placeholder="คำอธิบายรูปภาพ"
                            v-model="news.newFile[index].title"
                          ></CTextarea>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileSouthernBorderList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CTextarea
                            :disabled="!news.edit"
                            v-model="file.properties['cm:title']"
                          ></CTextarea>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content title="ข่าวความมั่นคงพื้นที่ชายแดน" icon="">
            <div v-if="reload">
              <!-- 2.1 -->
              <CCard
                v-for="(news, index) in smugglingPersonsList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>การลักลอบเข้าเมืองโดยผิดกฎหมาย</CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeSmugglingPersonsList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < smugglingPersonsList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'smugglingPersons')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileSmugglingPersonsList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
              <!-- 2.2-->
              <CCard
                v-for="(news, index) in smugglingProductsList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ</CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeSmugglingProductsList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < smugglingProductsList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'smugglingProducts')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileSmugglingProductsList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
              <!-- 2.3 -->
              <CCard
                v-for="(news, index) in drugList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>ยาเสพติด</CCardHeader>

                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeDrugList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="index < drugList.length - 1 ? false : true"
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'drug')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileDrugList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content title="ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ" icon="">
            <div v-if="reload">
              <!-- 3.1 -->
              <CCard
                v-for="(news, index) in terrorismList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>การก่อการร้าย </CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeTerrorismList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < terrorismList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'terrorism')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileTerrorismList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
              <!-- 3.2 -->
              <CCard
                v-for="(news, index) in transnationalCrimeList"
                :key="index"
                body-wrapper
              >
                <CCardHeader>อาชญากรรมข้ามชาติ </CCardHeader>
                <CRow class="mb-12">
                  <CCol sm="9">
                    <CInput
                      label="ลำดับที่"
                      horizontal
                      disabled
                      :value="index + 1"
                    ></CInput>
                    <CInput
                      label="พาดหัวข่าว"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.subject"
                      placeholder="พาดหัวข่าว"
                      horizontal
                    ></CInput>
                    <CTextarea
                      label="เนื้อหา"
                      :disabled="!news.edit"
                      type="text"
                      v-model="news.body"
                      rows="5"
                      placeholder="เนื้อหา"
                      horizontal
                    ></CTextarea>
                  </CCol>
                  <CCol sm="2">
                    <CButton
                      color="info"
                      size="sm"
                      @click="
                        news.edit = true;
                        carouselsMode = false;
                      "
                      v-if="!news.edit"
                    >
                      เปิดการแก้ไข</CButton
                    >
                    <CButton
                      color="success"
                      size="sm"
                      @click="
                        onSaveClick(news);
                        news.edit = false;
                      "
                      v-if="news.edit"
                    >
                      บันทึกการแก้ไข</CButton
                    >
                    <CButton
                      color="danger"
                      size="sm"
                      v-c-tooltip="'ลบรายการข่าว'"
                      @click="removeTransnationalCrimeList(index)"
                      class="ml-1"
                      :disabled="!news.edit"
                    >
                      ลบ
                    </CButton>
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2 mt-5"
                      :disabled="index > 0 ? false : true"
                      @click="goUp(news, index)"
                      ><chevrons-up-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-up-icon></CButton
                    ><br />
                    <CButton
                      color="primary"
                      size="sm"
                      class="mb-2"
                      :disabled="
                        index < transnationalCrimeList.length - 1 ? false : true
                      "
                      @click="goDown(news, index)"
                      ><chevrons-down-icon
                        size="1.5x"
                        class="custom-class"
                        style="padding-bottom: 3px;"
                      ></chevrons-down-icon
                    ></CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="9">
                    <CInputFile
                      label="อัปโหลดรูปภาพ"
                      :disabled="!news.edit"
                      @change="onFileSelected(index, 'transnationalCrime')"
                      multiple
                      custom
                      horizontal
                      mb="3"
                    >
                    </CInputFile>
                  </CCol>
                  <CCol sm="3">
                    <CButton
                      color="info"
                      class="float-left pl-5 pr-5"
                      :disabled="news.newFile === '' ? true : false"
                      @click="startUpload(news, index)"
                      >Upload</CButton
                    >
                  </CCol>
                </CRow>

                <CCol>
                  <CRow class="mt-3 mb-2">
                    <CCol> </CCol>
                  </CRow>
                  <div v-if="news.newFile !== ''">
                    <small>upload status</small>
                    <CProgress :value="uploadProgress" color="info" />
                  </div>
                  <CCard
                    body-wrapper
                    v-if="news.newFile.length > 0"
                    class="mt-4"
                  >
                    <h5>รูปภาพที่อัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.newFile">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100"
                              height="100"
                              :src="`${file.url}`"
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                class="ml-3"
                                @click="removeFileTransnationalCrimeList(index)"
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
                  <CCard body-wrapper class="mt-4">
                    <h5>รูปภาพที่เคยอัปโหลด</h5>
                    <CRow class="text-center align-items-center">
                      <template v-for="(file, index) in news.fileList">
                        <CCol class="mt-3" md="3" :key="index">
                          <CCard body-wrapper>
                            <CImg
                              width="100%"
                              :src="
                                `${url}/nodes/${file.id}/content/${User.aTicket}`
                              "
                            />
                          </CCard>
                          <CRow class="text-center">
                            <CCol>
                              <CButton
                                color="primary"
                                variant="ghost"
                                size="sm"
                                class="mr-2"
                                @click="goLeft(news, index)"
                                :disabled="index === 0 || !news.edit"
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
                                @click="goRight(news, index)"
                                :disabled="
                                  index === news.fileList.length - 1 ||
                                    !news.edit
                                "
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
                                :disabled="!news.edit"
                                @click="deleteFile(news, index)"
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
                </CCol>
              </CCard>
            </div>
          </tab-content>
          <tab-content title="รายละเอียดการปรับปรุงข่าว">
            <div v-if="reload">
              <CCard body-wrapper class="pb-3 pt-3">
                <div>
                  <CRow>
                    <CCol md="3">
                      <label for="">ผู้รับปฏิบัติ</label>
                    </CCol>
                    <CCol md="8">
                      <CMultiSelect
                        v-if="practitioner.length > 0"
                        @update="practitionerOption"
                        :options="practitionerList"
                        :search="true"
                        :selected="practitioner"
                        :selection="true"
                        optionsEmptyPlaceholder="No options placeholder"
                        selectionType="tags"
                        searchPlaceholder="เลือกผู้รับปฏิบัติ"
                      />
                    </CCol>
                  </CRow>
                  <CRow class="mt-3">
                    <CCol md="3">
                      <label for="">ผู้รับทราบ</label>
                    </CCol>
                    <CCol md="8">
                      <CMultiSelect
                        v-if="acknowledgment.length > 0"
                        @update="acknowledgmentOption"
                        :options="acknowledgmentList"
                        :search="true"
                        :selected="acknowledgment"
                        :selection="true"
                        optionsEmptyPlaceholder="No options placeholder"
                        selectionType="tags"
                        searchPlaceholder="เลือกผู้รับทราบ"
                      />
                    </CCol>
                  </CRow>
                </div>
                <CRow class="mt-3">
                  <CCol md="3">
                    <label for="">การบันทึก</label>
                  </CCol>
                  <CCol md="8">
                    <CInputRadioGroup
                      :options="[
                        { value: 'temporary', label: 'บันทึก' },
                        { value: 'saveAndSend', label: 'บันทึกและส่ง' }
                      ]"
                      :checked.sync="recording"
                      inline
                      custom
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="ชื่อผู้ปรับปรุงข่าว"
                  v-model="approver.name"
                  horizontal
                  disabled
                />
                <CTextarea
                  rows="3"
                  v-model="approver.approveComment"
                  placeholder="อธิบายการแก้ไขเพิ่มเติม"
                />
              </CCard>
            </div>
          </tab-content>
        </form-wizard>
      </CCardBody>
    </CCard>
    <CModal color="success" size="sm" :show.sync="successUploadModal" centered>
      <h6 class="text-center">File Uploaded</h6>
      <template #footer>
        <CButton
          color="success"
          class="float-right"
          @click="
            successUploadModal = false;
            uploadProgress = 0;
          "
          >ตกลง</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { alfrescoService } from "@/helpers/alfresco-helper";
import {
  ChevronsUpIcon,
  ChevronsDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from "vue-feather-icons";
import axios from "axios";
import { FormWizard, TabContent } from "vue-form-wizard";
import { DatePicker } from "v-calendar";
import moment from "moment";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { authHeader } from "@/helpers/auth-header";

export default {
  name: "",
  components: {
    "v-date-picker": DatePicker,
    jogetService,
    alfrescoService,
    ChevronsUpIcon,
    ChevronsDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
    FormWizard,
    TabContent,
    authHeader
  },
  data() {
    return {
      User: JSON.parse(localStorage.getItem("rtarfUser")),
      url: `${process.env.VUE_APP_BACKEND_URL}`,
      publicPowerGroupList: [],
      southernBorderList: [],
      smugglingPersonsList: [],
      smugglingProductsList: [],
      drugList: [],
      terrorismList: [],
      transnationalCrimeList: [],
      mergeNewsProcessId: this.$route.query.data,
      mergeNews: [],
      pageLoad: false,
      form: {
        processId: "",
        newsProcessId: ""
      },
      headerInputDate: "",
      attributes: [
        {
          highlight: true
        }
      ],
      ticket: "",
      carouselHeight: "300px",
      docId: "",
      docDate: new Date(),
      uploadProgress: 0,
      successUploadModal: false,
      mergeNewsList: [], // รายการข่าวที่จะรวม
      newsCommentList: [],
      newsCommentFields: [
        { key: "index", label: "#" },
        { key: "dateCreated", label: "วันที่ตรวจสอบ" },
        { key: "name", label: "ผู้ตรวจสอบ" },
        { key: "comment", label: "ความคิดเห็น" },
        { key: "ref2", label: "ขั้นตอน" },
        { key: "approveStatus", label: "ผลอนุมัติ" }
      ],
      reload: true,
      authHeader: authHeader(),
      approver: {
        name: "",
        approveStatus: "-",
        approveComment: ""
      },
      deleteNewsList: [],
      practitionerList: [],
      practitioner: [],
      acknowledgmentList: [],
      acknowledgment: [],
      hasPermission: false,
      recording: "temporary"
    };
  },
  created() {
    this.reload = false;
    this.ticket = this.User.ticket;
    this.approver.name = this.User.username;
    this.getRank();

    this.getPublicPowerGroupList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.edit = false;
          item.newFile = [];
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.publicPowerGroupList = newsList;
    });
    this.getSouthernBorderList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.edit = false;
          item.newFile = [];
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.southernBorderList = newsList;
    });
    this.getSmugglingPersonsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.smugglingPersonsList = newsList;
    });
    this.getSmugglingProductsList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.smugglingProductsList = newsList;
    });
    this.getDrugList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.drugList = newsList;
    });

    this.getTerrorismList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.terrorismList = newsList;
    });
    this.getTransnationalCrimeList().then(res => {
      let newsList = [];
      res.data.data.forEach(async (item, index) => {
        if (item.dailyNewsProcessId !== "") {
          item.newFile = [];
          item.edit = false;
          if (item.alfNodeId !== "") {
            var file = await this.getFileList(item.alfNodeId);
            var fileList = file.data.list.sort(function(a, b) {
              a.descIndex = Number(a.properties["cm:description"]);
              b.descIndex = Number(b.properties["cm:description"]);
              return a.descIndex - b.descIndex;
            });
            item.fileList = fileList;
            newsList.push(item);
          } else {
            newsList.push(item);
          }
          if (index == newsList.length - 1) {
            newsList = newsList.sort((a, b) =>
              Number(a.newsIndex) > Number(b.newsIndex) ? 1 : -1
            );
          }
        }
      });
      this.transnationalCrimeList = newsList;
    });
    this.getMergeNewsList().then(res => {
      this.mergeNewsList = res.data.data[0];
      this.acknowledgment = this.mergeNewsList.acknowledgment.split(",");
      this.practitioner = this.mergeNewsList.practitioner.split(",");

      // this.docId = this.mergeNewsList.docId
    });
    this.getNewsCommentList().then(res => {
      this.newsCommentList = res.data.data;
    });
  },
  methods: {
    async getRank() {
      await jogetService
        .list("RoyalThaiCommunication", "list_ranks")
        .then(res => {
          res.data.data.forEach((item, index) => {
            this.acknowledgmentList.push({
              value: item.rank,
              text: item.rank
            });
            this.practitionerList.push({
              value: item.rank,
              text: item.rank
            });
          });
        });
      this.reload = true;
    },
    acknowledgmentOption(rank) {
      this.acknowledgment = rank;
    },
    practitionerOption(rank) {
      this.practitioner = rank;
    },
    async removePublicPowerGroupList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.publicPowerGroupList[index].id,
        formData
      );
      this.publicPowerGroupList.splice(index, 1);
    },
    async removeSouthernBorderList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.southernBorderList[index].id,
        formData
      );
      this.southernBorderList.splice(index, 1);
    },
    async removeSmugglingPersonsList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.smugglingPersonsList[index].id,
        formData
      );
      this.smugglingPersonsList.splice(index, 1);
    },
    async removeSmugglingProductsList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.smugglingProductsList[index].id,
        formData
      );
      this.smugglingProductsList.splice(index, 1);
    },
    async removeDrugList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.drugList[index].id,
        formData
      );
      this.drugList.splice(index, 1);
    },
    async removeTerrorismList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.terrorismList[index].id,
        formData
      );
      this.terrorismList.splice(index, 1);
    },
    async removeTransnationalCrimeList(index) {
      const formData = {
        newsIndex: "",
        dailyNewsProcessId: ""
      };
      await jogetService.formSubmit(
        "RoyalThaiCommunication",
        "createNews",
        this.transnationalCrimeList[index].id,
        formData
      );
      this.transnationalCrimeList.splice(index, 1);
    },
    getFileList(fileNode) {
      return alfrescoService.getNodeChild(fileNode, this.User.aTicket);
    },
    startUpload(news, index) {
      this.pageLoading = true;
      let checkIndex = 0;
      var fileStartUpload = news.newFile.map(item => item.file);
      fileStartUpload.forEach((item, index) => {
        this.fileUpload(item, news.alfNodeId).then(async res => {
          const fileIndex = news.newFile.length++;
          const nodeId = res.data.id;
          await this.fileProperty(
            nodeId,
            fileIndex,
            news.newFile[index].title
          ).then(async res => {
            checkIndex = checkIndex + 1;
            if (checkIndex === fileStartUpload.length) {
              this.pageLoading = false;
              this.uploadProgress = 0;
              this.updateFileList(news);
              news.newFile = [];
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
    async updateFileList(news) {
      alfrescoService
        .getNodeChild(news.alfNodeId, this.User.aTicket)
        .then(res => {
          news.fileList = res.data.list;
          news.fileList.sort(function(a, b) {
            a.descIndex = Number(a.properties["cm:description"]);
            b.descIndex = Number(b.properties["cm:description"]);
            return a.descIndex - b.descIndex;
          });
        });
    },
    goUp(news, index) {
      this.reload = false;
      if (news.subNewsType === "กลุ่มพลังมวลชน") {
        const current = { ...this.publicPowerGroupList[index] };
        const next = { ...this.publicPowerGroupList[index - 1] };
        this.publicPowerGroupList[index] = { ...next };
        this.publicPowerGroupList[index - 1] = { ...current };
        this.publicPowerGroupList[index].newsIndex = current.newsIndex;
        this.publicPowerGroupList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "สถานการณ์ จชต.") {
        const current = { ...this.southernBorderList[index] };
        const next = { ...this.southernBorderList[index - 1] };
        this.southernBorderList[index] = { ...next };
        this.southernBorderList[index - 1] = { ...current };
        this.southernBorderList[index].newsIndex = current.newsIndex;
        this.southernBorderList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การลักลอบเข้าเมืองโดยผิดกฎหมาย") {
        const current = { ...this.smugglingPersonsList[index] };
        const next = { ...this.smugglingPersonsList[index - 1] };
        this.smugglingPersonsList[index] = { ...next };
        this.smugglingPersonsList[index - 1] = { ...current };
        this.smugglingPersonsList[index].newsIndex = current.newsIndex;
        this.smugglingPersonsList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ") {
        const current = { ...this.smugglingProductsList[index] };
        const next = { ...this.smugglingProductsList[index - 1] };
        this.smugglingProductsList[index] = { ...next };
        this.smugglingProductsList[index - 1] = { ...current };
        this.smugglingProductsList[index].newsIndex = current.newsIndex;
        this.smugglingProductsList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "ยาเสพติด") {
        const current = { ...this.drugList[index] };
        const next = { ...this.drugList[index - 1] };
        this.drugList[index] = { ...next };
        this.drugList[index - 1] = { ...current };
        this.drugList[index].newsIndex = current.newsIndex;
        this.drugList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การก่อการร้าย") {
        const current = { ...this.terrorismList[index] };
        const next = { ...this.terrorismList[index - 1] };
        this.terrorismList[index] = { ...next };
        this.terrorismList[index - 1] = { ...current };
        this.terrorismList[index].newsIndex = current.newsIndex;
        this.terrorismList[index - 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "อาชญากรรมข้ามชาติ") {
        const current = { ...this.transnationalCrimeList[index] };
        const next = { ...this.transnationalCrimeList[index - 1] };
        this.transnationalCrimeList[index] = { ...next };
        this.transnationalCrimeList[index - 1] = { ...current };
        this.transnationalCrimeList[index].newsIndex = current.newsIndex;
        this.transnationalCrimeList[index - 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    goDown(news, index) {
      this.reload = false;
      if (news.subNewsType === "กลุ่มพลังมวลชน") {
        const current = { ...this.publicPowerGroupList[index] };
        const next = { ...this.publicPowerGroupList[index + 1] };
        this.publicPowerGroupList[index] = { ...next };
        this.publicPowerGroupList[index + 1] = { ...current };
        this.publicPowerGroupList[index].newsIndex = current.newsIndex;
        this.publicPowerGroupList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "สถานการณ์ จชต.") {
        const current = { ...this.southernBorderList[index] };
        const next = { ...this.southernBorderList[index + 1] };
        this.southernBorderList[index] = { ...next };
        this.southernBorderList[index + 1] = { ...current };
        this.southernBorderList[index].newsIndex = current.newsIndex;
        this.southernBorderList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การลักลอบเข้าเมืองโดยผิดกฎหมาย") {
        const current = { ...this.smugglingPersonsList[index] };
        const next = { ...this.smugglingPersonsList[index + 1] };
        this.smugglingPersonsList[index] = { ...next };
        this.smugglingPersonsList[index + 1] = { ...current };
        this.smugglingPersonsList[index].newsIndex = current.newsIndex;
        this.smugglingPersonsList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ") {
        const current = { ...this.smugglingProductsList[index] };
        const next = { ...this.smugglingProductsList[index + 1] };
        this.smugglingProductsList[index] = { ...next };
        this.smugglingProductsList[index + 1] = { ...current };
        this.smugglingProductsList[index].newsIndex = current.newsIndex;
        this.smugglingProductsList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "ยาเสพติด") {
        const current = { ...this.drugList[index] };
        const next = { ...this.drugList[index + 1] };
        this.drugList[index] = { ...next };
        this.drugList[index + 1] = { ...current };
        this.drugList[index].newsIndex = current.newsIndex;
        this.drugList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "การก่อการร้าย") {
        const current = { ...this.terrorismList[index] };
        const next = { ...this.terrorismList[index + 1] };
        this.terrorismList[index] = { ...next };
        this.terrorismList[index + 1] = { ...current };
        this.terrorismList[index].newsIndex = current.newsIndex;
        this.terrorismList[index + 1].newsIndex = next.newsIndex;
      } else if (news.subNewsType === "อาชญากรรมข้ามชาติ") {
        const current = { ...this.transnationalCrimeList[index] };
        const next = { ...this.transnationalCrimeList[index + 1] };
        this.transnationalCrimeList[index] = { ...next };
        this.transnationalCrimeList[index + 1] = { ...current };
        this.transnationalCrimeList[index].newsIndex = current.newsIndex;
        this.transnationalCrimeList[index + 1].newsIndex = next.newsIndex;
      }
      this.reload = true;
    },
    // Upload a File
    async onFileSelected(index, type = "publicPowerGroup") {
      var files = event.target.files;
      var fileStart = [...files].map(item => {
        return {
          file: item,
          url: URL.createObjectURL(item)
        };
      });
      if (type === "publicPowerGroup") {
        this.publicPowerGroupList[index].newFile.push(...fileStart);
      } else if (type === "southernBorder") {
        this.southernBorderList[index].newFile.push(...fileStart);
      } else if (type === "smugglingPersons") {
        this.smugglingPersonsList[index].newFile.push(...fileStart);
      } else if (type === "smugglingProducts") {
        this.smugglingProductsList[index].newFile.push(...fileStart);
      } else if (type === "drug") {
        this.drugList[index].newFile.push(...fileStart);
      } else if (type === "terrorism") {
        this.terrorismList[index].newFile.push(...fileStart);
      } else if (type === "transnationalCrime") {
        this.transnationalCrimeList[index].newFile.push(...fileStart);
      }
    },
    removeFilePublicPowerGroupList(index) {
      this.publicPowerGroupList[index].newFile.splice(index, 1);
    },
    removeFileSouthernBorderList(index) {
      this.southernBorderList[index].newFile.splice(index, 1);
    },
    removeFileSmugglingPersonsList(index) {
      this.smugglingPersonsList[index].newFile.splice(index, 1);
    },
    removeFileSmugglingProductsList(index) {
      this.smugglingProductsList[index].newFile.splice(index, 1);
    },
    removeFileDrugList(index) {
      this.drugList[index].newFile.splice(index, 1);
    },
    removeFileTerrorismList(index) {
      this.terrorismList[index].newFile.splice(index, 1);
    },
    removeFileTransnationalCrimeList(index) {
      this.transnationalCrimeList[index].newFile.splice(index, 1);
    },
    // Move Array Position
    async goLeft(news, index) {
      const currentPosition = news.fileList[index];
      const previousPosition = news.fileList[index - 1];
      let updateStatus = 0;
      await this.fileProperty(currentPosition.id, index - 1).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      await this.fileProperty(previousPosition.id, index).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      if (updateStatus > 1) {
        this.updateFileList(news);
      }
    },
    async goRight(news, index) {
      const currentPosition = news.fileList[index];
      const nextPosition = news.fileList[index + 1];
      let updateStatus = 0;
      await this.fileProperty(currentPosition.id, index + 1).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      await this.fileProperty(nextPosition.id, index).then(res => {
        if (res.status === 200) {
          updateStatus += 1;
        }
      });

      if (updateStatus > 1) {
        this.updateFileList(news);
      }
    },
    async deleteFile(news, index) {
      const currentPosition = news.fileList[index];
      alfrescoService
        .deleteNode(currentPosition.id, this.User.aTicket)
        .then(res => {
          this.updateFileList(news);
          this.fileList.forEach(async (item, itemIndex) => {
            if (Number(item.properties["cm:description"]) > index) {
              await this.fileProperty(
                item.id,
                Number(item.properties["cm:description"]) - 1
              ).then(res => {});
            }
          });
        });
    },
    // End Move
    getNewsCommentList() {
      const searchData = [
        {
          paramName: "d-2008741-fn_ref1",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "rtarfNewsCommentList",
        searchData
      );
    },
    getMergeNewsList() {
      const searchData = [
        {
          paramName: "d-7725097-fn_id",
          paramValue: this.mergeNewsProcessId
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_dailyNews",
        searchData
      );
    },
    getPublicPowerGroupList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "กลุ่มพลังมวลชน"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSouthernBorderList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ภายใน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "สถานการณ์ จชต."
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSmugglingPersonsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบเข้าเมืองโดยผิดกฎหมาย"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getSmugglingProductsList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การลักลอบนำสินค้าผิดกฎหมายเข้าประเทศ"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getDrugList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวความมั่นคงพื้นที่ชายแดน"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "ยาเสพติด"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getTerrorismList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "การก่อการร้าย"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    getTransnationalCrimeList() {
      const searchData = [
        {
          paramName: "d-3656798-fn_status",
          paramValue: "ผ่านการตรวจสอบ"
        },
        {
          paramName: "d-3656798-fn_newsType",
          paramValue: "ข่าวในประเทศ"
        },
        {
          paramName: "d-3656798-fn_subNewsType",
          paramValue: "ข่าวก่อการร้ายและอาชญากรรมข้ามชาติ"
        },
        {
          paramName: "d-3656798-fn_dailyNewsProcessId",
          paramValue: this.mergeNewsProcessId
        },
        {
          paramName: "subOfSubNewsType",
          paramValue: "อาชญากรรมข้ามชาติ"
        }
      ];
      return jogetService.list(
        "RoyalThaiCommunication",
        "list_news",
        searchData
      );
    },
    async onSaveClick(news) {
      await jogetService
        .formSubmit("RoyalThaiCommunication", "createNews", news.id, news)
        .then(res => {
          news.fileList.forEach(async (item, index) => {
            const alfNodeId = item.id;
            await this.fileProperty(
              alfNodeId,
              index,
              item.properties["cm:title"]
            );
          });
        });
    },
    async onComplete() {
      const processId = this.mergeNewsProcessId;
      let formData = "";

      formData = {
        comment: this.approver.approveComment,
        name: this.approver.name,
        approveStatus: this.approver.approveStatus,
        ref1: processId,
        ref2: "ปรับปรุงข่าว"
      };

      jogetService.formSubmit(
        "RoyalThaiCommunication",
        "newsComment",
        "",
        formData
      );

      const mergeData = {
        collector: this.User.username,
        processId: processId,
        publishStatus: "รอตรวจสอบ",
        newsType: "ข่าวในประเทศ",
        docId: this.docId,
        docDate: this.docDate,
        practitioner: this.practitioner,
        acknowledgment: this.acknowledgment
      };
      jogetService
        .formSubmit("RoyalThaiCommunication", "mergeNews", processId, mergeData)
        .then(res => {
          const dailyNewsProcessId = processId;
          if (this.publicPowerGroupList.length > 0) {
            this.publicPowerGroupList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.southernBorderList.length > 0) {
            this.southernBorderList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.smugglingPersonsList.length > 0) {
            this.smugglingPersonsList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.smugglingProductsList.length > 0) {
            this.smugglingProductsList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.drugList.length > 0) {
            this.drugList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.terrorismList.length > 0) {
            this.terrorismList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }
          if (this.transnationalCrimeList.length > 0) {
            this.transnationalCrimeList.forEach(async (news, index) => {
              const formData = {
                newsIndex: index + 1,
                dailyNewsProcessId: dailyNewsProcessId,
                status: news.status
              };
              await jogetService.formSubmit(
                "RoyalThaiCommunication",
                "createNews",
                news.id,
                formData
              );
            });
          }

          if (this.recording == "saveAndSend") {
            jogetService.getCurrentActivity(dailyNewsProcessId).then(res => {
              const activityId = res.data.activityId;
              const variable = [
                {
                  paramName: "improve",
                  paramValue: "yes"
                },
                {
                  paramName: "status_1",
                  paramValue: ""
                }
              ];
              jogetService.processCompleteWithVariable(activityId, variable);
              this.completeProcess();
            });
          } else if (this.recording == "temporary") {
            this.completeProcess();
          }
        });
    },
    completeProcess() {
      this.$router.push({ name: "Cyber News" });
    }
  }
};
</script>

<style></style>
