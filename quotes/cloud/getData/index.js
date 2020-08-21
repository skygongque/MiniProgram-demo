// 云函数入口文件
const cloud = require('wx-server-sdk')
const COLLECTIONNAME = "goodReader";
// quotesJson
cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   return cloud.database().collection("quotesJson").get()
// }

function getTotalCount() {
  return cloud.database().collection(COLLECTIONNAME).count();
}

function getPageData(limit, offset) {
  return cloud.database().collection(COLLECTIONNAME)
    .limit(limit)
    .skip(offset)
    .get()
}

function sum(limit, offset) {
  return limit + offset
}

// 每次都查询totalCount有点浪费
async function getRandom() {
  var totalCount = await cloud.database().collection(COLLECTIONNAME).count();
  var numRandom = Math.floor(Math.random() * Number(totalCount.total))
  console.log("numRandom", numRandom)
  return cloud.database().collection(COLLECTIONNAME)
    .limit(1)
    .skip(numRandom)
    .get()
}

function getRamdom2(totalCount) {
  console.log(totalCount);
  var numRandom = Math.floor(Math.random() * Number(totalCount))
  console.log("numRandom", numRandom)
  return cloud.database().collection(COLLECTIONNAME)
    .limit(1)
    .skip(numRandom)
    .get()
}

// 按照id获取
function getDataById(id) {
  return cloud.database().collection(COLLECTIONNAME).doc(id).get();
}
// 按照ids获取
async function getDataByIdList(idList) {
  var restul = []
  for (var i = 0; i < idList.length; i++) {
    var temp = await cloud.database().collection(COLLECTIONNAME).doc(idList[i]).get();
    restul.push(temp)
  }
  return restul;
}

exports.main = async (event, context) => {
  if (event.hasOwnProperty("limit") && event.hasOwnProperty("offset")) {
    return getPageData(event.limit, event.offset)
  } else if (event.hasOwnProperty("getRandom") && event.hasOwnProperty("totalCount")) {
    return getRamdom2(event.totalCount)
  } else if (event.hasOwnProperty("totalCount")) {
    return getTotalCount();
  } else if (event.hasOwnProperty("getRandom")) {
    return getRandom();
  } else if (event.hasOwnProperty('id')) {
    return getDataById(event.id)
  } else if (event.hasOwnProperty('idList')) {
    return await getDataByIdList(event.idList)
  }
}