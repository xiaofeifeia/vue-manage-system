import request from '../utils/request';


export const listCategoryByParentId = (parentId) => {

    return request({
        url: '/category/listByParentId/' + parentId,
        method: 'post'
    });
};

export const listSpecByTemplateId = (templateId) => {

    return request({
        url: '/spec/listByTemplateId/' + templateId,
        method: 'post'
    });
};

export const listParaByTemplateId = (templateId) => {

    return request({
        url: '/para/listByTemplateId/' + templateId,
        method: 'post'
    });
};

export const createOrUpdateGoods = (goods) => {

    return request({
        url: '/goods/createOrUpdate',
        method: 'post',
        data: goods
    });
};

export const findGoodsPage = (params) => {

    return request({
        url: '/goods/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const setMarketable = (params) => {

    return request({
        url: '/goods/setMarketable/' + params.id + "?isMarketable=" + params.isMarketable,
        method: 'post'
    });
};

export const deleteGoods = (id) => {

    return request({
        url: '/goods/deleteGoods/' + id,
        method: 'post'
    });
};

export const deleteGoodsList = (ids) => {

    return request({
        url: '/goods/deleteGoodsList',
        method: 'post',
        data: JSON.stringify(ids)
    });
};

export const auditGoods = (params) => {

    return request({
        url: '/goods/audit',
        method: 'post',
        data: params
    });
};

export const getGoodsInfo = (id) => {

    return request({
        url: '/goods/getGoodsInfo/' + id,
        method: 'post'
    });
};