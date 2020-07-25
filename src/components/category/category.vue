<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    分类管理、{{titleName}}
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
                    @click="deleteCategorys"
                >批量删除</el-button>
                <el-input
                    v-model="query.name"
                    placeholder="分类名"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="categoryList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="分类名" align="center"></el-table-column>
                <el-table-column prop="caption" label="副标题" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.image"
                            :preview-src-list="[scope.row.image]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="级别" align="center"></el-table-column>
                <el-table-column prop="goodsNum" label="商品数量" align="center"></el-table-column>
                <el-table-column label="导航栏" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isNav"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="updateIsNav(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="热门" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isHot"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="updateIsHot(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isShow"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="updateIsShow(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="设置" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-show="level!==3"
                            type="text"
                            icon="el-icon-edit"
                            @click="addChildren(scope.$index, scope.row)"
                        >新增下级</el-button>
                        <el-button
                            v-show="level!==3"
                            type="text"
                            icon="el-icon-edit"
                            @click="goChildrenPage(scope.row)"
                        >查看下级</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="deleteCategory(scope.$index, scope.row)"
                        >转移商品</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
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
                            @click="deleteCategory(scope.$index, scope.row)"
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
        <el-dialog :title="title" :visible.sync="editVisible" width="50%">
            <el-form ref="categoryForm" :model="categoryForm" :rules="rules" label-width="150px">
                <el-form-item label="分类名称" required prop="name">
                    <el-input
                        v-model="categoryForm.name"
                        placeholder="请输入分类名称"
                        class="handle-input"
                    ></el-input>
                </el-form-item>
                <el-form-item label="副标题" required prop="caption">
                    <el-input
                        v-model="categoryForm.caption"
                        placeholder="请输入副标题"
                        class="handle-input"
                    ></el-input>
                </el-form-item>
                <el-form-item label="上级分类">
                    <el-select
                        v-model="categoryForm.parentId"
                        no-match-text="请选择"
                        placeholder="请选择"
                    >
                        <el-option
                            disabled
                            v-for="item in selectCategory"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
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
                <el-form-item label="排序">
                    <el-input
                        type="number"
                        v-model="categoryForm.seq"
                        placeholder="请输入序号"
                        class="handle-input"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否显示" required prop="isShow">
                    <el-radio-group v-model="categoryForm.isShow">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否首页导航栏" required prop="isNav">
                    <el-radio-group v-model="categoryForm.isNav">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否首页热门" required prop="isHot">
                    <el-radio-group v-model="categoryForm.isHot">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择模板">
                    <el-select
                        v-model="categoryForm.templateId"
                        no-match-text="请选择"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in allTemplate"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
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
import {
    categoryPage,
    add,
    update,
    deleteCategory,
    deleteCategorys,
    listAllCategory,
    updateIsShow,
    updateIsNav,
    updateIsHot
} from '../../api/category';
import { listAllTemplate } from '../../api/template';
import { upload } from '../../api/upload';

export default {
    name: 'CategoryComponent',
    data() {
        return {
            query: {
                name: '',
                parentId: this.parentId,
                pageNum: 1,
                pageSize: 10
            },
            selectCategory: [{ id: 0, name: '根分类' }],
            allTemplate: [],
            categoryList: [],
            multipleSelection: [],
            fileList: [],
            editVisible: false,
            total: 0,
            categoryForm: {
                isShow: true,
                isNav: true
            },
            showIndex: -1,
            title: '创建',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入分类名',
                        trigger: 'change'
                    },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
                ],
                isShow: [
                    {
                        required: true,
                        message: '请选择是否显示',
                        trigger: 'change'
                    }
                ],
                isNav: [
                    {
                        required: true,
                        message: '是否显示在导航栏',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    props: {
        parentId: Number,
        titleName: String,
        level: Number
    },
    computed: {
        //计算属性
    },
    created() {
        if (this.level != 1) {
            this.query.parentId = Number(this.$route.query.parentId);
            this.categoryForm.parentId = Number(this.$route.query.parentId);
        }

        this.getCategoryPage();
        this.listAllTemplate();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getCategoryPage() {
            categoryPage(this.query).then(res => {
                if (res.code == 200) {
                    if (res.data.list && res.data.list.length > 0) {
                        this.categoryList = res.data.list;
                        this.categoryList.map(c => {
                            c.level = this.level;
                        });
                    } else {
                        this.categoryList = [];
                    }
                    this.total = res.data.total || 0;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        handleUploadRemove(file, fileList) {
            this.fileList = [];
            this.categoryForm.image = '';
        },
        handleUploadSuccess(res) {
            //后台返回数据
            if (res.code === 200) {
                this.fileList.push(res.data);
                this.categoryForm.image = res.data.url;
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
            this.categoryForm = {
                isShow: true,
                isNav: true,
                parentId: 0
            };
            this.selectCategory = [{ id: 0, name: '根分类' }];
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.title = '修改';
            this.selectCategory = [{ id: row.id, name: row.name }];
            this.showIndex = index;
            this.categoryForm = row;
            this.editVisible = true;
        },
        addChildren(index, row) {
            this.selectCategory = [{ id: row.id, name: row.name }];
            this.categoryForm = { isShow: true, isNav: true, parentId: row.id };
            this.title = '添加' + row.name + '下家';
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['categoryForm'].validate(valid => {
                if (valid) {
                    if (this.categoryForm.id) {
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
            this.categoryForm = { isShow: true, isNav: true };
            this.$refs['categoryForm'].resetFields();
        },
        //添加操作
        async add() {
            await add(this.categoryForm).then(res => {
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
            await update(this.categoryForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.categoryList, this.showIndex, this.categoryForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteCategory(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteCategory(row.id).then(res => {
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
        deleteCategorys() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let CategoryIds = this.multipleSelection.map(data => {
                    return data.id;
                });
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteCategorys(CategoryIds).then(res => {
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
            this.getCategoryPage();
        },
        listAllTemplate() {
            listAllTemplate().then(res => {
                this.allTemplate = res.data;
            });
        },
        updateIsShow(row) {
            updateIsShow(row).then(res => {
                if (res.code === 200) {
                    this.handleSearch();
                } else {
                    this.$message.error(res.message);
                }
            });
        },
         updateIsHot(row) {
            updateIsHot(row).then(res => {
                if (res.code === 200) {
                    this.handleSearch();
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        updateIsNav(row) {
            updateIsNav(row).then(res => {
                if (res.code === 200) {
                    this.handleSearch();
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        goChildrenPage(row) {
            this.$router.push({
                path: './category' + (this.level + 1),
                query: {
                    parentId: row.id
                }
            });
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
