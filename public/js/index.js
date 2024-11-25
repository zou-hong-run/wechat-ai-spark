// 核心代码
let app = new Vue({
  el: '#app',
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 更新菜单
     * */
    async updateMenu() {
      let reqUrl = "/wechat/handleMenu";
      let res = await axios.get(reqUrl);
      console.log(res.data);
      alert(res.data)
    },
    async init() {
      let reqUrl = "/wechat/jsSdkAuthorized";
      let res = await axios.get(reqUrl, {
        params: {
          url: encodeURIComponent(location.href.split("#")[0]),
        },
      });
      let { appId, jsapi_ticket, noncestr, signature, timestamp, url } =
        res.data;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳（服务端生成）
        nonceStr: noncestr, // 必填，生成签名的随机串（服务端生成）
        signature, // 必填，签名（服务端生成）
        jsApiList: ["updateTimelineShareData", "scanQRCode", "updateAppMessageShareData", "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "onVoicePlayEnd",
          "uploadVoice",
          "downloadVoice",
          "chooseImage",
          "previewImage",
          "uploadImage",
          "downloadImage",
          "translateVoice",
          "getNetworkType",
          "openLocation",
          "getLocation",
          "hideOptionMenu",
          "showOptionMenu",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "closeWindow",
          "scanQRCode",
          "openProductSpecificView",
          "addCard",
          "chooseCard",
          "openCard",], // 必填，需要使用的JS接口列表
      });
      wx.ready(() => {
        console.log("ok");
        wx.updateAppMessageShareData({
          title: '我是分析的标题', // 分享标题
          desc: '我是分析的描述', // 分享描述
          link: 'http://www.zouhongrun.xyz/pic.png', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://www.zouhongrun.xyz/pic.png', // 分享图标
          success: function () {
            // 设置成功
            console.log("普通消息分享成功");
          }
        })
        wx.updateTimelineShareData({
          title: '我是分析的标题', // 分享标题
          link: 'http://www.zouhongrun.xyz/pic.png', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://www.zouhongrun.xyz/pic.png', // 分享图标
          success: function () {
            // 设置成功
            console.log("朋友圈分享成功");
          }
        })
        wx.hideMenuItems({
          menuList: [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
      });
    },
    reloadPage() {
      window.location.reload()
    },
    chooseImage() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
      });
    },
    scanQRCode() {
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        }
      });
    }
  }
})


