<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 门店管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="mr10" @click="handleAdd">添加</el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="mr10"
                    @click="deleteStores"
                >批量删除</el-button>
                <el-input
                    v-model="query.name"
                    placeholder="门店名"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="storeList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="门店名" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                <el-table-column label="LOGO" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.image"
                            :preview-src-list="[scope.row.image]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteStore(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form ref="storeForm" :model="storeForm" :rules="rules" label-width="125px">
                <el-form-item label="门店名" required prop="name">
                    <el-input v-model="storeForm.name" placeholder="请输入门店名" class="handle-input"></el-input>
                </el-form-item>

                <el-form-item label="地址" required prop="address">
                    <el-input v-model="storeForm.address" placeholder="请输入地址" class="handle-input"></el-input>
                </el-form-item>

                <el-form-item label="联系电话" required prop="phone">
                    <el-input v-model="storeForm.phone" placeholder="联系电话" class="handle-input"></el-input>
                </el-form-item>

                <el-form-item label="配送时间" required prop="deliveryTime">
                    <el-input
                        v-model="storeForm.deliveryTime"
                        placeholder="配送时间"
                        class="handle-input"
                    ></el-input>
                </el-form-item>

                <el-form-item label="配送信息" required prop="deliveryInfo">
                    <el-input
                        v-model="storeForm.deliveryInfo"
                        placeholder="配送信息"
                        class="handle-input"
                    ></el-input>
                </el-form-item>

                <el-form-item label="介绍" required prop="address">
                    <el-input
                        type="textarea"
                        v-model="storeForm.introduction"
                        class="handle-input"
                        rows="4"
                        placeholder="请输入介绍"
                    ></el-input>
                </el-form-item>

                <el-form-item label="LOGO">
                    <el-upload
                        action="http://localhost:8874/upload"
                        :on-remove="handleUploadRemove"
                        :on-success="handleUploadSuccess"
                        :before-upload="handleUploadBefore"
                        :file-list="fileList"
                        list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="resetForm">重置</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { storePage, add, update, deleteStore, deleteStores } from '../../api/store';
import { upload } from '../../api/upload';
export default {
    name: 'StoreTable',
    data() {
        return {
            query: {
                name: '',
                pageNum: 1,
                pageSize: 10
            },
            fileList: [],
            storeList: [],
            multipleSelection: [],
            editVisible: false,
            total: 0,
            storeForm: {},
            showIndex: -1,
            title: '创建',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入门店名',
                        trigger: 'change'
                    },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }
                ],
                address: [
                    {
                        required: true,
                        message: '请输入地址',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
        //计算属性
    },
    created() {
        this.getStorePage();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getStorePage() {
            storePage(this.query).then(res => {
                if (res.code == 200) {
                    this.storeList = res.data.list;
                    this.total = res.data.total || 0;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        handleUploadRemove(file, fileList) {
            this.fileList = [];
        },
        handleUploadSuccess(res) {
            //后台返回数据
            if (res.code === 200) {
                this.fileList.push(res.data);
                this.StoreForm.image = res.data.url;
                this.$message.success('上传成功');
            } else {
                this.$message.error('上传失败');
            }
        },
        handleUploadBefore(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
                return false;
            }
            if (!isLt1M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
                return false;
            }
            return true;
        },
        // 触发搜索按钮
        handleSearch() {
            this.handlePageChange(1);
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            this.storeForm = {};
            this.fileList = [];
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.title = '修改';
            this.fileList = [];
            this.showIndex = index;
            this.storeForm = row;
            if (row.image) {
                this.fileList = [
                    {
                        name: row.image.split('/')[row.image.split('/').length - 1],
                        url: row.image
                    }
                ];
            }
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['storeForm'].validate(valid => {
                if (valid) {
                    if (this.storeForm.id) {
                        this.update();
                    } else {
                        this.add();
                    }
                    return true;
                }
                return false;
            });
        },
        resetForm() {
            this.storeForm = {};
            this.fileList = [];
            this.$refs['storeForm'].resetFields();
        },
        //添加操作
        async add() {
            await add(this.storeForm).then(res => {
                if (res.code === 200) {
                    this.$message.success('添加成功');
                    this.editVisible = false;
                    this.handlePageChange(1);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //修改操作
        async update() {
            await update(this.storeForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.storeList, this.showIndex, this.storeForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteStore(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteStore(row.id).then(res => {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.handleSearch();
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                })
                .catch(() => {});
        },
        //批量删除
        deleteStores() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let StoreIds = this.multipleSelection.map(data => {
                    return data.id;
                });
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteStores(StoreIds).then(res => {
                        if (res.code === 200) {
                            this.$message.success(`删除成功`);
                            this.multipleSelection = [];
                            this.handleSearch();
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getStorePage();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
