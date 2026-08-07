---
name: add-pr-description
description: Generate a pull request description that follows the repository's PR template. Use when creating a PR, writing a PR description, or asked to summarize changes for a pull request.
---

# Add PR Description

Generate a pull request description that conforms to the repository's PR template.

## Workflow

1. Read `.github/pull_request_template.md` completely. Treat it as the source of truth for the output format.
2. Determine the change scope:
   a. Find the base branch with `git rev-parse --abbrev-ref HEAD` to identify the current branch.
   b. Determine the merge base: `git merge-base HEAD <base-branch>` (typically `main` or `develop`; if uncertain, ask the user).
   c. Get the commit range: `git log <merge-base>..HEAD --oneline`.
   d. Get the diff: `git diff <merge-base>..HEAD`.
   e. Check for uncommitted changes: `git status --short`. If present, include them in the analysis.
3. Analyze the diff and commit messages to understand what changed and why.
4. Fill in each section of the template:
   - **Summary**: Write a concise summary of the changes as 3-5 bullet points in Japanese. Focus on what was added, changed, or removed.
   - **Why**: Explain the motivation behind the changes in Japanese. Infer from commit messages, issue references, or code context. If the motivation cannot be determined, ask the user before completing this section.
   - **Validation**: Run the `verify` skill to execute the appropriate verification commands. Record the actual results. Only list checks that were actually performed.
   - **Review Points**: Highlight areas that need special reviewer attention: complex logic, architectural decisions, potential side effects, or areas requiring domain expertise. Write in Japanese.
5. Output the completed PR description as Markdown.

## Rules

- Write the PR description in Japanese to match the template language.
- Base all content on actual code changes from the diff and commits. Never invent or assume changes that are not visible.
- If the motivation (Why) cannot be determined from the available context, ask the user before producing the final output. Do not leave placeholder text.
- If validation cannot be completed (e.g., environment issues), note this explicitly rather than fabricating results.
- All command execution must go through Devbox: use `devbox run -- <command>` for each command. Do not chain commands with `&&`; run them one at a time.
- Keep the Summary concise: 3-5 bullet points maximum.
- The examples in this file are illustrative only. Never reuse example text as actual PR content.

## Example Output

The following is an illustrative example. Do not copy this text into a real PR.

```markdown
## Summary
- ユーザー認証ミドルウェアを追加
- ログインAPIエンドポイントを実装
- 認証トークンの検証ロジックを共通化

## Why
- アプリケーションにセキュアな認証機能を導入する必要があるため

## Validation
- `devbox run -- pnpm verify` を実行し、全チェックがパスすることを確認
- 既存のテストが全て成功することを検証

## Review Points
- トークン検証ロジックのエラーハンドリング設計についてレビューをお願いします
- ミドルウェアの適用スコープが適切かどうか確認をお願いします
```
