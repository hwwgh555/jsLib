## 时间处理
/**
 * 根据时间差（秒），返回几天几小时几分几秒
*/
```
export function getDiffDate(diffSeconds) {
    // 计算出相差天数
    const days = Math.floor(diffSeconds / (24 * 3600 * 1000))

    // 计算出小时数
    const leave1 = diffSeconds % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000))
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000))
    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000)
    let str = `${days}天${hours}小时${minutes}分钟${seconds}秒`
    if (days === 0) {
        str = `${hours}小时${minutes}分钟${seconds}秒`
    }
    if (days === 0 && hours === 0) {
        str = `${minutes}分钟${seconds}秒`
    }
    if (days === 0 && hours === 0 && minutes === 0) {
        str = `${seconds}秒`
    }
    return str
}
```
// 格式化时间 20190304145736 => 2019/03/04 14:57:36
```
export function formatDateTime(dateTimeStr, dateSeparator = '/', timeSeparator = ':') {
    const stringTime = dateTimeStr.toString()
    if (stringTime.length === 14) {
        // 年月日时分秒 20190304145736
        const reg = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/
        return stringTime.replace(reg, `$1${dateSeparator}$2${dateSeparator}$3 $4${timeSeparator}$5${timeSeparator}$6`)
    }
    if (stringTime.length === 8) {
        // 年月日 20190304
        const reg = /^(\d{4})(\d{2})(\d{2})$/
        return stringTime.replace(reg, `$1${dateSeparator}$2${dateSeparator}$3`)
    }
    if (stringTime.length === 6) {
        // 时分秒 14:57:36
        const reg = /^(\d{2})(\d{2})(\d{2})$/
        return stringTime.replace(reg, `$1${timeSeparator}$2${timeSeparator}$3`)
    }
    return stringTime
}
```