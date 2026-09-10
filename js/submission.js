(function () {
    'use strict';

    const form = document.getElementById('submission-form');
    if (!form) return;

    const contentField = document.getElementById('submission-content');
    const preview = document.getElementById('markdown-preview');
    const status = document.getElementById('submission-status');
    const draftKey = 'stackman-submission-draft';
    const queueKey = 'stackman-submission-queue';
    const apiUrl = window.STACKMAN_SUBMISSION_API || '';

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const renderMarkdown = (source) => {
        const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
        let html = '';
        let inCode = false;
        let code = [];
        let listOpen = false;

        const inline = (text) => escapeHtml(text)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        const closeList = () => {
            if (listOpen) {
                html += '</ul>';
                listOpen = false;
            }
        };

        lines.forEach((line) => {
            if (line.trim().startsWith('```')) {
                if (inCode) {
                    html += '<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>';
                    code = [];
                    inCode = false;
                } else {
                    closeList();
                    inCode = true;
                }
                return;
            }
            if (inCode) {
                code.push(line);
                return;
            }
            const heading = line.match(/^(#{1,3})\s+(.+)$/);
            const item = line.match(/^\s*[-*]\s+(.+)$/);
            if (heading) {
                closeList();
                const level = heading[1].length;
                html += '<h' + level + '>' + inline(heading[2]) + '</h' + level + '>';
            } else if (item) {
                if (!listOpen) {
                    html += '<ul>';
                    listOpen = true;
                }
                html += '<li>' + inline(item[1]) + '</li>';
            } else if (line.trim()) {
                closeList();
                html += '<p>' + inline(line) + '</p>';
            } else {
                closeList();
            }
        });
        closeList();
        if (inCode) html += '<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>';
        return html || '<p class="preview-empty">输入正文后，这里会显示预览。</p>';
    };

    const setStatus = (message, type) => {
        status.textContent = message;
        status.dataset.state = type || 'info';
    };

    const updatePreview = () => {
        preview.innerHTML = renderMarkdown(contentField.value);
    };

    const getFormData = () => Object.fromEntries(new FormData(form).entries());

    const saveDraft = () => {
        localStorage.setItem(draftKey, JSON.stringify(getFormData()));
        setStatus('草稿已保存在这台设备上，尚未提交。', 'success');
    };

    const restoreDraft = () => {
        try {
            const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
            if (!draft) return;
            Object.entries(draft).forEach(([key, value]) => {
                const field = form.elements.namedItem(key);
                if (field) field.value = value;
            });
            updatePreview();
            setStatus('已恢复本机草稿。', 'info');
        } catch (error) {
            localStorage.removeItem(draftKey);
        }
    };

    const submitLocalDemo = (data) => {
        const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        queue.unshift({
            id: 'local-' + Date.now(),
            ...data,
            status: 'pending',
            created_at: new Date().toISOString()
        });
        localStorage.setItem(queueKey, JSON.stringify(queue));
    };

    const submitRemote = async (data) => {
        const response = await fetch(apiUrl.replace(/\/$/, '') + '/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('submission failed');
    };

    contentField.addEventListener('input', updatePreview);
    document.getElementById('save-draft').addEventListener('click', saveDraft);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = getFormData();
        setStatus('正在提交，请稍候……', 'info');
        try {
            if (apiUrl) {
                await submitRemote(data);
                setStatus('投稿已提交，等待老师审核。', 'success');
            } else {
                submitLocalDemo(data);
                setStatus('投稿已进入本机演示审核队列。正式上线前需要配置共享后台。', 'success');
            }
            localStorage.removeItem(draftKey);
            form.reset();
            updatePreview();
        } catch (error) {
            setStatus('提交失败，请稍后重试；文章没有被公开。', 'error');
        }
    });

    restoreDraft();
    updatePreview();
})();
