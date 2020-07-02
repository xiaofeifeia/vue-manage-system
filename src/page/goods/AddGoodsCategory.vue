<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    添加商品信息
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
                        <ul class="el-transfer-panel__list" v-show="categoryList1.length>0">
                            <li
                                v-for="(item,index) in categoryList1"
                                :key="item.id"
                                :value="item.id"
                                :class="{selected:index===goods.spu.categoryIndex1}"
                                @click="liSelected(index,1,item)"
                            >{{item.name}}</li>
                        </ul>
                        <ul
                            class="el-transfer-panel__list"
                            v-show="!categoryList1.length || categoryList1.length===0"
                        >
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
                        <ul class="el-transfer-panel__list" v-show="categoryList2.length>0">
                            <li
                                v-for="(item,index) in categoryList2"
                                :key="item.id"
                                :value="item.id"
                                :class="{selected:index===goods.spu.categoryIndex2}"
                                @click="liSelected(index,2,item)"
                            >{{item.name}}</li>
                        </ul>
                        <ul
                            class="el-transfer-panel__list"
                            v-show="!categoryList2.length || categoryList2.length===0"
                        >
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
                        <ul class="el-transfer-panel__list" v-show="categoryList3.length>0">
                            <li
                                v-for="(item,index) in categoryList3"
                                :key="item.id"
                                :value="item.id"
                                :class="{selected:index===goods.spu.categoryIndex3}"
                                @click="liSelected(index,3,item)"
                            >{{item.name}}</li>
                        </ul>
                        <ul
                            class="el-transfer-panel__list"
                            v-show="!categoryList3.length || categoryList3.length===0"
                        >
                            <span>暂无数据</span>
                        </ul>
                    </div>
                </div>
                <div class="tip">
                    <p>
                        您当前选择的商品类别是：
                        <span>{{ this.goods.spu.categoryName1}}</span> >
                        <span>{{ this.goods.spu.categoryName2}}</span>
                        >
                        <span>{{ this.goods.spu.categoryName3}}</span>
                    </p>
                </div>
                <el-divider></el-divider>
                <div class="submitBtn">
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
import { listCategoryByParentId } from '../../api/goods';
import { setCookie, getCookie, delCookie } from '../../utils/cookie.js';

export default {
    name: 'addGoodsCategory',
    data() {
        return {
            parentId: 0,
            categoryParentId1: null,
            categoryParentId2: null,
            categoryList1: [],
            categoryList2: [],
            categoryList3: [],
            goods: {
                spu: {
                    categoryIndex1: null,
                    categoryIndex2: null,
                    categoryIndex3: null,
                    category1Id: null,
                    category2Id: null,
                    category3Id: null,
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
        this.listCategoryByParentId();
    },

    methods: {
        async listCategoryByParentId() {
            await listCategoryByParentId(this.parentId).then(res => {
                if (res.code === 200) {
                    this.categoryList1 = res.data;
                }
            });
            if (this.categoryList1.length > 0) {
                this.categoryParentId1 = this.categoryList1[0].id;
                this.goods.spu.categoryIndex1 = 0; //默认选中第一个
                this.goods.spu.categoryName1 = this.categoryList1[0].name;
                await listCategoryByParentId(this.categoryParentId1).then(res => {
                    if (res.code === 200) {
                        this.categoryList2 = res.data;
                    }
                });
                if (this.categoryList2.length > 0) {
                    this.categoryParentId2 = this.categoryList2[0].id;
                    this.goods.spu.categoryIndex2 = 0; //默认选中第一个
                    this.goods.spu.categoryName2 = this.categoryList2[0].name;
                    await listCategoryByParentId(this.categoryParentId2).then(res => {
                        if (res.code === 200) {
                            this.categoryList3 = res.data;
                            if (this.categoryList3.length > 0) {
                                this.goods.spu.categoryIndex3 = 0;
                                this.goods.spu.categoryName3 = this.categoryList3[0].name;
                            }
                        }
                    });
                }
            }
        },
        async listCategoryByParentId1() {
            await listCategoryByParentId(this.categoryParentId1).then(res => {
                if (res.code === 200) {
                    this.categoryList2 = res.data;
                }
            });
            if (this.categoryList2.length > 0) {
                this.categoryParentId2 = this.categoryList2[0].id;
                this.goods.spu.categoryIndex2 = 0; //默认选中第一个
                this.goods.spu.categoryName2 = this.categoryList2[0].name;
                await listCategoryByParentId(this.categoryParentId2).then(res => {
                    if (res.code === 200) {
                        this.categoryList3 = res.data;
                        if (this.categoryList3.length > 0) {
                            this.goods.spu.categoryIndex3 = 0;
                            this.goods.spu.categoryName3 = this.categoryList3[0].name;
                        }
                    }
                });
            }
        },
        listCategoryByParentId2() {
            listCategoryByParentId(this.categoryParentId2).then(res => {
                if (res.code === 200) {
                    this.categoryList3 = res.data;
                    if (this.categoryList3.length > 0) {
                        this.goods.spu.categoryIndex3 = 0;
                        this.goods.spu.categoryName3 = this.categoryList3[0].name;
                    }
                }
            });
        },
        liSelected(index, type, row) {
            if (type === 1) {
                this.categoryParentId1 = row.id;
                this.goods.spu.categoryIndex1 = index;
                this.goods.spu.categoryName1 = row.name;
                this.listCategoryByParentId1();
            } else if (type === 2) {
                this.categoryParentId2 = row.id;
                this.goods.spu.categoryIndex2 = index;
                this.goods.spu.categoryName2 = row.name;
                this.listCategoryByParentId2();
            } else if (type === 3) {
                this.goods.spu.categoryIndex3 = index;
                this.goods.spu.categoryName3 = row.name;
            }
        },
        submitGoodsCategory() {
            if (this.goods.spu.categoryIndex1 === null) {
                this.$message.error('请选择分类');
                return false;
            }

            this.goods.spu.category1Id = this.categoryList1[this.goods.spu.categoryIndex1].id;
            this.goods.spu.category2Id = this.categoryList2[this.goods.spu.categoryIndex2].id;
            this.goods.spu.category3Id = this.categoryList3[this.goods.spu.categoryIndex3].id;
            this.goods.spu.categoryName1 = this.categoryList1[this.goods.spu.categoryIndex1].name;
            this.goods.spu.categoryName2 = this.categoryList2[this.goods.spu.categoryIndex2].name;
            this.goods.spu.categoryName3 = this.categoryList3[this.goods.spu.categoryIndex3].name;
            //设置sku
            this.goods.category.categoryId = this.goods.spu.category3Id || this.goods.spu.category2Id || this.goods.spu.category1Id;
            this.goods.category.categoryName = this.goods.spu.categoryName3 || this.goods.spu.categoryName2 || this.goods.spu.categoryName1;
            setCookie('goods', JSON.stringify(this.goods));
            this.$router.push({
                path: './addGoodsInfo'
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