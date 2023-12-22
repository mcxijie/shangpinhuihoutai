<script>

export default {
  name: 'tradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: []
    }
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      const {page, limit} = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    }
  }
}
</script>

<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" style="margin: 10px 0px" type="primary">添加</el-button>
      <el-table :data="list" border style="width: 100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column label="品牌名词" prop="tmName" width="width"></el-table-column>
        <el-table-column label="品牌LOGO" prop="logoUrl" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="prop" width="width">
          <template slot-scope="{row,$index}">
            <el-button icon="el-icon-edit" size="mini" type="warning">修改</el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-count="7"
        :page-size="limit"
        :page-sizes="[3, 5, 10]"
        :total="total"
        layout="prev, pager, next, jumper,->,sizes,total"
        style="margin-top: 20px;textAlign:center"
        @current-change="getPageList"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
