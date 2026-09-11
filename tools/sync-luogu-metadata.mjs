import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';

const dataPath = new URL('../data/problem-bank.json', import.meta.url);
const dumpPath = new URL('../../.tmp-sheet-analysis/problemset-open.ndjson.gz', import.meta.url);

const difficultyScale = {
    1: { key: 'red', label: '入门', color: '#fe4c61' },
    2: { key: 'orange', label: '普及-', color: '#f39c11' },
    3: { key: 'yellow', label: '普及', color: '#ffc116' },
    4: { key: 'green', label: '普及+/提高-', color: '#52c41a' },
    5: { key: 'cyan', label: '提高', color: '#13c2c2' },
    6: { key: 'blue', label: '提高+/省选-', color: '#3498db' },
    7: { key: 'purple', label: '省选/NOI-', color: '#9d3dcf' },
    8: { key: 'black', label: 'NOI/NOI+/CTSC', color: '#0e1d69' },
};

const payload = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const wanted = new Map((payload.problems || []).map((problem) => [problem.code, problem]));
const stream = createReadStream(dumpPath).pipe(createGunzip());
const lines = createInterface({ input: stream, crlfDelay: Infinity });
let matched = 0;

for await (const line of lines) {
    if (!line.trim()) continue;
    let record;
    try {
        record = JSON.parse(line);
    } catch {
        continue;
    }
    const problem = wanted.get(record.pid);
    if (!problem) continue;
    const difficulty = difficultyScale[record.difficulty];
    problem.title = record.title || null;
    problem.luoguDifficulty = difficulty?.key || null;
    problem.luoguDifficultyLabel = difficulty?.label || null;
    problem.luoguColor = difficulty?.color || null;
    problem.luoguDifficultyRank = Number.isInteger(record.difficulty) ? record.difficulty : null;
    problem.metadataSynced = true;
    matched += 1;
}

const synced = payload.problems.filter((problem) => problem.metadataSynced).length;
const colored = payload.problems.filter((problem) => problem.luoguDifficulty).length;
payload.luoguMetadata = {
    source: '洛谷公开题库导出 latest.ndjson.gz',
    syncedAt: new Date().toISOString(),
    totalRequested: payload.problems.length,
    matched,
    colored,
    unmatched: payload.problems.length - synced,
    difficultyScale,
};

await fs.writeFile(dataPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(JSON.stringify(payload.luoguMetadata));
