<template>
  <div id="map" class="container"></div>
</template>
<script>
import * as maptalks from 'maptalks';
export default {
  data(){
    return {

    }
  },
  mounted(){
    this.$nextTick(()=>{
      const map = new maptalks.Map('map',{
        center: [-0.113049, 51.498568],
        zoom: 14,
        baseLayer: new maptalks.TileLayer('base',{
          urlTemplate: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&s=1&styles=pl&scaler=1&p=1&s=1',
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        })
      })
      console.log('map:',map)
    })
  }
}
</script>

<style lang="less">
.container{ width:100%;height:100% }
</style>