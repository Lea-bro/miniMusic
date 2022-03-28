// pages/home-video/index.js
import {getVideo} from '../../service/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs:[],
    hasMore:true
  },

  onLoad: async function (options) {
    this.getTopMvData(0)
  },

  // 封装代码
  getTopMvData:async function (offset) {
    // 判断是否可以请求
    if(!this.data.hasMore && offset !== 0) return

    // 展示动画
    wx.showNavigationBarLoading()

    // 请求数据
    const res = await getVideo(offset)
    let newData = this.data.topMvs
    if(offset === 0){
      newData = res.data
    } else{
      newData = newData.concat(res.data)
    }

    //保存数据 
    this.setData({topMvs:newData})
    this.setData({hasMore:res.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0){
      wx.stopPullDownRefresh()
    }
  },

  // 点击响应代码
  handleVideoItemClick(event){
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  },
  
  // 其他生命周期
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
  onPullDownRefresh:async function(){
    this.getTopMvData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.getTopMvData(this.data.topMvs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})