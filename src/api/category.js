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

export const updateIsMenu = (params) => {

    return request({
        url: '/category/updateIsMenu/' + params.id + "?isMenu=" + params.isMenu,
        method: 'post'
    });
};

export const updateIsShow = (params) => {

    return request({
        url: '/category/updateIsShow/' + params.id + "?isShow=" + params.isShow,
        method: 'post'
    });
};