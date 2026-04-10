# 青空アーカイブ レスポンシブデザイン 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存の青空アーカイブポータルサイトに、モバイル(375px〜)からデスクトップまで破綻しないレスポンシブ対応を加える。

**Architecture:** 変更は `src/APP.jsx` 単一ファイルに閉じる。モバイル用ハンバーガーメニューを `useState` でローカル管理し、それ以外のセクションは既存のインラインTailwindクラスに `sm:` / `md:` / `lg:` のバリアントを追加してフォントサイズ・余白・高さを調整する。新規依存・新規ファイルなし。

**Tech Stack:** React 18, Vite, Tailwind CSS 3.4, lucide-react

**Spec:** `docs/superpowers/specs/2026-04-10-responsive-design.md`

**注意:** このプロジェクトには自動テストスイートが存在しない(`package.json` の scripts は dev / build / lint / preview / deploy のみ)。したがって各タスクの検証は (a) `npm run lint` (b) `npm run build` (c) Chrome DevTools での手動確認 の組合せで行う。TDD は適用しない。

---

## File Structure

変更対象ファイル:
- **Modify:** `src/APP.jsx` — 唯一の変更ファイル。各セクションのインラインTailwindクラス調整 + モバイルメニュー state/UI 追加

非変更:
- `tailwind.config.js` — デフォルトブレークポイント(sm=640, md=768, lg=1024)をそのまま使用
- `src/index.css` — 追加スタイル不要
- `package.json` — 依存追加なし(`lucide-react` の `Menu` / `X` は既存パッケージ内)

---

## Task 1: モバイルメニュー用のimportとstate追加

**Files:**
- Modify: `src/APP.jsx:2` (import行), `src/APP.jsx:10-12` (state宣言)

**目的:** ハンバーガーメニュー実装に必要な `Menu` / `X` アイコンと `isMenuOpen` state を追加する。

- [ ] **Step 1: lucide-react の import に `Menu` と `X` を追加**

`src/APP.jsx` の 2行目を以下のように変更:

変更前:
```jsx
import { Twitter, Mail, BookOpen, ExternalLink, Leaf, ChevronDown, Globe } from 'lucide-react';
```

変更後:
```jsx
import { Twitter, Mail, BookOpen, ExternalLink, Leaf, ChevronDown, Globe, Menu, X } from 'lucide-react';
```

- [ ] **Step 2: `isMenuOpen` state を追加**

`export default function App() {` の直後、既存の `useState` 群の末尾に追加:

変更前:
```jsx
export default function App() {
    const [scrollY, setScrollY] = useState(0);
    const [activeWorldIndex, setActiveWorldIndex] = useState(0);
    const [particles, setParticles] = useState([]);
```

変更後:
```jsx
export default function App() {
    const [scrollY, setScrollY] = useState(0);
    const [activeWorldIndex, setActiveWorldIndex] = useState(0);
    const [particles, setParticles] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
```

- [ ] **Step 3: ビルドが通ることを確認**

Run: `cd studioHARERUYA-Portal && npm run build`
Expected: エラーなくビルド完了

- [ ] **Step 4: Lintが通ることを確認**

Run: `cd studioHARERUYA-Portal && npm run lint`
Expected: エラー/警告なし(既存の警告があればそれ以上増えていないこと)

- [ ] **Step 5: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): add mobile menu state and icon imports"
```

---

## Task 2: モバイルハンバーガーメニューUI実装

**Files:**
- Modify: `src/APP.jsx:82-96` (nav要素全体)

**目的:** モバイル幅(`< md`)でハンバーガーボタンを表示し、タップでフルスクリーンオーバーレイを開閉できるようにする。デスクトップ幅の既存ナビは維持する。

- [ ] **Step 1: nav要素をハンバーガーメニュー対応版に置換**

変更前(82-96行目):
```jsx
            {/* ナビゲーション */}
            <nav className="fixed w-full z-50 bg-[#f4f7f6]/80 backdrop-blur-md border-b border-sky-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer relative z-10" onClick={() => window.scrollTo(0, 0)}>
                            <Leaf className="h-6 w-6 text-emerald-500" />
                            <span className="font-bold text-xl tracking-wider text-slate-800">青空アーカイブ</span>
                        </div>
                        <div className="hidden md:flex space-x-8 relative z-10">
                            <a href="#about" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">About</a>
                            <a href="#world" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">World</a>
                            <a href="#works" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">Works</a>
                        </div>
                    </div>
                </div>
            </nav>
