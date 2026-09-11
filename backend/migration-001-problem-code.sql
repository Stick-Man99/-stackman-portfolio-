-- 线上已有 submissions 表时执行一次；新建表直接使用 schema.sql。
ALTER TABLE submissions ADD COLUMN problem_code TEXT;
