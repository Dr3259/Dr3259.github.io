
export interface MovieHeavenItem {
  title: string;
  downloadUrl: string;
  rating?: string;
  tags?: string;
  shortIntro?: string;
}

// 在此处粘贴您的JSON数据
// Paste your JSON data here
export const movieHeavenData: MovieHeavenItem[] = [
  {
    "title": "一个伟大时代的缩影",
    "downloadUrl": "ftp://ygdy8:ygdy8@yg76.dydytt.net:6023/阳光电影www.ygdy8.com.一个伟大时代的缩影.BD.1080P.国语中字.mkv",
    "rating": "7.9",
    "tags": "剧情 / 传记 / 历史",
    "shortIntro": "影片以真实历史事件为基础，讲述了一群普通人在时代洪流中的奋斗与选择，展现了他们的理想、爱情与挣扎。"
  },
  {
    "title": "神秘代码",
    "downloadUrl": "ftp://ygdy8:ygdy8@yg76.dydytt.net:6023/阳光电影www.ygdy8.com.神秘代码.BD.1080P.中英双字.mkv",
    "rating": "8.5",
    "tags": "科幻 / 悬疑 / 惊悚",
    "shortIntro": "一个大学教授无意间发现了一个来自过去的时间胶囊，里面的一串数字竟精准预言了过去50年发生的重大灾难。"
  }
];
