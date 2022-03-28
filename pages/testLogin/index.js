// pages/testLogin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 事件处理
  handleLoginClick:function (params) {
    const appId = wx.getAccountInfoSync().miniProgram.appId
    const secret = 'f8071daf43c359563f4b1eb5275aba7b'
    // console.log("appId",accountInfo.miniProgram.appId)
    wx.login({
      success(res){
        // console.log("code",res.code)
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${res.code}&grant_type=authorization_code`,
          success:function (res) {
            console.log("111",res.data)
            // console.log("111",res.data.openid)
            // console.log("111",res.data.session_key)
          },
          fail:function(err) {
            console.log("222",err)
          }
        })
      }
    })

  },
  handleLoginClick2:function (params) {
    wx.checkSession({
      success () {
        console.log("未过期")
      },
      fail () {
        console.log("过期")
      }
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})