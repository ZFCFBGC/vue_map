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
                <div v-for="car in item.cars" class="machineName">
                  <!-- 未激活 -->
                  <div class="unused" v-if="!car.activeTime">
                    <span>{{ car.machineName }}</span>
                  </div>
                  <!-- 欠费 -->
                  <div class="arrears" v-else-if="car.serviceState > 0">
                    <span>{{ car.machineName }}</span>
                  </div>
                  <div class="activation" v-else-if="car.carStatus">
                    <span
                      :class="
                        car.carStatus.online ? 'onlineStatus' : 'offlineStatus'
                      "
                      >{{ car.machineName }}</span
                    >
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
          this.deviceArr.map(item => {
            if (item.cars) {
              item.cars.map(info => {
                if (info.activeTime && info.serviceState <= 0) {
                  that.carInfoArr.push(info);
                }
              });
            }
            return;
          });
          this.$refs.myMap.showCar(that.carInfoArr);
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
      this.getDevice(0);
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
          .unused {
            font-size: 12px;
            color: #505050;
          }
          .arrears {
            font-size: 12px;
            color: #505050;
          }
          .activation {
            font-size: 12px;
            .onlineStatus {
              color: #007bee;
            }
            .offlineStatus {
              color: #505050;
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
