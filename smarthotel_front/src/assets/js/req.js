import axios from "axios";

let req = function ({url, data, params,success,method})  {
  method = (method===undefined || method===null)?"POST":method;
  return new Promise(resolve => {
    axios({
      url: `/api` + url,
      method: method,
      params: params,
      data: data,
    }).then(res => {
      if (res.status === 200) {
        if (success !== undefined) {
          success(res.data)
        }
        resolve(res.data);
      }
      else{
        console.log(res);
      }
    })
  })
}

export default req;