```

変更後:
```jsx
            {/* ナビゲーション */}
            <nav className="fixed w-full z-50 bg-[#f4f7f6]/80 backdrop-blur-md border-b border-sky-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer relative z-10" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>
                            <Leaf className="h-6 w-6 text-emerald-500" />
                            <span className="font-bold text-xl tracking-wider text-slate-800">青空アーカイブ</span>
                        </div>
                        {/* デスクトップ用ナビ */}
                        <div className="hidden md:flex space-x-8 relative z-10">
                            <a href="#about" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">About</a>
                            <a href="#world" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">World</a>
                            <a href="#works" className="text-slate-600 hover:text-sky-500 transition-colors font-medium">Works</a>
                        </div>
                        {/* モバイル用ハンバーガーボタン */}
                        <button
                            type="button"
                            className="md:hidden relative z-10 p-2 -mr-2 text-slate-700 hover:text-sky-500 transition-colors"
                            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* モバイル用フルスクリーンメニューオーバーレイ */}
                <div
                    className={`md:hidden fixed inset-0 top-16 bg-[#f4f7f6]/95 backdrop-blur-md transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="flex flex-col items-center justify-center gap-8 pt-16 text-2xl">
                        <a
                            href="#about"
                            className="text-slate-700 hover:text-sky-500 transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </a>
                        <a
                            href="#world"
                            className="text-slate-700 hover:text-sky-500 transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            World
                        </a>
                        <a
                            href="#works"
                            className="text-slate-700 hover:text-sky-500 transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Works
                        </a>
                    </div>
                </div>
            </nav>
```

- [ ] **Step 2: dev サーバを起動して目視確認**

Run: `cd studioHARERUYA-Portal && npm run dev`
Expected: http://localhost:5173 が起動

Chrome DevTools のデバイスモードで:
- iPhone SE (375px): ハンバーガーボタンが右上に表示される
- ハンバーガータップでオーバーレイが開き、About/World/Works が縦並びで表示される
- リンクタップでオーバーレイが閉じ、該当セクションへスクロールする
- Xボタンタップでオーバーレイが閉じる
- Desktop (1440px): ハンバーガーボタンは非表示、従来の横並びナビのみ表示

- [ ] **Step 3: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: 両方エラーなし

- [ ] **Step 4: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): add mobile hamburger menu with fullscreen overlay"
```

---

## Task 3: Heroセクションのレスポンシブ調整

**Files:**
- Modify: `src/APP.jsx:99-124` (Heroセクション全体)

**目的:** Heroセクションの見出し・本文・余白をモバイルで読みやすいサイズに調整する。

- [ ] **Step 1: section要素のpadding調整**

99行目の section タグを変更:

変更前:
```jsx
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden min-h-screen justify-center z-10">
```

変更後:
```jsx
            <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden min-h-screen justify-center z-10">
```

- [ ] **Step 2: h1 のフォントサイズ調整**

100行目を変更:

変更前:
```jsx
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-800 mb-6 leading-tight blur-reveal" style={{ transitionDelay: '0.1s' }}>
```

変更後:
```jsx
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-800 mb-6 leading-tight blur-reveal" style={{ transitionDelay: '0.1s' }}>
```

- [ ] **Step 3: p のフォントサイズ調整**

106行目を変更:

変更前:
```jsx
                <p className="max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed reveal-on-scroll" style={{ transitionDelay: '0.5s' }}>
```

変更後:
```jsx
                <p className="max-w-2xl text-base sm:text-lg text-slate-600 mb-10 leading-relaxed reveal-on-scroll" style={{ transitionDelay: '0.5s' }}>
```

- [ ] **Step 4: DevToolsで目視確認**

Run: `npm run dev` (既に起動していれば HMR で反映)
- iPhone SE (375px): タイトルが画面幅内に収まり、2行で改行される(`<br className="sm:hidden" />` が効いている)
- iPad (768px): sm:text-5xl が適用される
- Desktop: 変更なし

- [ ] **Step 5: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): adjust hero section typography and spacing for mobile"
```

---

## Task 4: Aboutセクションのレスポンシブ調整

**Files:**
- Modify: `src/APP.jsx:127-151` (Aboutセクション全体)

