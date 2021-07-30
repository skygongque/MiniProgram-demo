// pages/quote/quote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "limit": 10,
    "offset": 0,
    "totalCount": null,
    "soupfromDB": [],
    "canIUseClipboard": wx.canIUse('setClipboardData'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },
  nextPage() {
    wx.showLoading({
      title: "加载中",
    });
    var nextOffset = this.data.offset + this.data.limit;
    if (nextOffset < 411) {
      this.setData({
        "offset": nextOffset
      });
      this.loadData()
    } else {
      wx.showToast({
        title: '到底了',
      })
    }
    wx.hideLoading();
  },
  // 调用云函数与数据库通讯更新soupfromDB数据
  loadData() {
    var that = this
    wx.cloud.callFunction({
      name: "getData_cure",
      data: {
        "limit": this.data.limit,
        "offset": this.data.offset,
      },
      success(res) {
        console.log("云函数获取数据成功", res)
        let datas = res.result.data.data;
        // 加载更多的写法
        var tempSoupfromDB = that.data.soupfromDB;
        tempSoupfromDB.push(...datas);
        that.setData({
          "soupfromDB": tempSoupfromDB
        })
      }
      ,
      fail(err) {
        console.log("云函数获取数据失败", err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.nextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})