<template>
  <div class="index">
    <div class="header"></div>
    <div class="content clearfix">
      <div class="cont_l fl">
        <div class="swdTree">
          <user-tree @getNode="getNode"></user-tree>
        </div>
        <div class="device">
          <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item
              v-for="item in deviceArr"
              :name="item.carGroupId"
              :key="item.carGroupId"
            >
              <template slot="title">
                {{ item.name ? item.name : "默认分组" }}
                <span>&nbsp;&nbsp;(&nbsp;{{ item.allCount }}&nbsp;)</span>
              </template>
              <div v-if="item.cars" class="allDevice">
                <div v-for="car in item.cars" class="machineName" @click="openInfo(car)">
                  <!-- 未激活 -->
                  <div class="unused clearfix" v-if="!car.activeTime">
                    <div class="fl unuseAvatar">
                      <img
                        src="../../../static/images/tree/u_offline.gif"
                        alt=""
                      />
                    </div>
                    <div class="fl unuseTitle">{{ car.machineName }}</div>
                    <div class="fr unuseIcon">
                      <img
                        src="../../../static/images/monitor/unuse.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <!-- 欠费 -->
                  <div
                    class="arrears clearfix"
                    v-else-if="car.serviceState > 0"
                  >
                    <div class="fl arrearsAvatar">
                      <img
                        src="../../../static/images/tree/u_offline.gif"
                        alt=""
                      />
                    </div>
                    <div class="fl arrearsTitle">{{ car.machineName }}</div>
                    <div class="fr arrearsIcon">
                      <img
                        src="../../../static/images/monitor/expire.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="activation clearfix" v-else-if="car.carStatus">
                    <div
                      class="fl activationAvatar"
                      v-if="!car.carStatus.online"
                    >
                      <img
                        src="../../../static/images/tree/u_offline.gif"
                        alt=""
                      />
                    </div>
                    <div
                      class="fl activationAvatar"
                      v-if="car.carStatus.online"
                    >
                      <img
                        src="../../../static/images/tree/u_online.gif"
                        alt=""
                      />
                    </div>
                    <div
                      class="fl"
                      :class="
                        car.carStatus.online ? 'onlineStatus' : 'offlineStatus'
                      "
                    >
                      {{ car.machineName }}
                    </div>
                    <div class="fr activationIcon" v-if="!car.carStatus.online">
                      <img
                        src="../../../static/images/monitor/offline.png"
                        alt=""
                      />
                    </div>
                    <div class="fr activationIcon" v-if="car.carStatus.online">
                      <img
                        src="../../../static/images/monitor/stop.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="mapContainer fr">
        <gqg-map ref="myMap"></gqg-map>
      </div>
    </div>
  </div>
</template>
<script>
import gqgMap from "@/components/map/map.vue";
import userTree from "@/components/userTree/userTree.vue";
export default {
  components: {
    gqgMap,
    userTree
  },
  data() {
    return {
      activeNames: [0],
      deviceArr: [],
      targetUserId: null,
      carInfoArr: []
    };
  },
  created() {
    this.getDevice(0);
  },
  mounted() {},
  methods: {
    getDevice(groupId) {
      var that = this;
      var url = "/structure/getCarGroupAndStatus.do";
      var targetUserId = this.targetUserId
        ? this.targetUserId
        : this.$cookie.get("userId");
      var param = {
        targetUserId: targetUserId,
        groupId: groupId,
        mapType: 1
      };
      this.$client.post(url, param).then(res => {
        if (res.ret) {
          this.deviceArr = res.data;
          //处理数据，去除未激活和欠费设备
          this.carInfoArr = [];
          this.deviceArr.map(item => {
            if (item.cars && item.cars.length > 0) {
              item.cars.map(info => {
                if (info.activeTime && info.serviceState <= 0) {
                  that.carInfoArr.push(info);
                }
              });
            }
            return;
          });
          if (that.carInfoArr.length > 0) {
            this.$refs.myMap.showCar(that.carInfoArr);
          }
        } else {
          window.alert("网络错误，请刷新");
        }
      });
    },
    handleChange(val) {
      console.log("val:", val);
      if (val || val === 0) {
        this.activeNames = [val];
        this.getDevice(val);
      } else {
        console.log("关闭折叠面板");
      }
    },
    getNode(info) {
      console.log("信息", info);
      this.targetUserId = info.userId;
      this.$refs.myMap.clearAllCarMarker();
      this.getDevice(0);
    },
    openInfo(car){
      console.log('car：',car)
      if(car.activeTime&&car.serviceState<=0){
        // 打开车辆信息框
         this.$refs.myMap.car_marker(car.carStatus,true);
      }else{
        //未激活，过期
      }
    }
  }
};
</script>
<style scoped lang="less">
.index {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .header {
    background: #3489d9;
    height: 70px;
    width: 100%;
    overflow: hidden;
  }
  .content {
    width: 100%;
    height: 890px;
    .cont_l {
      width: 16%;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid #ddd;
      box-shadow: #3489d9;
      .swdTree {
        width: 100%;
        padding-left: 2%;
        max-height: 240px;
        min-height: 160px;
        overflow-y: auto;
        box-sizing: border-box;
        border-bottom: 3px solid #ddd;
        padding-bottom: 10px;
      }
      /deep/.device {
        width: 100%;
        padding: 0 2%;
        box-sizing: border-box;
        margin-top: 10px;
        cursor: pointer;
        .el-collapse-item__header {
          height: 32px;
          line-height: 32px;
        }
        .el-collapse-item__header.is-active {
          border-bottom-color: #ebeef5;
        }
        .el-collapse-item__content {
          padding-bottom: 0px;
        }
        .allDevice {
          max-height: 400px;
          overflow-y: auto;
        }
        .machineName {
          height: 28px;
          line-height: 28px;
          margin-left: 10px;
          color: #333;
          font-size: 12px;
          cursor: pointer;
          .unused {
            cursor: pointer;
            font-size: 12px;
            color: #505050;
            padding-right: 12px;
            .unuseAvatar {
              margin-top: 6px;
            }
            .unuseTitle {
              font-size: 12px;
            }
          }
          .arrears {
            cursor: pointer;
            font-size: 12px;
            color: #505050;
            padding-right: 12px;
            .arrearsAvatar {
              margin-top: 6px;
            }
            .arrearsTitle {
              font-size: 12px;
            }
          }
          .activation {
            cursor: pointer;
            font-size: 12px;
            padding-right: 12px;
            .onlineStatus {
              color: #007bee;
              font-size: 12px;
            }
            .offlineStatus {
              color: #505050;
              font-size: 12px;
            }
            .activationAvatar {
              margin-top: 6px;
            }
          }
        }
      }
    }
    .mapContainer {
      width: 84%;
      height: 890px;
    }
  }
}
</style>
