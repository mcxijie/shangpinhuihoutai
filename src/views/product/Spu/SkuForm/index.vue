<script>

export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      imageList: []
    }
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code === 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id);
      if (result2.code === 200) {
        this.attrInfoList = result2.data;
      }
    },
    handleSelectionChange(params) {
      this.imageList = params;
    },
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      })
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScenes", 0);
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      const {attrInfoList, skuInfo, spuSaleAttrList, imageList} = this;
      console.log(imageList);
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({attrId, valueId});
        }
        return prev;
      }, []);
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId, saleAttrValueId});
        }
        return prev;
      }, []);
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      });
      console.log(skuInfo);
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code === 200) {
        this.$message({type: 'success', message: '添加SKU成功'})
        this.$emit('changeScenes', 0);
      } else {
        this.$message({type: 'error', message: '添加SKU失败'})
      }
    }

  }
}
</script>

<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" rows="4" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"
                         :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"
                         :label="saleAttrValue.saleAttrValueName"
                         :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="spuImageList" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column label="label" prop="prop" type="selection" width="80"></el-table-column>
          <el-table-column label="图片" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width"></el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
