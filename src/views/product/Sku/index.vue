<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      skuInfo: [],
      show: false,
    }
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const {page, limit} = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code === 200) {
        row.isSale = 1;
        this.$message({
          message: '上架成功',
          type: 'success'
        });
        this.getSkuList();
      }
    },
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code === 200) {
        row.isSale = 0;
        this.$message({
          message: '下架成功',
          type: 'success'
        });
        this.getSkuList();
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    async getSkuInfo(row) {
      this.show = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    }
  }
}
</script>

<template>
  <div>
    <el-table :data="records" border style="width: 100%">
      <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="width"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px">
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格" prop="price" width="80"></el-table-column>
      <el-table-column label="操作" prop="sp2" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale === 0" icon="el-icon-sort-down" size="mini" type="success"
                     @click="sale(row)"></el-button>
          <el-button v-else icon="el-icon-sort-up" size="mini" type="success" @click="cancel(row)"></el-button>
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="edit"></el-button>
          <el-button icon="el-icon-info" size="mini" type="info" @click="getSkuInfo(row)"></el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger"></el-button>
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
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <el-drawer :show-close="false" :visible.sync="show" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right: 10px"
                    type="success">{{ attr.attrId }}-{{ attr.valueId }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>


<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>

