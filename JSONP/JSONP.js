/*
参考文章： http://www.fly63.com/article/detial/4206
注意点： 1. 回调函数名总是相同，导致请求覆盖总是 2.创建的script标签要及时清除
jsonP 实现
*/

/*
遇到问题： 不知道如何Promisify，JSONP的响应
解决方法： 直接挂在window是
*/
const JSONP = (function (){
    let count = 0
    return (api, params) => (
        new Promise((resolve, reject) => {
            const script = document.createElement('script')
            const urlParams = Object.keys(params).reduce((queryStr, key) => {
                // 需要转义 -- 为什么要转义
                queryStr += `${key}=${params[key]}&`
                return queryStr
            }, '')
            // const baseUrl = window.location.host
            const callBackName = `JSONP_CB=JSON_CB${count}`
            window[callBackName] = (res) => {
                resolve(res)
            }
            // script.setAttribute('src', `${baseUrl}/${url}?${urlParams}${callBackName}`)
            // script.src = `${baseUrl}/${url}?${urlParams}${callBackName}` 这里拼接会变成
            /*
                http://www.fly63.com/article/detial/www.fly63.com//api/info?name=hww&age=555&JSONP_CB=JSON_CB2 
                如果前面没有http://话，就会自动添加 1.http://www.fly63.com/article/detial/  
            */
            script.setAttribute('src', `${api}?${urlParams}${callBackName}`)

            count++
            // document.body.head.appendChild(script) document.body.head无法获取到head
            document.getElementsByTagName('head')[0].appendChild(script)
            setTimeout(() => {
                script.parentElement.removeChild(script)
            }, 500)
        })
    )
})()

// 去除注释版，并添加 encodeURIComponent的处理
const JSONP = (function (){
    let count = 0
    return (api, params) => (
        new Promise((resolve, reject) => {
            const script = document.createElement('script')
            const urlParams = Object.keys(params).reduce((queryStr, key) => {
                // 需要转义 -- 为什么要转义
                queryStr += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
                return queryStr
            }, '')
            const callBackName = `JSONP_CB=JSON_CB${count}`
            window[callBackName] = (res) => {
                resolve(res)
            }
            script.setAttribute('src', `${api}?${urlParams}${callBackName}`)

            count++
            // document.body.head.appendChild(script) document.body.head无法获取到head
            document.getElementsByTagName('head')[0].appendChild(script)
            setTimeout(() => {
                script.parentElement.removeChild(script)
            }, 500)
        })
    )
})()