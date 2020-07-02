<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    规格列表
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
                    @click="deleteSpecs"
                >批量删除</el-button>
                <el-input
                    v-model="query.name"
                    placeholder="输入名称"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="specList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="规格名称" align="center"></el-table-column>
                <el-table-column prop="templateName" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="options" label="可选值列表" align="center"></el-table-column>
                <el-table-column prop="seq" label="排序" align="center"></el-table-column>
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
                            @click="deleteSpec(scope.$index, scope.row)"
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
            <el-form ref="specForm" :model="specForm" :rules="rules" label-width="150px">
                <el-form-item label="名称" required prop="name">
                    <el-input v-model="specForm.name" placeholder="请输入名称" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="选择模板" required prop="templateId">
                    <el-select v-model="specForm.templateId" no-match-text="请选择" placeholder="请选择">
                        <el-option
                            v-for="item in allTemplate"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性值可选值列表" required prop="options">
                    <el-input
                        type="textarea"
                        v-model="specForm.options"
                        placeholder="请输入"
                        rows="6"
                        resize="both"
                    ></el-input>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input
                        type="number"
                        v-model="specForm.seq"
                        placeholder="请输入序号"
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
import { specPage, add, update, deleteSpec, deleteSpecs } from '../../api/spec';
import { listAllTemplate } from '../../api/template';

export default {
    name: 'specTable',
    data() {
        return {
            query: {
                name: '',
                templateId: null,
                pageNum: 1,
                pageSize: 10
            },
            multipleSelection: [],
            editVisible: false,
            total: 0,
            specForm: {},
            specList: [],
            allTemplate: [],
            showIndex: -1,
            title: '创建',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'change'
                    },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
                ],
                options: [
                    {
                        required: true,
                        message: '请输入属性值可选值列表',
                        trigger: 'change'
                    }
                ],
                templateId: [
                    {
                        required: true,
                        message: '请选择模板',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    created() {
        if (this.$route.query && this.$route.query.templateId) {
            this.query.templateId = Number(this.$route.query.templateId);
            this.specForm.templateId = this.query.templateId;
        } else {
            this.query.templateId = null;
            this.specForm.templateId = null;
        }
        this.listAllTemplate();
        this.getSpecPage();
    },
    watch: {
        $route(to, from) {
            if (this.$route.query && this.$route.query.templateId) {
                this.query.templateId = Number(this.$route.query.templateId);
                this.specForm.templateId = this.query.templateId;
            } else {
                this.query.templateId = null;
                this.specForm.templateId = null;
            }
            this.listAllTemplate();
            this.getSpecPage();
        }
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getSpecPage() {
            specPage(this.query).then(res => {
                if (res.code == 200) {
                    if (res.data.list && res.data.list.length > 0) {
                        this.specList = res.data.list;
                    } else {
                        this.specList = [];
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
            this.specForm = { templateId: this.query.templateId };
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.title = '修改';
            this.showIndex = index;
            this.specForm = row;
            console.log(row);
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['specForm'].validate(valid => {
                if (valid) {
                    if (this.specForm.id) {
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
            this.$refs['specForm'].resetFields();
            this.specForm = { templateId: this.query.templateId };
        },
        //添加操作
        async add() {
            await add(this.specForm).then(res => {
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
            await update(this.specForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.SpecList, this.showIndex, this.specForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteSpec(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteSpec(row.id).then(res => {
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
        deleteSpecs() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let SpecIds = this.multipleSelection.map(data => {
                    return data.id;
                });
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteSpecs(SpecIds).then(res => {
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
            this.getSpecPage();
        },
        listAllTemplate() {
            listAllTemplate().then(res => {
                this.allTemplate = res.data;
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
