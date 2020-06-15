import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://localhost:8874/',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem("Authorization");
        if (token) {
            config.headers.token = token;
        }
        // 鉴权参数设置
        if (config.method === 'get') {
            //get请求下 参数在params中，其他请求在data中
            config.params = config.params || {};
        } else {
            config.data = config.data || {};
            //一些参数处理
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);



/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                if (response.data.code === 200) {
                    //返回成功处理  这里传的啥 后续调用的时候 res就是啥
                    resolve(response.data.data);//我们后台所有数据都是放在返回的data里所以这里统一处理了
                } else {
                    //错误处理
                    Toast(response.data.msg)
                }
            })
            .catch(err => {
                reject(err);
                let message = '请求失败！请检查网络';
                //错误返回
                if (err.response) message = err.response.data.message;
                Toast(message)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                if (response.data.code === 200) {
                    resolve(response.data.data);
                } else {
                    Toast(response.data.msg)
                }
            }, err => {
                reject(err);
                let message = '请求失败！请检查网络';
                if (err.response) message = err.response.data.message;
                Toast(message)
            })
    })
}

export default service;
