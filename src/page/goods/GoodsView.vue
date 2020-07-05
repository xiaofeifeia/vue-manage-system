<template>
    <goods-info :id="id"></goods-info>
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
    }
};
</script>

<style>
</style>