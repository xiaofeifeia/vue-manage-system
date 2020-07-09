<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 商品审核列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="商品名称/商品货号" class="handle-input mr10" size="small"></el-input>
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
                        <el-image class="table-td-thumb" :src="scope.row.image" :preview-src-list="[scope.row.image]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名" width="210" align="center"></el-table-column>
                <el-table-column prop="brandName" label="品牌名" width="100" align="center"></el-table-column>
                <el-table-column prop="sn" label="货号" align="center"></el-table-column>
                <el-table-column prop="isMarketable" label="上架/下架" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.isMarketable === '0'" style="color: #67c23a">上架</span>
                        <span v-else-if="scope.row.isMarketable === '1'" style="color:#e6a23c">下架</span>
                        <span v-else-if="scope.row.isMarketable === '2'" style="color: #f56c6c">删除</span>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="库存" align="center"></el-table-column>
                <el-table-column prop="saleNum" label="销量" align="center"></el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" align="center" :formatter="auditStatusFormatter"></el-table-column>

                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="goodsView(scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="goodsAudit(scope.row)">审核</el-button>
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
import { findGoodsPage, audit, getGoodsInfo } from '../../api/goods';
export default {
    name: 'GoodsAuditTable',
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
            showIndex: -1
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
        goodsView(row) {
            this.$router.push({
                path: './goodsView',
                query: {
                    id: row.id,
                    type: 'audit'
                }
            });
        },
        goodsAudit(row) {
            this.$router.push({
                path: './goodsAudit',
                query: {
                    id: row.id
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getGoodsPage();
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
