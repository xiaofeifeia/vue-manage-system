import request from '../utils/request';


export const specPage = (params) => {

    return request({
        url: '/spec/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/spec/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/spec/update',
        method: 'post',
        data: params
    });
};
export const deleteSpec = (specId) => {

    return request({
        url: '/spec/delete/' + specId,
        method: 'post'
    });
};

export const deletSpecs = (specIds) => {

    return request({
        url: '/spec/deletSpecs',
        method: 'post',
        data: specIds
    });
};
