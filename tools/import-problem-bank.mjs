import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/18252/Documents/xwechat_files/wxid_38tlmtz0vsl922_c52f/temp/RWTemp/2026-05/76505e27def08190966d6f9d34da5a95/信奥题单 (持续更新).xlsx';
const outputPath = new URL('../data/problem-bank.json', import.meta.url);

const targetSheets = ['CSP-J', 'CSP-S+NOIP', 'NOI'];
const topicHeader = '知识点/类型';
const knownDifficulty = {
    P2216: { key: 'green', label: '普及+/提高-', color: '#52c41a' },
    P11026: { key: 'purple', label: '省选/NOI-', color: '#9d3dcf' },
};

const text = (value) => value === null || value === undefined ? '' : String(value).trim();

function normalizeCode(value) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 1000) return `P${value}`;
    const raw = text(value).replace(/\s+/g, '').toUpperCase();
    if (/^\d{4,6}$/.test(raw)) return `P${raw}`;
    if (/^(?:P|B|CF|U|AT|ABC|ARC|AGC|SP|HDU|POJ|UVA)[A-Z0-9_\-]+$/.test(raw)) return raw;
    return null;
}

function problemUrl(code) {
    return /^(?:P|B|CF|U|AT|ABC|ARC|AGC|SP|HDU|POJ|UVA)/.test(code)
        ? `https://www.luogu.com.cn/problem/${code}`
        : 'https://www.luogu.com.cn/problem/list';
}

function inferDomain(title) {
    const name = text(title);
    if (/图|连通|最短路|生成树|拓扑|网络流|匹配|LCA|Tarjan|Dijkstra|Floyd|SPFA|并查集|树上/.test(name)) return '图论';
    if (/DP|背包|动态规划|数位|状压|斜率优化|四边形|生成函数|概率与期望/.test(name)) return '动态规划';
    if (/树|线段树|树状数组|Trie|字典树|堆|Treap|Splay|LCT|平衡树|分块|莫队|可持久化|KD/.test(name)) return '树论 / 数据结构';
    if (/数学|数论|筛|GCD|LCM|质因数|同余|逆元|组合|容斥|矩阵|FFT|NTT|多项式|几何|博弈/.test(name)) return '数学';
    if (/字符串|KMP|Manacher|自动机|后缀|回文/.test(name)) return '字符串';
    return '基础算法';
}

function sourceStage(sheetName) {
    if (sheetName === 'CSP-J') return 'CSP-J';
    if (sheetName === 'CSP-S+NOIP') return 'CSP-S/NOIP';
    return 'NOI';
}

function isTopicLabel(value) {
    const name = text(value);
    if (!name || name === topicHeader || /^T\d+$/i.test(name)) return false;
    if (normalizeCode(name)) return false;
    return /[\u4e00-\u9fff]|[A-Za-z]/.test(name);
}

function findHeaderRow(values) {
    return values.findIndex((row) => row.some((cell) => text(cell) === topicHeader));
}

function findBlockStarts(values, headerRow) {
    return values[headerRow]
        .map((cell, index) => text(cell) === topicHeader ? index : -1)
        .filter((index) => index >= 0);
}

function readSheetTopics(sheetName, values) {
    const headerRow = findHeaderRow(values);
    if (headerRow < 0) return [];
    const starts = findBlockStarts(values, headerRow);
    const output = [];
    const stage = sourceStage(sheetName);

    for (let blockIndex = 0; blockIndex < starts.length; blockIndex += 1) {
        const start = starts[blockIndex];
        const end = blockIndex + 1 < starts.length ? starts[blockIndex + 1] - 1 : values[headerRow].length - 1;
        const headerDomain = headerRow > 0 ? text(values[headerRow - 1]?.[start]) : '';
        const domainFromHeader = /^(图论|树论|DP|动态规划|数学|基础\/算法\/数据结构体)$/i.test(headerDomain) ? headerDomain : '';
        const trainingHeaders = values[headerRow].slice(start + 1, end + 1).map(text);
        let currentTopic = '';
        let currentDomain = domainFromHeader || '基础算法';
        const topicMap = new Map();

        for (let rowIndex = headerRow + 1; rowIndex < values.length; rowIndex += 1) {
            const row = values[rowIndex] || [];
            const labels = row.slice(start, end + 1)
                .map((cell, offset) => ({ value: text(cell), offset }))
                .filter(({ value }) => isTopicLabel(value));

            if (labels.length > 0) {
                currentTopic = labels[0].value.replace(/\s+/g, ' ').trim();
                if (!domainFromHeader) currentDomain = inferDomain(currentTopic);
            }
            if (!currentTopic) continue;

            const key = `${stage}|${currentDomain}|${currentTopic}`;
            if (!topicMap.has(key)) {
                topicMap.set(key, {
                    id: key,
                    stage,
                    sourceSheet: sheetName,
                    domain: currentDomain,
                    title: currentTopic,
                    label: trainingHeaders.filter(Boolean).join(' → '),
                    sourceColor: null,
                    note: '题目来自原始 Excel 题单，保留原有专题与训练位置。',
                    problems: [],
                    sourceRows: [],
                });
                output.push(topicMap.get(key));
            }
            const topic = topicMap.get(key);
            for (let col = start + 1; col <= end; col += 1) {
                const code = normalizeCode(row[col]);
                if (!code) continue;
                const trainingPosition = text(values[headerRow][col]) || '未标注';
                if (!topic.problems.some((item) => item.code === code && item.trainingPosition === trainingPosition)) {
                    topic.problems.push({ code, trainingPosition, row: rowIndex + 1, sourceColumn: col + 1 });
                }
                topic.sourceRows.push(rowIndex + 1);
            }
        }
    }
    return output;
}

