# ADR: Codex のコマンド実行を Devbox 経由に限定する

- **Status:** Accepted
- **Date:** 2026-08-06

## Context

`docs/adr/20260713-devbox-canonical-toolchain.md` では、Devbox を唯一のローカル/CI ツールチェーンとして採用した。しかし、`AGENTS.md` の指示だけでは AI Agent がホスト環境の `pnpm`、`node`、`git` などを直接実行することを機械的に防げない。誤ってホスト側のバージョンや環境変数を使うと、ローカル、CI、Agent 間の再現性が失われる。

また、コマンドの先頭だけを確認する方式では、`devbox run -- <command>; <host-command>`、パイプ、リダイレクト、変数展開、コマンド置換などにより、一部の処理が Devbox の外側で評価される余地が残る。

## Decision

リポジトリの `.codex/hooks.json` に Codex の `PreToolUse` フックを定義し、シェルおよび unified exec が実行するコマンドを `.codex/hooks/require-devbox.mjs` で事前検査する。

ガードは以下を満たすコマンドだけを許可する。

- 最外層のコマンドが `devbox run` または `devbox shell` である
- Devbox 呼び出しの外側に、パイプ、リダイレクト、コマンド連結、変数展開、コマンド置換、グロブなどがない
- 複雑なシェル構文が必要な場合、その構文が引用符で保護され、Devbox 内側のシェルへ引き渡される

入力が不正な場合も実行を許可せず、fail-closed で拒否する。ガード自身も `devbox run` 経由で起動する。

Devbox はプロセス実行環境を提供するもので、専用のファイル読み書きツールを包むものではない。そのため、`apply_patch` などのファイル操作ツールはこのフックの対象外とする。編集後に実行するフォーマット、生成、テスト、ビルドなどはガード対象である。

## Consequences

- Codex が Devbox を経由せずにプロジェクトコマンドを実行しようとしても、実行前に拒否される
- コマンド文字列の一部だけを Devbox 経由に見せる迂回も拒否される
- Agent は拒否理由に従い、`devbox run -- <command>` として再実行する必要がある
- プロジェクトローカルフックは、Codex でプロジェクトを信頼し、フック定義を承認した後に有効になる。フックの変更時は再承認が必要になる
- Codex の公式仕様上、一部の専用ツールは標準の tool hook 経路を使用しない場合があり、リポジトリローカルフックはユーザーが無効化できる。組織として無効化不能な強制が必要な場合は、管理対象の `requirements.toml` と managed hooks を端末管理で配布する必要がある
- Codex 以外の Agent や、人間が直接起動したホストプロセスまではこのフックで遮断できない。それらには各製品の同等フックまたは OS/コンテナレベルの実行制約が必要になる

## Extension: Claude Code と OpenCode への適用

- **Date:** 2026-08-06

### Context

Codex だけをガードしても、同じリポジトリを Claude Code や OpenCode が操作するときにホスト環境からコマンドを直接実行できる。Agent ごとに指示を複製すると内容がずれるため、`AGENTS.md` と既存のコマンド判定を正本として共有する必要がある。

### Decision

- Claude Code には `CLAUDE.md` から `AGENTS.md` をインポートさせ、`.claude/settings.json` の `PreToolUse` で既存の `.codex/hooks/require-devbox.mjs` を `devbox run` 経由で実行する
- OpenCode はルートの `AGENTS.md` を自動的に読むため、指示ファイルは追加しない
- OpenCode の `opencode.json` では `bash` を既定拒否とし、`devbox run -- *` と `devbox shell*` のみ許可する
- `.opencode/plugins/require-devbox.js` の `tool.execute.before` でも既存の `isDevboxCommand` を呼び出し、権限パターンだけでは判定しきれないホスト側のシェル構文と不正入力を実行前に拒否する
- 現行の OpenCode `bash` ツールに加え、将来の `shell` 識別子も同じプラグインで検査する

### Consequences

- 3つの Agent が同じ Devbox ポリシーとコマンド判定を共有し、許可条件の重複実装を避けられる
- Claude Code では最初に project trust と `AGENTS.md` インポートの承認が必要になる。project hook はユーザー設定や管理ポリシーで無効化される場合がある
- OpenCode のプロジェクトプラグインは起動時に自動ロードされるが、`--pure` やプロジェクト設定の無効化、プラグインファイルの改変によって迂回できる
- Agent の起動方法まで含めて無効化不能にするには、管理対象設定、起動ラッパー、OS 権限、またはコンテナによる外部強制が必要になる

### References

- [Claude Code: Hooks reference](https://code.claude.com/docs/en/hooks)
- [Claude Code: Project instructions](https://code.claude.com/docs/en/memory)
- [OpenCode: Rules](https://opencode.ai/docs/rules/)
- [OpenCode: Plugins](https://opencode.ai/docs/plugins/)
- [OpenCode: Permissions](https://opencode.ai/docs/permissions)
