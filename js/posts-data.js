/* ============================================================
   幻想郷通信 · 文章索引
   —— 首页卡片、归档时间轴、本地搜索 共用这一份数据。
   —— 新增文章：复制 post.html 改内容，然后在这里加一条即可。
   —— 之所以用 .js 而不是 fetch('.json')：
      浏览器直接双击打开（file:// 协议）时 fetch 会被跨域策略拦截，
      而 <script> 引入的数据在本地与线上表现完全一致。
   ============================================================ */

window.SITE = {
  title: "幻想郷通信",
  url: "https://herz1.github.io/hrez1yun/", // 订阅和 SEO 的规范地址，必须保留尾部 /
  description: "一个东方 Project 风格的个人博客：弹幕、神社与代码。",
  since: "2026-01-01",          // 建站日，用于计算“已参拜天数”
};

window.POSTS = [
  {
    id: "build-touhou-blog",
    title: "从零打造东方 Project 风格博客：弹幕引擎与和风设计",
    date: "2026-07-24",
    cat: "教程",
    tags: ["前端", "东方", "博客搭建"],
    words: 1430, mins: 5,
    excerpt: "把符卡、弹幕、鸟居与青海波纹样翻译成 HTML/CSS/Canvas——本站的完整实现思路，附 GitHub Pages 部署与本地一致性方案。",
    cover: "torii",
    url: "post.html",
    pin: true,
  },
  {
    id: "danmaku-math",
    title: "弹幕算法笔记：用极坐标画一朵「花」",
    date: "2026-07-15",
    cat: "技术",
    tags: ["Canvas", "数学", "弹幕"],
    words: 959, mins: 3,
    excerpt: "环形、螺旋、花瓣三种经典弹型的参数方程推导，以及如何用 requestAnimationFrame 控制上千颗子弹不掉帧。",
    cover: "magic",
    url: "danmaku-math.html",
  },
  {
    id: "eosd-spellcards",
    title: "《东方红魔乡》通关备忘：那些年擦过的弹",
    date: "2026-07-06",
    cat: "游戏",
    tags: ["东方", "STG", "攻略"],
    words: 821, mins: 3,
    excerpt: "从道中路线、决死时机到残机规划：把一局拆成可以重复练习的安全选择，先稳定抵达红魔馆终点。",
    cover: "scarlet",
    url: "eosd-spellcards.html",
  },
  {
    id: "touhou-music",
    title: "原曲鉴赏：从《少女绮想曲》聊 ZUN 的旋律动机",
    date: "2026-06-28",
    cat: "音乐",
    tags: ["东方", "音乐"],
    words: 823, mins: 3,
    excerpt: "重复、移调、再回归——为什么这些旋律听一遍就忘不掉？用最朴素的乐理拆一拆。",
    cover: "moon",
    url: "touhou-music.html",
  },
  {
    id: "css-torii",
    title: "用纯 CSS 画一座朱红鸟居",
    date: "2026-06-17",
    cat: "技术",
    tags: ["CSS", "前端"],
    words: 898, mins: 3,
    excerpt: "圆角、伪元素与一点点透视：不引入任何图片，把神社门前的风景搬进网页。",
    cover: "torii",
    url: "css-torii.html",
  },
  {
    id: "reitaisai-diary",
    title: "例大祭同人志淘书记",
    date: "2026-05-30",
    cat: "随笔",
    tags: ["东方", "同人", "游记"],
    words: 792, mins: 3,
    excerpt: "排队两小时、战利品一大袋。记录一次快乐的同人展之旅，以及入坑十年的一点感慨。",
    cover: "scroll",
    url: "reitaisai-diary.html",
  },
  {
    id: "in-difficulty",
    title: "《永夜抄》难度曲线分析：刻符为什么令人闻风丧胆",
    date: "2026-05-12",
    cat: "游戏",
    tags: ["东方", "STG"],
    words: 873, mins: 3,
    excerpt: "从弹幕密度、速度与判断时间聊难度如何逐面累积，以及怎样用资源换取一整局的稳定。",
    cover: "moon",
    url: "in-difficulty.html",
  },
  {
    id: "gensokyo-geography",
    title: "幻想乡地理考（雾）：一张不存在的地图",
    date: "2026-04-25",
    cat: "考据",
    tags: ["东方", "二设", "杂谈"],
    words: 841, mins: 3,
    excerpt: "博丽神社在东边还是山上？雾之湖到底有多大？一本正经地整理散落在作品各处的地理线索。",
    cover: "magic",
    url: "gensokyo-geography.html",
  },
];
