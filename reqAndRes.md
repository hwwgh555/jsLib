## 请求与响应
/**
 * 解析后台响应是否正常
 * @param  {Object} rsp 响应
 * @param {String} successCode
 * @return {Object} { success:Boolean, code:String, msg:String }
 */
```
function parseResponseJson(rsp, successCode) {
    const resultcode = rsp.resultcode === undefined ? rsp.code : rsp.resultcode;
    const resultmsg = _.result(rsp, 'subErrorMsg',
        _.result(rsp, 'resultmsg',
            _.result(rsp, 'msg',
                _.result(rsp, 'message')
            )
        )
    );
    const isSuccess = rsp.success !== undefined ? rsp.success : (resultcode === successCode);
    const doRelogin = resultcode === '0011111100000001'
        || resultcode === 'RELOGIN001'
        || resultcode === 'FP10005';
    return {
        success: isSuccess,
        code: resultcode,
        msg: resultmsg || rsp.statusText || '网络错误，请稍后重试',
        redirect: doRelogin,
    };
}
```

```
/**
 * 接口请求通道锁
 */
```
const _channelUtils = (function () {
    const _fakePromise = {
        then: () => _fakePromise,
        catch: () => { },
    };
    let _choked = [];
    return {
        lock: (name, fn) => {
            const channel = _choked.find(ch => ch === name);
            warning(!channel, `fetchData: channel '${name}' is busy.`);
            if (channel) return _fakePromise;
            _choked.push(name);
            return fn();
        },
        unlock: (name) => {
            _choked = _choked.filter(ch => ch !== name);
        },
    };
}());
/**
 * 将对象参数转化为POST参数
 * @param  {string} type   数据格式('json'/'form')
 * @param  {object} params 参数对象
 * @return {string|object} 参数字符串或FormData对象
 */
function genPostParams(type, params = {}) {
    const _type = type.toUpperCase();
    if (type === 'JSON') return JSON.stringify(params);
    if (type === 'FORM') {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            formData.append(key, params[key]);
        });
        return formData;
    }
    return genUrlParams(params);
}
```

```
export const SCCache = {
    has: (key) => {
        const sccache = SCGlobal.sccache
        return sccache && sccache.hasOwnProperty(key)
    },
    get: (key) => {
        const sccache = SCGlobal.sccache

        if (!sccache) {
            return null
        }

        return sccache[key]

    },
    set: (key, value) => {
        SCGlobal.sccache = SCGlobal.sccache || {}

        const sccache = SCGlobal.sccache
        sccache[key] = value
    },
    delete: (key) => {
        const sccache = SCGlobal.sccache

        if (!sccache) {
            return
        }

        delete sccache[key]
    }
}
```
/**
 * 组装 fetch 函数的调用参数
 * @param  {[type]} api    [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
 ```
export function genFetchArguments(api, params) {
    const { url, options: { method, type, credentials } } = getApiConfig(api);
    const _method = method.toUpperCase();
    const _type = type.toUpperCase();
    const getContentType = (type) => {
        let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (type === 'JSON') contentType = 'application/json;charset=UTF-8';
        if (type === 'FORM') contentType = '';
        return contentType ? { 'content-type': contentType } : {};
    };
    const _url = _method == 'GET' ? (url + '?' + genUrlParams(params)) : url;
    const headers = { ...getContentType(_type), 'groupID': params.groupID, 'traceID': uuid() };
    const body = _method == 'POST' ? { body: genPostParams(_type, params) } : {};
    return { url: _url, method: _method, headers, credentials, ...body };
}
```

/**
 * 封装的 fetch 方法
 * !!This method can only be called on client side!!
 *
 * @param  {String}   api     API name, should be defined in './callserver.jsx'.
 * @param  {Object}   params  Request parameters.
 * @param  {Any}      cache   Use local cache without a remote request.
 * @param  {Object}   options See as follows.
 * @return {Promise}
 */
 ```
export function fetchData(api, params, cache, {
    delay = 0,              // delay for cached data
    path = 'data.records',  // path for response
    throttle = 500,         // wait time for frequent ajax request; pass false to turn off
    disablePrompt = false,
    successCode = '000'
} = {}, callback) {
    const channel = `${api}_${JSON.stringify(params)}`;
    const actionFn = () => new Promise((resolve, reject) => {
        // use cache
        if (cache !== undefined && cache !== null) {
            return _.delay(() => {
                resolve(cache);
                _channelUtils.unlock(channel);
            }, delay);
        }

        // fetch data from remote server
        const { groupID } = getAccountInfo();
        const reqParams = {
            ...(groupID ? { groupID, _groupID: groupID } : {}),
            ...params,
        };
        const { url, ...options } = genFetchArguments(api, reqParams);
        fetch(url, options).then(response => {
            // unlock channel
            _.delay(_channelUtils.unlock, throttle, channel);

            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        }).then(json => {
            const { redirect, success, code, msg } = parseResponseJson(json, successCode);
            if (!success) {
                callback && callback()
                if (serverErrorCode(code)) {
                    traceAndRecordAjaxError({ "requestUri": url, "traceID": options.headers.traceID });
                    !disablePrompt && Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: <div style={{ 'overflowWrap': 'break-word' }}>{msg}</div>,
                    });
                } else {
                    !disablePrompt && Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: redirect ? `您的帐号已在其他终端登录，请退出后重新登录。` : <div style={{ 'overflowWrap': 'break-word' }}>{msg}</div>,
                    });
                }
                redirect && window.setTimeout(() => doRedirect(), 3000);
                reject({ code, msg, response: json });
            }

            if (!path) resolve(json);
            else {
                const paths = path.split('.');
                const data = paths.reduce((ret, path) => {
                    if (!ret) return ret;
                    return ret[path];
                }, json);
                resolve(data);
            }
        }).catch(error => {
            reject(error);
            traceAndRecordAjaxError({ "requestUri": url, "traceID": options.headers.traceID });
        });
    });
    if (throttle === false) return actionFn();
    return _channelUtils.lock(channel, actionFn);
}
```

```
export function axiosFetch(options) {
    const { groupID } = getAccountInfo();
    const {
        service = serviceDefault,
        type = 'post',
        method,
        params = {},
        path = '',
        cache = false,
        successCode = '000',
        ...others
    } = options

    params.groupID === undefined ? params.groupID = groupID : null

    if (!type || !method) {
        return Promise.reject()
    }

    // 获取缓存key
    const ck = transUrlAndParamsToStr(method, params)

    // 返回缓存结果
    if (cache && SCCache.has(ck)) {
        return Promise.resolve(path ? _.at(SCCache.get(ck), path)[0] : SCCache.get(ck))
    }

    // 发送请求
    return axios[type](url, {
        service,
        type: type,
        method: method,
        data: params,
    })
        .then(response => {
            const { success, code, msg } = parseResponseJson(response, successCode)

            if (success && cache) {
                SCCache.set(ck, response)
            }

            if (success) {
                return path ? _.at(response, path)[0] : response
            } else {
                if (serverErrorCode(code)) {
                    traceAndRecordAjaxError({
                        requestUri: method,
                        traceID: uuid()
                    })
                }

                throw new Error(msg)
            }
        })
        .catch(error => {
            if (error.message) {
                Modal.error({
                    title: '啊哦！好像有问题呦~~',
                    content: <div style={{ 'overflowWrap': 'break-word' }}>{error.message}</div>,
                })
            }

            return Promise.reject()
        })
}
```