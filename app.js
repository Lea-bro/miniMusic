// app.js
import {getLoginCode , sendCode , checkToken , checkSession} from './service/api_login'

App({
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0
  },
  onLaunch:function (params) {
    // 1.获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight

    // 2.让用户默认进行登录
    // this.checkToken() 

    // 3.获取用户信息
  },
  async checkToken(){
    const token = wx.getStorageSync('token_key')  //判断本地是否有token
    // 检查token 是否过期
    const result = await checkToken()//检查token有没有过期,是否需要重新获取
    // console.log(result)
    // 检查session是否过期
    const session = await checkSession()
    // console.log(result,session)

    // 判断是否需要重新获取token
    if(!token || result.errorCode || !session){
      console.log("11")
      this.getToken()
    }  
  },
  getToken:async function () {
    // 1.获取code
    const code = await getLoginCode()
    console.log("code",code)
    
    //2.将code发送给服务器 
    const result = await sendCode(code)
    const token = result.token
    console.log("token",token)
    wx.setStorageSync('token_key', token)
  }
})
