# Stack Man 个人网站

> 懂算法的段子手，信息学竞赛助手

## 项目概述

这是一个为 Stack Man（火柴人）打造的个人介绍网页，用于展示个人信息、技能、项目作品和联系方式。网站采用纯静态技术构建，具有科技感与轻松风格相结合的视觉效果。

## 在线预览

[点击此处查看在线演示](https://stick-man99.github.io/-stackman-portfolio-/)

## 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式与动画
- **JavaScript (ES6+)** - 交互功能
- **Particles.js** - 粒子背景效果
- **AOS (Animate On Scroll)** - 滚动动画
- **Font Awesome** - 图标库

## 功能特性

### 核心功能
- 响应式设计 - 支持桌面、平板、手机
- 暗黑/亮色主题切换
- 粒子背景动效
- 平滑滚动导航
- 移动端汉堡菜单
- 滚动动画效果

### 页面列表
| 页面 | 文件路径 | 描述 |
|------|----------|------|
| 首页 | `index.html` | 个人介绍、核心数据、服务能力、项目作品 |
| 关于我 | `about.html` | 个人简介、从教经历、教育理念 |
| 联系我 | `contact.html` | 联系表单、联系方式 |
| 竞赛服务 | `services/competition.html` | CSP/NOIP 竞赛培训服务详情 |

## 项目结构

```
strck_man_web/
├── index.html              # 主页
├── about.html              # 关于页面
├── contact.html            # 联系页面
├── css/
│   └── style.css           # 主样式文件
├── js/
│   └── main.js             # 主脚本文件
├── services/
│   └── competition.html    # 竞赛服务页面
└── README.md               # 项目说明
```

## 快速开始

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd strck_man_web
```

2. 直接在浏览器中打开
```bash
# 方式 1: 直接打开
open index.html

# 方式 2: 使用 Python 简易服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

3. 使用 VS Code Live Server 扩展（推荐）
   - 安装 Live Server 扩展
   - 右键 index.html → "Open with Live Server"

## 设计说明

### 色彩方案

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色调 | `#6366f1` → `#8b5cf6` | 蓝紫渐变，科技感 |
| 辅助色 | `#f97316` | 橙色 |
| 深色背景 | `#0f172a` | 暗黑模式背景 |
| 浅色背景 | `#f8fafc` | 亮色模式背景 |

### 响应式断点

| 设备 | 断点 | 布局 |
|------|------|------|
| 桌面大屏 | ≥1024px | 多列布局 |
| 平板 | ≤1024px | 双列布局 |
| 手机 | ≤768px | 单列布局，汉堡菜单 |

## 自定义配置

### 修改联系方式

编辑 `index.html`、`contact.html` 和页脚中的联系信息：

```html
<!-- 飞书 -->
<div class="contact-value">ou_31d1f97aa62b52b3a3c5bd7d0eeff083</div>

<!-- GitHub -->
<a href="https://github.com/Stick-Man99" class="social-link">...</a>

<!-- 邮箱 -->
<a href="mailto:your-email@example.com" class="social-link">...</a>
```

### 修改主题色

在 `css/style.css` 中修改 CSS 变量：

```css
:root {
    --primary-500: #6366f1;  /* 主色 */
    --accent-500: #f97316;   /* 辅助色 */
}
```

## 部署指南

### GitHub Pages

1. 创建 GitHub 仓库
2. 推送项目文件
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

3. 在仓库设置中启用 GitHub Pages
   - Settings → Pages
   - Source: Deploy from branch (main)
   - Folder: / (root)

### Vercel 部署

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署完成

### Netlify 部署

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 或连接 GitHub 仓库自动部署

## 性能优化

- 使用 CDN 加载第三方库
- CSS 压缩（生产环境可进一步压缩）
- 图片使用 SVG 格式（火柴人头像）
- 懒加载动画（AOS）
- 粒子效果按需加载

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

## 更新日志

### v2.0 (2026-04-06)
- 新增多页面支持（关于、联系、服务）
- 新增下拉菜单导航
- 新增暗黑/亮色主题切换
- 新增粒子背景效果
- 新增滚动动画
- 优化响应式设计
- 修复移动端导航问题

### v1.0 (2026-04-06)
- 初始版本发布
- 单页个人介绍网站

## 许可证

MIT License, Copyright 2026 Stack Man

## 联系方式

- 飞书：`ou_31d1f97aa62b52b3a3c5bd7d0eeff083`
- GitHub: [Stick-Man99](https://github.com/Stick-Man99)
- 邮箱：example@email.com

---

**Made with care and lots of code**
