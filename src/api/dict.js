import request from '../utils/request';


export const findPage = (params) => {

    return request({
        url: '/dict/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/dict/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/dict/update',
        method: 'post',
        data: params
    });
};
export const deleteDict = (dictId) => {

    return request({
        url: '/dict/delete/' + dictId,
        method: 'post'
    });
};


export const findDictItemPage = (params) => {

    return request({
        url: '/dict/findDictItemPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const addDictItem = (params) => {

    return request({
        url: '/dict/addDictItem',
        method: 'post',
        data: params
    });
};

export const updateDictItem = (params) => {

    return request({
        url: '/dict/updateDictItem',
        method: 'post',
        data: params
    });
};
export const deleteDictItem = (dictItemId) => {

    return request({
        url: '/dict/deleteDictItem/' + dictItemId,
        method: 'post'
    });
};

