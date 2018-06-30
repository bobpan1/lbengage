// components/Explode/explode.js

var app = getApp();

var current_id;
var inserted_id;
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
var arr1 = [{ content: "一头大象", id: 1 }, { content: "两个人", id: 2 }, { "三只可爱的小松鼠": 33, id: 3 }, { content: "四年一遇大洪水", id: 4 }, { content: "五块", id: 5 }, { content: "六六大顺", id: 6 }, { content: "七个小矮人", id: 7 }, { content: "八只眼", id: 8 }];

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    
  },

  data: {
    mainx: 0,
    content: [],
    start: { x: 0, y: 0 }
  },



  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
   
    movestart: function (e) {
      currindex = e.target.dataset.index;
      current_id = "box" + e.target.dataset.index;
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
      x1 = e.currentTarget.offsetLeft;
      y1 = e.currentTarget.offsetTop;
      
    },

    move: function (e) {
      yy = e.currentTarget.offsetTop;
      x2 = e.touches[0].clientX - x + x1;
      y2 = e.touches[0].clientY - y + y1;
      this.setData({
        mainx: currindex,
        opacity: 0.7,
        start: { x: x2, y: y2 }
      });

      var i;

      //声明节点查询的方法
      var query = wx.createSelectorQuery().in(this)

      for (i = 1; i <= 7; i++) {
        var boxId = '#box' + i
        query.select(boxId).boundingClientRect()
      }

    query.exec(function (res) {
      
        for (i = 0; i < res.length; i++) {
          console.log("---------res i----------" + res.length);
          if (x2 > res[i].left - res[i].width / 2 &&
            x2 < res[i].left + res[i].width / 2 &&
            y2 > res[i].top - res[i].height / 2 &&
            y2 < res[i].top + res[i].height / 2
          ) {
            if (current_id != res[i].id) {
              inserted_id = res[i].id;

            }
          }

        }
      })

    },

    moveend: function () {

      //初始化控数组
      var arr = [];
      for (var i = 0; i < this.data.content.length; i++) {
        //如果是被替代的模块，则先插入当前移动模块
        if ("box" + this.data.content[i].id == inserted_id) {
          
          //找到当前移动模块
          for (var j = 0; j < this.data.content.length; j++) {
            if ("box" + this.data.content[j].id == current_id)
              arr.push(this.data.content[j]);
          }

          arr.push(this.data.content[i]);

        } else if ("box" + this.data.content[i].id == current_id) {

        } else {
          arr.push(this.data.content[i]);
        }

      }

      this.setData({
        mainx: "",
        content: arr,
        opacity: 1
      })

    },

  }
})