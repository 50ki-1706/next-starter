import { createClient } from "@libsql/client";
import { createRouterClient } from "@orpc/server";
import { drizzle } from "drizzle-orm/libsql";
import { beforeEach, describe, expect, it } from "vitest";
import * as schema from "../../db/schema";
import type { ORPCContext } from "./context";
import { router } from "./router";

// 全テストで同一のインメモリ SQLite インスタンスを共有
const client = createClient({ url: ":memory:" });
const db = drizzle(client, { schema });

// テーブル再作成ヘルパー
async function recreateTables() {
  // FK制約を有効化
  await db.run("PRAGMA foreign_keys = ON");
  // FK順序を考慮して逆順にDROP
  await db.run("DROP TABLE IF EXISTS verification");
  await db.run("DROP TABLE IF EXISTS account");
  await db.run("DROP TABLE IF EXISTS session");
  await db.run("DROP TABLE IF EXISTS user");
  // スキーマからテーブルを再作成
  await db.run(
    `CREATE TABLE user (id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE, email_verified integer NOT NULL, image text, created_at integer NOT NULL, updated_at integer NOT NULL)`,
  );
  await db.run(
    `CREATE TABLE session (id text PRIMARY KEY, expires_at integer NOT NULL, token text NOT NULL UNIQUE, created_at integer NOT NULL, updated_at integer NOT NULL, ip_address text, user_agent text, user_id text NOT NULL REFERENCES user(id))`,
  );
  await db.run(
    `CREATE TABLE account (id text PRIMARY KEY, account_id text NOT NULL, provider_id text NOT NULL, user_id text NOT NULL REFERENCES user(id), access_token text, refresh_token text, id_token text, access_token_expires_at integer, refresh_token_expires_at integer, scope text, password text, created_at integer NOT NULL, updated_at integer NOT NULL)`,
  );
  await db.run(
    `CREATE TABLE verification (id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL, expires_at integer NOT NULL, created_at integer, updated_at integer)`,
  );
}

// テスト用の未認証コンテキスト
const unauthContext: ORPCContext = { db, session: null };

function createUnauthedClient() {
  return createRouterClient(router, {
    context: unauthContext,
  });
}

describe("health procedure", () => {
  beforeEach(async () => {
    await recreateTables();
  });

  it("returns ok: true", async () => {
    const client = createUnauthedClient();
    const result = await client.health();
    expect(result).toEqual({ ok: true });
  });
});