**目的:** flexコンテナのgap、本文フォントサイズ、sectionパディングをモバイル向けに縮小する。

- [ ] **Step 1: section の padding 調整**

127行目を変更:

変更前:
```jsx
            <section id="about" className="py-24 bg-white relative z-10">
```

変更後:
```jsx
            <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white relative z-10">
```

- [ ] **Step 2: flexコンテナの gap 調整**

129行目を変更:

変更前:
```jsx
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
```

変更後:
```jsx
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
```

- [ ] **Step 3: 本文テキストのフォントサイズ調整**

135行目を変更:

変更前:
```jsx
                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
```

変更後:
```jsx
                            <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg">
```

- [ ] **Step 4: DevToolsで目視確認**

- iPhone SE: 本文が読みやすいサイズ、画像とテキストが縦積み
- iPad: 同様に縦積み(`lg:flex-row` 未満)、余白が詰まっている
- Desktop (lg+): 横並びレイアウト維持

- [ ] **Step 5: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): tighten about section spacing and typography on mobile"
```

---

## Task 5: Worldセクションのレスポンシブ調整

**Files:**
- Modify: `src/APP.jsx:190-237` (world-step 3つ分)

**目的:** スクロールテリング用の各ステップの高さ、見出し、本文のフォントサイズ、内側パディングをモバイルで縮小する。

- [ ] **Step 1: Step 0 (黄金時代) の調整**

190-200行目を変更:

変更前:
```jsx
                    <div className="world-step min-h-[150vh] flex items-center justify-center py-32" data-index="0">
                        <div className="max-w-2xl mx-auto px-6 text-slate-200">
                            <h3 className="text-3xl font-bold mb-8 tracking-widest text-cyan-400 blur-reveal">―――西暦2080年</h3>
                            <div className="space-y-8 text-lg md:text-xl leading-loose font-medium drop-shadow-lg">
```

変更後:
```jsx
                    <div className="world-step min-h-[120vh] lg:min-h-[150vh] flex items-center justify-center py-20 sm:py-32" data-index="0">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-slate-200">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-8 tracking-widest text-cyan-400 blur-reveal">―――西暦2080年</h3>
                            <div className="space-y-8 text-base sm:text-lg md:text-xl leading-loose font-medium drop-shadow-lg">
```

- [ ] **Step 2: Step 1 (終末事変) の調整**

203-213行目を変更:

変更前:
```jsx
                    <div className="world-step min-h-[200vh] flex items-center justify-center py-32" data-index="1">
                        <div className="max-w-3xl mx-auto px-6 text-center text-slate-200">
                            <h3 className="text-4xl sm:text-6xl tracking-[0.5em] font-serif mb-12 select-none text-red-500 glitch-reveal">
                                ―終末事変―
                            </h3>
                            <div className="space-y-8 text-lg md:text-xl leading-loose font-medium drop-shadow-xl bg-black/40 p-8 rounded-3xl backdrop-blur-sm border border-red-900/30">
```

変更後:
```jsx
                    <div className="world-step min-h-[160vh] lg:min-h-[200vh] flex items-center justify-center py-20 sm:py-32" data-index="1">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-slate-200">
                            <h3 className="text-3xl sm:text-5xl lg:text-6xl tracking-[0.5em] font-serif mb-12 select-none text-red-500 glitch-reveal">
                                ―終末事変―
                            </h3>
                            <div className="space-y-8 text-base sm:text-lg md:text-xl leading-loose font-medium drop-shadow-xl bg-black/40 p-6 sm:p-8 lg:p-12 rounded-3xl backdrop-blur-sm border border-red-900/30">
