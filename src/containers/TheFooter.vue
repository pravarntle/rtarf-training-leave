<template>
  <CFooter :fixed="false">
    <div>
      <a href="https://coreui.io" target="_blank"></a>
      <span class="ml-1">&copy; {{ new Date().getFullYear() }} </span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank"></span>
      <a href="https://coreui.io/vue"></a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: "TheFooter"
};
</script>