function readKnowledgeTaxonomy(values) {
    const headers = values[1] || [];
    const nodes = [];
    const mainColumns = [0, 1, 2, 3, 4];
    for (const col of mainColumns) {
        const domain = text(headers[col]) || '未分类';
        for (let row = 2; row < values.length; row += 1) {
            const title = text(values[row]?.[col]);
            if (!title || title.includes('省选+NOI')) continue;
            nodes.push({ id: `taxonomy-${col}-${row + 1}`, domain, title, stage: '综合知识体系', sourceRow: row + 1 });
        }
    }
    for (let row = 2; row < values.length; row += 1) {
        const stage = text(values[row]?.[6]);
        const title = text(values[row]?.[7]);
        if (stage) nodes.push({ id: `taxonomy-stage-${row + 1}`, domain: '高级拓展', title: stage, stage: stage, sourceRow: row + 1 });
        if (title) nodes.push({ id: `taxonomy-advanced-${row + 1}`, domain: '高级拓展', title, stage: '省选 / NOI', sourceRow: row + 1 });
    }
    return nodes;
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const topics = [];
const problemIndex = new Map();

for (const sheetName of targetSheets) {
    const sheet = workbook.worksheets.getItem(sheetName);
    const values = sheet.getUsedRange().values;
    for (const topic of readSheetTopics(sheetName, values)) {
        topic.problems.forEach(({ code, trainingPosition, row, sourceColumn }) => {
            if (!problemIndex.has(code)) {
                problemIndex.set(code, {
                    code,
                    url: problemUrl(code),
                    title: null,
                    luoguDifficulty: null,
                    luoguDifficultyLabel: null,
                    luoguColor: null,
                    sources: [],
                });
            }
            problemIndex.get(code).sources.push({ sheet: sheetName, topic: topic.title, domain: topic.domain, stage: topic.stage, trainingPosition, row, sourceColumn });
        });
        topic.problems = [...new Set(topic.problems.map((item) => item.code))];
        topic.sourceRows = [...new Set(topic.sourceRows)].sort((a, b) => a - b);
        topics.push(topic);
    }
}

const taxonomySheet = workbook.worksheets.getItem('信奥知识点');
const taxonomy = readKnowledgeTaxonomy(taxonomySheet.getUsedRange().values);

for (const [code, difficulty] of Object.entries(knownDifficulty)) {
    const problem = problemIndex.get(code);
    if (problem) {
        problem.luoguDifficulty = difficulty.key;
        problem.luoguDifficultyLabel = difficulty.label;
        problem.luoguColor = difficulty.color;
    }
}

const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: '信奥题单 (持续更新).xlsx',
    sourceSheets: targetSheets,
    difficultyScale: [
        { key: 'red', label: '入门', color: '#fe4c61' },
        { key: 'orange', label: '普及-', color: '#f39c11' },
        { key: 'yellow', label: '普及', color: '#ffc116' },
        { key: 'green', label: '普及+/提高-', color: '#52c41a' },
        { key: 'cyan', label: '提高', color: '#13c2c2' },
        { key: 'blue', label: '提高+/省选-', color: '#3498db' },
        { key: 'purple', label: '省选/NOI-', color: '#9d3dcf' },
        { key: 'black', label: 'NOI/NOI+/CTSC', color: '#0e1d69' },
    ],
    taxonomy,
    topics,
    problems: [...problemIndex.values()],
    stats: {
        topicCount: topics.length,
        problemCount: problemIndex.size,
        taxonomyCount: taxonomy.length,
    },
};

await fs.mkdir(new URL('../data/', import.meta.url), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(JSON.stringify(payload.stats));
