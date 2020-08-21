// pages/randomquote/randomquote.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: {},
    // openID:'',
    // hasUserInfo: false,
    userOpenID:null,
    total:null,
    quotesfromDB: [],
    canIUseClipboard: wx.canIUse('setClipboardData'),
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotalCount(this.loadRandomData);
    // console.log(this.data)
    // this.loadRandomData()
    // 获取用户信息
    // this.getUserInfo()
    // this.getOpenId()
    this.setOpenID()
    // console.log(app.globalData.userOpenID)
  },
  setOpenID(){
    if (app.globalData.userOpenID){
      this.setData({
        userOpenID:app.globalData.userOpenID
      })
    }
  },
  collectMain(){
    this.setOpenID();
    // 查询并增加或更新
    this.onQuery(this.data.userOpenID,this.handleQueryRes);
  },
  // 收藏quotes
  collectQuote(id,userOpenID){
    var data = {
      openID:userOpenID,
      collection:[id]
    }
    this.onAdd(data);
  },
  onAdd: function (data) {
    const db = wx.cloud.database()
    db.collection('userCollection').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onQuery: function(userOpenID,callback) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('userCollection').where({
      _openid: userOpenID
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        callback(res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      
      }
    })
  },
  onUpdate: function(data) {
    const db = wx.cloud.database()
    db.collection('userCollection').where({_openid:app.globalData.userOpenID}).update({
      data: data,
      success: res => {
        console.log('更新数据成功',res)
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  handleQueryRes(resList){
    console.log(resList.length);
    if (resList.length == 0){
      console.log("新用户")
      this.onAdd({
        openID:app.globalData.userOpenID,
        collection:[this.data.quotesfromDB[0]._id]
      });
      wx.showToast({
        title: '收藏成功'
      })
    }else{
      console.log("执行更新操作")
      var collectionTemp = resList[0].collection
      if (collectionTemp.indexOf(this.data.quotesfromDB[0]._id)===-1){
        collectionTemp.push(this.data.quotesfromDB[0]._id);
        this.onUpdate({
          openID:app.globalData.userOpenID,
          collection:collectionTemp
        })
        wx.showToast({
          title: '收藏成功'
        })
      }else{
        console.log("已收藏")
        wx.showToast({
          title: '不用重复收藏'
        })
      }
      
    }
  },
  // 获取用户信息
  getUserInfo(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log('获取用户授权')
      app.userInfoReadyCallback = res => {
        console.log('获取用户授权的结果',res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getTotalCount(callback) {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "totalCount": true,
      },
      success(res) {
        // console.log("got totalCount", res)
        let total = res.result.total;
        console.log(total)
        that.setData({
          "total": total
        })
        // console.log(that.data)
        callback()
      }
      ,
      fail(err) {
        console.log("fail to get totalCount", err)
      }
    })
  },
  loadRandomData() {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "getRandom":true,
        "totalCount":that.data.total
        // "limit": this.data.limit,
        // "offset": this.data.offset,
      },
      success(res) {
        // console.log("获取随机数据成功", res)
        let datas = res.result.data;
        datas.map((elem) => {
          // 去除content和author字段的�
          elem.content = elem.content.replace(/�/g, "");
          elem.author = elem.author.replace(/[�,，]/g, "");
          return elem
        });
        // // 加载更多的写法
        // var tempQuotesfromDB = that.data.quotesfromDB;
        // tempQuotesfromDB.push(...datas);
        that.setData({
          "quotesfromDB": datas
        })
      }
      ,
      fail(err) {
        console.log("云函数获取数据失败", err)
      }
    })
  },
  getAnother(){
    wx.showLoading({
      title: "加载中..."
    });
    this.loadRandomData();
    wx.hideLoading();
  },
  copyText: function() {
    wx.setClipboardData({
    data: this.data.quotesfromDB[0].content + "  ——  " + this.data.quotesfromDB[0].author,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  onPullDownRefresh: function () {
    this.loadRandomData();
    wx.stopPullDownRefresh();
  },
})