import request from '../utils/request';

export const upload = (file) => {
    let formData = new FormData();
    formData.append("file", file);
    return request({
        url: '/upload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    });
};
