// pages/music-player/index.js
import {getSongDataAction , getSongLyric } from '../../service/api_player';
import { NavBarHeight } from '../../constants/device-const';
import {audioContext,playerStore } from '../../store/index'; 
import { parseLyric } from '../../utils/parse-lyric';

const playModeNames = ["order","repeat","random"]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    pageData:{},
    duration:0,
    lyricInfo:[],

    currentTime:0,
    currentIndex:0,
    currentLyric:"",

    playModeIndex:0,
    playModeName:"order",
    isPauseOrPlay:false,
    PauseOrPlayImage:"pause", //"resume"

    tabStyleColor:false,
    contentHeight:0,
    currentValue:0,
    isOnTime:true,
    scrollBar:0
  },

  onLoad: function (options) {
    // 1.获取id
    const id = options.id
    this.setData({id})

    // 2.通过store获取数据
    this.setupPlayStoreListener()

    // 3.获取内容高度
    const screenHeight = getApp().globalData.screenHeight
    const statusBarHeight = getApp().globalData.statusBarHeight
    const contentHeight = screenHeight - statusBarHeight - NavBarHeight
    this.setData({contentHeight})

    // 4.播放音乐创建audio上下文
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    // 5.audioContext的监听
    // this.audioContextListener()
    // 6.获取歌词
    // getSongLyric(id).then(res => {
    //   const lyric = res.lrc.lyric
    //   const lyricInfo = parseLyric(lyric)
    //   this.setData({lyricInfo})
    //   // console.log(lyricInfo)
    // })
  },
  // 事件监听
  // audioContextListener:function () {
  //   audioContext.onCanplay(() =>{
  //     audioContext.play()
  //   })
  //   audioContext.onTimeUpdate(() =>{
  //     // 1.获取当前时间
  //     const currentTime = audioContext.currentTime * 1000
      
  //     // 2.根据当前时间修改sliderValue/currentTime
  //     if(this.data.isOnTime){
  //       this.setData({currentTime})
  //       const currentValue = (currentTime/this.data.duration)*100
  //       this.setData({currentValue})
  //     }
  //     // 3.查找当前歌词
  //     if(!this.data.lyricInfo.length) return
  //     for(let i = 0 ; i < this.data.lyricInfo.length ; i++){
  //       const lyricInfo = this.data.lyricInfo[i]
  //       if(currentTime < lyricInfo.time){
  //         const currentIndex = i - 1
  //         if(this.data.currentIndex !== currentIndex){
  //           const currentLyric = this.data.lyricInfo[currentIndex]
  //           // const scrollBar = currentIndex * 35
  //           this.setData({
  //             currentLyric:currentLyric.text,
  //             currentIndex,
  //             scrollBar:currentIndex * 35})
  //         } 
  //         break   
  //       }
  //     }
  //   })
  // },

  // getSongData:function (id) {
    //   getSongDataAction(id).then(res =>{
      //     this.setData({pageData:res.songs[0],duration:res.songs[0].dt})
      //   })
      // },

  // =========================== 事件处理
  handleCurrentChange:function () {
    this.setData({tabStyleColor:!this.data.tabStyleColor})
  },
  handleDragClick:function (event) {
    // audioContext.pause()
    // 1.获取当前slider的值
    const value = event.detail.value
    // 2.设置最新的sliderValue
    this.setData({currentValue:value})
    // 3.计算需要播放的当前时间
    const currentTime = this.data.duration * value / 100
    // 4.把歌曲跳转到当前时间
    audioContext.seek(currentTime / 1000)
    // 5.判断是否需要改变isOnTime
    if(this.data.isOnTime === false) {
      this.setData({isOnTime:true})
    }
    // audioContext.play()
  },
  handleDragChangingClick:function (event) {
    const value = event.detail.value
    const currentTime = this.data.duration * value / 100
    this.setData({isOnTime:false,currentTime})
  },
  handlePlayModeIndexClick:function () {
    let index = this.data.playModeIndex
    if(index === 2){
      index = 0
    } else{
      index = index + 1
    }
    playerStore.setState('playModeIndex',index)
  },
  handlePauseClick:function () {
    playerStore.dispatch("changeMusicPlayStatus",!this.data.isPauseOrPlay)
  },
  handlePrevMusicClick:function () {
    playerStore.dispatch("changeNewMusicAction","prev")
  },
  handleNextMusicClick:function () {
    playerStore.dispatch("changeNewMusicAction")
  },
  setupPlayStoreListener:function () {
    // 1.监听了 pageData/duration/lyricInfo
    playerStore.onStates(["pageData","duration","lyricInfo"],({pageData,duration,lyricInfo}) =>{
      if(pageData) this,this.setData({pageData})
      if(duration) this,this.setData({duration})
      if(lyricInfo) this,this.setData({lyricInfo})
    })
    // 2.监听currentTime/currentIndex/currentLyric
    playerStore.onStates(["currentTime","currentIndex","currentLyric"],({currentTime,currentIndex,currentLyric})=>{
      // 时间变化
      if(currentTime && this.data.isOnTime){
        const currentValue = (currentTime/this.data.duration)*100
        this.setData({currentTime,currentValue})
      }
      // 歌词变化
      if(currentIndex){
        this.setData({currentIndex,scrollBar:currentIndex*35})
      }
      if(currentLyric){
        this.setData({currentLyric})
      }
    })

    // 3.监听播放模式
    playerStore.onState("playModeIndex",(playModeIndex) =>{
      this.setData({playModeIndex,playModeName:playModeNames[playModeIndex]})
    })
    
    // 4.监听播放状态
    playerStore.onState("isPauseOrPlay",(isPauseOrPlay) =>{
      const PauseOrPlayImage = isPauseOrPlay ? "pause" : "resume"
      this.setData({isPauseOrPlay,PauseOrPlayImage})
    })
  },
  onUnload: function () {

  }
})