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

export const createGoods = (goods) => {

    return request({
        url: '/goods/create',
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

export const updateStatus = (params) => {

    return request({
        url: '/goods/updateStatus/' + params.id + "?status=" + params.status,
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