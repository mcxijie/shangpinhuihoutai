<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: false,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      }
    }
  },
  methods: {
    getCategoryId({categoryId, level}) {
      if (level === 1) {
        console.log(categoryId);
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const {category1Id, category2Id, category3Id} = this;
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: undefined,
        valueName: ""
      })
    }
  }
}
</script>

<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button :disabled="!category3Id" icon="el-icon-plus" type="primary" @click="isShowTable=false">添加属性
        </el-button>
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue" style="margin: 0px 20px"
                      type="success">{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="150">
            <template slot-scope="{row,$index}">
              <el-button icon="el-icon-edit" size="mini" type="warning" @click="isShowTable=false"></el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" :model="attrInfo" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attrInfo.attrName" icon="el-icon-plus" type="primary" @click="addAttrValue">添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" border style="width: 100%;margin: 20px 0px">
          <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="属性值名称" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-button icon="el-icon-delete" size="mini" type="danger"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
