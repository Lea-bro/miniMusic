
// 正则
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricSring) {
  const lyricSrings = lyricSring.split('\n')

  const lyricInfos = []
  for (const lineString of lyricSrings) {
    const timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue

    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000 
    const second = timeResult[2] * 1000 
    const millsecondTime = timeResult[3]
    const millsecond= millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
    const time =minute + second +millsecond
    // console.log(time)

    // 2.获取歌词
    const text = lineString.replace(timeRegExp,"")
    lyricInfos.push({time,text})
  }
  lyricInfos.push({time:999999,text:''})
  return lyricInfos
}