# next-starter

[English](./README.md)

[![Built with Devbox](https://www.jetify.com/img/devbox/shield_galaxy.svg)](https://www.jetify.com/devbox/docs/contributor-quickstart/)

これは Next.js のフルスタックスターターテンプレートです。フルスタックアプリケーションの開発をすぐに始められるよう、ツールと設定を一式用意しています。

## 機能
- [pnpm](https://pnpm.io/) 高速で効率的なパッケージマネージャー。
- [Next.js 16](https://nextjs.org/) フルスタックアプリケーションを構築するための React フレームワーク。
- [Biome](https://biomejs.dev/) 高速で拡張性の高いコードフォーマッター兼リンター。
- [BetterAuth](https://better-auth.com) Next.js 向けのシンプルで安全な認証ライブラリ。
- [Tailwind CSS](https://tailwindcss.com/) ユーティリティファーストな CSS フレームワーク。
- [orpc](https://orpc.dev) Next.js 向けの型安全で OpenAPI 互換の RPC フレームワーク。
- [zod](https://zod.dev/) TypeScript ファーストのスキーマバリデーションライブラリ。
- [Drizzle ORM](https://orm.drizzle.team/) SQL データベース向けの TypeScript ORM。
- [SQLite](https://www.sqlite.org/index.html) 軽量なファイルベースの SQL データベース。
- [Vitest](https://vitest.dev/) Vite 駆動の高速なユニットテストフレームワーク。
- [Storybook](https://storybook.js.org/) UI コンポーネントを単独で開発するためのツール。
- [Devbox](https://www.jetify.com/devbox/) 再現性のある開発環境。
- tsgo による型チェックの実験的サポート。


## はじめ方

### 前提条件

- [Devbox](https://www.jetify.com/devbox/docs/installing-devbox/)

Node.js、pnpm、cocogitto のバージョンは `devbox.json` で宣言され、Devbox 経由で提供されます:

- **Node.js** 26.4.0
- **pnpm** 11.1.2
- **cocogitto** 7.0.0

ツールチェーンを確認するには:

    devbox run -- node --version
    devbox run -- pnpm --version
    devbox run -- cog --version

### Devbox 環境

このプロジェクトは Devbox を標準のツールチェーンとして使用します。`devbox.json` で Node.js、pnpm、cocogitto のバージョンを固定しており、ロックファイルもコミットしているため、すべての環境で同じパッケージバージョンが解決されます。

Devbox 経由でコマンドを実行します:

    devbox run -- node --version
    devbox run -- pnpm install
    devbox run -- pnpm dev

Devbox シェルは、macOS と Linux で Node.js、pnpm、cocogitto のバージョンを完全に揃えて提供します。

対話型シェルを使いたい場合は `devbox shell` を実行してから、`pnpm <script>` を直接使用してください。

### Dev Container（VS Code）

このリポジトリには、macOS および Linux ホスト向けのプロジェクト提供の Devbox ベース Dev Container 設定が含まれています。

1. VS Code でプロジェクトを開き、**Dev Containers: Reopen in Container** を実行してください（既存のコンテナーがある場合は **Rebuild Container**）。
   コンテナーは公式の `jetpackio/devbox` イメージを使用し、非 root の `devbox` ユーザーとして実行され、`pnpm devcontainer:setup` で依存関係を自動的にインストールします。

2. コンテナー内でも同じコマンドが利用できます:

       pnpm dev
       pnpm storybook

#### Devbox の自動有効化

新規または再構築後の Dev Container ターミナルでは、Devbox ツールチェーンが自動的に読み込まれます。
`configure-bash.sh` は `/home/devbox/.bashrc` に単一のガードブロックを維持し、対話型シェルごとに `devbox shellenv` を一度評価し、重複実行を避けるために `NEXT_STARTER_DEVBOX_ENV_LOADED` を設定します。

通常のターミナル利用時に手動で `devbox shell` を実行する必要はありません。

#### フォールバックコマンド

自動的な `.bashrc` フックを使いたくない場合、または Dev Container 外で作業する場合は、以下を使用してください:

    devbox shell
    # or
    devbox run -- <command>

例:

    devbox run -- pnpm dev
    devbox run -- pnpm check

#### 転送されるポート

デフォルトで転送されるポートは以下のとおりです:

- Next.js 開発サーバー用の `3000`
- Storybook 用の `6006`

#### 再構築

`devbox.json` を変更した後は、**Dev Containers: Rebuild Container** でコンテナーを再構築してください。再生成された `devbox.lock` は、設定の変更と一緒にコミットしてください。

### 1. クローンとインストール

    git clone <repository-url>
    cd <cloned-directory>
    devbox run -- pnpm install --frozen-lockfile

### 2. コミット規約のセットアップ

このプロジェクトではコミットメッセージに [Conventional Commits](https://www.conventionalcommits.org/) を使用します。
コミットメッセージは [cocogitto](https://docs.cocogitto.io/) でローカルに検証されます。

commit-msg フックをインストールするためにセットアップスクリプトを実行してください:

    devbox run -- bash scripts/setup.sh

これはクローン後に一度だけ実行すれば十分です。フックはコミット時に `cog.toml` に対してコミットメッセージを検証するため、`cog.toml` が更新されても再実行は不要です。フックを再インストールする必要がある場合のみ再実行してください（例: フックを削除した後）。

### 3. 環境変数

    cp .env.local.example .env.local

`.env.local` を編集し、以下の変数を設定してください:

| 変数 | 必須 | 説明 |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth クライアント ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth クライアントシークレット |
| `BETTER_AUTH_SECRET` | Yes | ランダムな 32 バイトの 16 進数文字列。生成: `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | No | アプリのベース URL。デフォルト: `http://localhost:3000` |
| `DATABASE_URL` | No | データベース接続文字列。デフォルト: `file:local.db` (SQLite) |

### 4. データベースのセットアップ

    devbox run -- pnpm db:push

これにより、必要なテーブルがすべて含まれた `local.db` が作成されます。

バージョン管理されたマイグレーションを使用する場合は、以下を使用してください:

    devbox run -- pnpm db:generate
    devbox run -- pnpm db:migrate

### 5. 開発の開始

    devbox run -- pnpm dev

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

UI コンポーネント開発用の Storybook:

    devbox run -- pnpm storybook

ブラウザで [http://localhost:6006](http://localhost:6006) を開いてください。
