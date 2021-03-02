/**
 * 从缓存中查找数据 否则请求数据并放入缓存
 * @param local         true = 使用localStorage ；false = 使用sessionStorage
 * @param key             obj的字段名
 * @param expiresMinutes    过期时长（秒）
 * @param requestMethod     当缓存中无数据时用以请求数据的方法
 * @param param             请求数据方法的参数
 */
let getData = function (local, key, expiresMinutes, requestMethod, ...param) {
  let storage = local ? localStorage : sessionStorage;
  let expires = key + "Expires";
  let p = storage.getItem(key);
  let pe = storage.getItem(expires);
  let parse = JSON.parse(p);
  let now = new Date().getTime();
  console.log("key = " + key)
  //当localStorage中有数据，且在有效期内时，直接返回当中的数据
  if (p !== null && now - pe < 1000 * 60 * expiresMinutes) {
    return new Promise(resolve => {
      console.log(parse)
      resolve(parse);
    });
  }
  //当localStorage中无数据，或数据过期时，执行请求方法获取数据，并将获取到的数据存储到localStorage中
  return new Promise(resolve => {
    requestMethod(...param).then(res => {
      if (res === null) {
        alert("数据请求失败");
      }
      storage.removeItem(key)
      storage.removeItem(expires)
      storage.setItem(key, JSON.stringify(res));
      storage.setItem(expires, JSON.stringify(now));
      console.log(res)
      resolve(res);
    });
  })
}
export default getData;
