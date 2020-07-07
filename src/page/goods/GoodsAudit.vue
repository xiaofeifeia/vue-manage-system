<template>
    <div class="container">
        <goods-info :id="goods.id" @get-spu="getSpu"></goods-info>

        <el-form ref="goods" label-width="35%" class="auditForm">
            <el-form-item label="审核状态" required>
                <el-select v-model="goods.auditStatus" no-match-text="请选择" placeholder="请选择">
                    <el-option label="审核中" :value="1"></el-option>
                    <el-option label="审核通过" :value="2"></el-option>
                    <el-option label="审核失败" :value="3"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="审核说明">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    maxlength="200"
                    show-word-limit
                    rows="4"
                    class="handle-input"
                    v-model="goods.auditInfo"
                ></el-input>
            </el-form-item>
        </el-form>
        <div class="submitBtn">
            <el-button
                type="primary"
                icon="el-icon-arrow-left"
                size="medium"
                @click="goAuditPage"
            >返回审核列表</el-button>
            <el-button
                type="primary"
                size="medium"
                @click="auditGoods"
                v-show="checkAuditStatus!==2"
            >提交审核</el-button>
        </div>
    </div>
</template>

<script>
import goodsInfo from '../../components/goods/GoodsInfo';
import { auditGoods } from '../../api/goods';
export default {
    name: 'GoodsAudit',
    data() {
        return {
            checkAuditStatus: undefined,
            goods: {
                id: -1,
                auditStatus: undefined,
                auditInfo: ''
            }
        };
    },
    components: {
        goodsInfo
    },
    created() {
        this.goods.id = this.$route.query.id;
    },
    methods: {
        getSpu(spu) {
            this.goods = spu;
            this.checkAuditStatus = spu.auditStatus;
            if (this.goods.auditStatus !== undefined && this.goods.auditStatus === 0) {
                this.goods.auditStatus = 1; //
                //修改成审核中
                auditGoods(this.goods).then(res => {
                    console.log(res);
                });
            }
        },
        auditGoods() {
            if (this.goods.auditStatus === 3) {
                this.$message.success('操作成功');
                return;
            }
            auditGoods(this.goods).then(res => {
                if (res.code === 200) {
                    this.$message.success('操作成功');
                    this.$router.push({
                        path: './goodsAuditList',
                        query: {
                            id: this.goods.id
                        }
                    });
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        goAuditPage() {
            this.$router.push({
                path: './goodsAuditList'
            });
        }
    }
};
</script>

<style scoped>
.auditForm {
    padding: 30px;
}
.submitBtn {
    width: 100%;
    margin-top: 30px;
    text-align: center;
}
.handle-input {
    width: 450px;
}
</style>
</style>