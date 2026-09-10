CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author_nickname TEXT NOT NULL,
    grade_range TEXT,
    category TEXT NOT NULL,
    luogu_url TEXT,
    visibility TEXT NOT NULL DEFAULT 'public',
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    review_note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS submissions_status_created_idx
ON submissions(status, created_at DESC);
