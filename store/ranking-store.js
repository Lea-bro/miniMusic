import {HYEventStore} from 'hy-event-store';

import {getRankings} from '../service/api_music'
const RankingName ={0:'newRanking',1:'hotRanking',2:'originRanking',3:'upRanking'}
const rankingStore = new HYEventStore({
  state:{
    newRanking:{},
    hotRanking:{},
    originRanking:{},
    upRanking:{},
  },
  actions:{
    // 0:新歌榜 1:热门榜 2:原创榜 3:飙升榜
    getRankingDataAction(ctx){
      for(let i = 0; i < 4;i++){
        getRankings(i).then(res =>{
          ctx[RankingName[i]] = res.playlist
        })
      }
      
    }
  }
})

export {rankingStore}