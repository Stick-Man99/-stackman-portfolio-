# Stack Man 网站开发问题排查与解决方案手册

**文档版本：** v2.0  
**最后更新：** 2026-04-08  
**项目：** Stack Man 个人介绍网站

---

## 目录

1. [汉字乱码问题](#1-汉字乱码问题)
2. [表情图标显示问题](#2-表情图标显示问题)
3. [内容丢失问题](#3-内容丢失问题)
4. [页面切换闪烁问题](#4-页面切换闪烁问题)
5. [开发最佳实践](#5-开发最佳实践)
6. [快速修复脚本](#6-快速修复脚本)

---

## 1. 汉字乱码问题

### 问题描述
子页面（services/*.html, about.html, contact.html 等）在浏览器中显示中文乱码或问号，但首页 index.html 显示正常。

### 问题原因
**文件编码不一致**：
- 子页面文件是以 **GBK 编码**保存的（Windows 中文系统默认编码）
- 但 HTML 文件中声明的是 `<meta charset="UTF-8">`
- 浏览器按照 UTF-8 解析 GBK 编码的文件，导致中文显示为乱码或问号

### 解决方案

#### 方法一：使用 Python 脚本批量转换（推荐）
```bash
python fix_encoding.py
```

#### 方法二：使用 VS Code 转换
1. 在 VS Code 中打开文件
2. 点击右下角编码显示（可能显示为 GBK）
3. 选择"通过编码保存"
4. 选择 UTF-8

#### 方法三：使用 notepad++ 转换
1. 用 notepad++ 打开文件
2. 菜单：编码 → 转为 UTF-8
3. 保存

### 预防措施

1. **统一使用 UTF-8 编码**：所有 HTML、CSS、JS 文件必须使用 **UTF-8 无 BOM** 编码
2. **VS Code 设置**：
```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": false
}
```
3. **创建文件时注意**：
   - 使用支持 UTF-8 的编辑器
   - 确保新建文件时选择 UTF-8 编码
   - 避免从 GBK 编码的源复制内容

### 验证方法
```bash
python fix_encoding.py
```
输出 `OK (UTF-8)` 表示文件编码正确。

---

## 2. 表情图标显示问题

### 问题描述
页面中的 Emoji 表情（如 ?、?、? 等）显示为方框、问号或空白。

### 问题原因
1. **文件编码问题**：Emoji 是 Unicode 字符，需要 UTF-8 编码支持
2. **字体缺失**：系统或浏览器缺少支持 Emoji 的字体
3. **CSS 字体覆盖**：自定义字体可能不包含 Emoji 字符

### 解决方案

#### 方案一：确保文件编码为 UTF-8
```bash
python fix_encoding.py
```

#### 方案二：添加 Emoji 字体回退
在 CSS 中添加：
```css
body {
    font-family: 'Inter', 'Noto Sans SC', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
}
```

#### 方案三：使用 SVG 图标替代
对于关键的表情图标，使用 SVG 内联图标替代 Emoji：
```html
<!-- 使用 SVG 替代 ? -->
<svg class="lobster-icon" viewBox="0 0 48 48">
    <!-- SVG 路径 -->
</svg>
```

### 预防措施
1. 始终使用 UTF-8 编码保存文件
2. 在 CSS 中设置正确的字体回退链
3. 对于重要图标，优先使用 SVG 或图标字体（如 Font Awesome）

---

## 3. 内容丢失问题

### 问题描述
在修改 HTML 文件时，部分内容被意外删除或覆盖，导致页面内容不完整。

### 问题原因
1. **使用 replace_in_file 时 SEARCH 块不匹配**：文件内容被自动格式化后，SEARCH 块与实际内容不一致
2. **write_to_file 覆盖整个文件**：使用 write_to_file 时未提供完整内容
3. **编辑器自动格式化**：保存时编辑器自动调整格式，导致后续替换失败

### 解决方案

#### 方案一：修改前先读取文件
```bash
# 先读取文件确认当前内容
read_file <path>xxx.html</path>
```

#### 方案二：使用精确的 SEARCH 块
- SEARCH 块必须与文件内容**完全匹配**（包括空格、缩进、换行）
- 包含足够的上下文行以确保唯一匹配
- 避免过长的 SEARCH 块

#### 方案三：对于大改动使用 write_to_file
当需要修改多处内容时，直接使用 write_to_file 提供完整文件内容。

### 预防措施

1. **修改前备份**：
```bash
# 使用 git 保存当前状态
git add .
git commit -m "backup before changes"
```

2. **小步修改**：每次只修改一处内容，确认成功后再继续

3. **使用版本控制**：
```bash
# 查看变更
git diff
# 回滚错误修改
git checkout -- <file>
```

4. **确认文件内容**：修改后使用 read_file 或浏览器验证

---

## 4. 页面切换闪烁问题

### 问题描述
在页面切换时，主题（亮色/暗黑）会先闪烁一下默认主题，然后才切换到用户选择的主题。

### 问题原因
1. **JavaScript 加载时机**：主题切换脚本在外部 JS 文件中，加载和执行有延迟
2. **CSS 先于 JS 渲染**：浏览器先渲染页面，然后 JS 才执行主题切换

### 解决方案

#### 在 `<head>` 中添加内联脚本
在每个 HTML 文件的 `<head>` 末尾、`</head>` 之前添加：

```html
<!-- 防止页面切换时闪白 -->
<script>
    (function() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    })();
</script>
```

**位置要求**：
- 必须在 `</head>` 之前
- 必须在 CSS 链接之后
- 必须是内联脚本（不能是外部文件）

### 完整示例
```html
<head>
    <meta charset="UTF-8">
    <!-- 其他 meta 标签 -->
    <link rel="stylesheet" href="css/style.css">
    
    <!-- 防止页面切换时闪白 -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        })();
    </script>
</head>
```

### 验证方法
1. 切换到暗黑模式
2. 刷新页面或跳转到其他页面
3. 观察是否有闪烁（应该无闪烁）

---

## 5. 开发最佳实践

### 5.1 文件编码规范

| 文件类型 | 编码 | 说明 |
|----------|------|------|
| HTML | UTF-8 无 BOM | 必须声明 `<meta charset="UTF-8">` |
| CSS | UTF-8 无 BOM | 避免中文注释乱码 |
| JavaScript | UTF-8 无 BOM | 避免字符串乱码 |
| Markdown | UTF-8 无 BOM | 文档通用编码 |

### 5.2 修改 HTML 文件流程

```
1. 读取文件 → read_file
2. 确认内容 → 检查当前状态
3. 小步修改 → replace_in_file（单处修改）
        或
   write_to_file（完整重写）
4. 编码转换 → python fix_encoding.py
5. 验证效果 → 浏览器刷新检查
```

### 5.3 新增子页面模板

创建新的 HTML 子页面时，必须包含：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - Stack Man</title>
    <link rel="stylesheet" href="css/style.css">
    
    <!-- 防止页面切换时闪白（必须！） -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        })();
    </script>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 5.4 Git 使用规范

```bash
# 修改前备份
git add .
git commit -m "backup: before modifying xxx"

# 修改后检查
git diff

# 提交变更
git add .
git commit -m "feat: 描述修改内容"

# 推送到远程
git push
```

### 5.5 检查清单

每次修改后执行：

- [ ] 文件编码是否为 UTF-8？ → `python fix_encoding.py`
- [ ] 中文是否正常显示？ → 浏览器检查
- [ ] Emoji 是否正常显示？ → 浏览器检查
- [ ] 主题切换是否闪烁？ → 切换主题测试
- [ ] 内容是否完整？ → 对比修改前内容
- [ ] 导航链接是否正确？ → 点击测试

---

## 6. 快速修复脚本

### fix_encoding.py

项目根目录下的编码转换脚本：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量检测并转换 HTML/CSS/JS 文件编码为 UTF-8
"""
import os

files = [
    'index.html', 'about.html', 'contact.html', 'docs.html', 'blog.html',
    'services/school.html', 'services/competition.html', 
    'services/research.html', 'services/policy.html', 'services/cases.html',
    'css/style.css', 'js/main.js'
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Try UTF-8 first
    try:
        text = content.decode('utf-8')
        if text.encode('utf-8') == content:
            print(f'OK (UTF-8): {filepath}')
            continue
    except UnicodeDecodeError:
        pass
    
    # Try GBK and convert
    try:
        text = content.decode('gbk')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'Converted (GBK->UTF-8): {filepath}')
    except Exception as e:
        print(f'Error ({filepath}): {e}')

print('\nDone!')
```

### 使用方法
```bash
# 在项目根目录执行
python fix_encoding.py
```

### 输出说明
- `OK (UTF-8): xxx` - 文件已经是 UTF-8 编码
- `Converted (GBK->UTF-8): xxx` - 文件已从 GBK 转换为 UTF-8
- `Error (xxx): ...` - 文件处理出错

---

## 附录：问题记录历史

| 日期 | 问题 | 状态 | 备注 |
|------|------|------|------|
| 2026-04-07 | 子页面中文乱码 | ? 已解决 | 批量转换 UTF-8 |
| 2026-04-07 | CSS 文件问号标记 | ? 已解决 | 编码转换 |
| 2026-04-07 | blog.html 乱码 | ? 已解决 | 编码转换 |
| 2026-04-07 | contact.html 内容丢失 | ? 已解决 | 完整重写 |
| 2026-04-07 | docs.html 内容丢失 | ? 已解决 | 完整重写 |
| 2026-04-07 | 页面切换闪烁 | ? 已解决 | 添加内联脚本 |
| 2026-04-08 | 整理问题文档 | ? 已完成 | 本手册创建 |

---

## 总结与教训

### 核心原则
1. **编码统一**：所有文件必须使用 UTF-8 无 BOM 编码
2. **小步验证**：每次修改后验证效果，避免累积错误
3. **版本控制**：修改前提交备份，便于回滚
4. **模板复用**：新增页面使用标准模板，避免遗漏关键代码

### 避免的问题
1. ? 不要直接假设文件编码
2. ? 不要一次性修改多处而不验证
3. ? 不要忽略编辑器的自动格式化
4. ? 不要在外部 JS 中处理主题初始化

### 养成的习惯
1. ? 修改前先 `read_file` 确认内容
2. ? 修改后先 `fix_encoding.py` 转换编码
3. ? 新增页面复制标准模板
4. ? 提交前 `git diff` 检查变更

---

**文档维护者：** Stack Man 开发团队  
**反馈与建议：** 请通过飞书或 GitHub 联系
