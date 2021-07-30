// pages/index1/index1.js
// 引入用来发送请求的方法
import {request} from "../../utils/util.js"

Page({
  data: {
    swiperList:[],
    dataList:[],
    page:1,
    maxPage:10,
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData:function(){
    var that = this;
    request({url:`https://wxapp.congxue.com/voa/api/news-feed?_r=${Math.random()}&category=standard&page=${this.data.page}`})
    .then((res)=>{
      // 加载更多
      var tempdataList = that.data.dataList;
      tempdataList.push(...res.data.data);
      that.setData({
        dataList:tempdataList
      })
      console.log(res)
    })
  },
  nextPage:function() {
    // wx.showLoading({
    //   title: "加载中",
    // });
    if (this.data.page <= this.data.maxPage) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadData();
    } else {
      wx.showToast({
        title: '到底了',
      })
    }
    wx.hideLoading();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.nextPage()
  }

})