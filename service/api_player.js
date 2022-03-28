import LbRequest from './index';

export function getSongDataAction(ids) {
  return LbRequest.get('/song/detail',{
    ids
  }) 
}

export function getSongLyric(id) {
  return LbRequest.get('/lyric',{
    id
  })
}