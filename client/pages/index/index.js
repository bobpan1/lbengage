//index.js
//获取应用实例
var app = getApp()

var whisper = require('../../vendor/index');
var config = require('../../config');
 
//页面图片配置
var Src = require('../../src');

Page({
  data: {
    isRecording: false,
    recordUi: {
      record: Src.image.record,
      recording: Src.image.recording,
    },
    recAnimation: {},
    contentAnimation: {},
    isPlaying: false,
    playUi: {
      play: Src.image.play,
      playing: Src.image.playing,
    },
    recSrc: null,
    duration: 0,
    maxDuration: 60,
  },
  onReady: function () {
    console.log(" INDEX ONREADY ");
  },
  onLoad: function () {
    var that = this

    //获取用户数据
    whisper.login({
      success(result) {
        console.log('登录成功（index）:', result);
      },
      fail(error) {
        console.log('登录失败（index）:', error);
      }
    });
  },
  startRecord: function(){
    var $this = this
    $this.setData({
      isRecording: true,
    });
    whisper.startRecord({
      success(result) {
        $this.setData({
          isRecording: false,
        });
        console.log('录音成功:', result);
      },
      fail(error) {
        console.log('录音失败:', error);
      },
      process(){
        var rec = wx.createAnimation({
                        duration: 1000,
                        timingFunction: 'ease',
                    }).opacity(1).step().opacity(0).step();
        var content = wx.createAnimation({
                        duration: 1000,
                        timingFunction: 'ease',
                    }).opacity(0.4).step().opacity(1).step();

        $this.setData({
          duration: whisper.getRecordDuration(),
          recAnimation: rec.export(),
          contentAnimation: content.export(),
        });
      },
      compelete(){

      },
    });
  },
  stopRecord: function(){
    var $this = this;
    whisper.stopRecord({
      success(result) {
        console.log('SET TIMMER STOP:', result);
        $this.setData({
          isRecording: false,
        });
        console.log('停止录音:', result);
        //隔500毫秒后上传录音
        setTimeout(() => { $this.saveVoice('自动上传')}, 500 );
      },
      fail(error) {
        console.log('停止录音失败:', error);
      }
    });
  },
  play: function(){
    var $this = this
    $this.setData({
      isPlaying: true,
    });
    whisper.playRecord({
      src: whisper.getRecordSrc(),
      success() {
        $this.setData({
          isPlaying: false,
        });
        console.log('播放/暂停成功:', result);
      },
      fail(error) {
        $this.setData({
          isPlaying: false,
        }); 
        console.log('播放/暂停失败:', error);
      } 
    });
  },
  
  whisper: function (event) {

    //var tag = event.detail.value;
    //this.saveVoice(tag);
  },
 
  saveVoice: function(tag){

    //上传
    var $this = this;
    
    var src = whisper.getRecordSrc();
    if (!src){
      wx.showToast({
        title: '没有听清',
        icon: 'loading',
        duration: 1000
      });
      // return; 
    }
    wx.showToast({
      title: '正在上传...', 
      icon: 'loading',
      duration: 60000
    });

    whisper.uploadFile({
      url: config.service.whisperUrl + '/session='+whisper.getSession().session+'&tag='+tag+'&duration='+$this.data.duration,
      filePath: src, 
      name: 'whisper',
      success: function(res){ 
        wx.hideToast();
      },
      fail: function(res){ 
        console.log(res)
        wx.hideToast();
      },
      saved: function(res) {
        console.log(res);

          wx.showToast({
            title: res.translate,
            icon: 'info',
            duration: 1000
          });
          
          var explode = $this.selectComponent("#explode");
          var translate = res.pa;
          var words = Array();

          translate = translate.split(" ");
          console.log(translate)
          for (var i = 0; i < translate.length; i++){
            words[i] = { content: translate[i],id:i}
          }
          console.log(words)

          explode.setData({
            mainx: "",
            content: words,
            opacity: 1
          });

      }
    });
  },
  onShareAppMessage: function () {
    //页面分享
    return {
      title: '语音留言本',
      desc: '一分钟语记，岁月有痕迹。',
      path: '/pages/index/index'
    }
  },

  
})
