<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    规格参数模板
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
                    @click="deleteTemplates"
                >批量删除</el-button>
                <el-input
                    v-model="query.name"
                    placeholder="模板名称"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="templateList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="specNum" label="规格数量" align="center"></el-table-column>
                <el-table-column prop="paraNum" label="参数数量" align="center"></el-table-column>
                <el-table-column label="设置" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="goSpecPage(scope.row)"
                        >规格列表</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="goParaPage(scope.row)"
                        >参数列表</el-button>
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
                            @click="deleteTemplate(scope.$index, scope.row)"
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
            <el-form ref="templateForm" :model="templateForm" :rules="rules" label-width="150px">
                <el-form-item label="模板名称" required prop="name">
                    <el-input
                        v-model="templateForm.name"
                        placeholder="请输入模板名称"
                        class="handle-input"
                    ></el-input>
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
import { listAllTemplate, templatePage, add, update, deleteTemplate, deleteTemplates } from '../../api/template';
export default {
    name: 'templateTable',
    data() {
        return {
            query: {
                name: '',
                pageNum: 1,
                pageSize: 10
            },
            multipleSelection: [],
            editVisible: false,
            templateList: [],
            total: 0,
            templateForm: {},
            showIndex: -1,
            title: '创建',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'change'
                    },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
                ]
            }
        };
    },
    created() {
        this.getTemplatePage();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getTemplatePage() {
            templatePage(this.query).then(res => {
                if (res.code == 200) {
                    if (res.data.list && res.data.list.length > 0) {
                        this.templateList = res.data.list;
                        this.templateList.map(c => {
                            c.level = this.level;
                        });
                    } else {
                        this.templateList = [];
                    }
                    this.total = res.data.total || 0;
                } else {
                    this.$message.error(res.message);
                }
            });
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
            this.templateForm = {};
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.title = '修改';
            this.showIndex = index;
            this.templateForm = row;
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['templateForm'].validate(valid => {
                if (valid) {
                    if (this.templateForm.id) {
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
            this.templateForm = {};
            this.$refs['templateForm'].resetFields();
        },
        //添加操作
        async add() {
            await add(this.templateForm).then(res => {
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
            await update(this.templateForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.templateList, this.showIndex, this.templateForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteTemplate(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteTemplate(row.id).then(res => {
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
        deleteTemplates() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let templateIds = this.multipleSelection.map(data => {
                    return data.id;
                });
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteTemplates(templateIds).then(res => {
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
            this.getTemplatePage();
        },
        goSpecPage(row) {
            this.$router.push({
                path: './spec',
                query: {
                    templateId: row.id
                }
            });
        },
        goParaPage(row) {
            this.$router.push({
                path: './para',
                query: {
                    templateId: row.id
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
