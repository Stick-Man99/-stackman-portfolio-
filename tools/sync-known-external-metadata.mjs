import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bankPath = path.resolve(root, 'site/data/problem-bank.json');
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

const metadata = {
    AT_ARC069_D: { platform: 'AtCoder', title: 'Menagerie', url: 'https://atcoder.jp/contests/arc069/tasks/arc069_d' },
    ARC084B: { platform: 'AtCoder', title: 'Small Multiple', url: 'https://atcoder.jp/contests/arc084/tasks/arc084_b' },
    AT_AGC036_D: { platform: 'AtCoder', title: 'Negative Cycle', url: 'https://atcoder.jp/contests/agc036/tasks/agc036_d' },
    AT_JOISC2014_C: { platform: 'AtCoder / JOI', title: '历史的研究', url: 'https://atcoder.jp/contests/joisc2014/tasks/joisc2014_c' },
    ABC302H: { platform: 'AtCoder', title: 'Ball Collector', url: 'https://atcoder.jp/contests/abc302/tasks/abc302_h' },
    AT_ABC308_G: { platform: 'AtCoder', title: 'Minimum Xor Pair Query', url: 'https://atcoder.jp/contests/abc308/tasks/abc308_g' },
    SP18185: { platform: 'SPOJ', title: 'Give Away', url: 'https://www.luogu.com.cn/problem/SP18185' },
    SP30906: { platform: 'SPOJ', title: 'Ada and Unique Vegetable', url: 'https://www.luogu.com.cn/problem/SP30906' },
    SP20644: { platform: 'SPOJ', title: 'Zero Query', url: 'https://www.luogu.com.cn/problem/SP20644' },
    SP10707: { platform: 'SPOJ', title: 'Count on a tree II', url: 'https://www.luogu.com.cn/problem/SP10707' },
    SP11470: { platform: 'SPOJ', title: 'To the moon', url: 'https://www.luogu.com.cn/problem/SP11470' },
    U41492: { platform: '洛谷用户题目', title: '树上数颜色', url: 'https://www.luogu.com.cn/problem/U41492' },
    UVA1146: { platform: 'UVA', title: 'Now or later', url: 'https://www.luogu.com.cn/problem/UVA1146' },
};

let matched = 0;
for (const problem of bank.problems || []) {
    const item = metadata[String(problem.code || '').toUpperCase()];
    if (!item) continue;
    Object.assign(problem, {
        title: problem.title || item.title,
        platform: item.platform,
        externalTitle: item.title,
        externalSourceUrl: item.url,
        externalMetadataSynced: true,
    });
    matched += 1;
}

bank.externalMetadata = {
    ...(bank.externalMetadata || {}),
    knownExternal: { matched, total: Object.keys(metadata).length },
};
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ matched, total: Object.keys(metadata).length }));
