<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    {{ goods.spu.id ? '修改' : '添加' }}商品信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-steps :active="0" align-center>
                    <el-step title="步骤1" description="选择商品分类"></el-step>
                    <el-step title="步骤2" description="填写商品信息"></el-step>
                    <el-step title="步骤3" description="填写商品属性"></el-step>
                </el-steps>
            </div>
            <el-divider></el-divider>
            <div class="gcontent">
                <div class="el-transfer-panel" targetorder="original">
                    <p class="el-transfer-panel__header">
                        <span class="el-checkbox__label">选择一级分类</span>
                    </p>
                    <div class="el-transfer-panel__body">
                        <ul class="el-transfer-panel__list" v-show="categoryList1.length > 0">
                            <li
                                v-for="(item, index) in categoryList1"
                                :key="item.id"
                                :value="item.id"
                                :class="{ selected: item.id === goods.spu.category1Id }"
                                @click="liSelected(index, 1, item)"
                            >
                                {{ item.name }}
                            </li>
                        </ul>
                        <ul class="el-transfer-panel__list" v-show="!categoryList1.length || categoryList1.length === 0">
                            <span>暂无数据</span>
                        </ul>
                    </div>
                </div>
                <div class="el-icon-right"></div>
                <div class="el-transfer-panel" targetorder="original">
                    <p class="el-transfer-panel__header">
                        <span class="el-checkbox__label">选择二级分类</span>
                    </p>
                    <div class="el-transfer-panel__body">
                        <ul class="el-transfer-panel__list" v-show="categoryList2.length > 0">
                            <li
                                v-for="(item, index) in categoryList2"
                                :key="item.id"
                                :value="item.id"
                                :class="{ selected: item.id === goods.spu.category2Id }"
                                @click="liSelected(index, 2, item)"
                            >
                                {{ item.name }}
                            </li>
                        </ul>
                        <ul class="el-transfer-panel__list" v-show="!categoryList2.length || categoryList2.length === 0">
                            <span>暂无数据</span>
                        </ul>
                    </div>
                </div>
                <div class="el-icon-right"></div>
                <div class="el-transfer-panel" targetorder="original">
                    <p class="el-transfer-panel__header">
                        <span class="el-checkbox__label">选择三级分类</span>
                    </p>
                    <div class="el-transfer-panel__body">
                        <ul class="el-transfer-panel__list" v-show="categoryList3.length > 0">
                            <li
                                v-for="(item, index) in categoryList3"
                                :key="item.id"
                                :value="item.id"
                                :class="{ selected: item.id === goods.spu.category3Id }"
                                @click="liSelected(index, 3, item)"
                            >
                                {{ item.name }}
                            </li>
                        </ul>
                        <ul class="el-transfer-panel__list" v-show="!categoryList3.length || categoryList3.length === 0">
                            <span>暂无数据</span>
                        </ul>
                    </div>
                </div>
                <div class="tip">
                    <p>
                        您当前选择的商品类别是：
                        <span>{{ this.goods.spu.categoryName1 }}</span> >
                        <span>{{ this.goods.spu.categoryName2 }}</span>
                        >
                        <span>{{ this.goods.spu.categoryName3 }}</span>
                    </p>
                </div>
                <el-divider></el-divider>
                <div class="submitBtn">
                    <el-button type="primary" class="up" icon="el-icon-arrow-left" size="medium" @click="goodsListPage"
                        >返回商品列表</el-button
                    >
                    <el-button type="primary" size="medium" @click="submitGoodsCategory">
                        下一步，填写商品信息
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </div>
</template>

<script>
import { listCategoryByParentId, getGoodsInfo } from '../../api/goods';
import { setCookie, getCookie, delCookie } from '../../utils/cookie.js';

