---
description: 青空アーカイブ ポータルサイト 開発・更新・デプロイ手順
---
# 青空アーカイブ サイトメンテナンス・エージェント

このワークフローは、`studioHARERUYA-Portal` の開発・更新および、GitHub Pagesへの公開（デプロイ）を円滑にすすめるための AI エージェントの指針です。

今後私（AIアシスタント）に修正を依頼する際や、自身で作業する際の手順として活用されます。

## 1. ローカル開発環境の起動
サイトのデザインや文章、画像を更新する際は、まずローカル開発サーバーを起動してプレビューを確認します。

```bash
npm run dev
```
`http://localhost:5173/studioHARERUYA-Portal/` をブラウザで開き、変更がリアルタイムに反映されることを確認しながら作業を進めます。

## 2. コンテンツの更新・管理対象
サイトの更新やカスタマイズは、基本的に以下のファイルを対象に行います：
- **`src/APP.jsx`**: 画面のメイン構造（About, World, Worksセクション等）、テキスト群、及びアニメーションロジック（無重力パーティクル・スクロール用IntersectionObserver）。
- **`public/images/`**: サイト内で使用・表示される各種画像（hero.png, about.png, cyberpunk.png, destruction.png, cozy.png など）。
- **`src/index.css` & `tailwind.config.js`**: デザインや配色の調整。

## 3. トラブルシューティング
- **起動時に `Access is denied` エラーなどが出る場合**
  OneDriveの同期がViteのキャッシュをロックしている可能性があります。以下のコマンドでキャッシュディレクトリをクリアしてから、再度ローカルサーバーを起動してください。
```bash
Remove-Item -Recurse -Force node_modules\.vite
```

## 4. GitHub Pages への公開（デプロイ）
変更が完了し、ローカルプレビューでの動作確認（表示崩れやエラーがないこと）ができたら、以下のコマンドを実行してビルドとデプロイを行います。

// turbo-all
```bash
npm run deploy
```
このコマンドを実行すると、静的ファイルのビルド（`dist` ディレクトリの生成）と、自動的な `gh-pages` ブランチへのプッシュが行われ、数分後に GitHub Pages 上での公開が完了します。
