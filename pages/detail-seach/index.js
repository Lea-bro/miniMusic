// pages/detail-seach/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult
} from '../../service/api_search';
import throttle from '../../utils/throttle';
// const newHandleInput = throttle(handlethrottleFn)
let timer = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots:[],
    searchValue:'',
    suggestSongs:[],
    suggestSongsNodes:[],
    showSearchRes:true,
    resultSearchSong:[]
  },
  onLoad: function (options) {
    getSearchHot().then(res =>{
      this.setData({hots:res.result.hots})
    })
  },

  // 事件处理

  // 01.处理输入发送的网络请求
  handleInput:function (event) {
    // 1.获取输入值
    const searchValue = event.detail
    // 2.保存输入值
    this.setData({searchValue})
    // 3.判断输入值是否为空
    if(!searchValue.length) {
      this.setData({showSearchRes:true})
      return
    }
    // 4.根据输入值进行搜索
    this.handleThrottle(searchValue,(res) =>{
      const suggestSongs = res.result.allMatch
      if(!res.result.allMatch) return
      this.setData({suggestSongs})
      const suggestNodesList = suggestSongs.map(item => item.keyword)

      const suggestSongsNodes = []
      for (const keyword of suggestNodesList) {
        const nodes = []
        // 处理字体颜色，vnode节点
        if(keyword.toUpperCase().startsWith(searchValue.toUpperCase())){
          const key1 = keyword.slice(0,searchValue.length)
          const node1 = {
            name:"span",
            attrs:{style:"color:#26ce8a;font-size:14px;"},
            children:[{type:"text",text:key1}]
          }
          nodes.push(node1)

          const key2 = keyword.slice(searchValue.length)
          const node2 = {
            name:"span",
            attrs:{style:"color:#000000;font-size:14px;"},
            children:[{type:"text",text:key2}]
          }
          nodes.push(node2)
        } else{
          const node = {
            name:"span",
            attrs:{style:"color:#000000;font-size:14px;"},
            children:[{type:"text",text:keyword}]
          }
          nodes.push(node)
        }
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
      
    })
  },
  // 02.处理输入发送网络请求的节流函数
  handleThrottle:function (searchValue,fn) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() =>{
      getSearchSuggest(searchValue).then(fn)
      timer = 0
    },400)
  },
  // 03.处理确定搜索的点击
  handleSearchClick:function (event) {
    this.setData({showSearchRes:false})
    if(event.currentTarget.dataset.value !== undefined){
      const searchValue = event.currentTarget.dataset.value
      this.setData({searchValue})
    }

    // 获取搜索的结果
    getSearchResult(this.data.searchValue).then(res =>{
      // console.log(res.result.songs)
      this.setData({resultSearchSong:res.result.songs})
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