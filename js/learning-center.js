(() => {
    let topics = [
        { stage: 'CSP-J', domain: '基础算法', title: '队列', label: 'T2 → T4', color: 'foundation', note: '从基础容器到队列模拟，保留原题单的训练顺序。', problems: ['2216', '10457', '3662', '2564', '1419'] },
        { stage: 'CSP-J', domain: '基础算法', title: '栈', label: 'T2 → T4', color: 'foundation', note: '括号匹配、表达式和单调栈的基础入口。', problems: ['1165', '4387', '6503', '1901', '6155'] },
        { stage: 'CSP-J', domain: '基础算法', title: '前缀和 / 差分', label: 'T2 → T4', color: 'foundation', note: '一维和二维前缀思想，是后续优化与建模的基础。', problems: ['6625', '2280', '3173', '1387', '3662'] },
        { stage: 'CSP-J', domain: '基础算法', title: '二分', label: 'T2 → T4', color: 'foundation', note: '区分二分查找与二分答案，逐步进入更复杂的判定模型。', problems: ['1824', '1873', '9497', '9644', '10098'] },
        { stage: 'CSP-J', domain: '基础算法', title: '模拟', label: 'T1 → T3', color: 'foundation', note: '保留原题单的入门训练位置，题号将在完整导入阶段补齐。', problems: [] },
        { stage: 'CSP-J', domain: '基础算法', title: 'BFS', label: 'T2 → T4', color: 'foundation', note: '从网格和最短路开始理解广度优先搜索。', problems: [] },
        { stage: 'CSP-J', domain: '基础算法', title: 'DFS', label: 'T2 → T4', color: 'foundation', note: '递归、排列组合、方案数和深度优先搜索。', problems: [] },
        { stage: 'CSP-J', domain: '基础算法', title: '建图搜索', label: 'T3 → T4', color: 'foundation', note: '把实际问题转成图，再用搜索解决。', problems: [] },
        { stage: 'CSP-J', domain: '数据结构', title: '字符串', label: 'T2 → T4', color: 'structure', note: '字符操作、字符串处理和基础字符串算法。', problems: ['10262'] },
        { stage: 'CSP-J', domain: '数据结构', title: '二叉树', label: 'T3 → T4', color: 'structure', note: '二叉树表示、遍历和基础树形建模。', problems: ['1827', '1675'] },
        { stage: 'CSP-J', domain: '动态规划', title: '线性 DP', label: 'T3 → T4', color: 'dp', note: '从状态定义和转移入手，连接到背包与区间 DP。', problems: ['8707', '1970', '2629', '1103'] },
        { stage: 'CSP-J', domain: '动态规划', title: '背包 DP', label: 'T3 → T4', color: 'dp', note: '题单中的经典背包专题，后续可关联课程路线和博客题解。', problems: ['9460', '9533', '1855', '2904'] },
        { stage: 'CSP-J', domain: '动态规划', title: '区间 DP', label: 'T4', color: 'dp', note: '从区间状态和枚举分割点开始进入 DP 提高阶段。', problems: ['2858', '1220', '1388'] },
        { stage: 'CSP-J', domain: '数学', title: '数学', label: 'T2 → T4', color: 'math', note: '基础数学、数论工具和竞赛中常见的数学建模。', problems: ['2118', '1029', '1072'] },
        { stage: 'CSP-J', domain: '基础算法', title: 'T1 入门题单', label: 'T1', color: 'foundation', note: '面向入门阶段的基础练习集合。', problems: [] },
        { stage: 'CSP-S/NOIP', domain: '图论', title: '最短路与连通性', label: 'T2 → T5', color: 'graph', note: '覆盖 Floyd、Dijkstra、分层图和强连通分量等路线。', problems: ['1546', '2872', '9709', '3387'] },
        { stage: 'CSP-S/NOIP', domain: '数据结构', title: '线段树与树状数组', label: 'T3 → T6', color: 'structure', note: '从基础维护逐步过渡到区间结构与优化 DP。', problems: ['5200', '3374', '3608', '1886'] },
        { stage: 'NOI', domain: '图论', title: '动态树与高级树论', label: 'T5 → T7', color: 'structure', note: '高级阶段样板，后续接入 NOI 题单与更细的地图节点。', problems: ['LCT', '可持久化 Trie', '点分治'] }
    ];

    const state = { stage: 'all', domain: 'all', difficulty: 'all', search: '' };
    let problemMeta = new Map();
    let solutionLinks = new Map();
    const grid = document.getElementById('problemGrid');
    const empty = document.getElementById('problemEmpty');

    const problemCode = (problem) => typeof problem === 'string' ? problem : problem.code;
    const problemInfo = (problem) => problemMeta.get(problemCode(problem)) || {};
    const problemUrl = (problem) => {
        const code = problemCode(problem);
        if (/^\d+$/.test(code)) return `https://www.luogu.com.cn/problem/P${code}`;
        if (/^(P|B|CF|U|AT|ABC|ARC|AGC|SP|HDU|POJ|UVA)/i.test(code)) return `https://www.luogu.com.cn/problem/${code}`;
        return 'https://www.luogu.com.cn/problem/list';
    };

    const difficultyClass = (problem) => {
        const key = problemInfo(problem).luoguDifficulty;
        return key ? ` problem-difficulty-${key}` : '';
    };

    const difficultyLabel = (problem) => {
        const info = problemInfo(problem);
        if (info.luoguDifficultyLabel) return info.luoguDifficultyLabel;
        const code = displayCode(problem).toUpperCase();
        if (code.startsWith('CF')) return 'Codeforces 题目 · 洛谷颜色待补充';
        if (code.startsWith('AT_') || code.startsWith('ABC') || code.startsWith('ARC')) return 'AtCoder 题目 · 洛谷颜色待补充';
        if (code.startsWith('SP')) return 'SPOJ 题目 · 洛谷颜色待补充';
        if (code.startsWith('UVA')) return 'UVA 题目 · 洛谷颜色待补充';
        if (code.startsWith('U')) return '洛谷用户题目 · 洛谷颜色待补充';
        if (code === 'BORUVKA') return '题号待确认 · 洛谷颜色待补充';
        return '洛谷难度待同步';
    };

    const problemTooltip = (problem) => {
        const info = problemInfo(problem);
        const title = info.title ? ` · ${info.title}` : '';
        return `${displayCode(problem)}${title} · ${difficultyLabel(problem)}`
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    const displayCode = (problem) => {
        const code = problemCode(problem);
        return /^\d+$/.test(code) ? `P${code}` : code;
    };

    const submissionUrl = (problem, topic) => `submit.html?problem=${encodeURIComponent(displayCode(problem))}&topic=${encodeURIComponent(topic.title)}&luogu_url=${encodeURIComponent(problemUrl(problem))}&category=solution`;

    const renderProblems = () => {
        if (!grid || !empty) return;
        const query = state.search.trim().toLowerCase();
        const visible = topics.map((topic) => ({
            topic,
            problems: topic.problems.filter((problem) => state.difficulty === 'all' || problemInfo(problem).luoguDifficulty === state.difficulty),
        })).filter(({ topic, problems }) => {
            const stageMatch = state.stage === 'all' || topic.stage === state.stage;
            const domainMatch = state.domain === 'all' || topic.domain === state.domain;
            const searchMatch = !query || `${topic.title} ${topic.domain} ${topic.stage} ${topic.problems.map(problemCode).join(' ')}`.toLowerCase().includes(query);
            const difficultyMatch = state.difficulty === 'all' || problems.length > 0;
            return stageMatch && domainMatch && searchMatch && difficultyMatch;
        });

        grid.innerHTML = visible.map(({ topic, problems }) => `
            <article class="problem-topic-card topic-${topic.color}">
                <div class="topic-card-top"><span class="topic-stage">${topic.stage}</span><span class="topic-label">${topic.label}</span></div>
                <div class="topic-card-title"><div><span class="topic-domain">${topic.domain}</span><h3>${topic.title}</h3></div><span class="topic-count">${state.difficulty === 'all' ? topic.problems.length : problems.length} 题</span></div>
                <p>${topic.note}</p>
                <div class="topic-problems">${problems.map((problem) => {
                    const solution = solutionLinks.get(displayCode(problem));
                    const actionHref = solution ? `student-article.html?id=${encodeURIComponent(solution.id)}` : submissionUrl(problem, topic);
                    const actionTitle = solution ? `查看 ${displayCode(problem)} 题解` : `为 ${displayCode(problem)} 投稿题解`;
                    const actionIcon = solution ? 'fa-book-open' : 'fa-pen';
                    return `<span class="problem-item"><a class="problem-pill${difficultyClass(problem)}" href="${problemUrl(problem)}" target="_blank" rel="noreferrer" data-problem="${problemCode(problem)}" title="${problemTooltip(problem)}">
                        <span class="problem-code">${displayCode(problem)}</span><i class="fas fa-arrow-up-right-from-square"></i>
                    </a><a class="problem-write-link${solution ? ' has-solution' : ''}" href="${actionHref}" title="${actionTitle}" aria-label="${actionTitle}"><i class="fas ${actionIcon}"></i></a></span>`;
                }).join('')}</div>
                <div class="topic-card-footer"><span><i class="fas fa-circle-info"></i> 悬停题号查看题目名称与难度</span><a href="submit.html?topic=${encodeURIComponent(topic.title)}" class="topic-submit">补充题解 <i class="fas fa-pen"></i></a></div>
            </article>
        `).join('');
        empty.hidden = visible.length > 0;
    };

    document.querySelectorAll('.stage-tab').forEach((button) => button.addEventListener('click', () => {
        document.querySelectorAll('.stage-tab').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        state.stage = button.dataset.stage;
        renderProblems();
    }));

    document.getElementById('domainFilters')?.addEventListener('click', (event) => {
        const button = event.target.closest('.filter-chip');
        if (!button) return;
        document.querySelectorAll('.filter-chip').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        state.domain = button.dataset.domain;
        renderProblems();
    });

    document.getElementById('difficultyFilters')?.addEventListener('click', (event) => {
        const button = event.target.closest('.filter-chip');
        if (!button) return;
        document.querySelectorAll('#difficultyFilters .filter-chip').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        state.difficulty = button.dataset.difficulty;
        renderProblems();
    });

    const renderDomainFilters = (domains) => {
        const container = document.getElementById('domainFilters');
        if (!container || !domains?.length) return;
        const uniqueDomains = [...new Set(domains.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
        container.innerHTML = ['全部知识领域', ...uniqueDomains].map((label, index) => `<button class="filter-chip${index === 0 ? ' is-active' : ''}" data-domain="${index === 0 ? 'all' : label}">${label}</button>`).join('');
    };

    const loadImportedProblemBank = async () => {
        try {
            const response = await fetch('data/problem-bank.json?v=20260911');
            if (!response.ok) throw new Error(`problem-bank.json ${response.status}`);
            const payload = await response.json();
            problemMeta = new Map((payload.problems || []).map((problem) => [problem.code, problem]));
            topics = (payload.topics || []).map((topic) => ({
                ...topic,
                color: topic.domain.includes('图') ? 'graph' : topic.domain.includes('DP') ? 'dp' : topic.domain.includes('数学') ? 'math' : topic.domain.includes('树') || topic.domain.includes('数据结构') ? 'structure' : topic.domain.includes('字符串') ? 'pink' : 'foundation',
                problems: topic.problems || [],
            }));
            renderDomainFilters(topics.map((topic) => topic.domain));
            const status = document.querySelector('.data-status');
            if (status && payload.stats) {
                const metadata = payload.luoguMetadata || {};
                const syncedCount = Number(metadata.colored || 0);
                const unmatchedCount = Number(metadata.unmatched || 0);
                const externalCount = Object.values(payload.externalMetadata?.sources || {})
                    .reduce((total, source) => total + Number(source.matched || 0), 0)
                    + Number(payload.externalMetadata?.knownExternal?.matched || 0);
                const pendingText = unmatchedCount ? ` · ${unmatchedCount} 道洛谷颜色待补充` : '';
                const externalText = externalCount ? ` · 已补充外部题名 ${externalCount} 道` : '';
                status.innerHTML = `<i class="fas fa-circle"></i>已导入 ${payload.stats.problemCount} 道题 · ${payload.stats.topicCount} 个专题 · 已同步洛谷颜色 ${syncedCount} 道${externalText}${pendingText}`;
            }
            renderProblems();
        } catch (error) {
            console.warn('题单数据加载失败，使用页面内置样例。', error);
        }
    };

    const loadPublishedSolutions = async () => {
        const apiUrl = (window.STACKMAN_SUBMISSION_API || '').replace(/\/$/, '');
        if (!apiUrl) return;
        try {
            const response = await fetch(`${apiUrl}/articles`);
            if (!response.ok) return;
            const data = await response.json();
            solutionLinks = new Map();
            (data.items || []).forEach((item) => {
                if (item.problem_code && !solutionLinks.has(item.problem_code)) solutionLinks.set(item.problem_code, item);
            });
            renderProblems();
        } catch (error) {
            console.warn('题解关联暂时不可用。', error);
        }
    };

    document.getElementById('problemSearch')?.addEventListener('input', (event) => {
        state.search = event.target.value;
        renderProblems();
    });

    document.addEventListener('keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            document.getElementById('problemSearch')?.focus();
        }
    });

    const mapStage = document.getElementById('mapStage');
    const mapViewport = document.getElementById('mapViewport');
    const galaxyNodes = document.getElementById('galaxyNodes');
    const galaxyLines = document.getElementById('galaxyLines');
    if (mapStage && mapViewport && galaxyNodes && galaxyLines) {
    const zoomReset = document.getElementById('mapZoomReset');
    const galaxyBreadcrumb = document.getElementById('galaxyBreadcrumb');
    const detailStatus = document.getElementById('detailStatus');
    const detailMeta = document.getElementById('detailMeta');

    const galaxyDomains = [
        { id: 'foundation', title: '基础 / 算法 / 数据结构', short: '基础算法', stage: 'j', color: 'blue', summary: '数组、排序、模拟、搜索与基础容器，是整个知识星系的地基。', children: [
            { id: 'array', title: '数组与下标', stage: 'j', status: 'has-content', summary: '从数组、下标和二维数组的表示开始。', leaves: ['一维数组', '二维数组', '数组下标', '结构体'] },
            { id: 'sort', title: '排序与分治', stage: 'j', status: 'has-content', summary: '冒泡、选择、插入、归并排序和归并分治。', leaves: ['冒泡排序', '选择排序', '插入排序', '归并排序'] },
            { id: 'search', title: '搜索与模拟', stage: 'j', status: 'has-content', summary: 'BFS、DFS、递归、记忆化搜索和基础模拟。', leaves: ['BFS 最短路', '递归 / DFS', '记忆化搜索', '模拟'] },
            { id: 'prefix', title: '前缀和与差分', stage: 'j', status: 'has-content', summary: '一维、二维前缀和及差分，连接大量基础题单。', leaves: ['一维前缀和', '二维前缀和', '一维差分', '二维差分'] },
            { id: 'string-basic', title: '基础字符串', stage: 'j', status: 'has-content', summary: '字符操作、字符串处理与基础哈希。', leaves: ['字符操作', 'Map / Vector', '字符串哈希'] }
        ] },
        { id: 'graph', title: '图论', short: '图论', stage: 's', color: 'orange', summary: '从建图、连通性到最短路、LCA 和高级图论。', children: [
            { id: 'graph-basic', title: '图的表示与遍历', stage: 'j', status: 'has-content', summary: '邻接表、邻接矩阵、链式前向星和图上搜索。', leaves: ['邻接表', '邻接矩阵', '链式前向星', '图上 BFS / DFS'] },
            { id: 'shortest', title: '最短路', stage: 's', status: 'has-content', summary: 'Floyd、Dijkstra、分层图、次短路与差分约束。', leaves: ['Floyd', 'Dijkstra', '分层图最短路', '次短路'] },
            { id: 'connectivity', title: '连通性与 Tarjan', stage: 's', status: 'has-content', summary: '强连通、割点、割边、桥和缩点。', leaves: ['强连通分量', '割点', '割边 / 桥', '缩点'] },
            { id: 'lca', title: 'LCA 与树上关系', stage: 's', status: 'has-content', summary: 'LCA、树上差分、树链剖分和树上前缀和。', leaves: ['LCA', '树上差分', '树链剖分', '树上前缀和'] }
        ] },
        { id: 'dp', title: '动态规划', short: 'DP', stage: 's', color: 'green', summary: '从线性 DP 和背包逐步走向树形、状压和优化 DP。', children: [
            { id: 'linear-dp', title: '线性 DP', stage: 'j', status: 'has-content', summary: '从状态定义、转移和边界处理开始。', leaves: ['线性 DP', '最长上升子序列', '区间基础'] },
            { id: 'knapsack', title: '背包 DP', stage: 'j', status: 'has-content', summary: '01、完全、多重、混合和二维费用背包。', leaves: ['01 背包', '完全背包', '多重背包', '二维费用背包'] },
            { id: 'tree-dp', title: '树形 DP', stage: 's', status: 'has-content', summary: '树的直径、重心、换根和树形背包。', leaves: ['树的直径', '树的重心', '换根 DP', '树形背包'] },
            { id: 'advanced-dp', title: '高级 DP', stage: 'noi', status: 'pending', summary: '状压、数位、矩阵加速和各种优化 DP。', leaves: ['状压 DP', '数位 DP', '矩阵加速 DP', '单调队列优化 DP'] }
        ] },
        { id: 'tree', title: '树论 / 数据结构', short: '树论结构', stage: 's', color: 'purple', summary: '树状数组、线段树、Trie 和高级树论逐层展开。', children: [
            { id: 'fenwick', title: '树状数组', stage: 'j', status: 'has-content', summary: '单点、区间和多维维护的基础结构。', leaves: ['单点修改', '区间查询', '树状数组优化 DP'] },
            { id: 'segment', title: '线段树', stage: 's', status: 'has-content', summary: '区间维护、懒标记、扫描线与线段树优化。', leaves: ['区间最值', '区间修改', '扫描线', '线段树优化 DP'] },
            { id: 'trie', title: '字典树 Trie', stage: 's', status: 'has-content', summary: '字符串 Trie、01 Trie 和异或对。', leaves: ['字典树 Trie', '01 Trie', '异或对'] },
            { id: 'advanced-tree', title: '高级树论', stage: 'noi', status: 'pending', summary: 'LCT、点分治、可持久化结构和树套树。', leaves: ['动态树 LCT', '点分治', '可持久化 Trie', '树套树'] }
        ] },
        { id: 'math', title: '数学', short: '数学', stage: 's', color: 'yellow', summary: '从基础数论、组合数学到省选与 NOI 数学工具。', children: [
            { id: 'number-theory', title: '基础数论', stage: 'j', status: 'has-content', summary: 'GCD、LCM、质因数分解、筛法与快速幂。', leaves: ['GCD / LCM', '质因数分解', '埃氏筛', '快速幂'] },
            { id: 'modular', title: '同余与逆元', stage: 's', status: 'has-content', summary: '同余式、费马小定理、乘法逆元与 EXGCD。', leaves: ['同余式', '费马小定理', '乘法逆元', '扩展欧几里得'] },
            { id: 'combinatorics', title: '组合数学', stage: 's', status: 'has-content', summary: '排列组合、容斥、鸽巢和中国剩余定理。', leaves: ['排列组合', '容斥原理', '鸽巢原理', '中国剩余定理'] },
            { id: 'advanced-math', title: '高级数学', stage: 'noi', status: 'pending', summary: '矩阵、生成函数、FFT/NTT 与更高阶专题。', leaves: ['矩阵', '生成函数', 'FFT / NTT', '莫比乌斯反演'] }
        ] },
        { id: 'string', title: '字符串算法', short: '字符串', stage: 's', color: 'pink', summary: '从 KMP、Manacher 到后缀结构和高级字符串。', children: [
            { id: 'matching', title: '匹配与回文', stage: 'j', status: 'has-content', summary: 'KMP、Manacher 和字符串匹配基础。', leaves: ['KMP', 'Manacher', '扩展 KMP'] },
            { id: 'string-structure', title: '字符串结构', stage: 's', status: 'pending', summary: '后缀数组、后缀自动机等进阶内容。', leaves: ['后缀数组', '后缀自动机', 'AC 自动机'] }
        ] }
    ];

    const galaxyState = { view: 'overview', domain: null, topic: null, zoom: 1, x: 0, y: 0 };
    const findDomain = (id) => galaxyDomains.find((domain) => domain.id === id);
    const findTopic = (id) => galaxyDomains.flatMap((domain) => domain.children).find((topic) => topic.id === id);
    const stageLabel = { j: 'J 组基础', s: 'S 组 / NOIP', noi: '省选 / NOI' };
    const statusLabel = { 'has-content': '已有题单', pending: '待补充' };

    const createNode = (node, type, x, y, radius) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `galaxy-node galaxy-node-${type} galaxy-stage-${node.stage || 'j'} galaxy-domain-${node.color || 'blue'} ${node.status === 'pending' ? 'is-pending' : ''}`;
        button.dataset.nodeId = node.id;
        button.dataset.nodeType = type;
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.setProperty('--node-size', `${radius * 2}px`);
        const count = node.children ? `${node.children.length} 个专题` : node.leaves ? `${node.leaves.length} 个细分点` : '知识节点';
        button.innerHTML = `<span class="galaxy-node-orb"><i class="galaxy-node-icon">${type === 'domain' ? '✦' : type === 'topic' ? '·' : '•'}</i></span><span class="galaxy-node-label">${node.title}</span><span class="galaxy-node-caption">${type === 'domain' ? count : stageLabel[node.stage] || '知识点'}</span>`;
        button.addEventListener('click', () => selectGalaxyNode(node, type));
        galaxyNodes.appendChild(button);
        return { x, y, radius };
    };

    const drawLine = (from, to, className = '') => {
        const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 30;
        curve.setAttribute('d', `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`);
        curve.setAttribute('class', `galaxy-line ${className}`);
        galaxyLines.appendChild(curve);
    };

    const ringPoints = (count, centerX, centerY, radiusX, radiusY, start = -Math.PI / 2) => Array.from({ length: count }, (_, index) => {
        const angle = start + (Math.PI * 2 * index) / count;
        return { x: centerX + Math.cos(angle) * radiusX, y: centerY + Math.sin(angle) * radiusY };
    });

    const updateBreadcrumb = () => {
        galaxyBreadcrumb.innerHTML = '<button type="button" class="breadcrumb-root">信奥知识体系</button>';
        if (galaxyState.domain) {
            const domain = findDomain(galaxyState.domain);
            galaxyBreadcrumb.innerHTML += `<span class="breadcrumb-divider">/</span><button type="button" class="breadcrumb-domain">${domain.title}</button>`;
        }
        if (galaxyState.topic) galaxyBreadcrumb.innerHTML += `<span class="breadcrumb-divider">/</span><span class="is-current">${findTopic(galaxyState.topic).title}</span>`;
        galaxyBreadcrumb.innerHTML += '<span class="breadcrumb-hint">点击节点展开 · 拖动浏览</span>';
        galaxyBreadcrumb.querySelector('.breadcrumb-root')?.addEventListener('click', () => { galaxyState.view = 'overview'; galaxyState.domain = null; galaxyState.topic = null; renderGalaxy(); });
        galaxyBreadcrumb.querySelector('.breadcrumb-domain')?.addEventListener('click', () => { galaxyState.view = 'domain'; galaxyState.topic = null; renderGalaxy(); });
    };

    const updateDetail = (node, type) => {
        document.getElementById('mapDetailTitle').textContent = node.title || '信奥知识体系';
        document.getElementById('mapDetailText').textContent = node.summary || '从大领域进入专题星系，再连接到文档、题单和博客题解。';
        detailStatus.innerHTML = `<i class="fas fa-circle"></i>${type === 'domain' ? '知识领域' : type === 'topic' ? '专题节点' : '细知识点'}`;
        detailMeta.innerHTML = type === 'domain'
            ? `<span>${node.children.length} 个专题</span><span>${stageLabel[node.stage]}</span>`
            : type === 'topic'
                ? `<span>${node.leaves.length} 个细分点</span><span class="detail-${node.status}">${statusLabel[node.status]}</span>`
                : '<span>可继续补充题单</span><span>可参与共建</span>';
        document.getElementById('mapDetail').classList.add('has-selection');
    };

    const selectGalaxyNode = (node, type) => {
        updateDetail(node, type);
        if (type === 'domain') { galaxyState.view = 'domain'; galaxyState.domain = node.id; galaxyState.topic = null; renderGalaxy(); }
        if (type === 'topic') { galaxyState.view = 'topic'; galaxyState.topic = node.id; renderGalaxy(); }
    };

    const renderGalaxy = () => {
        galaxyNodes.innerHTML = '';
        galaxyLines.innerHTML = '';
        const center = { x: 600, y: 380 };
        const positions = [];
        if (galaxyState.view === 'overview') {
            const root = createNode({ id: 'root', title: '信奥知识体系', stage: 'j', summary: '从基础到 NOI 的完整知识宇宙。' }, 'root', center.x, center.y, 78);
            const points = ringPoints(galaxyDomains.length, center.x, center.y, 365, 245, -Math.PI / 2);
            galaxyDomains.forEach((domain, index) => { const point = createNode(domain, 'domain', points[index].x, points[index].y, 61); drawLine(root, point, `line-${domain.color}`); positions.push(point); });
        } else if (galaxyState.view === 'domain') {
            const domain = findDomain(galaxyState.domain);
            const root = createNode(domain, 'domain-root', center.x, center.y, 76);
            const points = ringPoints(domain.children.length, center.x, center.y, 365, 245, -Math.PI / 2);
            domain.children.forEach((topic, index) => { const point = createNode({ ...topic, color: domain.color }, 'topic', points[index].x, points[index].y, 55); drawLine(root, point, `line-${domain.color}`); });
        } else {
            const topic = findTopic(galaxyState.topic);
            const domain = galaxyDomains.find((item) => item.children.some((child) => child.id === topic.id));
            const root = createNode({ ...topic, color: domain.color }, 'topic-root', center.x, center.y, 72);
            const leaves = topic.leaves.map((title, index) => ({ id: `${topic.id}-${index}`, title, stage: topic.stage, status: topic.status, summary: `${title} 是 ${topic.title} 下的细分知识点，可继续挂接题单、文档和题解。`, color: domain.color }));
            const points = ringPoints(leaves.length, center.x, center.y, 360, 235, -Math.PI / 2);
            leaves.forEach((leaf, index) => { const point = createNode(leaf, 'leaf', points[index].x, points[index].y, 42); drawLine(root, point, `line-${domain.color}`); });
        }
        updateBreadcrumb();
        applyMapTransform();
    };

    let dragging = false;
    let dragStart = null;
    const pointers = new Map();
    let pinchDistance = 0;
    let pinchZoom = 1;
    const applyMapTransform = () => { mapStage.style.transform = `translate(${galaxyState.x}px, ${galaxyState.y}px) scale(${galaxyState.zoom})`; zoomReset.textContent = `${Math.round(galaxyState.zoom * 100)}%`; };
    const setZoom = (nextZoom) => { galaxyState.zoom = Math.min(1.5, Math.max(.72, nextZoom)); applyMapTransform(); };
    const distance = () => { const values = [...pointers.values()]; return values.length < 2 ? 0 : Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y); };
    document.getElementById('mapZoomIn')?.addEventListener('click', () => setZoom(galaxyState.zoom + .12));
    document.getElementById('mapZoomOut')?.addEventListener('click', () => setZoom(galaxyState.zoom - .12));
    document.getElementById('mapZoomReset')?.addEventListener('click', () => { galaxyState.zoom = 1; galaxyState.x = 0; galaxyState.y = 0; applyMapTransform(); });
    document.getElementById('mapBack')?.addEventListener('click', () => { if (galaxyState.view === 'topic') { galaxyState.view = 'domain'; galaxyState.topic = null; } else if (galaxyState.view === 'domain') { galaxyState.view = 'overview'; galaxyState.domain = null; } renderGalaxy(); });
    mapViewport?.addEventListener('wheel', (event) => { event.preventDefault(); setZoom(galaxyState.zoom + (event.deltaY > 0 ? -.08 : .08)); }, { passive: false });
    mapViewport?.addEventListener('pointerdown', (event) => { pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); if (pointers.size === 1 && !event.target.closest('.galaxy-node')) { dragging = true; dragStart = { x: event.clientX - galaxyState.x, y: event.clientY - galaxyState.y }; mapViewport.setPointerCapture(event.pointerId); mapViewport.classList.add('is-dragging'); } if (pointers.size === 2) { dragging = false; pinchDistance = distance(); pinchZoom = galaxyState.zoom; } });
    mapViewport?.addEventListener('pointermove', (event) => { if (!pointers.has(event.pointerId)) return; pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); if (pointers.size === 2 && pinchDistance) { setZoom(pinchZoom * (distance() / pinchDistance)); return; } if (dragging && dragStart) { galaxyState.x = event.clientX - dragStart.x; galaxyState.y = event.clientY - dragStart.y; applyMapTransform(); } });
    const endPointer = (event) => { pointers.delete(event.pointerId); if (pointers.size < 2) pinchDistance = 0; if (pointers.size === 0) { dragging = false; mapViewport.classList.remove('is-dragging'); } };
    mapViewport?.addEventListener('pointerup', endPointer); mapViewport?.addEventListener('pointercancel', endPointer);

    renderGalaxy();
    }

    renderProblems();
    loadImportedProblemBank();
    loadPublishedSolutions();
    applyMapTransform();
})();
