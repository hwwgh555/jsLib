## DOM查询伪数组转换为数组
```
let $eles = document.querySelectorAll("selector");
let eleArr = Array.from($eles);
```

## 查找最近的父元素
```
let $ele = document.querySelector(".selector");
const closestParentEle = $ele.closest('div.parent');
// 找不到则返回null
````