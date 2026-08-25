# ⛩️ 幻想郷通信 —— 东方 Project 风格个人博客

纯静态、零构建、零依赖的东方 Project（幻想乡）风格博客模板。
**双击本地 HTML、本地起服务器、部署到 GitHub Pages，三种方式打开效果完全一致。**

正式站点：[https://herz1.github.io/hrez1yun/](https://herz1.github.io/hrez1yun/)

## 🧱 技术栈与构建

- 技术栈：原生 HTML、CSS、JavaScript，无框架、无包管理器、无数据库。
- 生产构建命令：无；仓库根目录即发布目录。
- 纯静态预览：`python -m http.server 4173`，随后访问 `http://127.0.0.1:4173/`。
- 项目没有后端或动态 API。本地 Python 仅用于静态文件预览，不会也不需要运行在 GitHub Pages。

## 🖥️ 本地预览

开发服务器已配置（`python -m http.server`），启动后访问：

> **http://localhost:8000**

### Windows 一键启动 / 关闭

双击项目根目录的 **`网站开关.cmd`**：

- 网站未运行时：自动启动端口 `8000` 的本地服务器，并在默认浏览器打开首页；
- 网站正在运行时：安全关闭由该脚本启动的服务器；
- 脚本只会关闭自己记录的 Python 服务器。如果端口 `8000` 被其他程序占用，会给出提示而不会终止其他进程；
- 关闭服务器不会强行关闭浏览器标签页，标签页可直接手动关闭。

三种方式任选其一，效果与线上一致：

1. **直接双击** `index.html` —— 用浏览器以 `file://` 打开即可完整运行；
2. VS Code 安装 **Live Server** 插件 → 右键 `index.html` → *Open with Live Server*；
3. 命令行：
   ```bash
   python -m http.server 8000     # 然后访问 http://localhost:8000
   ```

## ✨ 特性一览

| 分类 | 内容 |
| --- | --- |
| 🎨 东方同人美术 | **动态灵梦主视觉**（本站原创 SVG + 浮游、光环、阴阳玉、御札动效）、原创管理人头像、404 被弹小灵梦、友链 Q 版角色（灵梦/帕秋莉/琪露诺/露娜萨）、五幅封面场景插画（黄昏鸟居 / 魔理沙夜空 / 红魔馆 / 竹林月夜 / 社务所文房）、怀表时计 |
| 🌸 氛围引擎 | 白昼樱吹雪（三维翻转花瓣 + 风场）↔ 永夜萤火虫 + 流星（`js/petals.js`）；全站环境弹幕、点击擦弹 + Graze 计分、隐藏符卡全屏螺旋弹幕（`js/danmaku.js`） |
| 🧿 静态桌宠 | 全站自托管灵梦桌宠：首屏完成后懒加载、角色区域拖动、70%–150% 分级缩放、气泡随左右位置自动翻转并与文字同步缩放、本地中文台词、关闭与重新唤起、尺寸/状态/位置持久化；窄屏默认收起，尊重 `prefers-reduced-motion` |
| ⛩️ 东方元素 | 朱红鸟居神社场景 Hero、参拝朱印章、阴阳玉 Logo/加载动画、御札标签、绘马公告、符卡式引用块、注连绳纸垂、青海波纹样页脚、幔幕、404「被弹！Continue?」 |
| 🌗 昼 / 永夜 | 一键切换：白昼参拜 ↔ 满月永夜（星空 + 石灯笼点亮 + 萤火虫），记忆在 localStorage，支持 `?theme=night` 链接直达 |
| 🧊 设计系统 | 全套线性 SVG 图标（无 emoji 图标）、分层阴影与弹簧缓动令牌、玻璃拟态导航、View Transitions 跨页过渡、卡片流光扫过效果 |
| 📈 阅读体验 | 顶部进度条、**BOSS 符卡进度药丸**（显示当前小节符卡名 + ★ 进度）、目录高亮、返回顶部百分比圆环 |
| 🧩 小组件 | 本地搜索（S）、打字机、幻想时计 + 每日运势、本地一言、代码复制 + Toast、字数/阅读时长、运行天数 |
| ⌨️ 快捷键 | `S` 搜索 · `D` 昼夜 · `←/→`（或 `J/K`）上下篇 · `Esc` 关闭 · 古老指令 `↑↑↓↓←→←→BA` 触发隐藏符卡 |
| ♿ 体贴细节 | 响应式布局、`prefers-reduced-motion` 时自动关闭全部动效、键盘焦点可见、标签页隐藏时弹幕/花瓣暂停省电 |

## 📁 目录结构

```
hrez1yun/
├── index.html          # 首页（灵梦立绘 Hero + 文章流 + 侧栏）
├── post.html           # 从零打造东方风格博客
├── danmaku-math.html   # 极坐标弹幕算法
├── eosd-spellcards.html # 红魔乡通关备忘
├── touhou-music.html   # 少女绮想曲旋律鉴赏
├── css-torii.html      # 纯 CSS 鸟居
├── reitaisai-diary.html # 例大祭淘书记
├── in-difficulty.html  # 永夜抄难度曲线
├── gensokyo-geography.html # 幻想乡地理考
├── archive.html        # 文库（御札标签过滤 + 时间轴，支持 #tag= 直达）
├── about.html          # 关于（人物卡能力条 / 装备栏 / 友链 / 二创声明）
├── 404.html            # 被弹！Continue? （GitHub Pages 自动接管 404）
├── .nojekyll           # 告诉 GitHub 跳过 Jekyll，原样托管
├── assets/
│   ├── waifu/v1/       # 桌宠清单、中文台词与来源声明
│   └── reimu.svg       # 首页与桌宠共用的原创 SVG 灵梦立绘
├── css/
│   ├── style.css       # 全站样式（CSS 变量昼夜双主题）
│   └── waifu.css       # 仅限定在桌宠容器内的覆盖样式
└── js/
    ├── posts-data.js   # ★ 文章索引（唯一需要日常维护的数据文件）
    ├── art.js          # ★ 美术资产库（立绘/封面/头像/图标 sprite + 注入器）
    ├── danmaku.js      # 弹幕引擎 DanmakuFX
    ├── petals.js       # 樱吹雪/萤火虫氛围引擎 PetalFX
    ├── main.js         # 全部通用小组件逻辑
    └── waifu-pet.js    # 全站桌宠懒加载与交互入口
```

## 🚀 部署到 GitHub Pages（约 3 分钟）

1. 本项目发布到 `Herz1/hrez1yun` 的 `main` 分支：
   ```bash
   git init
   git add .
   git commit -m "⛩️ 神社开张"
   git branch -M main
   git remote add origin https://github.com/Herz1/hrez1yun.git
   git push -u origin main
   ```
2. 仓库页面 → **Settings → Pages** → *Build and deployment*：
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `(root)` → **Save**
3. 发布地址：`https://herz1.github.io/hrez1yun/`

> 当前使用 GitHub Pages 项目站点：Source 选择 **Deploy from a branch**，Branch 选择 **main / (root)**，并启用 HTTPS。

## 🔍 为什么「本地 = 线上」？

| 纪律 | 说明 |
| --- | --- |
| 全相对路径 | 所有引用形如 `./css/style.css`。GitHub **项目页**部署在 `/仓库名/` 子路径下，绝对路径 `/css/…` 会 404；相对路径在 `file://`、`localhost`、子路径、自定义域名下全部通用 |
| 零构建 | 仓库里的文件就是最终产物，不存在「本地要先 build」的差异 |
| 核心数据不走 fetch | 文章索引以 `<script>` 引入，SVG 插画由 `js/art.js` 注入，图片由普通 `<img>` 加载。桌宠台词在 HTTP 环境读取本地 JSON，`file://` 下自动使用同内容的内置台词，不影响桌宠和正文 |
| `.nojekyll` | 跳过 GitHub 默认的 Jekyll 处理，避免个别文件被吞 |
| 唯一联网项 | Google Fonts 字体。断网时自动回退到系统楷体/宋体/黑体，功能不受影响；追求完全离线可自行下载字体改为本地引入 |

## ✍️ 如何新增文章

1. 复制 `post.html` 改名（如 `my-post.html`），替换标题、正文与目录；
   - 每个 `<h2>` 记得带上 `id`、`data-no="壱/弐/参…"`（朱印编号）与 `data-sc="小节符卡名"`（BOSS 条会实时显示）；
2. 在 `js/posts-data.js` 的 `POSTS` 数组**开头**加一条记录（`url` 填新文件名）；
3. 完成。首页卡片、文库时间轴、本地搜索会自动收录，无需改其他任何文件。

当前示例内容已经包含 8 篇独立文章，每条索引都指向自己的 HTML 页面。文章页底部按发布日期连接“较早一篇 / 较新一篇”，最早与最新文章会显示不可点击的边界提示。

封面图无需准备图片：`cover` 字段从内置的 5 幅手绘场景插画中选择——
`torii`（黄昏鸟居）/ `magic`（魔理沙夜空）/ `moon`（竹林月夜）/ `scarlet`（红魔馆之夜）/ `scroll`（社务所文房）。

## 🔗 配置个人链接与友链

- 首页个人卡片中的 GitHub、哔哩哔哩、邮箱和 RSS 位于 `index.html` 的 `.social-row`。默认是不可点击的展示图标；取得真实地址后，将对应的 `<span class="social-link …">` 改成带真实 `href` 的 `<a>` 即可。
- 关于页的四张示例友链位于 `about.html` 的 `.friend-grid`。默认同样不可点击；配置时将对应 `<span>` 改成 `<a class="friend-card" href="真实地址">`，并替换站名与介绍。
- 模板不会虚构个人账号或第三方站点地址，因此未配置前不会出现会误导访客的空链接。

## 🎨 快速换肤 / 改美术

- `css/style.css` 顶部集中了全部设计令牌：`--vermilion` 朱红 · `--gold` 金 · `--gap` 隙间紫 · `--paper` 和纸底色 · 分层阴影 `--shadow-*` · 弹簧缓动 `--ease-spring`。夜间模式变量在 `html[data-theme="night"]` 块中，昼夜可独立调整。
- 首页灵梦立绘位于 `assets/reimu.svg`；构图和动效在 `css/style.css` 的 `.hero-reimu` 段。
- 其余插画（封面/头像/Q 版/图标）都在 `js/art.js`，每一幅都是独立的 SVG 字符串，可直接编辑。

## 🧿 桌宠维护

- 当前桌宠不是 Live2D，而是复用 `assets/reimu.svg` 的静态 SVG 方案；格式在 `assets/waifu/v1/model-manifest.json` 中明确标记为 `static-image`。
- 更换普通立绘：替换 `assets/reimu.svg`；如宽高比变化，在 `css/waifu.css` 调整 `#waifu` 宽度。
- 调整桌面位置和尺寸：访客可用桌宠工具栏的 `−` / `+` 在 70%–150% 间缩放，人物、气泡框和气泡文字会同步变化，选择会自动记忆；模板默认尺寸仍可在 `css/waifu.css` 顶部修改 `left`、`bottom` 与 `width`。气泡会根据桌宠所在的页面左右半区自动显示在人物内侧上方。
- 调整台词：编辑 `assets/waifu/v1/waifu-tips.json`。选择器只对应当前博客实际存在的导航、文章卡片、标题、目录、代码块、复制按钮和返回顶部按钮。
- 调整移动端策略：修改 `@media (max-width: 720px)`。当前窄屏默认只显示 44px 唤起按钮，用户主动打开后显示缩小桌宠。
- 关闭状态、拖动位置及减少动态的手动恢复选择保存在 `localStorage`；点击左下角鸟居按钮即可恢复，无需清理浏览器数据。
- 若后续取得真实 Live2D 模型，请先根据入口文件识别 Cubism 2 或 Cubism 3/4/5，再引入对应 Core。不要修改当前静态清单冒充 Live2D，也不要混用 `model.json` 与 `model3.json`。

## 📜 二次创作声明

本模板为东方 Project 爱好者的非营利二次创作，与上海爱丽丝幻乐团无从属关系，未使用官方图片素材。公开仓库中的角色、头像、封面、图标和装饰均为本站原创 SVG 二次创作；本地留存的第三方原始素材包及加工 PNG 因再分发限制已由 `.gitignore` 排除，不会上传到公开仓库。

## 📄 许可证

- 网站程序代码以 [MIT License](./LICENSE) 发布，版权所有者为 Herz1。
- 原创文章、原创 SVG 插画及其他原创内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)；MIT License 不覆盖这些内容。
- 东方 Project 及相关角色权利归原权利人所有，本项目遵循其公开二次创作指引。
- 本地服务器脚本只用于预览静态文件；GitHub Pages 不运行 Python、PowerShell、Node 后端或数据库。若未来新增线上 API，应单独部署并通过显式配置地址接入，禁止把密钥写入仓库。

—— 愿幻想乡长存，也愿你的博客常新。⛩️
