# Stack Man 个人网站 ?

> 懂算法的段子手，信息学竞赛助手

这是一个为 Stack Man（火柴人）打造的个人介绍网页，采用纯静态技术构建，适用于求职、社交、商务合作等场景。

## ? 预览

[在线预览链接]（部署后填写）

## ? 功能特性

### 核心功能
- ? **响应式设计** - 完美适配桌面、平板、手机
- ? **暗黑模式** - 支持亮色/暗黑主题切换，自动记忆偏好
- ? **平滑滚动** - 导航栏锚点平滑跳转
- ? **粒子背景** - 科技感粒子动效
- ? **滚动动画** - 元素进入视口时淡入动画

### 页面模块
1. **头部导航** - 固定顶部导航栏，滚动时改变背景
2. **英雄区域** - 火柴人 SVG 头像 + 姓名 + Slogan + CTA 按钮
3. **关于我** - 详细介绍个人背景、经历、目标
4. **技能栈** - 四大分类技能标签展示
5. **项目作品** - 5 个项目卡片展示
6. **联系方式** - 飞书、GitHub、邮箱

## ?? 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 语义化标签 |
| CSS3 | 自定义属性、Grid 布局、动画 |
| JavaScript | 原生 ES6+，无依赖 |
| Google Fonts | Inter + Noto Sans SC 字体 |

## ? 项目结构

```
strck_man_web/
├── index.html          # 主页面
├── css/
│   └── style.css       # 主样式（含响应式）
├── js/
│   └── main.js         # 主脚本
├── README.md           # 说明文档
└── images/             # 图片目录（可选）
```

## ? 快速开始

### 本地预览

直接双击打开 `index.html` 文件即可在浏览器中预览。

或使用 VS Code 的 Live Server 扩展：

1. 安装 Live Server 扩展
2. 右键 `index.html` → "Open with Live Server"

### 使用 Python 简易服务器

```bash
# Python 3
python -m http.server 8000

# 访问 http://localhost:8000
```

## ? 部署指南

### GitHub Pages

1. 创建 GitHub 仓库
2. 推送所有文件到仓库
3. 进入 Settings → Pages
4. 选择 `main` 分支，保存
5. 等待部署完成，访问生成的 URL

### Vercel

1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按提示完成部署

### Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 或连接 GitHub 仓库自动部署

## ? 自定义配置

### 修改颜色

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-start: #6366f1;  /* 主色起始 */
    --primary-end: #8b5cf6;    /* 主色结束 */
    --accent: #f97316;         /* 强调色 */
}
```

### 修改内容

直接编辑 `index.html` 中的文本内容。

### 添加项目

在 `index.html` 的 `projects-grid` 区域复制项目卡片：

```html
<div class="project-card">
    <div class="project-icon">?</div>
    <h3 class="project-title">项目名称</h3>
    <p class="project-desc">项目描述</p>
    <div class="project-tech">
        <span class="tech-tag">技术 1</span>
        <span class="tech-tag">技术 2</span>
    </div>
</div>
```

## ? 性能指标

| 指标 | 目标 | 实际 |
|------|------|------|
| Lighthouse 性能 | ≥90 | - |
| 首屏加载时间 | <2s | - |
| 页面总大小 | <2MB | - |

## ? 可访问性

- ? 语义化 HTML 标签
- ? 键盘导航支持
- ? 颜色对比度符合 WCAG 2.1 AA
- ? 图片 Alt 文本
- ? ARIA 标签

## ? 浏览器兼容性

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | 最近 2 年版本 |
| Firefox | 最近 2 年版本 |
| Safari | 最近 2 年版本 |
| Edge | 最近 2 年版本 |
| 移动端 | iOS Safari, Chrome Mobile |

## ? 待办事项

- [ ] 配置自定义域名
- [ ] 添加真实的 GitHub 链接
- [ ] 配置联系邮箱
- [ ] 添加统计代码（可选）
- [ ] 添加 sitemap.xml（SEO）

## ? 许可证

MIT License

## ? 关于

**Stack Man（火柴人）** ?

- 信息学竞赛教育 AI 助手
- 懂算法的段子手
- 培养路径：预科班 → CSP → NOIP → NOI → IOI

---

Made with ? and lots of code.
