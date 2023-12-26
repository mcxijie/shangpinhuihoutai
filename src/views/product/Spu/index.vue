<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
  name: 'Spu',
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true,
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
    }
  },
  methods: {
    getCategoryId({categoryId, level}) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const {page, limit, category3Id} = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
    },
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    changeScene(scene) {
      this.scene = scene;
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
}
</script>

<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect :show="!show" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button :disabled="!category3Id" icon="el-icon-plus" type="primary" @click="addSpu">添加SPU</el-button>
        <el-table :data="records" border style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="spu名称" prop="spuName" width="width"></el-table-column>
          <el-table-column label="spu描述" prop="description" width="width"></el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <hint-button icon="el-icon-plus" size="mini" title="添加sku" type="success"></hint-button>
              <hint-button icon="el-icon-edit" size="mini" title="修改spu" type="warning"
                           @click="updateSpu(row)"></hint-button>
              <hint-button icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" type="info"></hint-button>
              <hint-button icon="el-icon-delete" size="mini" title="删除spu" type="danger"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          :total="total"
          layout="prev,pager,next,jumper,->,sizes,total"
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene === 2"></SkuForm>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
