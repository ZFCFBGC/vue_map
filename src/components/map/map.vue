<template>
  <div class="mapTalk">
    <div id="map" class="container"></div>
    <div class="title clearfix">
      <div class="title_l fl">显示定位信息</div>
      <div class="title_r fr">
        <img src="@/assets/images/map.png" alt="切换地图" @click="toggleMap" />
        <div class="mapSelect" v-if="isMapSelectShow">
          <div
            class="tabSelect"
            :class="active == 1 ? 'active' : ''"
            @click="choseMap(1)"
          >
            百度地图
          </div>
          <div
            class="tabSelect"
            :class="active == 2 ? 'active' : ''"
            @click="choseMap(2)"
          >
            谷歌地图
          </div>
          <div
            class="tabSelect"
            :class="active == 3 ? 'active' : ''"
            @click="choseMap(3)"
          >
            必应地图
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
export default {
  data() {
    return {
      nowShowSatellite: false,
      maptalk: null, //地图主体对象
      layer: null, //地图图层
      isMapSelectShow: false,
      active: 1,
      carMarkerArr: []
    };
  },
  mounted() {
    this.choseMap(1);
  },
  methods: {
    // 百度地图
    showBaiduMap: function() {
      var that = this;
      that.$nextTick(() => {
        this.maptalk = new maptalks.Map("map", {
          center: [121.487899486, 31.24916171],
          zoom: 10,
          zoomControl: {
            position: "top-left",
            slider: true,
            zoomLevel: false
          },
          scaleControl: true,
          spatialReference: {
            projection: "baidu"
          },
          attribution: {
            content: "&copy;百度地图"
          },
          baseLayer: new maptalks.GroupTileLayer("地图", [
            new maptalks.TileLayer("百度地图", {
              visible: !this.nowShowSatellite,
              urlTemplate:
                "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&s=1&styles=pl&scaler=1&p=1&s=1",
              subdomains: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            }),
            new maptalks.TileLayer("百度卫星", {
              visible: this.nowShowSatellite,
              urlTemplate:
                "https://ss{s}.bdstatic.com/8bo_dTSlR1gBo1vgoIiO_jowehsv/starpic/?qt=satepc&s=1&u=x={x};y={y};z={z};v=009;type=sate&fm=46&app=webearth2&v=009",
              subdomains: ["0", "1", "2", "3"]
            })
          ])
        });
        this.maptalk.setMinZoom(4); //限制最小缩放比例
        this.maptalk.setMaxZoom(20); //限制最大缩放比例
      });
    },
    // 谷歌地图
    showGoogleMap: function(initLng, initLat) {
      var that = this;
      that.$nextTick(() => {
        this.maptalk = new maptalks.Map("map", {
          center: [121.487899486, 31.24916171],
          zoom: 10,
          zoomControl: {
            position: "top-left",
            slider: true,
            zoomLevel: false
          },
          scaleControl: true,
          attribution: {
            content: "&copy;谷歌地图"
          },
          baseLayer: new maptalks.GroupTileLayer("地图", [
            new maptalks.TileLayer("谷歌地图", {
              visible: !this.nowShowSatellite,
              urlTemplate:
                "https://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile",
              subdomains: ["0", "1", "2", "3"]
            }),
            new maptalks.TileLayer("谷歌卫星", {
              visible: this.nowShowSatellite,
              urlTemplate:
                "https://mt{s}.google.cn/maps/vt?lyrs=s%40781&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}",
              subdomains: ["0", "1", "2", "3"]
            })
          ])
        });
        this.maptalk.setMinZoom(4); //限制最小缩放比例
        this.maptalk.setMaxZoom(20); //限制最大缩放比例
      });
    },
    // 必应地图
    showBingMap: function() {
      var that = this;
      that.$nextTick(() => {
        this.maptalk = new maptalks.Map("map", {
          center: [121.487899486, 31.24916171],
          zoom: 10,
          zoomControl: {
            position: "top-left",
            slider: true,
            zoomLevel: false
          },
          scaleControl: true,
          attribution: {
            content: "&copy;必应地图"
          },
          baseLayer: new maptalks.GroupTileLayer("地图", [
            new maptalks.TileLayer("必应电子地图", {
              visible: !this.nowShowSatellite,
              id: "bingBase",
              urlTemplate: function(x, y, z, domain) {
                //通过x,y,z计算quadkey和url
                var quadKey = that.quadTreeChange(x, y, z);
                return (
                  "http://ecn.t" +
                  domain +
                  ".tiles.virtualearth.net/tiles/r" +
                  quadKey +
                  ".jpeg?g=7863&mkt=zh-CN&shading=hill"
                );
              },
              subdomains: ["0", "1", "2", "3"]
            }),
            new maptalks.TileLayer("必应卫星地图", {
              id: "bingSatellite",
              visible: this.nowShowSatellite,
              urlTemplate: function(x, y, z, domain) {
                //通过x,y,z计算quadkey和url
                var quadKey = this.quadTreeChange(x, y, z);
                return (
                  "http://ecn.t" +
                  domain +
                  ".tiles.virtualearth.net/tiles/a" +
                  quadKey +
                  ".jpeg?g=7863"
                );
              },
              subdomains: ["0", "1", "2", "3"]
            })
          ])
        });
        this.maptalk.setMinZoom(4); //限制最小缩放比例
        this.maptalk.setMaxZoom(20); //限制最大缩放比例
      });
    },
    //xyz转quadKeys算法
    //转换规则：10进制的参数x，y值要先转为2进制，再将y，x从右到左进行位数拼接，例如y=100,x=11,则补齐0后x=011，拼接为100101。
    //再把结果值转换为4进制。4进制的结果长度小于z值需要在前面补0
    quadTreeChange: function(x, y, z) {
      var x2 = x.toString(2); //10进制转换为2进制
      var y2 = y.toString(2);
      var zeroMap = [
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000"
      ];
      // 位数不相等则在前面补齐0
      if (x2.length > y2.length) {
        var length = x2.length - y2.length;
        y2 = zeroMap[length - 1] + y2;
      } else if (x2.length < y2.length) {
        var length = y2.length - x2.length;
        x2 = zeroMap[length - 1] + x2;
      }
      var val = "";
      for (var i = 0; i < y2.length; i++) {
        val += y2[i] + x2[i];
      }
      var value4 = parseInt(val, 2).toString(4); //转为10进制再转为四进制
      // 4进制数据的长度小于z值的话要在前面补0
      if (value4.length < z) {
        value4 = zeroMap[z - value4.length - 1] + value4;
      }
      return value4;
    },

    //显示地图切换
    toggleMap() {
      this.isMapSelectShow = !this.isMapSelectShow;
    },
    // 切换地图
    choseMap(type) {
      // 如果地图对象存在则清除
      if (this.maptalk) {
        this.maptalk.remove();
      }
      if (type == 1) {
        this.active = 1;
        this.showBaiduMap();
      } else if (type == 2) {
        this.active = 2;
        this.showGoogleMap();
      } else if (type == 3) {
        this.active = 3;
        this.showBingMap();
      }
      setTimeout(() => {
        if (!this.layer) {
          //没有图层则添加图层到底图
          this.layer = new maptalks.VectorLayer("vector").addTo(this.maptalk);
        } else {
          //有图层则把图层添加进底图(底图切换)
          this.maptalk.removeLayer(this.layer); //清除图层
          this.layer = new maptalks.VectorLayer("vector").addTo(this.maptalk);
        }
      }, 500);

      this.isMapSelectShow = false;
    },
    /**
     *  @method showCar 显示车辆方法
     *  @param car {Object} 当前设备的状态信息
     *  @param isOpenInfo {Bolean} 是否显示信息窗
     *  @param showLine {Bolean} 是否显示信息窗轨迹
     *  @param isSelectFromMonitor {Bolean} 是否从监控列表点击显示坐标信息
     *  @param isRefresh {Bolean} 是否每十秒刷新状态模式
     *  @param isCancelCheckLoc {Bolean} 是否取消判断坐标在中国 true->取消 false->不取消
     */
    showCar1:function(car,isOpenInfo,showLine,isSelectFromMonitor,isRefresh,isCancelCheckLoc){

    },
    showCar(carArr) {
      var that = this;
      if (carArr) {
        var carInfo = carArr[0].carStatus;
        console.log("2222222：", carInfo);
        that.maptalk.setCenter([carInfo.lon, carInfo.lat]);
        that.maptalk.setZoom(17);
        carArr.map(item => {
          if (item.carStatus.lon == 0) {
            // console.log("没有定位数据");
          } else {
            if (item.carStatus.online) {
              item.carStatus.icon =
                "../../static/images/machine/" + item.carType + "/green_0.png";
            } else {
              item.carStatus.icon =
                "../../static/images/machine/" + item.carType + "/white_0.png";
            }
            that.car_marker(item.carStatus, false);
          }
          return;
        });
      } else {
        return;
      }
    },
    // 创建车辆图标
    //../images/map/machine/3/blue_315.png
    car_marker: function(opt, carStatus) {
      // console.log('执行好了吗')
      var that = this;
      var point = new maptalks.Marker([opt.lon, opt.lat], {
        visible: true,
        editable: true,
        cursor: "pointer",
        shadowBlur: 0,
        shadowColor: "black",
        draggable: false,
        dragShadow: false, // display a shadow during dragging
        drawOnAxis: null, // force dragging stick on a axis, can be: x, y
        symbol: {
          markerFile: opt.icon,
          markerDx: 0,
          markerDy: 16
        }
      });
      var label = new maptalks.Label("label without box", [opt.lon, opt.lat], {
        draggable: true,
        textSymbol: {
          textFaceName: "monospace",
          textFill: "#34495e",
          textHaloFill: "#fff",
          textHaloRadius: 4,
          textSize: 18,
          textWeight: "bold",
          textVerticalAlignment: "top"
        }
      });
      // point.setInfoWindow({
      //   content: `<div class="map_machineNameBox">22222222222222222222</div>`,
      //   single: false,
      //   autoPan: false,
      //   custom: true,
      //   dx: 0,
      //   dy: -8
      // });
      setTimeout(function() {
        point.addTo(that.layer);
        // if (carStatus == true) {
        //   point.openInfoWindow();
        // }
      }, 500);
      this.carMarkerArr.push(point);
      return point;
    },
    // 更新车辆图标位置
    refresh_carMarker: function(marker, opt) {
      var that = this;
      if (marker) {
        if (opt.lon && opt.lat) {
          marker.setCoordinates({
            x: opt.lon,
            y: opt.lat
          });
        }
        if (opt.icon) {
          marker.setSymbol({
            markerFile: opt.icon,
            markerDx: 0,
            markerDy: 16
          });
        }
      }
    },
    // 锁定视窗
    lockWindowByLngLat: function(lng, lat) {
      var boolean = this.isGetBounds(lng, lat);
      if (!boolean) {
        this.maptalk.setCenter([lng, lat]);
      }
    },
    // 判断坐标点是否在地图可视范围内
    isGetBounds: function(lon, lat) {
      var view = this.maptalk.getExtent(); //获取当前地图的显示范围
      if (
        lon > view.xmin &&
        lon < view.xmax &&
        lat > view.ymin &&
        lat < view.ymax
      ) {
        return true; //在范围内
      } else {
        return false; ////在范围外
      }
    },
    // 移除所有车辆图标
    clearAllCarMarker: function() {
      for (var i = 0; i < this.carMarkerArr.length; i++) {
        this.carMarkerArr[i].remove();
      }
      this.carMarkerArr = [];
      console.log("执行了吗");
    },
    showCarInfoBox(marker, car, pos) {}
  }
};
</script>

