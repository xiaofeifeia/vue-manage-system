<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>
                    {{ goods.spu.id ? '修改' : '添加' }}商品属性
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-steps :active="2" align-center>
                    <el-step title="步骤1" description="选择商品分类"></el-step>
                    <el-step title="步骤2" description="填写商品信息"></el-step>
                    <el-step title="步骤3" description="填写商品属性"></el-step>
                </el-steps>
            </div>
            <el-divider></el-divider>
            <div class="gcontent">
                <el-form ref="goods" :model="goods" :rules="rules" label-width="150px">
                    <el-form-item label="规格参数组" required>
                        <el-input v-model="goods.spu.templateName" readonly class="handle-input_max"></el-input>
                    </el-form-item>
                    <div class="spec">
                        <el-form-item label="商品规格" required></el-form-item>

                        <el-form-item v-for="item in allSpec" :key="item.id" :label="item.name" :prop="item.name">
                            <el-checkbox
                                v-for="(val, index) in item.list"
                                :label="val"
                                :key="index"
                                v-model="goods.spu.specItems[item.name]"
                                @change="specChange(item.name, val, $event)"
                            ></el-checkbox>
                        </el-form-item>
                    </div>

                    <div class="el-table el-table--border">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead class="has-gutter">
                                    <tr class>
                                        <th
                                            colspan="1"
                                            rowspan="1"
                                            v-for="(item, index) in specTableColums"
                                            :key="index"
                                            class="el-table_10_column_100"
                                        >
                                            <div class="cell">
                                                <i v-show="item.required" class="need">*</i>
                                                {{ item.label }}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in checkSpecDatas" :key="index">
                                        <td colspan="1" rowspan="1" v-for="(val, index) in item" :key="index">
                                            <span>{{ val }}</span>
                                        </td>
                                        <td colspan="1" rowspan="1">
                                            <el-input v-model="skuBaseInfo.price[index]" class="handle-input"></el-input>
                                            <p v-show="false">错误：2323</p>
                                        </td>
                                        <td colspan="1" rowspan="1">
                                            <el-input v-model.number="skuBaseInfo.num[index]" class="handle-input"></el-input>
                                        </td>
                                        <td colspan="1" rowspan="1">
                                            <el-input v-model.number="skuBaseInfo.alertNum[index]" class="handle-input"></el-input>
                                        </td>
                                        <td colspan="1" rowspan="1">
                                            <el-input v-model="skuBaseInfo.sn[index]" class="handle-input"></el-input>
                                        </td>
                                        <td colspan="1" rowspan="1">
                                            <el-input v-model="skuBaseInfo.weight[index]" class="handle-input"></el-input>
                                        </td>

                                        <td colspan="1" rowspan="1">
                                            <el-button type="primary" @click="handleUploadSkuImage(index)">
                                                <span>上传图片</span>
                                            </el-button>
                                        </td>
                                    </tr>

                                    <span class="el-table__empty-text" style="display:none">暂无数据</span>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="el-table paraTable el-table--border">
                        <div class="el-table__header-wrapper">
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
                                <thead class="has-gutter">
                                    <tr class>
                                        <th
                                            :colspan="index === 0 ? 1 : 3"
                                            rowspan="1"
                                            v-for="(item, index) in paraTableColums"
                                            :key="index"
                                            class="el-table_10_column_100"
                                        >
                                            <div class="cell">{{ item.label }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(p, index) in allPara" :key="index">
                                        <td colspan="1" rowspan="1">
                                            <span>
                                                <i>*</i>
                                                {{ p.name }}
                                            </span>
                                        </td>
                                        <td colspan="3" rowspan="1" class="left">
                                            <el-select placeholder="请选择" v-model="goods.spu.paraItems[p.name]" @change="paraChange">
                                                <el-option
                                                    v-for="(val, index) in p.list"
                                                    :key="index"
                                                    :label="val"
                                                    :value="val"
                                                ></el-option>
                                            </el-select>
                                        </td>
                                    </tr>

                                    <span class="el-table__empty-text" style="display:none">暂无数据</span>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <common-upload
                        :image-list="goods.spu.imageList"
                        :image-index="goods.spu.firstIndex"
                        @get-files="getSpuImageList"
                    ></common-upload>
                </el-form>
                <div class="myEditor">
                    <quill-editor ref="myTextEditor" v-model="goods.spu.introduction" :options="editorOption"></quill-editor>
                </div>
                <div class="submitBtn">
                    <el-button type="primary" class="up" icon="el-icon-arrow-left" size="medium" @click="goodsInfoPage"
                        >上一步，填写商品信息</el-button
                    >
                    <el-button type="primary" size="medium" @click="submitGoods">提交审核</el-button>
                </div>
            </div>
            <el-divider></el-divider>
            <el-dialog title="上传图片" :visible.sync="showImageDialog" width="58%">
                <common-upload :image-list="skuImageList" :image-index="firstIndex" @get-files="getSkuImageList"></common-upload>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { listCategoryByParentId, listSpecByTemplateId, listParaByTemplateId, createOrUpdateGoods } from '../../api/goods';
import { listAllTemplate } from '../../api/template';
import { setCookie, getCookie, delCookie } from '../../utils/cookie.js';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import commonUpload from '../../components/upload/CommonUpload';

export default {
    name: 'addGoodsAttr',
    data() {
        return {
            goods: {},
            skuBaseInfo: {
                price: [],
                num: [],
                alertNum: [],
                sn: [],
                weight: []
            },
            allTemplate: [],
            allSpec: [],
            allPara: [],
            skuIndex: 0, //默认点击sku的下标
            firstIndex: 0, //默认点击sku的下标
            skuImageList: [], //接收子组件返回的图片列表（公共上传组件）
            showImageDialog: false,
            checkSpecNames: [],
            checkSpecDatas: [],
            editorOption: {
                placeholder: '请输入商品详情'
            },
            specTableColums: [
                { prop: 'price', label: '价格', width: 120, required: true },
                { prop: 'num', label: '库存数量', width: 120, required: true },
                { prop: 'alertNum', label: '库存预警数量', width: 120, required: true },
                { prop: 'sn', label: 'SKU编号', width: 150 },
                { prop: 'weight', label: '重量', width: 100, required: true },
                { prop: '', label: '操作', width: 100 }
            ],
            paraTableColums: [
                { prop: 'type', label: '参数类型', width: 120 },
                { prop: 'inputPara', label: '录入参数', width: 120 }
            ],
            rules: {
                //
            }
        };
    },
    components: {
        quillEditor,
        commonUpload
    },
    watch: {
        $route(to, from) {
            this.$router.go(0);
        }
    },
    created() {
        let goodsStr = getCookie('goods');
        if (goodsStr) {
            this.goods = JSON.parse(goodsStr);
            if (this.goods.skus) {
                this.iterSku2SkuBaseInfo();
            } else {
                this.$set(this.goods, 'skus', []);
            }
            if (this.goods.spu.specItems) {
                //遍历
                let allList = [];
                if (typeof this.goods.spu.specItems === 'string') {
                    this.$set(this.goods.spu, 'specItems', JSON.parse(this.goods.spu.specItems));
                } else {
                    this.$set(this.goods.spu, 'specItems', this.goods.spu.specItems);
                }
                for (var key in this.goods.spu.specItems) {
                    this.checkSpecNames.splice(0, 0, key); //放入队头
                    this.specTableColums.splice(0, 0, { label: key, prop: key }); //放入队头
                    allList.splice(0, 0, this.goods.spu.specItems[key]);
                }
                if (allList.length > 0) {
                    //求笛卡尔积
                    let resultList = allList.reduce((last, current) => {
                        const array = [];
                        last.forEach(par1 => {
                            current.forEach(par2 => {
                                array.push(par1 + '_' + par2);
                            });
                        });
                        return array;
                    });
                    resultList.forEach(res => {
                        this.checkSpecDatas.push(res.split('_'));
                    });
                }
            } else {
                this.$set(this.goods.spu, 'specItems', []);
            }
            if (this.goods.spu.paraItems) {
                if (typeof this.goods.spu.paraItems === 'string') {
                    this.$set(this.goods.spu, 'paraItems', JSON.parse(this.goods.spu.paraItems));
                } else {
                    this.$set(this.goods.spu, 'paraItems', this.goods.spu.paraItems);
                }
            } else {
                this.$set(this.goods.spu, 'paraItems', {});
            }
            if (this.goods.spu.images) {
                this.$set(this.goods.spu, 'imageList', this.goods.spu.images.split(','));
            } else {
                this.$set(this.goods.spu, 'imageList', []);
            }
        }

        this.listAllTemplate();
        this.listSpecByTemplateId(this.goods.spu.templateId);
        this.listParaByTemplateId(this.goods.spu.templateId);
    },

    methods: {
        paraChange(val) {
            this.$forceUpdate();
        },
        getSpuImageList(images, firstIndex) {
            if (images) {
                this.goods.spu.imageList = images;
                this.goods.spu.firstIndex = firstIndex;
            }
        },
        getSkuImageList(images, firstIndex) {
            if (images) {
                this.goods.skus[this.skuIndex].imageList = images;
                this.goods.skus[this.skuIndex].firstIndex = firstIndex | 0;
            }
        },
        iterSku2SkuBaseInfo() {
            for (let i = 0; i < this.goods.skus.length; i++) {
                const sku = this.goods.skus[i];
                for (var key in this.skuBaseInfo) {
                    this.skuBaseInfo[key].push(sku[key]);
                }
                if (this.goods.skus[i].images) {
                    //处理图片
                    this.goods.skus[i].imageList = this.goods.skus[i].images.split(',');
                    this.goods.skus[i].firstIndex = this.goods.skus[i].imageList.indexOf(this.goods.skus[i].image);
                }
            }
        },
        listAllTemplate() {
            listAllTemplate().then(res => {
                this.allTemplate = res.data;
            });
        },
        listSpecByTemplateId(templateId) {
            listSpecByTemplateId(Number(templateId)).then(res => {
                if (res.code === 200) {
                    res.data.forEach(t => {
                        this.allSpec.push({
                            id: t.id,
                            name: t.name,
                            list: t.options.split(',')
                        });
                        if (!this.goods.spu.specItems[t.name]) {
                            this.goods.spu.specItems[t.name] = [];
                        }
                    });
                }
            });
        },
        listParaByTemplateId(templateId) {
            listParaByTemplateId(Number(templateId)).then(res => {
                if (res.code === 200) {
                    res.data.forEach(t => {
                        this.allPara.push({
                            id: t.id,
                            name: t.name,
                            list: t.options.split(',')
                        });
                        if (!this.goods.spu.paraItems[t.name]) {
                            this.goods.spu.paraItems[t.name] = '';
                        }
                    });
                }
            });
        },
        handleClick(row) {
            //
        },
        specChange(name, value, check) {
            //选中
            if (check) {
                if (this.checkSpecNames.indexOf(name) === -1) {
                    this.checkSpecNames.splice(0, 0, name); //放入队头
                    this.specTableColums.splice(0, 0, { label: name, prop: name }); //放入队头
                }
                if (typeof this.goods.spu.specItems[name] === 'boolean') {
                    this.goods.spu.specItems[name] = [];
                    this.goods.spu.specItems[name].splice(0, 0, value); //放入队头
                }
            } else {
                //取消
                if (this.goods.spu.specItems[name].length === 0) {
                    let nameIndex = this.checkSpecNames.indexOf(name);
                    this.specTableColums.splice(nameIndex, 1); //移除列
                    this.checkSpecNames.splice(nameIndex, 1);
                    delete this.goods.spu.specItems[name];
                    //删除sku中的spec属性
                    if (this.goods.skus && this.goods.skus.length > 0) {
                        let skuArr = [];
                        this.goods.skus.forEach(sku => {
                            if (typeof sku.spec === 'string') {
                                sku.spec = JSON.parse(sku.spec);
                            }
                            delete sku.spec[name];
                            skuArr.push(sku);
                        });
                        this.goods.skus = skuArr;
                    }
                }
            }

            this.iterSpecItems(check);
        },
        iterSpecItems(check) {
            //遍历
            let allList = [];

            for (let name in this.goods.spu.specItems) {
                if (this.goods.spu.specItems[name] && this.goods.spu.specItems[name].length > 0) {
                    allList.splice(0, 0, this.goods.spu.specItems[name]);
                }
            }

            if (!allList || allList.length <= 0) {
                this.goods.skus = [];
                this.checkSpecDatas = [];
                return;
            }
            //求笛卡尔积
            let resultList = allList.reduce((last, current) => {
                const array = [];
                last.forEach(par1 => {
                    current.forEach(par2 => {
                        array.push(par1 + '_' + par2);
                    });
                });
                return array;
            });
            this.checkSpecDatas = [];
            let containSpecArr = [];
            if (this.goods.skus && this.goods.skus.length > 0) {
                this.goods.skus.map(sku => {
                    let str = '';
                    if (typeof sku.spec === 'string') {
                        sku.spec = JSON.parse(sku.spec);
                    }
                    for (let index in this.checkSpecNames) {
                        if (sku.spec[this.checkSpecNames[index]]) {
                            str += sku.spec[this.checkSpecNames[index]] + '_';
                        }
                    }
                    if (str) {
                        containSpecArr.push(str.substring(0, str.length - 1));
                    }
                });
            }

            let skusArr = []; //再取消勾选的时候，要重新设置skus
            resultList.forEach(res => {
                const ind = containSpecArr.indexOf(res);
                this.checkSpecDatas.push(res.split('_'));
                if (check) {
                    if (ind === -1) {
                        //判断长度不一样的 如skus中是槟色_5寸   选中是：槟色_5寸_6GB+64GB
                        let index = this.checkSkusSpecIndex(containSpecArr, res);
                        if (index !== -1) {
                            for (let j = 0; j < res.split('_').length; j++) {
                                this.goods.skus[index].spec[this.checkSpecNames[j]] = res.split('_')[j];
                            }
                        } else {
                            //生成skus
                            let sku = { images: '', imageList: [], spec: {} };
                            for (let j = 0; j < res.split('_').length; j++) {
                                sku.spec[this.checkSpecNames[j]] = res.split('_')[j];
                            }
                            this.goods.skus.push(sku);
                        }
                    }
                } else {
                    if (ind !== -1) {
                        skusArr.push(this.goods.skus[ind]);
                    }
                }
            });
            if (!check) {
                this.goods.skus = skusArr;
                for (let key in this.skuBaseInfo) {
                    this.skuBaseInfo[key] = [];
                    this.goods.skus.forEach(sku => {
                        if (sku.hasOwnProperty(key) && sku[key]) {
                            this.skuBaseInfo[key].push(sku[key]);
                        }
                    });
                }
            }
        },
        checkSkusSpecIndex(containSpecArr, spec) {
            let index = -1;
            containSpecArr.forEach(s => {
                if (spec.length > s.length) {
                    if (spec.indexOf(s) !== -1) {
                        index = containSpecArr.indexOf(s);
                        return;
                    }
                }
            });
            return index;
        },
        handleUploadSkuImage(index) {
            this.skuImageList = [];
            if (this.goods.skus[index].imageList) {
                this.skuImageList = this.goods.skus[index].imageList;
            }
            this.skuIndex = index;
            this.showImageDialog = true;
        },
        goodsInfoPage() {
            this.$router.push({
                path: './addGoodsInfo',
                query: {
                    id: this.goods.spu.id
                }
            });
        },
        submitGoods() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            if (this.goods.spu.imageList && this.goods.spu.imageList.length > 0) {
                this.goods.spu.images = this.goods.spu.imageList.join(',');
                this.goods.spu.image = this.goods.spu.imageList[this.goods.spu.firstIndex];
            }

            for (let i = 0; i < this.goods.skus.length; i++) {
                if (this.goods.skus[i].imageList && this.goods.skus[i].imageList.length > 0) {
                    this.goods.skus[i].images = this.goods.skus[i].imageList.join(',');
                    this.goods.skus[i].image = this.goods.skus[i].imageList[this.goods.skus[i].firstIndex];
                }

                //先整合category到sku
                this.goods.skus[i] = Object.assign(this.goods.skus[i], this.goods.category);
                //赋值sku信息
                for (let key in this.skuBaseInfo) {
                    this.goods.skus[i][key] = this.skuBaseInfo[key][i];
                }
                this.goods.skus[i].spec = this.goods.skus[i].spec;
            }
            // 写入cookie
            setCookie('goods', JSON.stringify(this.goods));
            createOrUpdateGoods(this.goods).then(res => {
                loading.close();
                if (res.code === 200) {
                    delCookie('goods'); //清空cookie
                    this.$message.success('操作成功');
                    this.$router.push({
                        path: './Goods'
                    });
                } else {
                    this.$message.error(res.message);
                }
            });
        }
    }
};
</script>

<style scoped>
* {
    font-size: 14px !important;
}
.handle-box {
    height: 80px;
}
.gcontent {
    color: #999999;
    margin: 30px 120px;
}
.gcontent span {
    margin-right: 10px;
    font-size: 13px;
}
.spec {
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    background-color: #f5f7fa;
}
.submitBtn {
    text-align: center;
}

.el-form-item {
    margin-top: 25px;
}
.el-table {
    margin-top: 25px;
    text-align: center;
}
.handle-input_max {
    width: 35%;
}
.handle-input {
    width: 80%;
}
.el-form-item__label,
.el-form-item__content {
    font-size: 12px;
}
.el-table__header-wrapper tbody td,
th {
    background-color: #fff;
    text-align: center;
}
.el-table__header-wrapper tbody span i {
    color: tomato;
}

.submitBtn,
.myEditor {
    margin-top: 30px;
}
.paraTable {
    margin-bottom: 30px;
}
.up {
    background-color: #fff;
    color: #409eff;
}
.el-table__header-wrapper tbody td.left {
    text-align: left;
    padding-left: 10px;
}
td > p {
    font-size: 10px !important;
    color: tomato;
    margin-bottom: -10px;
}
.need {
    color: tomato;
}
</style>
