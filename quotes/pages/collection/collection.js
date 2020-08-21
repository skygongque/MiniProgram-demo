
// pages/collection/collection.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: [],
    quotesfromDB: [],
    canIUseClipboard: wx.canIUse('setClipboardData')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.onQuery(this.loadData);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onQuery: function (callback) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('userCollection').where({
      _openid: app.globalData.userOpenID
    }).get({
      success: res => {
        let tempCollection = res.data[0].collection;
        tempCollection.reverse();
        this.setData({
          collection: tempCollection
        });
        // console.log(res.data[0].collection)
        callback(tempCollection)
        // console.log('[数据库] [查询记录] 成功: ', res)
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
  loadData(collection) {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "idList": collection,
      },
      success(res) {
        console.log("云函数获取数据成功", res)
        let datas = res.result;
        datas.map((elem) => {
          // 去除content和author字段的�
          elem.content = elem.data.content.replace(/�/g, "");
          elem.author = elem.data.author.replace(/[�,]/g, "");
          elem._id = elem.data._id;
          elem.index = elem.data.index;
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
  cancelCollect: function (e) {
    console.log(e.currentTarget.id);
    let temp = this.data.collection;
    let result = []
    for (var i = 0; i < temp.length; i++) {
      if (temp[i] != e.currentTarget.id){
        result.push(temp[i]);
      }
    };
    this.setData({
      collection:result
    });
    this.onUpdate({
      collection:result
    });
    
  },
  onUpdate: function(data) {
    const db = wx.cloud.database()
    db.collection('userCollection').where({_openid:app.globalData.userOpenID}).update({
      data: data,
      success: res => {
        console.log('更新数据成功',res)
        // 重新加载数据
        this.onQuery(this.loadData);
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  copyText: function(e) {
    wx.setClipboardData({
    data: e.currentTarget.id,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onQuery(this.loadData);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onQuery(this.loadData);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})