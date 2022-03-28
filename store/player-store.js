import {HYEventStore} from 'hy-event-store';
import {getSongDataAction , getSongLyric } from '../service/api_player';
import { parseLyric } from '../utils/parse-lyric';

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state:{
    isFirstPlay:true,
    isStoping:false,

    id:0,
    pageData:{},
    duration:0,
    lyricInfo:[],

    currentTime:0,
    currentIndex:0,
    currentLyric:"",

    playModeIndex:0,  //0:顺序，1：单曲循环，2：随机播放
    isPauseOrPlay:false,

    playListSongs:[],
    playListIndex:0
  },
  actions:{
    playMusicWithSongIdAction(ctx,{id,isRefresh = false}){
      if(id === ctx.id && !isRefresh){
        this.dispatch("changeMusicPlayStatus",true)
        return
      }
      ctx.id = id
      // 修改播放状态
      ctx.isPauseOrPlay = true
      ctx.pageData = {}
      ctx.duration = 0
      ctx.lyricInfo = []
      ctx.currentTime = 0
      ctx.currentIndex = 0
      ctx.currentLyric = ""

      // 1.请求数据
      // 请求歌曲详情和歌曲总时长
      getSongDataAction(id).then(res =>{
        ctx.pageData = res.songs[0]
        ctx.duration = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyric = res.lrc.lyric
          // 对歌词格式做处理
        ctx.lyricInfo = parseLyric(lyric)
      })

      // 2.播放该歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      audioContext.title = "未知"

      // 3.对歌曲的监听
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    // 音乐状态监听
    setupAudioContextListenerAction(ctx){
      // 1.监听音乐可以播放
      audioContext.onCanplay(() =>{
        audioContext.play()
      })
      // 2.监听时间改变
      audioContext.onTimeUpdate(() =>{
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000
        
        // 2.保存当前时间currentTime
        ctx.currentTime = currentTime

        // 3.查找当前歌词
        if(!ctx.lyricInfo.length) return
        for(let i = 0 ; i < ctx.lyricInfo.length ; i++){
          const lyricInfo = ctx.lyricInfo[i]
          if(currentTime < lyricInfo.time){
            // 保存当前的歌词和索引
            const currentIndex = i - 1
            if(ctx.currentIndex !== currentIndex){
              const currentLyric = ctx.lyricInfo[currentIndex]
              
              ctx.currentLyric = currentLyric.text
              ctx.currentIndex = currentIndex
            } 
            break   
          }
        }
      })
      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
      // 4.监听背景音乐暂停/播放
      audioContext.onPlay(() =>{
        ctx.isPauseOrPlay = true
      })
      audioContext.onPause(() =>{
        ctx.isPauseOrPlay = false
      })
      // 5.监听音乐的停止
      audioContext.onStop(() => {
        ctx.isPauseOrPlay = false
        ctx.isStoping = true
      })
    },
    // 音乐的播放与暂停
    changeMusicPlayStatus(ctx,isPauseOrPlay){
      ctx.isPauseOrPlay = isPauseOrPlay
      if(ctx.isStoping && ctx.isPauseOrPlay){
        // audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = "未知"
        ctx.isStoping = false
      }
      if(!isPauseOrPlay){
        audioContext.pause()
      } else{
        audioContext.play()
      }
    },
    // 音乐切换
    changeNewMusicAction(ctx,info = 'next'){
      // 0.判断传入的切换方式
      const value = (info === 'prev') ? -1 : 1;
      // 1.获取当前需要播放歌曲在当前列表的索引
      let index = ctx.playListIndex + value
      if(index === ctx.playListSongs.length) index = 0  //最后一首跳第一首
      if(index === -1) index = ctx.playListSongs.length - 1  //第一首跳最后一首

      // 2.根据当前播放状态获取需要播放的id
      const playModeIndex = ctx.playModeIndex
      let id = 0
      switch(playModeIndex){
        case 0:  //顺序
           id = ctx.playListSongs[index].id
           break
        case 1:  //单曲
           id = ctx.playListSongs[index].id
           break
        case 2:  //随机
          const Listlength = ctx.playListSongs.length //[0,5] 6
          index = Math.floor(Math.random()*Listlength)
          id = id = ctx.playListSongs[index].id
          break
      }

      // 3.播放该歌曲/设置当前歌曲的索引
      this.dispatch("playMusicWithSongIdAction",{id,isRefresh:true})
      ctx.playListIndex = index
    },
    // 获取音乐播放
    playMusicAction(ctx){
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
      audioContext.autoplay = true
      audioContext.title = "未知"
    }

  }
})



export {
  audioContext,
  playerStore
}