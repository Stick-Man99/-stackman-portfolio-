(function () {
    'use strict';

    const grid = document.getElementById('student-articles-grid');
    const status = document.getElementById('student-articles-status');
    if (!grid || !status) return;

    const apiUrl = (window.STACKMAN_SUBMISSION_API || '').replace(/\/$/, '');
    const categoryNames = { note: '学习笔记', solution: '算法题解', contest: '竞赛总结', reflection: '学习思考' };
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const formatDate = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN');
    };

    const excerpt = (value) => String(value || '')
        .replace(/```[\s\S]*?```/g, ' 代码片段 ')
        .replace(/[#*_`>[\]()!-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 96);

    const render = (items) => {
        if (!items.length) {
            status.innerHTML = '目前还没有公开的学生作品。<a href="submit.html">提交第一篇学习笔记</a>';
            return;
        }
        status.textContent = '';
        grid.innerHTML = items.map((item) => '<article class="blog-card student-article-card">' +
            '<div class="student-card-accent"><span>学生共创</span></div>' +
            '<div class="blog-card-content">' +
            '<div class="blog-meta"><span class="blog-category">' + escapeHtml(categoryNames[item.category] || '学生作品') + '</span><span class="blog-date">' + escapeHtml(formatDate(item.created_at)) + '</span></div>' +
            '<h3 class="blog-title">' + escapeHtml(item.title) + '</h3>' +
            '<p class="blog-excerpt">' + escapeHtml(excerpt(item.content) || '打开文章查看完整内容。') + '</p>' +
            '<p class="student-author">作者：' + escapeHtml(item.author) + (item.grade ? ' · ' + escapeHtml(item.grade) : '') + '</p>' +
            '<div class="blog-footer"><a href="student-article.html?id=' + encodeURIComponent(item.id) + '" class="read-more">阅读全文 <i class="fas fa-arrow-right"></i></a></div>' +
            '</div></article>').join('');
    };

    if (!apiUrl) {
        status.textContent = '学生作品将在共享后台连接后显示。';
        return;
    }

    fetch(apiUrl + '/articles')
        .then((response) => {
            if (!response.ok) throw new Error('load_failed');
            return response.json();
        })
        .then((data) => render(data.items || []))
        .catch(() => {
            status.textContent = '学生作品暂时无法加载，请稍后刷新。';
            status.dataset.state = 'error';
        });
})();
