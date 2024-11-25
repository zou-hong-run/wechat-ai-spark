import axios from 'axios'
import { getParams, getConnect } from '../../utils/spark.js';

// 用户的聊天历史记录 (chatHistoryMap)
// 用户的暂存消息 (tempAnswerFragmentMap)
// 用户的回答是否还在加载中（answerLoadingMap）
// 已经返回给用户的片段长度（answerLenMap）
let chatHistoryMap = {};
let tempAnswerFragmentMap = {};
let answerLoadingMap = {};
let answerLenMap = {};

const responseMsgService = {
  /**
   * 这里是接受到用户发来的信息
   * fromusername 用户userid,
   * tousername 服务器id,
   * createtime 创建时间,
   * msgtype 消息类别 [text,event],
   * content 文字消息内容,
   * msgid 文字消息id,
   * mediaid 媒体id
   * 
   * event 事件类别[unsubscribe,subscribe],
   * eventkey 事件唯一标识 
   */
  async matchMsgType(msg) {
    // 根据不同的消息，做相应的判断，这里的消息有text消息类，和event类
    // msgtype=>text=>text,image,video,audio....
    // msgtype=>event=>event:[subscribe,unsubscribe]
    const {
      fromusername,// 发件人 用户
      tousername,// 收件人 服务器
      msgtype,// 消息类别
      content,// 消息内容
      mediaid,// 媒体id
      title,// 标题
      description,// 描述
      event,// 事件类别
      eventkey,// 单独讲 (扫码，菜单按钮)=>标识符，标识不同的二维码，或者菜单按钮的类型
      createtime,// 创建时间
      // 音乐
      musicurl,
      hqmusicurl,
      thumbmediaid,
      // 图文消息
      picurl,
      url,
      // 语音识别 内容
      recognition,
    } = msg;
    // console.log(msgtype, content);
    // 回信的时候
    let replyOptions = {
      // 收件人
      toUserName: fromusername,// 用户
      // 发件人
      fromUserName: tousername,// 服务器
      // 时间
      createTime: Date.now(),
      // 类型
      msgType: msgtype,
    }

    let msgMenuClickStrategy = {
      // 客服消息回复 用户触发之后，会自动回复信息（多条）
      "customservice_test": async () => {
        try {
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息1"
            }
          });
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息2"
            }
          });
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息3"
            }
          });
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息4"
            }
          });
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息5"
            }
          });
          await axios.get("/wechat/handleCustomServiceMsg", {
            params: {
              openid: fromusername,
              content: "我是客服消息6"
            }
          });
          replyOptions.content = "(*￣︶￣)"
        } catch (error) {
          console.log(error, "error");
          replyOptions.content = "客服小姐姐有点忙"
        }
        replyOptions.msgType = 'text';
      },
      // 获取一张图片
      "get_pic": async () => {
        // try {
        //   let result = await axios.get("/wechat/handlePicMaterialList", {
        //     params: {
        //       offset: 0,
        //       count: 10
        //     }
        //   });
        //   console.log(result.data);

        //   replyOptions.msgType = 'image'
        // } catch (error) {

        //   replyOptions.msgType = 'text'
        //   replyOptions.content = "服务器有点忙"
        // }
        replyOptions.mediaId = "bH5n8w1kQjZatIJz1Zz8OW_vY9gNwegRK1F7s-_gaeey7pDemaD_azLTcU7_Tqjs"
        replyOptions.msgType = "image"
      },
      // 获取模板消息
      "get_template_msg": async () => {
        try {
          await axios.get("/wechat/handleTemplateMsg", {
            params: {
              openid: fromusername
            }
          });
          replyOptions.content = "(*￣︶￣)"
        } catch (error) {
          replyOptions.content = "服务器有点忙"
        }
        replyOptions.msgType = 'text'
      }
    }

    let msgEventStrategy = {
      'unsubscribe': () => {
        replyOptions.msgType = 'text'
        replyOptions.content = "用户取消关注"
      },
      'subscribe': () => {
        replyOptions.msgType = 'text'
        replyOptions.content = "欢迎欢迎，终于等到你辣！！！，快来打字和我聊天把！！！"
      },
      'CLICK': async () => {
        msgMenuClickStrategy[eventkey] && await msgMenuClickStrategy[customservice_test]()
      },
      'VIEW': async () => {

      },
      'SCAN': async () => {
        if (eventkey == '1') {
          replyOptions.msgType = 'text'
          replyOptions.content = "你是通过扫描特定二维码进来的用户"
        }
      }
    }

    // 策略模式
    let msgTypeStratey = {
      'text': async () => {
        // 用户的聊天历史记录 (chatHistoryMap)
        // 用户的暂存消息 (tempAnswerFragmentMap)
        // 用户的回答是否还在加载中（answerLoadingMap）
        // 已经返回给用户的片段长度（answerLenMap）
        if (!chatHistoryMap[fromusername]) {
          chatHistoryMap[fromusername] = [];
        }
        if (!tempAnswerFragmentMap[fromusername]) {
          tempAnswerFragmentMap[fromusername] = '';
        }
        if (!answerLenMap[fromusername]) {
          answerLenMap[fromusername] = 0
        }
        replyOptions.content = content;
        // 用户答案还在加载中
        if (answerLoadingMap[fromusername]) {
          answerLenMap[fromusername] += tempAnswerFragmentMap[fromusername].length;
          replyOptions.content = "【承接未回答的内容】" + tempAnswerFragmentMap[fromusername] + "【回复尚未完成，回复任意内容查看后续；回复完毕后方可继续提问。】";
        }
        // 暂存区还有内容，但是已经记载完毕了
        else if (tempAnswerFragmentMap[fromusername]) {
          answerLenMap[fromusername] = 0;
          replyOptions.content = "【承接未回答的内容】" + tempAnswerFragmentMap[fromusername] + "【回答完毕。🥳】";
          tempAnswerFragmentMap[fromusername] = "";
        } else {
          chatHistoryMap[fromusername].push({ role: 'user', content });
          // console.log("会话历史：", chatHistoryMap);
          const data = getParams(chatHistoryMap[fromusername], fromusername);
          const connect = await getConnect()
          try {
            connect.send(JSON.stringify(data));
            const answer = await new Promise((resolve, reject) => {
              let fullAnswer = "";
              let timeout = setTimeout(() => {
                reject(new Error("请求超时"))
              }, 4000)
              connect.on('message', (val) => {
                val = val.toString('utf-8');
                const data = JSON.parse(val);
                const payload = data.payload;
                const choices = payload.choices;
                const status = choices.status;
                const text = choices.text;
                if (status !== 2) {
                  fullAnswer += text[0].content;
                  answerLoadingMap[fromusername] = true;
                  // 已经加载的内容
                  tempAnswerFragmentMap[fromusername] = fullAnswer.slice(answerLenMap[fromusername]);
                } else {
                  fullAnswer += text[0].content;
                  // console.log('收到最终结果：', fullAnswer);
                  // const total_tokens = payload.usage.text.total_tokens;
                  // console.log('total_tokens:', totalTokens);
                  answerLoadingMap[fromusername] = false;
                  chatHistoryMap[fromusername].push({
                    role: 'assistant',
                    content: fullAnswer,
                  });
                  // 第一次没加载完毕第二次加载完毕了，需要保留残留文本，进行回复
                  tempAnswerFragmentMap[fromusername] = fullAnswer.slice(answerLenMap[fromusername]);
                  answerLenMap[fromusername] = 0;
                  clearTimeout(timeout);
                  resolve(fullAnswer);
                }
              });
            });

            replyOptions.content = answer;
            // 没有超时 将保留的残留文本清空
            tempAnswerFragmentMap[fromusername] = "";
          } catch (error) {
            // console.log(error.message);
            if (error.message == '请求超时') {
              answerLenMap[fromusername] = tempAnswerFragmentMap[fromusername].length;
              replyOptions.content = tempAnswerFragmentMap[fromusername] + "【😝回复尚未完成，回复任意内容查看后续；回复完毕后方可继续提问。😮‍💨】";
            }
          }
        }
        // 保持聊天历史为最新的二十条消息
        if (chatHistoryMap[fromusername].length > 30) {
          chatHistoryMap[fromusername] = chatHistoryMap[fromusername].slice(-30);
        }
        replyOptions.content = replyOptions.content + "【注意个人隐私保护】"
        // console.log(replyOptions, 'replyOptions');


      },
      'image': () => {
        replyOptions.mediaId = mediaid;// 自定义的媒体资源id
      },
      // 语言消息
      'voice': () => {
        // 语音识别成功就返回字符串
        if (recognition) {
          replyOptions.content = recognition;
          replyOptions.msgType = 'text'
        } else {
          replyOptions.mediaId = mediaid
        }
      },
      // 视频消息(视频，小视频)
      'video': () => {
        replyOptions.mediaId = mediaid;
        replyOptions.title = title;
        replyOptions.description = description
      },
      'music': () => {
        replyOptions.title = title;
        replyOptions.description = description;
        replyOptions.musicUrl = musicurl;
        replyOptions.hqmusicUrl = hqmusicurl;
        replyOptions.thumbmediaId = thumbmediaid;
      },
      'news': () => {
        replyOptions.title = title;
        replyOptions.description = description;
        replyOptions.picUrl = picurl;
        replyOptions.url = url
      },
      'event': () => {
        // 处理事件
        msgEventStrategy[event] && msgEventStrategy[event]()
      }
    }

    msgTypeStratey[msgtype] && await msgTypeStratey[msgtype]()

    console.log("reply", replyOptions);
    return replyOptions;// 最终，我们将返回这个对象，
  }
}

export default responseMsgService;