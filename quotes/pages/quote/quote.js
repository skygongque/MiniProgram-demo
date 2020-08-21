// pages/quote/quote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "limit": 10,
    "offset": 0,
    "totalCount": null,
    // "test": "this is a test",
    // "quotes": [
    //   "this is a test",
    //   "this is a test2 this is a test2",
    //   "this is a test3",
    //   "this is a test2 this is a test2 this is a test2 this is a test2this is a test2 this is a test2this is a test2 this is a test2"
    // ],
    // "quotesAuthor": [
    //   {
    //     "id": '001',
    //     "content": "this is a test3",
    //     "author": "steve jobs"
    //   },
    //   {
    //     "id": '002',
    //     "content": "this is a test3 this is a test3",
    //     "author": "steve jobs"
    //   },
    //   {
    //     "id": '003',
    //     "content": "this is a test3 this is a test3",
    //     "author": "william"
    //   },
    //   {
    //     "id": '004',
    //     "content": "勇气通往天堂，怯懦通往地狱。",
    //     "author": "塞内加"
    //   },
    // ],
    "quotesfromDB": [],
    "canIUseClipboard": wx.canIUse('setClipboardData'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotalCount()
    this.loadData()
  },
  nextPage() {
    wx.showLoading({
      title: "加载中",
    });
    var nextOffset = this.data.offset + this.data.limit;
    if (nextOffset < this.data.totalCount) {
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
  // 调用云函数与数据库通讯更新quotesfromDB数据
  loadData() {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "limit": this.data.limit,
        "offset": this.data.offset,
      },
      success(res) {
        console.log("云函数获取数据成功", res)
        let datas = res.result.data;
        datas.map((elem) => {
          // 去除content和author字段的�
          elem.content = elem.content.replace(/�/g, "");
          elem.author = elem.author.replace(/[�,]/g, "");
          return elem
        });
        // 加载更多的写法
        var tempQuotesfromDB = that.data.quotesfromDB;
        tempQuotesfromDB.push(...datas);
        that.setData({
          "quotesfromDB": tempQuotesfromDB
        })
      }
      ,
      fail(err) {
        console.log("云函数获取数据失败", err)
      }
    })
  },
  getTotalCount() {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "totalCount": true,
      },
      success(res) {
        console.log("got totalCount", res)
        let total = res.result.total;
        console.log(total)
        that.setData({
          "totalCount": total
        })
      }
      ,
      fail(err) {
        console.log("fail to get totalCount", err)
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