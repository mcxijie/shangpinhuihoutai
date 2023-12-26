<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {},
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initSpuData(spu) {
      const spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        this.spuImageList = spuImageResult.data;
      }
      const saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    }
  }
}
</script>

<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" value="">
          <el-option label="魅族" value="魅族"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="描述" rows="4" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt="" width="100%">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还有3未选择" value="">
          <el-option label="颜色" value="颜色"></el-option>
        </el-select>
        <el-button icon="el-icon-plus" type="primary">添加销售属性</el-button>
        <el-table border style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
          <el-table-column label="属性名" prop="prop" width="width"></el-table-column>
          <el-table-column label="属性值名称列表" prop="prop" width="width"></el-table-column>
          <el-table-column label="操作" prop="prop" width="width"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
