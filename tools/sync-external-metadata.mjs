import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bankPath = path.resolve(root, 'site/data/problem-bank.json');
const codeforcesPath = path.resolve(root, '.tmp-sheet-analysis/codeforces-problems.json');

const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const codeforces = JSON.parse(fs.readFileSync(codeforcesPath, 'utf8'));
const codeforcesMap = new Map(
    (codeforces.result?.problems || []).map((problem) => [`CF${problem.contestId}${problem.index}`.toUpperCase(), problem])
);

let matched = 0;
for (const problem of bank.problems || []) {
    const code = String(problem.code || '').toUpperCase();
    if (!code.startsWith('CF')) continue;
    const metadata = codeforcesMap.get(code);
    if (!metadata) continue;

    problem.title = problem.title || metadata.name;
    problem.platform = 'Codeforces';
    problem.externalTitle = metadata.name;
    problem.externalRating = metadata.rating ?? null;
    problem.externalTags = metadata.tags || [];
    problem.externalMetadataSynced = true;
    matched += 1;
}

bank.externalMetadata = {
    syncedAt: new Date().toISOString(),
    sources: {
        codeforces: {
            source: 'Codeforces 官方 problemset.problems API',
            requested: (bank.problems || []).filter((problem) => String(problem.code || '').toUpperCase().startsWith('CF')).length,
            matched,
        },
    },
};

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ source: bank.externalMetadata.sources.codeforces.source, matched, requested: bank.externalMetadata.sources.codeforces.requested }));
