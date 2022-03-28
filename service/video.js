import LbRequest from './index';

// 获取视频的接口
export function getVideo(offset,limit = 10){
  return LbRequest.get('/top/mv',{
    offset,
    limit
  })
}

// 请求mv播放地址
export function getMvURL(id) {
  return LbRequest.get("/mv/url",{
    id
  })
}

// 请求mv数据
export function getMvDetail(mvid) {
  return LbRequest.get("/mv/detail",{
    mvid
  })
}

// 请求相关视频
export function getMvRelated(id) {
  return LbRequest.get('/related/allvideo',{
    id
  })
}