## 查找

/**
 * 判断一个对象是否与一个检索字符串匹配。
 * 对象有两个可选的域值:
 *   - name:String 中文名称
 *   - py:String 拼音名称，例如“拼音”格式为 pin;yin;py;
 * @param {Object} item 具有 name 和 py 属性的对象
 * @param {String} search 目标匹配字符串
 * @return {Boolean}
 */
```
export function pyMatch({ name = '', py = '' }, search = '') {
    if (!search) return true;
    const len = search.length;
    const pyParts = py.slice(0, -1).split(';');
    const quanpin = pyParts.slice(0, -1).reduce((ret, val, idx, arr) => {
        return ret.concat(arr.slice(idx).join(''));
    }, []);
    const jianpin = pyParts.slice(-1).join('');
    return (name.indexOf(search) !== -1
        || jianpin.indexOf(search) !== -1
        || !!quanpin.find(spell => spell.substr(0, len) === search)
    );
}
```