<style lang="less" scoped>
.mapTalk {
  width: 100%;
  height: 100%;
  position: relative;
}
/deep/.container {
  width: 100%;
  height: 100%;
  .map_machineNameBox {
    background: red;
    padding: 4px;
    border-radius: 4px;
    white-space: nowrap;
    border: 1px solid #dfdfdf;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    width: 100px;
    height: 100px;
  }
  .maptalks-zoom {
    border: 1px solid rgba(221, 221, 221, 1);
    margin-top: 32px;
    background: #fff;
    .maptalks-zoom-slider {
      margin-top: 6px;
    }
    .maptalks-zoom-slider-box {
      background: #fff;
      border: 1px solid #fff;
    }
    .maptalks-zoom-slider a.maptalks-zoom-zoomin,
    .maptalks-zoom-slider a.maptalks-zoom-zoomout {
      background: #fff;
      border: 1px solid #fff;
      color: #666;
    }
    .maptalks-zoom-slider-box
      .maptalks-zoom-slider-ruler
      .maptalks-zoom-slider-reading {
      background: #3587d9;
    }
    .maptalks-zoom-slider-box .maptalks-zoom-slider-ruler {
      background: #dfdfdf;
    }
  }
}

.title {
  position: absolute;
  left: 0;
  top: 0;
  height: 28px;
  line-height: 28px;
  background: #fff;
  width: 100%;
  z-index: 999;
  border: 1px solid #eee;
  border-radius: 5px;
  .title_l {
    margin-left: 16px;
    font-size: 12px;
    color: #666;
    line-height: 28px;
  }
  .title_r {
    margin-right: 24px;
    margin-top: 5px;
    position: relative;
  }
  .mapSelect {
    position: absolute;
    left: -42px;
    top: 20px;
    width: 80px;
    background: #fff;
    padding: 6px 0;
    border: 1px solid #dedede;
    font-size: 12px;
    color: #666;
    .tabSelect {
      font-size: 12px;
      color: #666;
      line-height: 24px;
    }
    .active {
      color: #49a0ff;
    }
  }
}
</style>
