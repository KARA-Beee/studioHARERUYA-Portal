# 青空アーカイブ レスポンシブWebデザイン対応

**作成日:** 2026-04-10
**対象:** studioHARERUYA-Portal (React + Vite + Tailwind CSS)
**範囲:** 標準プラン(既存デザインを維持しつつ、モバイル/タブレットで破綻しないレスポンシブ対応)

## 背景と目的

「青空アーカイブ」ポータルサイトは既に Tailwind の `sm:` / `md:` / `lg:` を一部使用しているが、以下の問題があり、モバイル・タブレット閲覧時に UX が損なわれている。

- モバイルナビゲーションが未実装(`hidden md:flex` でリンクが完全に非表示)
- Worldセクションのスクロールテリング用 `min-h-[150vh] / 200vh / 250vh` がモバイルで冗長
- Worksセクションの3枚目カードが `sm:hidden lg:block` となっており、タブレット幅で非表示になるバグ
- Heroセクションや World セクションの見出し・本文がモバイルで大きすぎる
- ハンバーガーメニューなどの a11y 属性欠落

本スペックはこれらを解消し、iPhone SE(375px)クラスからデスクトップ(1440px+)まで快適に閲覧できる状態にすることを目的とする。

## スコープ

### 対応範囲(標準プラン)

1. モバイル用ハンバーガーメニューの追加
2. Hero / About / World / Works / Footer の各セクションのフォントサイズ・余白・高さ調整
3. Works セクション3枚目の表示ロジックバグ修正
4. タップ領域の確保
5. 最小限のアクセシビリティ属性追加(`aria-label`, `aria-expanded`, `type="button"`)

### 非対応範囲

- タブレット専用のレイアウト(Option C 相当)
- `prefers-reduced-motion` 等の大規模 a11y 強化
- Hero プレースホルダーの本画像差し替え(別タスク)
- 新規依存追加、新規コンポーネント分離

## ブレークポイント

Tailwind デフォルトをそのまま使用:

| 名前 | 幅 | 想定デバイス |
|---|---|---|
| (default) | `< 640px` | スマホ縦 |
| `sm:` | `≥ 640px` | 大きめスマホ / 縦タブレット |
| `md:` | `≥ 768px` | 横タブレット |
| `lg:` | `≥ 1024px` | デスクトップ(現状維持) |

## アーキテクチャ

変更は `src/APP.jsx` のみに閉じる。新規ファイル・新規依存は追加しない。`lucide-react` は既に依存に含まれるため、`Menu` / `X` アイコンのインポートを追加するだけで済む。

モバイルメニュー開閉状態は `App` コンポーネント内の `useState` でローカル管理する(既存の `scrollY` / `activeWorldIndex` / `particles` と同じスタイル)。

## 詳細設計

### 1. ナビゲーション (`<nav>`)

