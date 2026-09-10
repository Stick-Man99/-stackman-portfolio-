(function () {
    'use strict';
    const list = document.getElementById('review-list');
    const queueKey = 'stackman-submission-queue';
    const categoryNames = { note: '学习笔记', solution: '算法题解', contest: '竞赛总结', reflection: '学习思考' };
    const escapeHtml = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    const getQueue = () => JSON.parse(localStorage.getItem(queueKey) || '[]');
    const render = () => {
        const queue = getQueue();
        if (!queue.length) {
            list.innerHTML = '<div class="empty-state"><h2>暂无待审核投稿</h2><p>可以先打开学生投稿页提交一篇本机演示文章。</p><a class="btn btn-primary" href="submit.html">打开投稿页</a></div>';
            return;
        }
        list.innerHTML = queue.map((item) => '<article class="review-card" data-id="' + escapeHtml(item.id) + '">' +
            '<div class="review-card-header"><div><span class="blog-category">' + escapeHtml(categoryNames[item.category] || item.category) + '</span><h2>' + escapeHtml(item.title) + '</h2><p>作者：' + escapeHtml(item.author) + ' · ' + escapeHtml(item.grade || '未填写') + '</p></div><span class="review-status">' + escapeHtml(item.status) + '</span></div>' +
            '<details><summary>查看 Markdown 内容</summary><pre class="review-content">' + escapeHtml(item.content) + '</pre></details>' +
            '<div class="review-actions"><button class="btn btn-primary" data-action="approve">演示通过</button><button class="btn btn-secondary" data-action="remove">删除演示记录</button></div></article>').join('');
    };
    list.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        if (!action) return;
        const card = event.target.closest('.review-card');
        const id = card.dataset.id;
        const queue = getQueue();
        if (action === 'remove') {
            localStorage.setItem(queueKey, JSON.stringify(queue.filter((item) => item.id !== id)));
        } else if (action === 'approve') {
            localStorage.setItem(queueKey, JSON.stringify(queue.map((item) => item.id === id ? { ...item, status: 'approved' } : item)));
        }
        render();
    });
    render();
})();
