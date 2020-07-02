import request from '../utils/request';

export const listAllTemplate = () => {
    return request({
        url: '/template/findAll',
        method: 'get'
    });
};


export const templatePage = (params) => {

    return request({
        url: '/template/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/template/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/template/update',
        method: 'post',
        data: params
    });
};
export const deleteTemplate = (templateId) => {

    return request({
        url: '/template/delete/' + templateId,
        method: 'post'
    });
};

export const deleteTemplates = (templateIds) => {

    return request({
        url: '/template/deleteTemplates',
        method: 'post',
        data: templateIds
    });
};