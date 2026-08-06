/**
 * OpenCode のシェルツールを実行前に検査し、Devbox 外のコマンドを拒否する。
 * 共通のコマンド判定を再利用し、OpenCode 固有のフック形式だけを変換する。
 */
import { isDevboxCommand } from "../../.codex/hooks/require-devbox.mjs";

/**
 * 値がキー参照可能なオブジェクトかを判定する。
 *
 * @param {unknown} value - 判定対象の値。
 * @returns {value is Record<string, unknown>} null ではないオブジェクトの場合は true。
 */
function isRecord(value) {
  return typeof value === "object" && value !== null;
}

/**
 * OpenCode のツール引数からコマンド文字列を取得する。
 *
 * @param {unknown} args - `tool.execute.before` が受け取ったツール引数。
 * @returns {string | null} コマンドが文字列ならその値、それ以外は null。
 */
function getCommand(args) {
  if (!isRecord(args)) {
    return null;
  }

  return typeof args.command === "string" ? args.command : null;
}

/**
 * OpenCode のシェルツール呼び出しを Devbox ポリシーで検査する。
 *
 * @param {{ tool?: unknown }} input - 実行対象ツールの情報。
 * @param {{ args?: unknown }} output - 実行前に確定したツール引数。
 * @returns {Promise<void>} 許可時は完了し、拒否時は例外を送出する。
 */
async function enforceDevboxCommand(input, output) {
  if (input.tool !== "bash" && input.tool !== "shell") {
    return;
  }

  const command = getCommand(output.args);
  if (command !== null && isDevboxCommand(command)) {
    return;
  }

  throw new Error(
    "Devbox guard: use `devbox run -- <command>` or `devbox shell`. Host-side shell composition and expansion are blocked.",
  );
}

/**
 * OpenCode の `tool.execute.before` に Devbox 強制ガードを登録する。
 *
 * @returns {Promise<{ "tool.execute.before": typeof enforceDevboxCommand }>} OpenCode のフック定義。
 */
export async function DevboxGuard() {
  return {
    "tool.execute.before": enforceDevboxCommand,
  };
}
