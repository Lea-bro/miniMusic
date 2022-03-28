// pages/detail-video/index.js
import {
  getMvURL,
  getMvDetail,
  getMvRelated
} from '../../service/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrlInfo:{},
    mvDetail:{},
    mvRelated:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    // 1.获取传入的id
    const id = options.id
    
    // 2.获取页面的数据
    this.getPageData(id)
  },

  // 其他逻辑
  getPageData:async function(id){
    // 1.请求播放地址
    const mvUrl = await getMvURL(id)
    // 2.请求播放信息
    const mvDetail = await getMvDetail(id)
    // 3.请求相关视频
    const mvRelated = await getMvRelated(id)
    this.setData({
      mvUrlInfo:mvUrl.data,
      mvDetail:mvDetail.data,
      mvRelated:mvRelated.data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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