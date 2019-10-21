## 下载与上传
* 导出
```
export function mes3ExportExcel(options, other = {}) {
    const groupID = getAccountInfo().groupID
    const {
        service = service_MES3,
        method,
        params,
        exportId = 'MESExportExcelForm',
        isBlob = false,
        fileName = '',
    } = options
    if (!isBlob) {
        const form = $(`<form id="${exportId}Export"></form>`)

        form.attr('action', exportUrl)
        form.attr('method', 'get')
        form.attr('target', '_self')

        form.append(`<input type="hidden" name="service" value="${service}" />`)
        form.append(`<input type="hidden" name="method" value="${method}" />`)
        form.append(`<input type="hidden" name="groupID" value="${groupID}" />`)

        for (const [k, v] of Object.entries(params)) {
            // 值出现undefined时会,打印失败
            form.append(`<input type="hidden" name="${k}" value="${typeof v === 'undefined' ? '' : v}" />`)
        }

        $('body').append(form)
        $(`#${exportId}Export`).submit()

        _.defer(() => $(`#${exportId}Export`).remove())
        return
    }
    if (!params.groupID) {
        console.log('groupID为必传项！')
        return
    }
	other.showLoading && other.showLoading()
    let url = exportUrl
    params.service = service_MES3
    params.method = method
    Object.keys(params).forEach((item, index) => {
        // 值出现undefined时会,打印失败
        if (index === 0) {
            url += `?${item}=${typeof params[item] === 'undefined' ? '' : params[item]}` 
        } else {
            url += `&${item}=${typeof params[item] === 'undefined' ? '' : params[item]}` 
        }
    })
    axios({
        url,
        method: 'get',
        data: {
            service,
            type: 'get',
            method: method,
            data: params,
        },
        responseType: 'blob',
    })
    .then((data) => {
        other.hideLoading && other.hideLoading()
        if (!data) {
            return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `${fileName}.xls`)

        document.body.appendChild(link)
        link.click()
    })
    .catch(err => {
        other.hideLoading && other.hideLoading()
        console.log('err', err)
    }) 
    
}
```
* 上传
```
export function axiosUpload(options) {
    const {
        service = serviceDefault,
        method = '/file/upload',
        file,
        fileParams = {},
        path,
        successCode = '000',
    } = options
    const params = new FormData()
    // 上的excel文件
    params.append('myFile', file)
    // 生产计划单excel导入时,传入的其它数据
    if (JSON.stringify(fileParams) !== '{}') {
        params.append('data', JSON.stringify(fileParams))
    }
    return axios.post(
        `${uploadUrl}?service=${service}&method=${method}`,
        params,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    )
        .then(response => {
            // const { success } = parseResponseJson(response, successCode)
            return response
            // if (success) {
            //     return path ? _.at(response, path)[0] : response
            // } else {
            //     return Promise.reject(response)
            // }
        })
}
```