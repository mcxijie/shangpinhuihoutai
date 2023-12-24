<script>

export default {
  name: 'tradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      }
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
    },
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.tmForm = {...row};
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    async addOrUpdateTradeMark() {
      this.dialogFormVisible = false;
      let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm);
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
        });
        this.getPageList(this.tmForm.id ? this.page : 1);
      } else {
        this.$message.error(result.message);
      }
    }
  }
}
</script>

<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" style="margin: 10px 0px" type="primary" @click="showDialog">添加</el-button>
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
            <el-button icon="el-icon-edit" size="mini" type="warning" @click="updateTradeMark(row)">修改</el-button>
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

      <el-dialog :title="this.tmForm.id ?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
        <el-form :model="tmForm" style="width: 80%">
          <el-form-item label="品牌名称" label-width="100px">
            <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌名称LOGO" label-width="100px">
            <el-upload
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              action="/dev-api/admin/product/fileUpload"
              class="avatar-uploader">
              <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
