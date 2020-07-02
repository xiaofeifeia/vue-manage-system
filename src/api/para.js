import request from '../utils/request';


export const paraPage = (params) => {

    return request({
        url: '/para/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/para/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/para/update',
        method: 'post',
        data: params
    });
};
export const deletePara = (paraId) => {

    return request({
        url: '/para/delete/' + paraId,
        method: 'post'
    });
};

export const deletparas = (paraIds) => {

    return request({
        url: '/para/deletParas',
        method: 'post',
        data: paraIds
    });
};
