<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                    @click="deleteUsers"
                >批量删除</el-button>
                <el-select v-model="query.statusVal" multiple placeholder="请选择">
                    <el-option key="0" label="可用" :value="0"></el-option>
                    <el-option key="1" label="禁用" :value="1"></el-option>
                    <el-option key="2" label="删除" :value="2"></el-option>
                </el-select>
                <el-input
                    v-model="query.username"
                    placeholder="用户名"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="userList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                :cell-style="cellStyle"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column
                    prop="sourceType"
                    label="用户来源"
                    :formatter="sourceTypeFormatter"
                    align="center"
                ></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.headPic"
                            :preview-src-list="[scope.row.headPic]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    :formatter="statusFormatter"
                    align="center"
                ></el-table-column>
                <el-table-column prop="createDate" label="注册时间"></el-table-column>
                <el-table-column prop="lastLoginTime" label="最新登录时间"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="resetPwd(scope.$index, scope.row)"
                        >重置密码</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteUser(scope.$index, scope.row)"
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
            <el-form ref="userForm" :model="userForm" :rules="rules" label-width="70px">
                <el-form-item label="用户名" required prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-show="!userForm.userId">
                    <el-input
                        type="password"
                        v-model="userForm.password"
                        show-password
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="userForm.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input type="number" v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="userForm.address" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="状态" required prop="status">
                    <el-select v-model="userForm.status" clearable collapse-tags placeholder="请选择">
                        <el-option key="0" label="可用" :value="0"></el-option>
                        <el-option key="1" label="禁用" :value="1"></el-option>
                        <el-option key="2" label="删除" :value="2"></el-option>
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
import { userPage, add, update, deleteUser, resetPwd, deleteUsers } from '../api/user';
export default {
    name: 'userTable',
    data() {
        return {
            query: {
                username: '',
                statusVal: [0, 1],
                statusList: '',
                pageNum: 1,
                pageSize: 10
            },
            userList: [],
            multipleSelection: [],
            editVisible: false,
            total: 0,
            userForm: {
                sourceType: 0 //默认来自后台创建
            },
            showIndex: -1,
            title: '创建',
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'change'
                    },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'change'
                    }
                ],
                status: [
                    {
                        required: true,
                        message: '请选择状态',
                        trigger: 'change'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'change'
                    },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            }
        };
    },
    computed: {
        //计算属性
    },
    created() {
        this.setStatusList();
        this.getUserPage();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getUserPage() {
            userPage(this.query).then(res => {
                if (res.code == 200) {
                    this.userList = res.data.list;
                    this.total = res.data.total || 0;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        setStatusList() {
            this.query.statusList = this.query.statusVal.join(',');
        },
        // 触发搜索按钮
        handleSearch() {
            this.setStatusList();
            this.handlePageChange(1);
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        handleAdd() {
            this.userForm = { sourceType: 0 };
            this.title = '创建';
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.showIndex = index;
            this.userForm = row;
            this.title = '修改';
            this.editVisible = true;
        },
        // 保存编辑
        submitForm() {
            this.$refs['userForm'].validate(valid => {
                if (valid) {
                    if (this.userForm.userId) {
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
            this.userForm = {};
            this.$refs['userForm'].resetFields();
        },
        //添加操作
        async add() {
            await add(this.userForm).then(res => {
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
            await update(this.userForm).then(res => {
                if (res.code === 200) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.userList, this.showIndex, this.userForm);
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 删除操作
        deleteUser(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteUser(row.userId).then(res => {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.$set(this.userList, index, this.userForm);
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                })
                .catch(() => {});
        },
        //批量删除
        deleteUsers() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let userIds = this.multipleSelection.map(data => {
                    return data.userId;
                });
                deleteUsers(userIds).then(res => {
                    if (res.code === 200) {
                        this.$message.success(`删除成功`);
                        this.multipleSelection = [];
                        this.handleSelectionChange(1);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            }
        },
        //重置密码
        resetPwd(index, row) {
            //
            // 二次确认删除
            this.$confirm('确定重置密码？', '提示', {
                type: 'warning'
            }).then(() => {
                resetPwd(row.userId).then(res => {
                    if (res.code === 200) {
                        this.$message.success('重置密码成功');
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getUserPage();
        },
        cellStyle(cell, rowIndex, columnIndex) {
            //根据报警级别显示颜色
            if (cell.column.label === '状态') {
                if (cell.row.status === 0) {
                    return 'color: #409eff';
                } else if (cell.row.status === 1) {
                    return 'color: #606266';
                } else if (cell.row.status === 2) {
                    return 'color: #f56c6c';
                }
                return '';
            }
        },
        statusFormatter(row, column) {
            if (row.status === 0) {
                return '可用';
            } else if (row.status === 1) {
                return '禁用';
            } else if (row.status === 2) {
                return '删除';
            } else {
                return '未知';
            }
        },
        sourceTypeFormatter(row, column) {
            if (row.sourceType === 0) {
                return '后台';
            } else if (row.sourceType === 1) {
                return '微信小程序';
            } else if (row.sourceType === 2) {
                return 'PC';
            } else if (row.sourceType === 3) {
                return 'H5';
            } else if (row.sourceType === 4) {
                return 'Android';
            } else if (row.sourceType === 5) {
                return 'IOS';
            }
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
