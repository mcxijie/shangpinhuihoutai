<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndAttrName: "",
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
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
        let listArr = spuImageResult.data;
        listArr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      const saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    handleInputConfirm(row) {
      const {baseSaleAttrId, inputValue} = row;
      if (inputValue.trim() === "") {
        this.$message("属性值不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue);
      if (!result) {
        this.$message("属性值不能重复");
        return;
      }

      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code === 200) {
        this.$message({type: "success", message: "保存成功"});
        this.$emit("changeScene", {scene: 0, flag: this.spu.id ? "修改" : "添加"});
      }
      Object.assign(this._data, this.$options.data());
    },
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      const saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    cancle() {
      this.$emit("changeScene", {scene: 0, flag: ""});
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    unSelectSaleAttr() {
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName;
        })
      });
    }
  }
}
</script>

<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" placeholder="描述" rows="4" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" alt="" width="100%">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name"
                     :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button :disabled="!attrIdAndAttrName" icon="el-icon-plus" type="primary" @click="addSaleAttr">添加销售属性
        </el-button>
        <el-table :data="spu.spuSaleAttrList" border style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="width"></el-table-column>
          <el-table-column label="属性值名称列表" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" :disable-transitions="false"
                      closable @close="row.spuSaleAttrValueList.splice(index,1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag"
                        size="small" @blur="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-button icon="el-icon-delete" size="mini" type="danger"
                         @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
