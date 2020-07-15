import request from '../utils/request';


export const bannerPage = (params) => {

    return request({
        url: '/banner/findPage/' + params.pageNum + "/" + params.pageSize,
        method: 'post',
        data: params
    });
};

export const add = (params) => {

    return request({
        url: '/banner/add',
        method: 'post',
        data: params
    });
};

export const update = (params) => {

    return request({
        url: '/banner/update',
        method: 'post',
        data: params
    });
};
export const deletebanner = (bannerId) => {

    return request({
        url: '/banner/delete/' + bannerId,
        method: 'post'
    });
};

export const deleteBanners = (bannerIds) => {

    return request({
        url: '/banner/deleteBanners',
        method: 'post',
        data: bannerIds
    });
};


export const listAllbanner = () => {

    return request({
        url: '/banner/findAll',
        method: 'get'
    });
};