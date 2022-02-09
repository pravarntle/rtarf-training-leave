<template>
  <CChartHorizontalBar :datasets="defaultDatasets" :labels="departments" :options="options" />
</template>

<script>
import { CChartHorizontalBar } from "@coreui/vue-chartjs";

export default {
  name: "CChartBaFolderReport",
  components: { CChartHorizontalBar },
  data() {
    return {
      departments: [
        "กรมการเงินทหาร",
        "กรมกิจการชายแดนทหาร",
        "กรมยุทธบริการทหาร",
        "ศูนย์ไซเบอร์ทหาร",
        "สำนักงานจเรทหาร",
        "โรงเรียนช่างฝีมือทหาร",
        "วิทยาลัยเสนาธิการทหาร",
        "โรงเรียนเตรียมทหาร",
        "กรมแผนที่ทหาร",
        "กรมสารบรรณทหาร",
        "ศูนย์ศึกษายุทธศาสตร์",
        "สถาบันจิตวิทยาความมั่นคง"
      ],
      options: {
        layout: {
          padding: 30
        }
      }
    };
  },
  computed: {
    defaultDatasets() {
      return [
        {
          label: "ปริมาณการใช้ข้อมูล (GB)",
          backgroundColor: "#f87979",
          data: [80, 120, 95, 38, 69, 87, 11, 40, 100, 160, 177, 74],
        },
      ];
    },
  },
};
</script>
