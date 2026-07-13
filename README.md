# next-starter

[日本語](./README.ja.md)

This is a Next.js full-stack starter template. It includes a set of tools and configurations to help you get started quickly with building full-stack applications.

## Features
- [pnpm](https://pnpm.io/) A package manager that is fast and efficient.
- [Next.js 16](https://nextjs.org/) A React framework for building full-stack applications.
- [Biome](https://biomejs.dev/) A fast and extensible code formatter and linter.
- [BetterAuth](https://better-auth.com) A simple and secure authentication library for Next.js.
- [Tailwind CSS](https://tailwindcss.com/) A utility-first CSS framework for rapid UI development.
- [orpc](https://orpc.dev) A type-safe, OpenAPI-compatible RPC framework for Next.js.
- [zod](https://zod.dev/) A TypeScript-first schema validation library.
- [Drizzle ORM](https://orm.drizzle.team/) A TypeScript ORM for SQL databases.
- [SQLite](https://www.sqlite.org/index.html) A lightweight, file-based SQL database.
- [Vitest](https://vitest.dev/) A blazing fast unit test framework powered by Vite.
- [Storybook](https://storybook.js.org/) A tool for developing UI components in isolation.
- [Devbox](https://www.jetify.com/devbox/) A reproducible development environment.
- Experimental support for tsgo for type checking.


## Getting Started

### Prerequisites

- [Devbox](https://www.jetify.com/devbox/docs/installing-devbox/)

Node.js, pnpm, and cocogitto versions are declared in `devbox.json` and provided through Devbox:

- **Node.js** 26.4.0
- **pnpm** 11.1.2
- **cocogitto** 7.0.0

Verify the toolchain:

    devbox run -- node --version
    devbox run -- pnpm --version
    devbox run -- cog --version

### Devbox environment

This project uses Devbox as its canonical toolchain. `devbox.json` pins Node.js, pnpm, and cocogitto, and the lock file is committed so every environment resolves the same package versions.

Run commands through Devbox:

    devbox run -- node --version
    devbox run -- pnpm install
    devbox run -- pnpm dev

The Devbox shell provides the exact same Node.js, pnpm, and cocogitto versions on macOS and Linux.

If you prefer an interactive shell, run `devbox shell` and then use `pnpm <script>` directly.

### Dev Container (VS Code)

The repository includes a project-provided Devbox-based Dev Container configuration for macOS and Linux hosts.

1. Open the project in VS Code and run **Dev Containers: Reopen in Container** (or **Rebuild Container** if the container already exists).
   The container uses the official `jetpackio/devbox` image, runs as the non-root `devbox` user, and installs dependencies automatically via `pnpm devcontainer:setup`.

2. Inside the container, the same commands work:

       pnpm dev
       pnpm storybook

#### Automatic Devbox activation

Newly opened or rebuilt Dev Container terminals automatically load the Devbox toolchain.
`configure-bash.sh` maintains a single guarded block in `/home/devbox/.bashrc` that evaluates `devbox shellenv` once per interactive shell and sets `NEXT_STARTER_DEVBOX_ENV_LOADED` to avoid duplicate work.

No manual `devbox shell` is required for normal terminal use.

#### Fallback commands

If you prefer not to rely on the automatic `.bashrc` hook, or if you are outside the Dev Container, use:

    devbox shell
    # or
    devbox run -- <command>

For example:

    devbox run -- pnpm dev
    devbox run -- pnpm check

#### Forwarded ports

Only the following ports are forwarded by default:

- `3000` for the Next.js development server
- `6006` for Storybook

#### Rebuilding

After changing `devbox.json`, rebuild the container with **Dev Containers: Rebuild Container**. Commit the regenerated `devbox.lock` together with the config change.

### 1. Clone and Install

    git clone <repository-url>
    cd <cloned-directory>
    devbox run -- pnpm install --frozen-lockfile

### 2. Commit Convention Setup

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
Commit messages are validated locally via [cocogitto](https://docs.cocogitto.io/).

Run the setup script to install the commit-msg hook:

    devbox run -- bash scripts/setup.sh

This needs to be done once after cloning. The hook validates commit messages against `cog.toml` at commit time, so no re-run is needed when `cog.toml` is updated. Re-run only if you need to reinstall the hook (e.g., after deleting it).

### 3. Environment Variables

    cp .env.local.example .env.local

Edit `.env.local` and set the following variables:

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `BETTER_AUTH_SECRET` | Yes | A random 32-byte hex string. Generate with: `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | No | Base URL of the app. Default: `http://localhost:3000` |
| `DATABASE_URL` | No | Database connection string. Default: `file:local.db` (SQLite) |

### 4. Database Setup

    devbox run -- pnpm db:push

This creates `local.db` with all required tables.

For version-controlled migrations, use:

    devbox run -- pnpm db:generate
    devbox run -- pnpm db:migrate

### 5. Start Development

    devbox run -- pnpm dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

Storybook for UI component development:

    devbox run -- pnpm storybook

Open [http://localhost:6006](http://localhost:6006).
