<template>
    <div>
        <goods-info :id="id"></goods-info>
        <div class="submitBtn">
            <el-button type="primary" class="up" icon="el-icon-arrow-left" size="medium" @click="goAuditPage">返回审核列表</el-button>
        </div>
    </div>
</template>

<script>
import goodsInfo from '../../components/goods/GoodsInfo';
export default {
    name: 'GoodsInfo',
    data() {
        return {
            id: -1
        };
    },
    components: {
        goodsInfo
    },
    created() {
        this.id = this.$route.query.id;
    },
    methods: {
        goAuditPage() {
            this.$router.push({
                path: './goodsAuditList'
            });
        }
    }
};
</script>

<style scoped>
.submitBtn {
    width: 100%;
    margin-top: 30px;
    text-align: center;
}
</style>
</style>