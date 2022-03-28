import LbRequest from './index';

export function getBanners() {
  return LbRequest.get("/banner",{
    type:2
  })
}

export function getRankings(idx){
  return LbRequest.get('/top/list',{
    idx
  })
}

export function getSongMenu(cat = "全部",limit = 6,offset = 0) {
  return LbRequest.get('/top/playlist',{
    cat,
    limit,
    offset
  })
}

// 歌单详情
export function getSongDetail(id) {
  return LbRequest.get("/playlist/detail/dynamic",{
    id
  })
  
}