**追加 state:**
```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

**構造:**
- 既存の `hidden md:flex` リンク群はそのまま維持
- 新たに `md:hidden` のハンバーガーボタンを右端に追加(`Menu` / `X` を開閉で切替)
- `isMenuOpen` が true のときフルスクリーンオーバーレイを表示
  - 背景: `bg-[#f4f7f6]/95 backdrop-blur-md`
  - 縦並びリンク: About / World / Works
  - リンクタップで `setIsMenuOpen(false)` を呼び、既存のアンカーリンクで該当セクションへスクロール

**アクセシビリティ:**
- ハンバーガーボタンに `aria-label="メニューを開く/閉じる"`, `aria-expanded={isMenuOpen}`, `type="button"`

### 2. Hero セクション

| 要素 | 変更前 | 変更後 |
|---|---|---|
| `<h1>` | `text-4xl sm:text-5xl lg:text-7xl` | `text-3xl sm:text-5xl lg:text-7xl` |
| `<p>` | `text-lg` | `text-base sm:text-lg` |
| section padding | `pt-24 pb-12 lg:pt-32 lg:pb-24` | `pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-24` |

### 3. About セクション

| 要素 | 変更前 | 変更後 |
|---|---|---|
| flexコンテナ gap | `gap-16` | `gap-8 lg:gap-16` |
| 本文 `<p>` container | `text-lg` | `text-base sm:text-lg` |
| section padding | `py-24` | `py-16 sm:py-20 lg:py-24` |

### 4. World セクション

| 要素 | 変更前 | 変更後 |
|---|---|---|
| Step0 高さ | `min-h-[150vh]` | `min-h-[120vh] lg:min-h-[150vh]` |
| Step1 高さ | `min-h-[200vh]` | `min-h-[160vh] lg:min-h-[200vh]` |
| Step2 高さ | `min-h-[250vh]` | `min-h-[200vh] lg:min-h-[250vh]` |
| Step0 `<h3>` | `text-3xl` | `text-2xl sm:text-3xl` |
| Step1 `<h3>` | `text-4xl sm:text-6xl` | `text-3xl sm:text-5xl lg:text-6xl` |
| Step 本文 | `text-lg md:text-xl` | `text-base sm:text-lg md:text-xl` |
| Step1/Step2 内側パディング | `p-8` / `p-8 sm:p-12` | `p-6 sm:p-8 lg:p-12` |
| Step2 最後のテキスト | `text-2xl sm:text-4xl` | `text-xl sm:text-3xl lg:text-4xl` |

`.world-step` 要素の `data-index` と IntersectionObserver 連携は変更しない(`rootMargin: "-40% 0px -40% 0px"` は画面高比率なので、高さ削減による影響は受けない)。

### 5. Works セクション

| 要素 | 変更前 | 変更後 |
|---|---|---|
| 3番目カードの className | `sm:hidden lg:block` を含む | 削除(常に表示) |
| グリッド gap | `gap-10` | `gap-6 sm:gap-8 lg:gap-10` |
| カード内 padding | `p-6` | `p-5 sm:p-6` |
| section padding | `py-24` | `py-16 sm:py-20 lg:py-24` |
| 見出し margin | `mb-16` | `mb-10 sm:mb-16` |

### 6. フッター

| 要素 | 変更前 | 変更後 |
|---|---|---|
| section padding | `py-16` | `py-12 sm:py-16` |
| ロゴの margin | `mb-8` | `mb-6 sm:mb-8` |
| SNS アイコン行 margin | `mb-8` | `mb-6 sm:mb-8` |

### 7. 共通

- 既存の `<style dangerouslySetInnerHTML>` ブロックはそのまま維持(アニメーション定義は全画面幅で有効)
- `html { scroll-behavior: smooth; }` そのまま
- ボタン要素すべてに `type="button"` を追加(BOOTHで見るボタン、ハンバーガーボタン)

## データフロー

```
ユーザー操作                        状態変化
───────────                       ─────────
ハンバーガータップ       ──>  setIsMenuOpen(true)  ──>  オーバーレイ表示
リンクタップ             ──>  setIsMenuOpen(false) ──>  オーバーレイ非表示 + アンカースクロール
Xボタンタップ           ──>  setIsMenuOpen(false) ──>  オーバーレイ非表示
```

既存の `scrollY` / `activeWorldIndex` / `particles` の state 管理には影響しない。

## エラーハンドリング

本タスクはプレゼンテーション層の調整のため、追加のエラーハンドリングは不要。`lucide-react` から追加インポートする `Menu` / `X` は既にパッケージに含まれるため、ビルドエラーの懸念なし。

## テスト方針

手動確認:

1. `npm run dev` でローカル起動
2. Chrome DevTools デバイスモードで以下の幅を確認:
   - iPhone SE (375 × 667)
   - iPhone 12 Pro (390 × 844)
   - iPad (768 × 1024)
   - Desktop (1440 × 900)
3. 確認項目:
   - [ ] ハンバーガーメニューが表示される(< 768px)
   - [ ] ハンバーガータップでオーバーレイが開く
   - [ ] オーバーレイ内リンクをタップするとメニューが閉じて該当セクションへスクロール
   - [ ] md 以上では従来の横並びナビが表示され、ハンバーガーは非表示
   - [ ] Hero のタイトルが各幅で崩れない
   - [ ] About の画像とテキストが縦積みになる(< lg)
   - [ ] World セクションのスクロールテリングが全幅で動作し、画像切替が機能する
   - [ ] Works の3枚目カードが全幅で表示される
   - [ ] Footer のロゴ・アイコン・著作権表示が崩れない
4. `npm run build` で本番ビルドが通ることを確認
5. `npm run lint` で ESLint 警告が増えないことを確認

## 変更ファイル

- `src/APP.jsx`(唯一の変更ファイル)

新規ファイル・依存変更なし。

## ロールバック方針

変更は単一ファイルに閉じているため、`git checkout src/APP.jsx` または該当コミットの revert で即座に元に戻せる。
