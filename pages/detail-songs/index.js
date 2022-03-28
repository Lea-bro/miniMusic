// pages/detail-songs/index.js
import { rankingStore,playerStore } from '../../store/index';
import { getSongDetail }  from '../../service/api_music';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking:"",
    songMenu:{},
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({type})

    if(type === 'menu'){
      const id = options.id
      getSongDetail(id).then(res =>{
        this.setData({songMenu:res.playlist})
      })
    } else if(type === 'rank'){
      const ranking = options.ranking
      this.setData({ranking})
      // 1.根据传过来的name从store获取数据
      rankingStore.onState(ranking,this.getRankingData)
    }
  },

  onUnload: function () {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking,this.getRankingData)
    }
  },

  // 事件处理
  getRankingData:function (res) {
    this.setData({songMenu:res})
  },
  handlePlayListClick:function (event) {
    playerStore.setState('playListSongs',this.data.songMenu.tracks)
    playerStore.setState('playListIndex',event.currentTarget.dataset.index)
  },
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