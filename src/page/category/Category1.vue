<template>
    <category-form :parentId="param.parentId" :titleName="param.titleName" :level="param.level"></category-form>
</template>

<script>
import categoryForm from '../../components/category/category.vue';
export default {
    name: 'CategoryTable',
    data() {
        return {
            param: {
                titleName: '一级分类',
                parentId: 0,
                level: 1 //一级分类
            }
        };
    },
    components: {
        categoryForm
    },
    methods: {
        //
    }
};
</script>

<style scoped>
</style>
