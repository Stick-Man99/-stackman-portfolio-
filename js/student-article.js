(function () {
    'use strict';

    const root = document.getElementById('published-article');
    if (!root) return;

    const apiUrl = (window.STACKMAN_SUBMISSION_API || '').replace(/\/$/, '');
    const id = new URLSearchParams(window.location.search).get('id');
    const categoryNames = { note: '学习笔记', solution: '算法题解', contest: '竞赛总结', reflection: '学习思考' };
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const inline = (text) => escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const renderMarkdown = (source) => {
        const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
        let html = '';
        let inCode = false;
        let code = [];
        let listOpen = false;
        const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };

        lines.forEach((line) => {
            if (line.trim().startsWith('```')) {
                if (inCode) { html += '<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>'; code = []; inCode = false; }
                else { closeList(); inCode = true; }
                return;
            }
            if (inCode) { code.push(line); return; }
            const heading = line.match(/^(#{1,3})\s+(.+)$/);
            const item = line.match(/^\s*[-*]\s+(.+)$/);
            if (heading) {
                closeList();
                const level = heading[1].length;
                html += '<h' + level + '>' + inline(heading[2]) + '</h' + level + '>';
            } else if (item) {
                if (!listOpen) { html += '<ul>'; listOpen = true; }
                html += '<li>' + inline(item[1]) + '</li>';
            } else if (line.trim()) {
                closeList();
                html += '<p>' + inline(line) + '</p>';
            } else closeList();
        });
        closeList();
        if (inCode) html += '<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>';
        return html;
    };

    const showError = () => {
        root.innerHTML = '<div class="article-error"><h1>文章暂时无法查看</h1><p>它可能尚未通过审核、不是公开内容，或者链接已经失效。</p><a class="btn btn-primary" href="blog.html">返回博客</a></div>';
    };

    if (!apiUrl || !id) { showError(); return; }

    fetch(apiUrl + '/articles/' + encodeURIComponent(id))
        .then((response) => {
            if (!response.ok) throw new Error('load_failed');
            return response.json();
        })
        .then(({ item }) => {
            document.title = item.title + ' - Stack Man';
            const date = new Date(item.created_at);
            const dateLabel = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN');
            const luoguLink = item.luogu_url ? '<a class="article-problem-link" href="' + escapeHtml(item.luogu_url) + '" target="_blank" rel="noopener noreferrer">前往洛谷题目 <span aria-hidden="true">↗</span></a>' : '';
            root.innerHTML = '<header class="published-article-header">' +
                '<span class="blog-category">' + escapeHtml(categoryNames[item.category] || '学生作品') + '</span>' +
                '<h1>' + escapeHtml(item.title) + '</h1>' +
                '<p>作者：' + escapeHtml(item.author) + (item.grade ? ' · ' + escapeHtml(item.grade) : '') + (dateLabel ? ' · ' + escapeHtml(dateLabel) : '') + '</p>' +
                luoguLink + '</header>' +
                '<div class="published-article-content markdown-preview">' + renderMarkdown(item.content) + '</div>';
        })
        .catch(showError);
})();
