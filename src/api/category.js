import request from '../utils/request';


export const categoryPage = (params) => {

    return request({
        url: '/category/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/category/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/category/update',
        method: 'post',
        data: params
    });
};
export const deleteCategory = (categoryId) => {

    return request({
        url: '/category/delete/' + categoryId,
        method: 'post'
    });
};

export const deletCategorys = (categoryIds) => {

    return request({
        url: '/category/deletCategorys',
        method: 'post',
        data: categoryIds
    });
};


export const listAllCategory = () => {

    return request({
        url: '/category/findAll',
        method: 'get'
    });
};

export const updateIsNav = (params) => {

    return request({
        url: '/category/updateIsNav/' + params.id + "?isNav=" + params.isNav,
        method: 'post'
    });
};

export const updateIsShow = (params) => {

    return request({
        url: '/category/updateIsShow/' + params.id + "?isShow=" + params.isShow,
        method: 'post'
    });
};

export const updateIsHot = (params) => {

    return request({
        url: '/category/updateIsHot/' + params.id + "?isHot=" + params.isHot,
        method: 'post'
    });
};