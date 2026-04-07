# 问题排查记录 - 中文乱码问题

## 问题描述
子页面（services/*.html, about.html, contact.html 等）在浏览器中显示中文乱码/问号，但首页 index.html 显示正常。

## 问题原因
**文件编码不一致**：
- 子页面文件是以 **GBK 编码**保存的（Windows 中文系统默认编码）
- 但 HTML 文件中声明的是 `<meta charset="UTF-8">`
- 浏览器按照 UTF-8 解析 GBK 编码的文件，导致中文显示为乱码或问号

## 为什么首页正常？
首页 index.html 可能是以 UTF-8 编码创建的，所以显示正常。

## 解决方案

### 方法一：批量转换文件编码（推荐）
```python
import os
files = ['services/school.html', 'services/competition.html', ...]
for f in files:
    # 读取为二进制
    with open(f, 'rb') as file:
        content = file.read()
    # 尝试 UTF-8 解码
    try:
        text = content.decode('utf-8')
        print(f'OK (UTF-8): {f}')
    except:
        # 尝试 GBK 解码并转换
        text = content.decode('gbk')
        with open(f, 'w', encoding='utf-8') as out:
            out.write(text)
        print(f'Converted (GBK->UTF-8): {f}')
```

### 方法二：使用 VS Code 转换
1. 在 VS Code 中打开文件
2. 点击右下角编码显示（可能显示为 GBK）
3. 选择"通过编码保存"
4. 选择 UTF-8

### 方法三：使用 notepad++ 转换
1. 用 notepad++ 打开文件
2. 菜单：编码 → 转为 UTF-8
3. 保存

## 预防措施

### 1. 统一使用 UTF-8 编码
所有 HTML、CSS、JS 文件必须使用 **UTF-8 无 BOM** 编码。

### 2. VS Code 设置
在 VS Code 设置中添加：
```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": false
}
```

### 3. 创建文件时注意
- 使用支持 UTF-8 的编辑器
- 确保新建文件时选择 UTF-8 编码
- 避免从 GBK 编码的源复制内容

### 4. HTTP 服务器配置
确保服务器发送正确的 Content-Type 头：
```
Content-Type: text/html; charset=utf-8
```

## 验证方法

### 检查文件编码
```python
# 尝试用 UTF-8 读取，失败则可能是其他编码
with open('file.html', 'r', encoding='utf-8') as f:
    content = f.read()
```

### 浏览器开发者工具
1. 打开开发者工具（F12）
2. 查看 Console 是否有编码相关错误
3. 查看 Network 标签中响应头是否正确

## 已修复文件

### 第一次修复（2026-04-07）
- [x] services/school.html
- [x] services/competition.html
- [x] services/research.html
- [x] services/policy.html
- [x] services/cases.html
- [x] about.html
- [x] contact.html
- [x] docs.html
- [x] css/style.css (修复了问号列表标记)

### 第二次修复（2026-04-07 下午 4:20）
- [x] blog.html (GBK -> UTF-8 转换完成)

## 修复脚本

使用 Python 脚本自动检测并转换编码：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os

files = ['blog.html', 'about.html', 'contact.html', 'docs.html', ...]

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
    text = content.decode('gbk')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'Converted (GBK->UTF-8): {filepath}')
```

## 相关资源
- [UTF-8 vs GBK 编码区别](https://zh.wikipedia.org/wiki/UTF-8)
- [VS Code 编码设置](https://code.visualstudio.com/docs/editor/codebasics#_encoding)

---
**创建日期：** 2026-04-07  
**问题状态：** ? 已解决
