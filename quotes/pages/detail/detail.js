// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    oneQuotefromDB: {},
    canIUseClipboard: wx.canIUse('setClipboardData')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    console.log(options.id),
    this.loadData(options.id)
  },
  loadData(id) {
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      data: {
        "id": id,
      },
      success(res) {
        console.log("云函数获取数据成功", res)
        let oneData = res.result.data;
        console.log(oneData)
        // 去除content和author字段的�
        oneData.content = oneData.content.replace(/�/g, "");
        oneData.author = oneData.author.replace(/[�,，]/g, "");
        // 加载更多的写法
        // var tempQuotesfromDB = that.data.quotesfromDB;
        // tempQuotesfromDB.push(...datas);
        that.setData({
          "oneQuotefromDB": oneData
        })
      }
      ,
      fail(err) {
        console.log("云函数获取数据失败", err)
      }
    })
  },
  copyText: function() {
    wx.setClipboardData({
    data: this.data.oneQuotefromDB.content + "  ——  " + this.data.oneQuotefromDB.author,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})