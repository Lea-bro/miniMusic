import LbRequest from './index';

export  function getSearchHot() {
  return LbRequest.get('/search/hot')
}

export function getSearchSuggest(keywords) {
  return LbRequest.get('/search/suggest',{
    keywords,
    type:"mobile"
  })
}
export function getSearchResult(keywords) {
  return LbRequest.get('/search',{
    keywords
  })
}