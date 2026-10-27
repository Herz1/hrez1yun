# 幻想郷通信 · 分支审阅说明

日期：2026-10-28（Asia/Singapore）  
仓库：`Herz1/hrez1yun`  
分支：`feat/site-polish-20261028`  
基线：`4f8be8a19a0efffe13fa719cdd28342559fb9ae6`

## 本轮改动

- 增加与原站风格一致的阅读清单：归档和文章正文均可收藏，提供只看收藏、取消收藏与跨标签页同步。
- 归档支持关键词、现有分类/标签、月份、排序组合筛选；条件写入 URL，支持分享、刷新、浏览器前进后退与原有链接。
- 增加结果计数、无结果提示、清除筛选和窄屏布局。收藏只在当前浏览器保存；存储被禁用时明确提示只在当前页面暂存。
- 重做搜索弹窗的键盘行为：输入标签、关闭按钮、Tab 焦点循环、方向键选结果、Esc 关闭、焦点回到触发按钮、背景不可交互。结果通过 DOM 文本节点输出。
- 保留朱红、和纸、永夜与御札风格；文库沿用原来的御札标签入口。
- 主题改用 `gensokyo-theme`，只迁移旧值中的 `day/night`，避免读取同域兔山博客的 `dark/light`。

所有原文章、插画、看板娘、配色、内容索引和外部账号配置保留。新增功能为本地原生 JavaScript，不引入运行时插件或构建步骤。

## 参考与取舍

- [astro-koharu](https://github.com/cosZone/astro-koharu)：延续原站已采用的主题化文章索引与轻盈卡片组织思路。
- [Pagefind 筛选文档](https://pagefind.app/docs/filtering/)：参考元数据组合筛选方式。当前文章数量小，直接复用原有索引，没有为筛选新增搜索引擎或构建依赖。
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)：搜索焦点、键盘顺序、关闭和回归触发点。
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)：访问失败与保存失败降级。
- [MDN URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 与 [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)：筛选链接编码、恢复与历史导航。

本轮实现为原生代码，没有复制上述项目的主题、美术或文章。

## 已执行验证

- 新增脚本与修改的主脚本通过 `node --check`。
- `tools/test-reading.cjs`：31 项 DOM 行为断言通过。覆盖收藏/移除、仅收藏、空结果、标签链接、异常查询、键盘循环、焦点恢复、损坏存储、存储禁用、跨博客主题值以及文章相对链接。
- `git diff --check` 无空白错误。
- 全站为静态文件，无生产构建步骤。
- 浏览器实测：关键词/标签组合筛选、加入收藏及仅显示收藏均正确，视觉保留原主题。

测试通过说明以上明确场景得到验证；不能保证所有浏览器或外部服务永远无问题。DOM 回归不验证实际绘图、音频、字体服务或 Bilibili 实时接口。本次已进行上述浏览器功能与视觉检查；其他浏览器版本仍需按需验证。

如需复跑行为回归（仅开发验证依赖，网站运行无需安装）：

```bash
npm install --no-save --no-package-lock jsdom@26.1.0
node tools/test-reading.cjs
```

## 本地预览

```bash
git switch feat/site-polish-20261028
python -m http.server 4173 --bind 127.0.0.1
```

访问 `http://127.0.0.1:4173/archive.html`，再打开任意文章测试收藏与搜索。

## 分支与回退

本次仅发布独立功能分支，不修改默认分支、不合并、不修改 Pages 设置。仓库内没有会因本次分支推送发布正式站点的工作流。

未合并时，默认分支与线上原站继续保持原版本。若要撤销本分支的增强提交：

```bash
git switch feat/site-polish-20261028
git log --oneline
git revert <本次增强提交的SHA>
git push origin feat/site-polish-20261028
```

只撤销审阅确认的增强提交；后续提交存在时不使用强推或硬重置。

