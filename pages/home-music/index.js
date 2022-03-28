// pages/home-music/index.js
import {rankingStore,playerStore} from '../../store/index';

import {getBanners,getSongMenu} from '../../service/api_music';
import {getImageHeight} from '../../utils/query-rect';
import throttle from '../../utils/throttle';

const throttleQueryRect = throttle(getImageHeight,10);
const RankingName ={0:'newRanking',1:'originRanking',2:'upRanking'}


Page({

  data: {
    banners:[],
    recommendSong:[],
    hotSongMenu:[],
    recommendSongMenu:[],
    rankings:[],

    currentSongInfo:{},
    isPauseOrPlay: false,
     

    imageHeight:0,
    timer:0
  },
  onLoad: function (options) {
    // playerStore.dispatch("playMusicWithSongIdAction",{id:441491828})

    // 1.获取页面数据
    this.getPageData()

    // 2.发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")

    // 3.从store获取数据
    rankingStore.onState('hotRanking',res =>{
      const recommendSong = res.tracks?.slice(0,6)
      if(recommendSong){
        this.setData({recommendSong})
      }
    })
    rankingStore.onState('newRanking',this.getRankingHanle(0))
    rankingStore.onState('originRanking',this.getRankingHanle(1))
    rankingStore.onState('upRanking',this.getRankingHanle(2))

    // 4.从store获取当前歌曲信息
    playerStore.onStates(["pageData","isPauseOrPlay"],({
      pageData,
      isPauseOrPlay
    }) =>{
      if(pageData) this.setData({currentSongInfo:pageData})
      if(isPauseOrPlay !== undefined) this.setData({isPauseOrPlay})
      
    })


  },

  // 网络请求
  getPageData:async function(){
    const banners = await getBanners()
    const songMenu = await getSongMenu()
    const recommendSongMenu = await getSongMenu("华语")
    this.setData({
      banners:banners.banners,
      hotSongMenu:songMenu.playlists,
      recommendSongMenu:recommendSongMenu.playlists
    })
  },

  // 事件处理
  handleSearchClick:function () {
    wx.navigateTo({
      url: '/pages/detail-seach/index',
    })
  },
  handleImageHeight:function () {
    // throttleQueryRect('.swiper-image').then(res =>{
    //   this.setData({imageHeight:res})
    // })
    let timer = this.data.timer
    if(timer) clearTimeout(timer)
    timer = setTimeout(() =>{
      getImageHeight('.swiper-image').then(res =>{
            this.setData({imageHeight:res})
      })
    },500)
    this.setData({timer})
  },
  getRankingHanle:function (idx) {
      return (res) =>{
        if(Object.keys(res).length === 0) return 
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const playCount = res.playCount
        const songList = res.tracks.slice(0,3)
        const rankingObj = {name,coverImgUrl,playCount,songList}
        let rankings = this.data.rankings
        rankings[idx] = rankingObj
        this.setData({
          rankings
        })
      }
  },
  handleMoreClick:function (params) {
    this.navigateToDetailSongPage('hotRanking')
  },
  handleRingkingItemClick:function (event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = RankingName[idx]
    this.navigateToDetailSongPage(rankingName)
  },
  handlePlayListClick:function (event) {
    playerStore.setState('playListSongs',this.data.recommendSong)
    playerStore.setState('playListIndex',event.currentTarget.dataset.index)
  },
  hanleMusicPlayClick:function (params) {
    // if(!this.data.currentSongInfo.id){
    //   playerStore.dispatch("playMusicWithSongIdAction",{id:441491828})
    // }
    playerStore.dispatch("changeMusicPlayStatus",!this.data.isPauseOrPlay)
  },
  handleToolBarClick:function () {
    wx.navigateTo({
      url: `/pages/music-player/index?id=${this.data.currentSongInfo.id}`,
    })
  },
  navigateToDetailSongPage:function (rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  onUnload: function () {

  }
})