```

- [ ] **Step 3: Step 2 (目覚め) の調整**

216-236行目を変更。`world-step` の外枠高さ、内側カードパディング、末尾テキストサイズを調整:

変更前:
```jsx
                    <div className="world-step min-h-[250vh] flex flex-col items-center justify-center py-32" data-index="2">
                        <div className="max-w-3xl mx-auto px-6 text-slate-100 w-full">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-12 rounded-3xl shadow-2xl mb-[40vh]">
                                <div className="space-y-8 text-lg md:text-xl leading-loose font-medium drop-shadow-md">
                                    <p className="text-slate-300 italic blur-reveal">......... しかしながら、人類は滅亡していませんでした。</p>
                                    <p className="reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>世界の終わりを予期していた人々が僅かながらも存在し、世界中にシェルターを建造していたのです。運良くそこに辿り着けた人々は、地表が安全になるまでの数十年間、地下で息を潜め続けました。</p>
                                    <p className="reveal-on-scroll text-sky-300 font-bold text-2xl mt-8" style={{ transitionDelay: '0.4s' }}>2100年代になり、シェルターの多くのロックダウンが解除されました。</p>
                                    <p className="reveal-on-scroll" style={{ transitionDelay: '0.6s' }}>地表に出た者たちが目にしたのは、滅びた文明と、それを覆う穏やかな夏の青空、白い雲、生い茂る緑。</p>
                                </div>
                            </div>
                            <div className="text-center bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl mx-auto w-full">
                                <p className="text-lg text-slate-200 mb-8 reveal-on-scroll font-medium drop-shadow-md">
                                    終末事変の影響の残滓か、あるいは混乱の中で用いられた気象兵器の後遺症か。
                                </p>
                                <p className="text-2xl sm:text-4xl font-bold text-white leading-relaxed drop-shadow-lg blur-reveal" style={{ transitionDelay: '0.3s' }}>
                                    地球全土は穏やかな初夏の気候に抱かれ、<br />
                                    ただ静かで明るく、少し寂しい、<br />
                                    そんな光景が広がっていたのでした。
                                </p>
                            </div>
                        </div>
                    </div>
```

変更後:
```jsx
                    <div className="world-step min-h-[200vh] lg:min-h-[250vh] flex flex-col items-center justify-center py-20 sm:py-32" data-index="2">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-slate-100 w-full">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl mb-[40vh]">
                                <div className="space-y-8 text-base sm:text-lg md:text-xl leading-loose font-medium drop-shadow-md">
                                    <p className="text-slate-300 italic blur-reveal">......... しかしながら、人類は滅亡していませんでした。</p>
                                    <p className="reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>世界の終わりを予期していた人々が僅かながらも存在し、世界中にシェルターを建造していたのです。運良くそこに辿り着けた人々は、地表が安全になるまでの数十年間、地下で息を潜め続けました。</p>
                                    <p className="reveal-on-scroll text-sky-300 font-bold text-xl sm:text-2xl mt-8" style={{ transitionDelay: '0.4s' }}>2100年代になり、シェルターの多くのロックダウンが解除されました。</p>
                                    <p className="reveal-on-scroll" style={{ transitionDelay: '0.6s' }}>地表に出た者たちが目にしたのは、滅びた文明と、それを覆う穏やかな夏の青空、白い雲、生い茂る緑。</p>
                                </div>
                            </div>
                            <div className="text-center bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl mx-auto w-full">
                                <p className="text-base sm:text-lg text-slate-200 mb-8 reveal-on-scroll font-medium drop-shadow-md">
                                    終末事変の影響の残滓か、あるいは混乱の中で用いられた気象兵器の後遺症か。
                                </p>
                                <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-relaxed drop-shadow-lg blur-reveal" style={{ transitionDelay: '0.3s' }}>
                                    地球全土は穏やかな初夏の気候に抱かれ、<br />
                                    ただ静かで明るく、少し寂しい、<br />
                                    そんな光景が広がっていたのでした。
                                </p>
                            </div>
                        </div>
                    </div>
```

- [ ] **Step 4: DevToolsで目視確認**

- iPhone SE: 各ステップの高さが詰まり、テキストが画面内で読みやすい
- スクロールテリングの画像切替が機能する(`activeWorldIndex` が 0→1→2 と変わる)
- Desktop: 元の `150vh/200vh/250vh` が適用され、元の体験が維持される

- [ ] **Step 5: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): reduce world section heights and typography on mobile"
```

---

## Task 6: Worksセクションのレスポンシブ調整とバグ修正

**Files:**
- Modify: `src/APP.jsx:244-310` (Worksセクション全体)

**目的:** Worksセクションのpadding/gap/カード内paddingを調整し、3番目カードの `sm:hidden lg:block` バグ(タブレット幅で非表示になる)を修正する。また全ての BOOTH ボタンに `type="button"` を付与する。

- [ ] **Step 1: section padding と見出し margin 調整**

244-252行目を変更:

