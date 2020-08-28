<template>
  <div class="index">
    <div class="title">地图练习</div>
    <gqg-map></gqg-map>
  </div>
</template>
<script>
import gqgMap from "@/components/map/map.vue";
export default {
  components:{
    gqgMap
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped lang="less">
  .index{
    height:100%;
    width:90%;
    padding:0 5%;
  }
</style>