export default {
    name: 'addGoodsCategory',
    data() {
        return {
            parentId: 0,
            categoryList1: [],
            categoryList2: [],
            categoryList3: [],
            goods: {
                spu: {
                    category1Id: undefined,
                    category2Id: undefined,
                    category3Id: undefined,
                    categoryName1: '',
                    categoryName2: '',
                    categoryName3: ''
                },
                skus: [],
                category: {}
            }
        };
    },
    created() {
        delCookie('goods');
        this.listCategoryByParentId();
        const goodsId = this.$route.query.id;
        if (goodsId) {
            this.getGoodsInfo(goodsId);
        }
        this.goods.categoryList1;
    },
    watch: {
        $route(to, from) {
            this.$router.go(0);
        }
    },
    methods: {
        async getGoodsInfo(id) {
            await getGoodsInfo(id).then(res => {
                if (res.code === 200) {
                    this.goods = res.data;
                    this.goods.category = {};
                } else {
                    this.$message.error(res.message);
                }
            });
            await listCategoryByParentId(this.parentId).then(res => {
                if (res.code === 200) {
                    this.categoryList1 = res.data;
                }
            });
            if (this.goods.spu.category1Id) {
                await listCategoryByParentId(this.goods.spu.category1Id).then(res => {
                    if (res.code === 200) {
                        this.categoryList2 = res.data;
                    }
                });
            }
            if (this.goods.spu.category2Id) {
                await listCategoryByParentId(this.goods.spu.category2Id).then(res => {
                    if (res.code === 200) {
                        this.categoryList3 = res.data;
                    }
                });
            }
        },
        async listCategoryByParentId() {
            await listCategoryByParentId(this.parentId).then(res => {
                if (res.code === 200) {
                    this.categoryList1 = res.data;
                }
            });
        },
        async listCategoryByParentId1() {
            await listCategoryByParentId(this.goods.spu.category1Id).then(res => {
                if (res.code === 200) {
                    this.categoryList2 = res.data;
                }
            });
        },
        async listCategoryByParentId2() {
            await listCategoryByParentId(this.goods.spu.category2Id).then(res => {
                if (res.code === 200) {
                    this.categoryList3 = res.data;
                }
            });
        },
        liSelected(index, type, row) {
            if (type === 1) {
                this.goods.spu.category1Id = row.id;
                this.goods.spu.categoryName1 = row.name;
                this.goods.spu.category2Id = undefined;
                this.goods.spu.categoryName2 = '';
                this.goods.spu.category3Id = undefined;
                this.goods.spu.categoryName3 = '';
                this.listCategoryByParentId1();
            } else if (type === 2) {
                this.goods.spu.category2Id = row.id;
                this.goods.spu.categoryName2 = row.name;
                this.goods.spu.category3Id = undefined;
                this.goods.spu.categoryName3 = '';
                this.listCategoryByParentId2();
            } else if (type === 3) {
                this.goods.spu.category3Id = row.id;
                this.goods.spu.categoryName3 = row.name;
            }
        },
        submitGoodsCategory() {
            if (this.goods.spu.category1Id === undefined) {
                this.$message.error('请选择分类');
                return false;
            }
            //设置sku
            this.goods.category.categoryId = this.goods.spu.category3Id || this.goods.spu.category2Id || this.goods.spu.category1Id;
            this.goods.category.categoryName = this.goods.spu.categoryName3 || this.goods.spu.categoryName2 || this.goods.spu.categoryName1;
            setCookie('goods', JSON.stringify(this.goods));
            this.$router.push({
                path: './addGoodsInfo',
                query: {
                    id: this.goods.spu.id
                }
            });
        },
        goodsListPage() {
            this.$router.push({
                path: './goods'
            });
        }
    }
};
</script>

<style scoped>
.container {
    font-size: 13px;
}
.handle-box {
    height: 80px;
}
.gcontent {
    color: #999999;
    text-align: center;
    margin: 50px auto;
}
.el-transfer-panel {
    width: 225px;
}
.gcontent span {
    color: #999999;
    text-align: left;
}
ul,
.el-transfer-panel__header {
    text-align: left;
}
ul li {
    color: black;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f5f7fa;
    padding-left: 15px;
}
ul span {
    display: block;
    text-align: center;
}
ul li::after {
    content: '>';
    float: right;
    margin-right: 18px;
    color: #999999;
}
ul li.selected,
ul li:hover,
ul li:hover::after,
ul li.selected::after {
    background-color: #e0dbdb;
    color: #0099ff;
}
.el-icon-right {
    font-size: 40px;
    margin: 50px;
}
.tip {
    margin: 20px auto;
    color: #2e2929;
}
.tip span {
    color: tomato;
}
.submitBtn {
    text-align: center;
}
</style>
