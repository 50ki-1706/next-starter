- フロントエンドはテストコードを書かないでください。
- バックエンドはテストコードを書いてください。
- コードを実装した後は、必ず`pnpm verify`を実行してください。
- スクリプトを実行する際は`&&`は使用せず、1つずつ実行してください。

## 許可スクリプト
スクリプトはpackage.jsonに書かれているものだけ使用してください。これにより、プロジェクトの一貫性が保たれ、予期しない問題を防ぐことができます。
- `pnpm dev`: 開発サーバーを起動します。
- `pnpm build`: プロジェクトをビルドします。
- `pnpm start`: ビルドされたプロジェクトを起動します。
- `pnpm check`: コードの品質を確認します。(Biome)
- `pnpm format`: コードをフォーマットします。(Biome)
- `pnpm typecheck`: 型チェックを実行します。
- `pnpm test:run`: テストを実行します。(vitest)
- `pnpm build-storybook`: Storybookをビルドします。
- `pnpm db:generate`: Drizzle ORMのコードを生成します。
- `pnpm db:migrate`: データベースのマイグレーションを実行します。
- `pnpm db:push`: データベースのマイグレーションを適用します。
- `pnpm db:reset`: データベースをリセットします。
- `pnpm verify`: コードが正しく動作し、必要な基準を満たしていることを確認します。
