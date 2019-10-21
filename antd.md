## antd组件相关

```
// 计算整张表的列宽宽度之和
export function getTableTotalWidth(cols = []) {
    let width = 0
    function loops(columns = []) {
        columns.map((item) => {
            if (item.children) {
                loops(item.children)
            } else if (item.width) {
                width += parseInt(item.width, 10)
            } else {
                width += 100
            }
            return null
        })
    }
    loops(cols)
    return width
}
```