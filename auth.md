## 权限
```
export function doRedirect() {
    const host = window.location.host;
    const match = host.match(/^((\w+)\.)?.*shop\.xxx\.com$/);
    const env = match ? (match[2] || 'release') : 'dohko';
    const passportUrl = PASSPORT_URL[env] || PASSPORT_URL.release;
    window.location = `${passportUrl}/login?redirectURL=http%3A%2F%2F${host}`;
}
```

/**
 * Uses a binary search to find the first element in a list.
 * @param {Array} array List where to apply the search.
 * @param {Any} value Target search value.
 * @param {Function} iteratee Custom predicator.
 */
 ```
function sortedFindBy(
    array = [],
    value = '',
    iteratee = item => item,
) {
    const findIdx = _.sortedIndexBy(array, value, iteratee);
    const findResult = array[findIdx];
    if (findResult && iteratee(findResult) === iteratee(value)) return findResult;
    return null;
}
```

/**
 * 检查当前账户是否具有该权限
 * @param {String} rightCode 权限编码，多个编码用逗号隔开，有任一权限即可通过检查
 * @return {Boolean}
 */
```
export function checkPermission(rightCode) {
    const rightList = getRightListFromRedux();
    if (!rightCode || !rightList || !rightList.length) return false;
    const rightCodes = rightCode.split(',');
    return !!rightCodes.find(
        code => !!sortedFindBy(rightList, { rightCode: code }, right => right.rightCode)
    );
}
```
