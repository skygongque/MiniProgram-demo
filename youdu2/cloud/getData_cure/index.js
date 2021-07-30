// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const COLLECTIONNAME = "cure";


function getPageData(limit, offset) {
  return cloud.database().collection(COLLECTIONNAME)
    .limit(limit)
    .skip(offset)
    .get()
}


// 云函数入口函数
exports.main = async (event, context) => {
  if (event.hasOwnProperty("limit") && event.hasOwnProperty("offset")) {
    return {
      'code':1,
      'data':await getPageData(event.limit, event.offset)
    }
  }else{
    return {
      'code':2,
      'msg':'no limit or offset'
    }
  }
}