変更前:
```jsx
            <section id="works" className="py-24 bg-[#f4f7f6] relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 blur-reveal">
```

変更後:
```jsx
            <section id="works" className="py-16 sm:py-20 lg:py-24 bg-[#f4f7f6] relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-16 blur-reveal">
```

- [ ] **Step 2: グリッドのgap調整**

254行目を変更:

変更前:
```jsx
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
```

変更後:
```jsx
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
```

- [ ] **Step 3: Work Item 1 のカード padding とボタン type 属性調整**

256-271行目を変更:

変更前:
```jsx
                        {/* Work Item 1 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                            <div className="aspect-[3/4] bg-sky-100 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-sky-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">New Book</h3>
                            </div>
                            <div className="p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">終末ピクニック Vol.3</h3>
                                    <span className="bg-sky-100 text-sky-600 text-xs px-2 py-1 rounded-full font-medium">最新刊</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">廃線になった駅舎でパンを焼くお話。水彩イラストと掌編のフルカラー本です。</p>
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

変更後:
```jsx
                        {/* Work Item 1 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                            <div className="aspect-[3/4] bg-sky-100 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-sky-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">New Book</h3>
                            </div>
                            <div className="p-5 sm:p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">終末ピクニック Vol.3</h3>
                                    <span className="bg-sky-100 text-sky-600 text-xs px-2 py-1 rounded-full font-medium">最新刊</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">廃線になった駅舎でパンを焼くお話。水彩イラストと掌編のフルカラー本です。</p>
                                <button type="button" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

- [ ] **Step 4: Work Item 2 のカード padding とボタン type 属性調整**

274-289行目を変更:

変更前:
```jsx
                        {/* Work Item 2 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                            <div className="aspect-[3/4] bg-emerald-50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-emerald-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">Art Book</h3>
                            </div>
                            <div className="p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">青空図録</h3>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">既刊</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">過去2年間のポストアポカリプス風景画をまとめた総集編イラスト集。</p>
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

変更後:
```jsx
                        {/* Work Item 2 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                            <div className="aspect-[3/4] bg-emerald-50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-emerald-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">Art Book</h3>
                            </div>
                            <div className="p-5 sm:p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">青空図録</h3>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">既刊</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">過去2年間のポストアポカリプス風景画をまとめた総集編イラスト集。</p>
                                <button type="button" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

- [ ] **Step 5: Work Item 3 の表示バグ修正、padding調整、ボタン type 属性**

292-307行目を変更。`sm:hidden lg:block` を削除して常に表示させる:

変更前:
```jsx
                        {/* Work Item 3 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 sm:hidden lg:block reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
                            <div className="aspect-[3/4] bg-amber-50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-amber-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">Goods</h3>
                            </div>
                            <div className="p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">水没都市のアクリルジオラマ</h3>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">グッズ</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">窓辺に飾ると光が透けて綺麗な、アクリル製の組み立て式ジオラマです。</p>
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

変更後:
```jsx
                        {/* Work Item 3 */}
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
                            <div className="aspect-[3/4] bg-amber-50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-50"></div>
                                <h3 className="text-2xl font-bold text-amber-800/40 z-10 rotate-[-10deg] group-hover:scale-110 transition-transform">Goods</h3>
                            </div>
                            <div className="p-5 sm:p-6 relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">水没都市のアクリルジオラマ</h3>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">グッズ</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">窓辺に飾ると光が透けて綺麗な、アクリル製の組み立て式ジオラマです。</p>
                                <button type="button" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                    BOOTHで見る <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
```

- [ ] **Step 6: DevToolsで目視確認**

- iPhone SE (1カラム): 3枚すべてのカードが縦に並ぶ
- iPad (2カラム): 3枚目が2段目の左に表示される(従来は非表示だった)
- Desktop (3カラム): 3枚すべて横並び

- [ ] **Step 7: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: エラーなし

- [ ] **Step 8: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "fix(responsive): show third work card on all breakpoints and tighten spacing"
```

---

## Task 7: フッターのレスポンシブ調整

**Files:**
- Modify: `src/APP.jsx:313-333` (footer要素全体)

**目的:** フッターのpaddingと要素間marginをモバイル向けに縮小する。

- [ ] **Step 1: footer の padding、内部要素の margin 調整**

313-319行目を変更:

