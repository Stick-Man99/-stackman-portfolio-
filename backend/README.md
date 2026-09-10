# 投稿审核后台（第一版部署说明）

前端投稿页面已经可以在本地演示：不要求学生注册，文章先进入待审核队列。没有配置后端地址时，队列只保存在当前浏览器的 `localStorage`，不能用于真实多人协作。

## 正式上线所需

1. 一个 Cloudflare 账号。
2. 一个 D1 数据库，并执行 `schema.sql`。
3. 部署 `worker.js`，创建 D1 绑定名 `DB`。
4. 在 Worker Secrets 中设置 `ADMIN_TOKEN`，不要把令牌写进网页或 GitHub。
5. 在前端发布配置中设置 `window.STACKMAN_SUBMISSION_API` 为 Worker 地址。

打开网站的 `review.html`，填入 Worker 地址和管理员令牌即可读取审核队列。令牌只在当前页面内存中使用，不会写入 `localStorage`。

## 当前边界

- 学生投稿接口只写入 `pending`，不会直接公开。
- 审核接口必须带管理员令牌。
- 通过审核后，第一版仍由老师人工整理成博客文章；自动发布到 GitHub 需要下一阶段再接 GitHub App 或受限令牌。
- 正式上线前还需要补充限流、垃圾内容过滤、隐私说明和未成年人投稿授权流程。
