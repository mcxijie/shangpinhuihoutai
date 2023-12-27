<script>
import SpuForm from '@/views/product/Spu/SpuForm/index.vue'
import SkuForm from '@/views/product/Spu/SkuForm/index.vue'

export default {
  name: 'Spu',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      scene: 0
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
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    changeScene({scene, flag}) {
      this.scene = scene;
      if (flag === "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message({type: "success", message: "删除成功"});
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
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
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId"></CategorySelect>
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
              <hint-button icon="el-icon-plus" size="mini" title="添加sku" type="success"
                           @click="addSku(row)"></hint-button>
              <hint-button icon="el-icon-edit" size="mini" title="修改spu" type="warning"
                           @click="updateSpu(row)"></hint-button>
              <hint-button icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" type="info"></hint-button>
              <el-popconfirm title="" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" icon="el-icon-delete" size="mini" title="删除spu"
                             type="danger"></hint-button>
              </el-popconfirm>
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
      <SkuForm v-show="scene === 2" ref="sku"></SkuForm>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
