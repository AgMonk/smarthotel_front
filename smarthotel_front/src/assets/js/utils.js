// 获取对象类型
import axios from "axios";
import fi from "element-ui/src/locale/lang/fi";

let getTypeOf = function (obj) {
  let type = Object.prototype.toString.call(obj);
  return type.replace("[object ", "").replace("]", "");
}
// 格式化输出字符串
let format = function (template, ...data) {
  if (data === undefined || data.length === 0) {
    return template;
  }
  let d = data[0];
  let s = template;
  if (data.length === 1 && getTypeOf(d) === 'Object') {
    for (let key in d) {
      if (d.hasOwnProperty(key)) {
        let keyword = "{" + key + "}";
        while (s.includes(keyword))
        s = s.replace(keyword, d[key]);
      }
    }
    return s;
  }
  if (data.length > 1) {
    for (let i = 0; i < data.length; i++) {
      s = s.replace("{}", data[i]);
    }
    return s;
  }
  return template;
}
//Date对象格式化方法
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
//格式化日志方法
console.slf4j = function  (template, ...data){
  console.log(format (template, ...data))
}
//字符串格式化方法
String.prototype.format = function (...data) {return format(this, ...data)}
console.clear()
/**
 * 获取地址栏参数
 * @param key 参数名
 * @param index 第x个该参数
 */
let getParam = function(key,index){
  let params =[];
  let location = window.location.href;
  location.substr(location.indexOf("?")+1).split("&").forEach(s=>{
    let d = s.split("=");
    if(d[0]===key){
      params.push({key:d[0],value:d[1]})
    }
  })
  index = index===undefined?0:index-1;
  return params[index];
}
//数组按字段搜索对象
Array.prototype.searchByField = function(field,keyword){
  for (let i = 0; i < this.length; i++) {
    let item = this[i];
    if (item.hasOwnProperty(field) && item[field] === keyword) {
      return item;
    }
  }
}

let loginVerification = (that,success,...args)=>{
  axios("/api/user/info").then(res => {
    console.log(res)
    if (res.data.code === 3000) {
      that.$message(res.data.message)
      window.location.href = "/#/me"
    }else{
      success(...args)
    }
  })
}

let exists = (obj)=>obj!==undefined&&obj!==null;

export {
  getTypeOf,
  exists,
  format,
  getParam,
  loginVerification,
}
