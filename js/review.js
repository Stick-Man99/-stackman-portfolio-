(function () {
    'use strict';

    const list = document.getElementById('review-list');
    const connection = document.getElementById('review-connection');
    const apiField = document.getElementById('review-api-url');
    const tokenField = document.getElementById('review-admin-token');
    const status = document.getElementById('review-status');
    const queueKey = 'stackman-submission-queue';
    const endpointKey = 'stackman-review-endpoint';
    const categoryNames = { note: '学习笔记', solution: '算法题解', contest: '竞赛总结', reflection: '学习思考' };
    let apiUrl = window.STACKMAN_SUBMISSION_API || localStorage.getItem(endpointKey) || '';
    let adminToken = '';

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const setStatus = (message, type) => {
        status.textContent = message;
        status.dataset.state = type || 'info';
    };

    const getLocalQueue = () => JSON.parse(localStorage.getItem(queueKey) || '[]');
    const saveLocalQueue = (queue) => localStorage.setItem(queueKey, JSON.stringify(queue));
    const statusLabel = (value) => ({ pending: '待审核', approved: '已通过', rejected: '已退回' }[value] || value);

    const render = (items) => {
        if (!items.length) {
            list.innerHTML = '<div class="empty-state"><h2>暂无投稿</h2><p>可以先打开学生投稿页提交一篇测试文章。</p><a class="btn btn-primary" href="submit.html">打开投稿页</a></div>';
            return;
        }
        list.innerHTML = items.map((item) => {
            const id = escapeHtml(item.id);
            const online = Boolean(apiUrl);
            const currentStatus = escapeHtml(item.status || 'pending');
            const problemLabel = item.problem_code ? ' · 关联题目：' + escapeHtml(item.problem_code) : '';
            return '<article class="review-card" data-id="' + id + '">' +
                '<div class="review-card-header"><div><span class="blog-category">' + escapeHtml(categoryNames[item.category] || item.category) + '</span><h2>' + escapeHtml(item.title) + '</h2><p>作者：' + escapeHtml(item.author || item.author_nickname) + ' · ' + escapeHtml(item.grade || item.grade_range || '未填写') + problemLabel + '</p></div><span class="review-status">' + statusLabel(currentStatus) + '</span></div>' +
                '<details><summary>查看 Markdown 内容</summary><pre class="review-content">' + escapeHtml(item.content) + '</pre></details>' +
                '<div class="review-actions">' +
                (currentStatus === 'pending' ? '<button class="btn btn-primary" data-action="approve">通过并发布</button><button class="btn btn-secondary" data-action="reject">退回修改</button>' : '') +
                (!online ? '<button class="btn btn-secondary" data-action="remove">删除本机记录</button>' : '') +
                '</div></article>';
        }).join('');
    };

    const loadRemote = async () => {
        if (!adminToken) throw new Error('missing_token');
        const response = await fetch(apiUrl.replace(/\/$/, '') + '/admin/submissions', { headers: { Authorization: 'Bearer ' + adminToken } });
        if (!response.ok) throw new Error('load_failed');
        const data = await response.json();
        render(data.items || []);
        setStatus('已连接线上审核后台，共 ' + (data.items || []).length + ' 条投稿。', 'success');
    };

    const loadLocal = () => {
        render(getLocalQueue());
        setStatus('当前是本机演示模式，其他设备看不到这些投稿。', 'info');
    };

    const refresh = async () => {
        if (!apiUrl) return loadLocal();
        try {
            await loadRemote();
        } catch (error) {
            render([]);
            setStatus(error.message === 'missing_token' ? '请输入管理员令牌后再连接线上后台。' : '线上后台连接失败，请检查地址、令牌和跨域设置。', 'error');
        }
    };

    const updateRemote = async (id, nextStatus) => {
        const response = await fetch(apiUrl.replace(/\/$/, '') + '/admin/submissions/' + encodeURIComponent(id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken },
            body: JSON.stringify({ status: nextStatus })
        });
        if (!response.ok) throw new Error('update_failed');
        await loadRemote();
    };

    connection.addEventListener('submit', (event) => {
        event.preventDefault();
        apiUrl = apiField.value.trim().replace(/\/$/, '');
        adminToken = tokenField.value;
        if (apiUrl) localStorage.setItem(endpointKey, apiUrl);
        else localStorage.removeItem(endpointKey);
        refresh();
    });

    list.addEventListener('click', async (event) => {
        const action = event.target.dataset.action;
        const card = event.target.closest('.review-card');
        if (!action || !card) return;
        try {
            if (apiUrl) {
                await updateRemote(card.dataset.id, action === 'approve' ? 'approved' : 'rejected');
            } else {
                const queue = getLocalQueue();
                if (action === 'remove') saveLocalQueue(queue.filter((item) => item.id !== card.dataset.id));
                else saveLocalQueue(queue.map((item) => item.id === card.dataset.id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item));
                loadLocal();
            }
        } catch (error) {
            setStatus('操作失败，投稿状态没有改变。', 'error');
        }
    });

    apiField.value = apiUrl;
    refresh();
})();
