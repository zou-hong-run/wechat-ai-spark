/**
 * 回复用户消息的模板
 * @param {}} options 
 */
const xmlTemplate = (options) => {
  let startXMLStr = `<xml>
  <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
  <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
  <CreateTime>${options.createTime}</CreateTime>
  <MsgType><![CDATA[${options.msgType}]]></MsgType>\n`;

  let xmlStrategy = {
    'text': () => {
      startXMLStr += `<Content><![CDATA[${options.content}]]></Content>`
    },
    'image': () => {
      startXMLStr += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    },
    // 语言消息
    'voice': () => {
      startXMLStr += `<Voice>
      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      <Recognition>
          < ![CDATA[${options.recognition}] ]>
      </Recognition>
      </Voice>`
    },
    // 视频消息(视频，小视频)
    'video': () => {
      startXMLStr += `<Video>
      <MediaId>
        <![CDATA[${options.mediaId}]]>
      </MediaId>
      <Title><![CDATA[${options.title}]]></Title>
      <Description>
        <![CDATA[${options.description}]]>
      </Description>
    </Video>`
    },
    'music': () => {
      startXMLStr += `
      <Music>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.hqmusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
      </Music>`
    },
    'news': () => {
      xmlStr += `<ArticleCount>${options.content.length}</ArticleCount><Articles>`;
      options.content.forEach(item => {
        xmlStr += `
        <item>
          <Title><![CDATA[${item.title}]]></Title>
          <Description><![CDATA[${item.description}]]></Description>
          <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
          <Url><![CDATA[${item.url}]]></Url>
        </item>`
      });
      xmlStr += `</Articles>`;
    }
  }
  xmlStrategy[options.msgType] && xmlStrategy[options.msgType]();
  let endXMLStr = `</xml>`;
  return startXMLStr + endXMLStr;
}
export default xmlTemplate