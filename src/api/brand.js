import request from '../utils/request';


export const brandPage = (params) => {

    return request({
        url: '/brand/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/brand/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/brand/update',
        method: 'post',
        data: params
    });
};
export const deleteBrand = (brandId) => {

    return request({
        url: '/brand/delete/' + brandId,
        method: 'post'
    });
};

export const deleteBrands = (brandIds) => {

    return request({
        url: '/brand/deleteBrands',
        method: 'post',
        data: brandIds
    });
};


export const listAllBrand = () => {

    return request({
        url: '/brand/findAll',
        method: 'get'
    });
};