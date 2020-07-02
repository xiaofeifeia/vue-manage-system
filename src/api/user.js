import request from '../utils/request';

export const login = (params) => {

    return request({
        url: '/user/login',
        method: 'post',
        data: params
    });
};

export const userPage = (params) => {

    return request({
        url: '/user/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/user/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/user/update',
        method: 'post',
        data: params
    });
};
export const deleteUser = (userId) => {

    return request({
        url: '/user/delete/' + userId,
        method: 'post'
    });
};

export const deleteUsers = (userIds) => {

    return request({
        url: '/user/deleteUsers',
        method: 'post',
        data: userIds
    });
};


export const resetPwd = (userId) => {

    return request({
        url: '/user/resetPwd/' + userId,
        method: 'post',
    });
};
