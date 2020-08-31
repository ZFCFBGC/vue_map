<template>
  <div class="index">
    <div class="header"></div>
    <div class="content clearfix">
      <div class="cont_l fl">
        <user-tree></user-tree>
      </div>
      <div class="mapContainer fr">
        <gqg-map></gqg-map>
      </div>
    </div>
    
  </div>
</template>
<script>
import gqgMap from "@/components/map/map.vue";
import userTree from "@/components/userTree/userTree.vue";
export default {
  components:{
    gqgMap,
    userTree
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
    width:100%;
    height:100%;
    box-sizing: border-box;
    .header{
      background: #3489d9;
      height: 70px;
      width: 100%;
      overflow: hidden;
    }
    .content{
      width:100%;
      height:890px;
      .cont_l{
        width:10%;
      }
      .mapContainer{
        width:85%;
        height:890px;
      }
    }
  }
</style>
