import request from '../utils/request';


export const storePage = (params) => {

    return request({
        url: '/store/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/store/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/store/update',
        method: 'post',
        data: params
    });
};
export const deleteStore = (storeId) => {

    return request({
        url: '/store/delete/' + storeId,
        method: 'post'
    });
};

export const deleteStores = (storeIds) => {

    return request({
        url: '/store/deleteStores',
        method: 'post',
        data: storeIds
    });
};
