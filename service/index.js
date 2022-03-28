const BASE_URL = "http://123.207.32.32:9001";

const BASE_URL_LOGIN = "http://123.207.32.32:3000";
const token = wx.getStorageSync('token_key')

class LbRequest{

  constructor(baseUrl,baseHeader = {}){
    this.baseUrl = baseUrl
    this.baseHeader = baseHeader
  }

  request(url,method,params,header = {}){
    if(Object.keys(header).length !== 0){
      this.baseHeader = {...header,...this.baseHeader}
    }
    return new Promise((resolve,reject) =>{
      wx.request({
        url: this.baseUrl + url,
        method:method,
        header:this.baseHeader,
        data:params,
        success:function(res){
          resolve(res.data)
        },
        fail:reject
      })
    })
  }

  get(url,params,header){
    return this.request(url,"GET",params,header)
  }

  post(url,data,header){
    return this.request(url,"POST",data,header)
  }
}

export default new LbRequest(BASE_URL)

export const LbLogin =  new LbRequest(BASE_URL_LOGIN,{token})