変更前:
```jsx
            <footer id="contact" className="bg-slate-900 text-slate-400 py-16 relative z-10 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8 text-white cursor-pointer hover:text-sky-300 transition-colors" onClick={() => window.scrollTo(0, 0)}>
                        <Leaf className="h-6 w-6 text-emerald-500" />
                        <span className="font-bold text-2xl tracking-wider">青空アーカイブ</span>
                    </div>

                    <div className="flex gap-6 mb-8">
```

変更後:
```jsx
            <footer id="contact" className="bg-slate-900 text-slate-400 py-12 sm:py-16 relative z-10 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-6 sm:mb-8 text-white cursor-pointer hover:text-sky-300 transition-colors" onClick={() => window.scrollTo(0, 0)}>
                        <Leaf className="h-6 w-6 text-emerald-500" />
                        <span className="font-bold text-2xl tracking-wider">青空アーカイブ</span>
                    </div>

                    <div className="flex gap-6 mb-6 sm:mb-8">
```

- [ ] **Step 2: DevToolsで目視確認**

- iPhone SE: フッターが詰まって見えるが崩れない。SNSアイコンが親指でタップしやすいサイズ(`p-4`)
- Desktop: 元の余白が維持される

- [ ] **Step 3: Lint と build**

Run: `cd studioHARERUYA-Portal && npm run lint && npm run build`
Expected: エラーなし

- [ ] **Step 4: Commit**

```bash
cd studioHARERUYA-Portal
git add src/APP.jsx
git commit -m "feat(responsive): tighten footer spacing on mobile"
```

---

## Task 8: 最終検証

**Files:**
- なし(検証のみ)

**目的:** 全タスク完了後、全ブレークポイントで崩れがないことを通しで確認する。

- [ ] **Step 1: 本番ビルド**

Run: `cd studioHARERUYA-Portal && npm run build`
Expected: エラーなしで `dist/` が生成される

- [ ] **Step 2: プレビュー起動**

Run: `cd studioHARERUYA-Portal && npm run preview`
Expected: http://localhost:4173 が起動

- [ ] **Step 3: 各ブレークポイントで全セクションを通しで確認**

Chrome DevTools デバイスモードで以下のデバイス幅を切り替えながら、ページトップから最下部までスクロールして確認:

- [ ] iPhone SE (375 × 667)
    - [ ] ナビ: ハンバーガー表示 → タップで開閉 → リンクタップでジャンプ+閉じる
    - [ ] Hero: タイトルが画面幅内、改行が意図通り
    - [ ] About: 画像とテキストが縦積み、読みやすいフォントサイズ
    - [ ] World: スクロールテリング動作、画像切替が機能、テキストはみ出しなし
    - [ ] Works: 3枚のカードが縦に並ぶ
    - [ ] Footer: 崩れなし
- [ ] iPhone 12 Pro (390 × 844)
    - [ ] 上記と同様の項目を確認
- [ ] iPad (768 × 1024)
    - [ ] ナビ: ハンバーガーが非表示、横並びナビが表示
    - [ ] About: まだ縦積み(`lg:flex-row` 未満)
    - [ ] Works: 2カラム表示、3枚目が2段目に表示されること
- [ ] Desktop (1440 × 900)
    - [ ] 全セクションが従来通り表示される(リグレッションなし)

- [ ] **Step 4: Lint 最終確認**

Run: `cd studioHARERUYA-Portal && npm run lint`
Expected: エラー・警告なし

- [ ] **Step 5: 完了報告**

すべての確認項目にチェックが入ったら、ユーザーに完了を報告する。

---

## Self-Review Notes

- **Spec coverage:** スペックの全7セクション(ナビ/Hero/About/World/Works/Footer/共通)それぞれに対応するタスクを配置済み。タスク1(state追加)→ 2(ナビUI)→ 3(Hero)→ 4(About)→ 5(World)→ 6(Works)→ 7(Footer)→ 8(通し検証)の順。
- **Placeholders:** なし。全ステップに実際のコードと具体的なコマンドを記載。
- **Type consistency:** `isMenuOpen` / `setIsMenuOpen` の命名を全タスクで統一。`Menu` / `X` のインポート名も一貫。
- **TDD 不適用の根拠:** 本プロジェクトに自動テストスイートが存在せず、純粋なプレゼンテーション層の調整のため、手動検証(devtools + build + lint)で代替する旨を冒頭に明記。
