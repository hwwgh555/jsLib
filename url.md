## url相关
/**
 * 将对象参数转化为URL参数
 * @param  {object} params 参数对象
 * @return {string}        URL参数字符串
 */
 ```
export function genUrlParams(params = {}) {
    return Object.keys(params).map(key => {
        const val = params[key]
        if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(val));
    }).join('&');
}
```
```
export function generateXWWWFormUrlencodedParams(opts) {
    if (!(opts instanceof Object || typeof opts === 'object')) {
        throw new Error('\'opts\' must be type of \'object\'.');
    }

    const params = Object.keys(opts)
        .filter((key) => {
            return !(opts[key] === null || undefined === opts[key]);
        })
        .map((key) => {
            let value = opts[key];
            if (value instanceof Set || value instanceof Map) {
                value = JSON.stringify([...value]);
            } else if (value instanceof Object || typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }).join('&');

    return params;
}
```
* 拼接url及参数
```
export function transferUrlAndObjectToQueryStr(url = '', params = {}){
	if (url.trim() === '') {
		throw Error('url不能为空!')
	}
	if (typeof params !== 'object' || JSON.stringify(params) === '{}'){
		throw Error('params需要是对象!')
	}
	const queryUrlStr = Object.keys(params).reduce((queryUrlStr, key) => {
		return queryUrlStr += `${key}=${params[key]}&`
	}, url + '?').slice(0, -1)
	return encodeURIComponent(queryUrlStr)
}
```
// 如何添加测试呢？
// typescript的好处之一，是不是不用写类型的判断提醒了？
* 获取url参数
```
export const parseUrlParams = () => {
    const params = {}
    const search = window.location.search.substr(1).split('&') || ''

    if (window.location.search) {
        search.forEach((param) => {
            param = param.split('=')
            params[param[0]] = decodeURIComponent(param[1])
        })
    }

    return params
}
```
