import {LbLogin} from './index'

// 获取个人code
export function getLoginCode() {
  return new Promise((resolve,reject) =>{
    wx.login({
      timeout: 1000,
      success:function (res) {
        resolve(res.code)
      },
      fail:function (err) {
        reject(err)
      }
    })
  })
}

// code发送给服务器获取token
export function sendCode(code) {
  return LbLogin.post("/login",{
    code
  })
}
// 判断token是否过期
export function checkToken() {
  return LbLogin.post("/auth")
}
// 检查Session是否过期
export function checkSession() {
  return new Promise((resolve,reject) =>{
    wx.checkSession({
      success: (res) => {
        resolve(true)
      },
      fail:function (err) {
        reject(false)
      }
    })
  })
}