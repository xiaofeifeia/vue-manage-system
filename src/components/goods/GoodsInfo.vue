<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    查看商品详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="gcontent">
                <div class="spuContent">
                    <el-form label-width="40%" class="categoryForm">
                        <el-form-item label="商品分类">
                            <span>{{goods.spu.categoryName1}} ></span>
                            <span>{{goods.spu.categoryName2}} ></span>
                            <span>{{goods.spu.categoryName3}}</span>
                        </el-form-item>
                    </el-form>
                    <div class="left">
                        <el-form label-width="150px">
                            <el-form-item label="图片">
                                <el-image
                                    style="width: 100px; height: 100px"
                                    :src="goods.spu.image"
                                    :preview-src-list="[goods.spu.image]"
                                ></el-image>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-input v-model="goods.spu.name" readonly class="handle-input"></el-input>
                            </el-form-item>
                            <el-form-item label="副标题">
                                <el-input v-model="goods.spu.caption" readonly class="handle-input"></el-input>
                            </el-form-item>

                            <el-form-item label="选择模板">
                                <el-input
                                    v-model="goods.spu.templateId"
                                    readonly
                                    class="handle-input"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号">
                                <el-input v-model="goods.spu.sn" readonly class="handle-input"></el-input>
                            </el-form-item>

                            <el-form-item label="商品详情">
                                <el-input
                                    type="textarea"
                                    v-model="goods.spu.introduction"
                                    readonly
                                    rows="4"
                                    class="handle-input"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form-item label="商品介绍">
                            <el-input
                                type="textarea"
                                class="handle-input"
                                v-model="goods.spu.introduction"
                                disabled
                                rows="4"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="right">
                        <el-form>
                            <el-form-item label="商品品牌">
                                <el-input
                                    v-model="goods.spu.brandName"
                                    readonly
                                    class="handle-input"
                                ></el-input>
                            </el-form-item>

                            <el-form-item label="服务保证">
                                <el-input
                                    v-model="goods.spu.saleService"
                                    readonly
                                    class="handle-input"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="商品参数"></el-form-item>
                            <el-form-item
                                label-width="120px"
                                v-for="(value,key) in goods.spu.paraItems"
                                :label="key"
                                :key="key"
                            >
                                <el-input
                                    v-model="goods.spu.paraItems[key]"
                                    readonly
                                    class="handle-input short"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="图片列表"></el-form-item>
                            <ul>
                                <li v-for="(item,index) in goods.spu.images" :key="index">
                                    <el-image :src="item" :preview-src-list="goods.spu.images"></el-image>
                                </li>
                            </ul>
                        </el-form>
                    </div>
                    <!-- 编辑弹出框 -->
                    <el-dialog title="商品图片" :visible.sync="showSkuImage" width="40%">
                        <el-form>
                            <ul>
                                <li v-for="(item,index) in skuImageList" :key="index">
                                    <el-image :src="item" :preview-src-list="skuImageList"></el-image>
                                </li>
                            </ul>
                        </el-form>
                    </el-dialog>
                </div>

                <el-table
                    :data="goods.skus"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column label="商品图片" prop="image" align="center">
                        <template slot-scope="scope">
                            <el-image
                                class="table-td-thumb"
                                :src="scope.row.image"
                                :preview-src-list="[scope.row.image]"
                                style="width:50px;height:50px"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名" width="200" align="center"></el-table-column>
                    <el-table-column prop="sn" label="货号" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="品牌名" width="100" align="center"></el-table-column>
                    <el-table-column
                        v-for="(val,index) in specArr"
                        :prop="val"
                        :label="val"
                        :key="index"
                        align="center"
                        width="100"
                    ></el-table-column>
                    <el-table-column prop="num" label="库存" align="center"></el-table-column>
                    <el-table-column prop="saleNum" label="销量" align="center"></el-table-column>

                    <el-table-column label="操作" width="120" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                icon="el-icon-view"
                                @click="shouImage(scope.row)"
                            >图片列表</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="submitBtn">
                    <el-button
                        type="primary"
                        class="up"
                        icon="el-icon-arrow-left"
                        size="medium"
                    >返回审核列表</el-button>
                    <el-button type="primary" size="medium">提交审核</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getGoodsInfo } from '../../api/goods';

export default {
    name: 'addGoodsAttr',
    data() {
        return {
            goods: {},
            specArr: [],
            showSkuImage: false,
            skuImageList: []
        };
    },
    props: {
        id: String
    },
    created() {
        this.getGoodsInfo(this.id);
    },

    methods: {
        shouImage(row) {
            this.showSkuImage = true;
            if (row.images) {
                this.skuImageList = row.images.split(',');
            } else {
                this.skuImageList = [];
            }
        },
        getGoodsInfo(id) {
            getGoodsInfo(id).then(res => {
                if (res.code === 200) {
                    this.goods = res.data;
                    if (this.goods.spu) {
                        if (this.goods.spu.images) {
                            this.goods.spu.images = this.goods.spu.images.split(',');
                            if (this.goods.spu.image) {
                                this.goods.spu.imageIndex = this.goods.spu.images.indexOf(this.goods.spu.image);
                            } else {
                                this.goods.spu.imageIndex = 0;
                            }
                        }
                        if (this.goods.spu.paraItems) {
                            if (typeof this.goods.spu.paraItems === 'string') {
                                this.goods.spu.paraItems = JSON.parse(this.goods.spu.paraItems);
                            }
                        }
                    }
                    if (this.goods.skus && this.goods.skus.length > 0) {
                        this.goods.skus.map(sku => {
                            if (typeof sku.spec === 'string') {
                                sku.spec = JSON.parse(sku.spec);
                            }

                            for (let key in sku.spec) {
                                sku[key] = sku.spec[key];
                            }
                            return sku;
                        });
                        for (var key in this.goods.skus[0].spec) {
                            this.specArr.push(key);
                        }
                    }
                }
            });
        }
    }
};
</script>

<style scoped>
.categoryForm {
    margin-bottom: 30px;
}

.handle-input {
    width: 400px;
}
.short {
    width: 300px;
}

.spuContent .left {
    float: left;
    width: 50%;
}
.spuContent .right {
    float: left;
    width: 45%;
    margin-left: 30px;
}
ul {
    height: 120px;
}
ul > li {
    width: 80px;
    border: 1px solid #dcdfe6;
    margin: 10px 0 10px 10px;
    list-style: none;
    float: left;
}
ul > li > .el-image {
    height: 80px;
    width: 80px;
}
</style>