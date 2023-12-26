<script>
export default {
  name: "HintButton",
  props: ["title"],
}
</script>

<template>
  <a :title="title" style="margin: 10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<style lang="scss" scoped>

</style>
