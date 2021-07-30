// pages/detail/detail.js

import { request } from "../../utils/util.js";

const myAudio = wx.createInnerAudioContext();


Page({
  data: {
    contentList: [],
    detail: {},
    isplay: false,
    myAudioDuration: '',  // 视频时间
    myAudioCurrent: '',   // 当前播放进度
    error: '',
    myAudioPos: 0.0,
    changingSlider:false,
    contentFontSize:40,
    showLanguage:"En-Ch"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    request({ url: `https://wxapp.congxue.com/voa/api/article-detail?id=${options.id}&_r=${Math.random()}` })
      .then((res) => {
        console.log(res)
        that.setData({
          contentList: res.data.data.content,
          detail: res.data.data
        })
        console.log("音频链接", that.data.detail.audio)
        myAudio.src = this.data.detail.audio;
        // 在onCanplay里获取并设置音频时长和播放进度
        myAudio.onCanplay(() => {
          myAudio.duration; //必须写，不然获取不到。。。
          setTimeout(() => {
            console.log(myAudio.duration);
            this.setData({
              myAudioDuration: format(myAudio.duration),
              myAudioCurrent: format(myAudio.currentTime)
            });
          }, 1000);
        });
        // 播放完成处理，按钮变一下
        myAudio.onEnded((res) => {
          this.setData({
            isplay: false
          })
        });
        //错误处理
        myAudio.onError((res) => {
          this.setData({
            error: res.errMsg
          })
        });

      })


  },
  //播放  
  play: function () {
    // myAudio.startTime = this.data.myAudioCurrent; //考虑到进度条被拖动，不一定从00:00:00开始
    myAudio.play();
    this.setData({
      isplay: true
    });
    //进度条变化   
    myAudio.onTimeUpdate(() => {
      // console.log(this.data.myAudioPos);
      // let newPos = myAudio.currentTime / myAudio.duration * 100;
      // let movePosDistence = Math.abs(newPos - this.data.myAudioPos);
      
      if (this.data.changingSlider) {
        console.log("changingSlider")
      }else {
        this.setData({
          myAudioPos: myAudio.currentTime / myAudio.duration * 100,
          myAudioCurrent: format(myAudio.currentTime)
        });
      }
      
    })
  },
  // 停止
  pause: function () {
    myAudio.pause();
    this.setData({
      isplay: false
    });
  },
  hanle_slider_change(e) {
    this.setData({
      changingSlider:true
    })
    const position = e.detail.value;
    var currentTime = position / 100 * myAudio.duration;
    myAudio.seek(currentTime);
    this.setData({
      myAudioPos: position,
      myAudioCurrent: format(currentTime)
    })
    sleep(1000).then(()=>{
      this.setData({
        changingSlider:false
      })
    })
  },
  onHide: function () {
    myAudio.stop();
    // myAudio.destroy();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    myAudio.stop();
    // myAudio.destroy();
  },
  handleFontSizeUp:function(){
    var newFontSize = this.data.contentFontSize + 2;
    if (newFontSize <= 60){
      this.setData({
        contentFontSize:newFontSize
      })
    }else{
      wx.showToast({
        title: '已经最大字体了',
      })
    }
    
  },
  handleFontSizeDown:function(){
    var newFontSize = this.data.contentFontSize - 2;
    if (newFontSize >= 10){
      this.setData({
        contentFontSize:newFontSize
      })
    }else{
      wx.showToast({
        title: '已经最小字体了',
      })
    }
  },
  switchToEn:function(){
    this.setData({
      showLanguage:"English"
    })
  },
  switchToCh:function(){
    this.setData({
      showLanguage:"Chinese"
    })
  },
  switchToEnCh:function(){
    this.setData({
      showLanguage:"En-Ch"
    })
  }
})

// 时间格式化
function format(t) {
  let time = Math.floor(t / 60) >= 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60);
  t = time + ':' + ((t % 60) / 100).toFixed(2).slice(-2);
  return t;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}