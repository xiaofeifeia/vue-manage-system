<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品列表
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
                    @click="deleteGoodsList"
                >批量删除</el-button>
                <el-input
                    v-model="query.name"
                    placeholder="商品名称/商品货号"
                    class="handle-input mr10"
                    size="small"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="goodsList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="商品图片" prop="image" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.image"
                            :preview-src-list="[scope.row.image]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名" width="210" align="center"></el-table-column>
                <el-table-column prop="brandName" label="品牌名" width="100" align="center"></el-table-column>
                <el-table-column prop="sn" label="货号" align="center"></el-table-column>
                <el-table-column prop="isMarketable" label="上架/下架" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isMarketable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-value="1"
                            inactive-value="0"
                            @change="setMarketable(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="库存" align="center"></el-table-column>
                <el-table-column prop="saleNum" label="销量" align="center"></el-table-column>
                <el-table-column
                    prop="auditStatus"
                    label="审核状态"
                    align="center"
                    :formatter="auditStatusFormatter"
                ></el-table-column>

                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="goodsView(scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteGoods(scope.row)"
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
    </div>
</template>

<script>
import { findGoodsPage, setMarketable, deleteGoods, deleteGoodsList, auditGoods, getGoodsInfo } from '../../api/goods';
export default {
    name: 'GoodsTable',
    data() {
        return {
            query: {
                name: '',
                pageNum: 1,
                pageSize: 10
            },
            goodsList: [],
            multipleSelection: [],
            editVisible: false,
            total: 0,
            goodsForm: {},
            showIndex: -1,
            title: '创建',
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入品牌名',
                        trigger: 'change'
                    },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
                ],
                letter: [
                    {
                        required: true,
                        message: '请输入首字母',
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
        this.getGoodsPage();
    },
    methods: {
        auditStatusFormatter(row, column) {
            if (row.auditStatus == 0) {
                return '未审核';
            } else if (row.auditStatus == 1) {
                return '审核中';
            } else if (row.auditStatus == 2) {
                return '已审核';
            } else if (row.auditStatus == 3) {
                return '审核失败';
            }
        },
        // 获取 easy-mock 的模拟数据
        getGoodsPage() {
            findGoodsPage(this.query).then(res => {
                if (res.code == 200) {
                    this.goodsList = res.data.list;
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
            this.$router.push({
                path: './addGoodsCategory'
            });
        },
        // 编辑操作
        handleEdit(row) {
            this.$router.push({
                path: './addGoodsCategory',
                query: {
                    id: row.id
                }
            });
        },
        // 保存编辑
        submitForm() {
            this.$refs['goodsForm'].validate(valid => {
                if (valid) {
                    if (this.goodsForm.id) {
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
            this.goodsForm = {};
            this.$refs['goodsForm'].resetFields();
        },
        // 删除操作
        deleteGoods(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteGoods(row.id).then(res => {
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
        deleteGoodsList() {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                let goodsIds = this.multipleSelection.map(data => {
                    return data.id;
                });
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteGoodsList(goodsIds).then(res => {
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
        goodsView(row) {
            this.$router.push({
                path: './goodView',
                query: {
                    id: row.id
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getGoodsPage();
        },
        // 上架下架
        setMarketable(row) {
            setMarketable(row).then(res => {
                if (res.code === 200) {
                    this.$message.success('修改成功');
                    this.handleSearch();
                } else {
                    this.$message.error(res.message);
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
