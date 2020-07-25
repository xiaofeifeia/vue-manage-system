<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 字典管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="mr10" @click="handleAdd">添加</el-button>
                <el-input
                    v-model="query.dictCode"
                    placeholder="字典号"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="dictList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="dictCode" label="code" align="center"></el-table-column>
                <el-table-column prop="dictValue" label="value" align="center"></el-table-column>
                <el-table-column prop="createdate" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="400" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="goDictItem(scope.row)"
                        >字典条目列表</el-button>
                         <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteDict(scope.$index, scope.row)"
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
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="dictForm" :model="dictForm" :rules="rules" label-width="70px">
                <el-form-item label="code" required prop="dictCode">
                    <el-input v-model="dictForm.dictCode" placeholder="请输入编号"></el-input>
                </el-form-item>
              
                <el-form-item label="value">
                    <el-input v-model="dictForm.dictValue" placeholder="请输入值"></el-input>
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
import { findPage, add, update, deleteDict} from '../api/dict';
export default {
    name: 'dictTable',
    data() {
        return {
            query: {
                dictCode: '',
                pageNum: 1,
                pageSize: 10
            },
            dictList: [],
            multipleSelection: [],
            editVisible: false,
            total: 0,
            dictForm: {
            },
            showIndex: -1,
            title: '创建',
            rules: {
                dictCode: [
                    {
                        required: true,
                        message: '请输入dictCode',
                        trigger: 'change'
                    },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
                ],
                 dictValue: [
                    {
                        required: true,
                        message: '请输入dictValue',
                        trigger: 'change'
                    },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        //计算属性
    },
    created() {
        this.getDictPage();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getDictPage() {
            findPage(this.query).then(res => {
                if (res.code == 200) {
                    this.dictList = res.data.list;
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
            this.dictForm = { };
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.showIndex = index;
            this.dictForm = row;
            this.title = '修改';
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['dictForm'].validate(valid => {
                if (valid) {
                    if (this.dictForm.id) {
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
            this.dictForm = {};
            this.$refs['dictForm'].resetFields();
        },
        //添加操作
        async add() {
            await add(this.dictForm).then(res => {
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
            await update(this.dictForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.dictList, this.showIndex, this.dictForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteDict(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteDict(row.id).then(res => {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.$set(this.dictList, index, this.dictForm);
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                })
                .catch(() => {});
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getDictPage();
        },
        goDictItem(row){
            this.$router.push({
                path:'./dictItem',
                query:{
                    "dictId":row.id
                }
            })
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
