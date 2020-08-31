<template>
  <div class="userTree">
    <div class="search">
      <el-input placeholder="请输入客户名称" v-model="userName" size="mini">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="userTree_c">
      <div v-if="clientArr.length > 0" class="treeInfo">
        <el-tree
          :props="props"
          :load="loadNode"
          node-key="userId"
          :default-expanded-keys="[id]"
          :highlight-current="true"
          lazy
          :expand-on-click-node="false"
          @node-click="getNode"
          @node-expand="getExpand"
          @node-collapse="getColse"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="userTreeTitle">{{ node.label }}</span>
            <span class="allNum">[{{ data.totalNum }}</span>
            <span class="placeHolder">/</span>
            <span class="underNum">{{ data.underNum }}]</span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "userTree",
  props: {
    root: null
  },
  data() {
    return {
      iconClass: "el-icon-circle-plus-outline",
      id: null,
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      clientArr: [],
      userName:'',
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {},
  methods: {
    getUserInfo(node, resolve) {
      var url = "/structure/getChildStruc.do";
      this.$client.post(url).then(res => {
        console.log("节点数据：", res);
        if (res.ret) {
          var obj = res.data[0];
          this.id = obj.userId;
          obj.leaf = !obj.hasChild;
          this.clientArr.push(obj);
        }
      });
    },
    getExpand() {},
    getColse() {},
    getNode(item) {
      this.$emit("getNode", {
        multipleSelection: item
      });
    },
    loadNode(node, resolve) {
      var that = this;
      console.log("懒加载：", node, this.clientArr);
      if (node.level === 0) {
        return resolve(this.clientArr);
      }
      if (node.level > 0) {
        this.getChildrenNode(node, resolve);
      }
    },
    getChildrenNode(node, resolve) {
      var url = `/structure/getChildStruc.do`;
      this.$client
        .post(url, {
          targetUserId: node.data.userId
        })
        .then(res => {
          console.log("11111:", res);
          if (res.ret) {
            var arr = res.data;
            arr.map(item => {
              item.leaf = !item.hasChild;
            });
            resolve(arr);
          } else {
            window.alert("网络故障，请检查网络设置");
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.userTree {
  height: 100%;
  width: 100%;
  .search{
    width:287px;
  }
  .userTree_c {
    height: 100%;
    width: 100%;
    /deep/.treeInfo {
      height: 100%;
      min-width: 286px;
      width: 100%;
      overflow-y: auto;
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: #ffe6b0;
      }
    }
  }
  .userTreeTitle,
  .allNum,
  .placeHolder,
  .underNum {
    height: 26px;
    font-size: 12px;
    line-height: 26px;
    display: inline-block;
  }
}
</style>
