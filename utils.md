```js
replaceAndDeleteKey = (obj, keysMap) => {
 Object.entries(keysMap).forEach((keyArr) => {
     const [key, newKey] = keyArr
     if (obj[key] === undefined) throw new Error(`对象中不存在相应${key}值`)
     // eslint-disable-next-line no-param-reassign
     obj[newKey] = obj[key]
     // eslint-disable-next-line no-param-reassign
     delete obj[key]
 })
 
// demo
var o = {
    name: '555',
    age: 'hww',
}
var keysMap = {
    name: 'newName',
}
replaceAndDeleteKey(o, keysMap)
console.log(o) // { newName: '555', age: 'hww',}
```
作用：批量替换目标对象的key命名
应用场景：如后端接口与自己定义的变量名称不一致，ajax方式获取数据，统一修改变量名

```js
calMul = (v1,v2) => {
    var m = 0;
    var s1 = v1.toString();
    var s2 = v2.toString();
    try{
        m += s1.split(".")[1].length;
    }catch (e){
    }
    try{
        m += s2.split(".")[1].length;
    }
    catch (e){
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
```
作用： 处理js小数直接进行相乘时的精度问题处理 
其它替换方式：D



