<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    {{goods.spu.id?'修改':'添加'}}商品信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-steps :active="1" align-center>
                    <el-step title="步骤1" description="选择商品分类"></el-step>
                    <el-step title="步骤2" description="填写商品信息"></el-step>
                    <el-step title="步骤3" description="填写商品属性"></el-step>
                </el-steps>
            </div>
            <el-divider></el-divider>
            <div class="gcontent">
                <el-form ref="goods" :model="goods" :rules="rules" label-width="150px">
                    <el-form-item label="商品分类" required>
                        <span>{{goods.spu.categoryName1}} ></span>
                        <span>{{goods.spu.categoryName2}} ></span>
                        <span>{{goods.spu.categoryName3}}</span>
                    </el-form-item>
                    <el-form-item label="名称" required prop="spu.name">
                        <el-input v-model="goods.spu.name" placeholder="请输入名称" class="handle-input"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题" required prop="spu.caption">
                        <el-input
                            v-model="goods.spu.caption"
                            placeholder="请输入副标题"
                            class="handle-input"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="商品品牌" required prop="spu.brandId">
                        <el-select
                            v-model="goods.spu.brandId"
                            no-match-text="请选择"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in allBrand"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品介绍">
                        <el-input
                            type="textarea"
                            v-model="goods.spu.introduction"
                            placeholder="请输入商品介绍"
                            maxlength="200"
                            show-word-limit
                            rows="4"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择模板" required prop="spu.templateId">
                        <el-select
                            v-model="goods.spu.templateId"
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
                    <el-form-item label="商品货号">
                        <el-input v-model="goods.spu.sn" placeholder="请输入商品货号" class="handle-input"></el-input>
                        <div>
                            <span>不输入商品货号，系统将自动生成一个唯一的货号</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="服务保证" prop="saleService">
                        <el-checkbox v-model="goods.spu.saleService" label="无忧退货"></el-checkbox>
                        <el-checkbox v-model="goods.spu.saleService" label="快速退款"></el-checkbox>
                        <el-checkbox v-model="goods.spu.saleService" label="免费包邮"></el-checkbox>
                    </el-form-item>
                </el-form>
                <div class="submitBtn">
                    <el-button
                        type="primary"
                        class="up"
                        icon="el-icon-arrow-left"
                        size="medium"
                    >上一步，填写商品分类</el-button>
                    <el-button
                        type="primary"
                        size="medium"
                        @click="submitgoods"
                        :loading="btnLoading"
                    >
                        下一步，填写商品属性
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </div>
</template>

<script>
import { listByParentId } from '../../api/goods';
import { listAllTemplate } from '../../api/template';
import { listAllBrand } from '../../api/brand';
import { setCookie, getCookie, delCookie } from '../../utils/cookie.js';

export default {
    name: 'addGoodsInfo',
    data() {
        return {
            goods: {},
            allTemplate: [],
            allBrand: [],
            btnLoading: false,
            rules: {
                'spu.name': [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'change'
                    },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
                ],
                'spu.caption': [
                    {
                        required: true,
                        message: '请输入属性值可选值列表',
                        trigger: 'change'
                    },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                'spu.templateId': [
                    {
                        required: true,
                        message: '请选择模板',
                        trigger: 'change'
                    }
                ],
                'spu.brandId': [
                    {
                        required: true,
                        message: '请选择品牌',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    created() {
        let goods = getCookie('goods');
        if (goods) {
            this.goods = JSON.parse(goods);
            if (this.goods.spu.saleService) {
                this.goods.spu.saleService = this.goods.spu.saleService.split(',');
            } else {
                this.goods.spu.saleService = [];
            }
        }
        this.listAllTemplate();
        this.listAllBrand();
    },

    methods: {
        listAllTemplate() {
            listAllTemplate().then(res => {
                this.allTemplate = res.data;
            });
        },
        listAllBrand() {
            listAllBrand().then(res => {
                this.allBrand = res.data;
            });
        },
        submitgoods() {
            this.$refs['goods'].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    let t = this.allTemplate.find(t => {
                        return t.id === this.goods.spu.templateId;
                    });
                    this.goods.spu.templateName = t.name;
                    this.goods.spu.saleService = this.goods.spu.saleService.join(',');
                    //写入cookie
                    setCookie('goods', JSON.stringify(this.goods));
                    this.$router.push({
                        path: './addGoodsAttr',
                        query: {
                            id: this.goods.spu.id
                        }
                    });
                }
                this.btnLoading = false;
                return false;
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
    width: 460px;
    color: #999999;
    margin: 30px auto;
}
.gcontent span {
    margin-right: 10px;
    font-size: 13px;
}
.submitBtn {
    text-align: center;
}
.handle-input {
    width: 250px;
}
.el-form-item {
    margin-top: 30px;
}
.up {
    background-color: #fff;
    color: #409eff;
}
</style>