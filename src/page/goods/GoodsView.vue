<template>
    <div>
        <goods-info :id="id"></goods-info>
        <div class="submitBtn">
            <el-button type="primary" class="up" icon="el-icon-arrow-left" size="medium" @click="goPage">返回{{type==='goods'?'商品':'审核'}}列表</el-button>
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
        this.type=this.$route.query.type;
    },
    methods: {
        goPage() {
           if(this.type==='audit'){
                this.$router.push({
                path: './goodsAuditList'
              });
            }else{
              this.$router.push({
                path: './goods'
               });
            }
           
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