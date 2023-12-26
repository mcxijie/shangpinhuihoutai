<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
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
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
    },
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      if (row.valueName.trim() === "") {
        this.$message("请你输入正常属性值")
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepat) {
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== "") {
          delete item.flag;
          return true;
        }
      });
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.getAttrList();
      } catch (error) {
        this.$message({
          type: "error",
          message: "保存失败"
        });
      }
    }
  }
}
</script>

<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button :disabled="!category3Id" icon="el-icon-plus" type="primary" @click="addAttr">添加属性
        </el-button>
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin: 0px 20px"
                      type="success">{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="150">
            <template slot-scope="{row,$index}">
              <el-button icon="el-icon-edit" size="mini" type="warning" @click="updateAttr(row)"></el-button>
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
              <el-input v-if="row.flag" v-model="row.valueName" placeholder="请输入属性值名称" size="mini"
                        :ref="$index" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else style="display: block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="attrInfo.attrValueList.length < 1" type="primary" @click="addOrUpdateAttr">保存
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
