import React, { useState, useEffect } from 'react';
import { Twitter, Mail, BookOpen, ExternalLink, Leaf, ChevronDown, Globe } from 'lucide-react';

export default function App() {
    const [scrollY, setScrollY] = useState(0);
    const [activeWorldIndex, setActiveWorldIndex] = useState(0);
    const [particles, setParticles] = useState([]);

    // --- 無重力パーティクル（antigravity）の初期化 ---
    useEffect(() => {
        // ランダムなサイズ、位置、速度を持つ光の粒子を30個生成
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            duration: Math.random() * 15 + 15, // 15秒〜30秒かけてゆっくり上昇
            delay: Math.random() * 10,
        }));
        setParticles(newParticles);
    }, []);

    // --- スクロールイベントとIntersection Observer ---
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // 要素のフェードイン監視
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('is-revealed');
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });

        document.querySelectorAll('.reveal-on-scroll, .blur-reveal, .glitch-reveal').forEach((el) => revealObserver.observe(el));

        // Worldセクションの現在位置監視（画面中央に入ったブロックを判定）
        const worldObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveWorldIndex(Number(entry.target.dataset.index));
                }
            });
        }, { threshold: 0, rootMargin: "-40% 0px -40% 0px" });

        document.querySelectorAll('.world-step').forEach((el) => worldObserver.observe(el));

        return () => {
            window.removeEventListener("scroll", handleScroll);
            revealObserver.disconnect();
            worldObserver.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7f6] text-slate-700 font-sans selection:bg-sky-200 relative">

            {/* 魔法の無重力パーティクル（antigravity effect） */}
            <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full mix-blend-overlay bg-sky-200"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            bottom: '-20px',
                            opacity: 0,
                            boxShadow: '0 0 8px rgba(186, 230, 253, 0.8)', // ほのかな光彩
                            animation: `antigravity ${p.duration}s linear infinite ${p.delay}s`,
                        }}
                    />
                ))}
            </div>

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

            {/* ヒーローセクション */}
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden min-h-screen justify-center z-10">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-800 mb-6 leading-tight blur-reveal" style={{ transitionDelay: '0.1s' }}>
                    終わった世界で、<br className="sm:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                        のんびりお茶を。
                    </span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed reveal-on-scroll" style={{ transitionDelay: '0.5s' }}>
                    サークル「青空アーカイブ」の公式ポータルサイトへようこそ。<br />
                    滅びたあとの静かな世界で、草花と青空に囲まれた穏やかな日常を描いています。
                </p>

                {/* ヒーロー画像エリア */}
                <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 bg-white relative aspect-video flex items-center justify-center border-4 border-white reveal-on-scroll" style={{ transitionDelay: '0.8s' }}>
                    {/* public/images/hero.png を配置してください */}
                    <img
                        src="/images/hero.png"
                        alt="青空と廃墟の風景"
                        className="w-full h-full object-cover animate-fade-in"
                        style={{
                            transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0002})`,
                            transformOrigin: 'center top',
                            willChange: 'transform'
                        }}
                    />
                </div>

                <div className="absolute bottom-10 animate-bounce text-slate-400">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            {/* About セクション */}
            <section id="about" className="py-24 bg-white relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3 blur-reveal">
                                <Leaf className="text-emerald-400" />
                                コンセプト
                            </h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>人類がいなくなった後の地球は、思いのほか平和でした。</p>
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>コンクリートの隙間から芽吹く緑、錆びた標識に止まる小鳥たち、そして見上げるほどに高く澄み渡る青空。私たちはそんな「コージーカタストロフィー（穏やかな終末）」をテーマに、同人誌やイラスト集を制作しています。</p>
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.5s' }}>アナログ水彩のあたたかみのあるタッチで、少し寂しくて、でもとても心地よい世界をお届けします。</p>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>
                            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-100 to-emerald-50 rounded-3xl transform rotate-3 scale-105 -z-10 animate-float-slow"></div>
                            <div className="rounded-2xl overflow-hidden shadow-lg bg-[#f4f7f6] aspect-video sm:aspect-[4/3] flex items-center justify-center">
                                {/* public/images/about.png を配置してください */}
                                <img src="/images/about.png" alt="終末世界の日常" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------
          World セクション（スクロールテリング実装）
          ---------------------------------------------------------------- */}
            <section id="world" className="relative bg-slate-900 z-10">

                {/* Sticky背景コンテナ */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">

                    {/* 画像 1: 黄金時代 (Cyberpunk) */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeWorldIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        {/* public/images/cyberpunk.png を配置してください */}
                        <img src="/images/cyberpunk.png" className="w-full h-full object-cover scale-105" alt="黄金時代" />
                        <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply"></div>
                    </div>

                    {/* 画像 2: 終末事変 (Destruction) */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeWorldIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
                        {/* public/images/destruction.png を配置してください */}
                        <img src="/images/destruction.png" className="w-full h-full object-cover scale-105" alt="終末事変" />
                        <div className="absolute inset-0 bg-red-950/70 mix-blend-multiply"></div>
                    </div>

                    {/* 画像 3: 目覚め (Cozy Post-apocalyptic) */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeWorldIndex === 2 ? 'opacity-100' : 'opacity-0'}`}>
                        {/* public/images/cozy.png を配置してください */}
                        <img src="/images/cozy.png" className="w-full h-full object-cover scale-105" alt="目覚め" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    </div>

                    {/* 共通のノイズテクスチャ */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                </div>

                {/* スクロールするテキストコンテンツエリア */}
                <div className="relative z-10 -mt-[100vh]">

                    {/* Step 0: 黄金時代 */}
                    <div className="world-step min-h-[150vh] flex items-center justify-center py-32" data-index="0">
                        <div className="max-w-2xl mx-auto px-6 text-slate-200">
                            <h3 className="text-3xl font-bold mb-8 tracking-widest text-cyan-400 blur-reveal">―――西暦2080年</h3>
                            <div className="space-y-8 text-lg md:text-xl leading-loose font-medium drop-shadow-lg">
                                <p className="reveal-on-scroll">人類文明は科学技術の発展により黄金時代を迎えました。</p>
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>世界中に大都市が築かれ、生存圏は星の外にまで広がり、人間と遜色ない思考や行動が可能なアンドロイドが生まれ、医学の発展により人類は「老い」すら克服していたのです。</p>
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>しかし、そんな文明の絶頂期は、突如として終わりを迎えます。</p>
                                <p className="reveal-on-scroll text-cyan-200 font-bold" style={{ transitionDelay: '0.6s' }}>2084年7月。地球上で様々な異常現象が同時多発的に発生し、ほんの数ヶ月間で文明は終焉を迎えました。</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: 終末事変 */}
                    <div className="world-step min-h-[200vh] flex items-center justify-center py-32" data-index="1">
                        <div className="max-w-3xl mx-auto px-6 text-center text-slate-200">
                            <h3 className="text-4xl sm:text-6xl tracking-[0.5em] font-serif mb-12 select-none text-red-500 glitch-reveal">
                                ―終末事変―
                            </h3>
                            <div className="space-y-8 text-lg md:text-xl leading-loose font-medium drop-shadow-xl bg-black/40 p-8 rounded-3xl backdrop-blur-sm border border-red-900/30">
                                <p className="reveal-on-scroll">後にそう呼ばれるこの事件の原因や詳細については、未だ明らかになっていません。</p>
                                <p className="reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>ただひとつ確かなことは、多くの人間の予想を裏切り、<br className="hidden sm:block" />あまりにもあっけなく世界が終わった。ということだけでしょう。</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: 目覚め (Cozy) */}
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

                </div>
            </section>
            {/* ---------------------------------------------------------------- */}

            {/* Works セクション */}
            <section id="works" className="py-24 bg-[#f4f7f6] relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 blur-reveal">
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 mb-4">
                            <BookOpen className="text-sky-500" />
                            発行物
                        </h2>
                        <p className="text-slate-500">最新の同人誌・イラスト集</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    </div>
                </div>
            </section>

            {/* フッター */}
            <footer id="contact" className="bg-slate-900 text-slate-400 py-16 relative z-10 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8 text-white cursor-pointer hover:text-sky-300 transition-colors" onClick={() => window.scrollTo(0, 0)}>
                        <Leaf className="h-6 w-6 text-emerald-500" />
                        <span className="font-bold text-2xl tracking-wider">青空アーカイブ</span>
                    </div>

                    <div className="flex gap-6 mb-8">
                        <a href="#" className="hover:text-sky-400 hover:scale-110 transition-all bg-slate-800 p-4 rounded-full">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-emerald-400 hover:scale-110 transition-all bg-slate-800 p-4 rounded-full">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>

                    <p className="text-sm tracking-widest opacity-70">
                        © {new Date().getFullYear()} Aozora Archive. All rights reserved.
                    </p>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        html { scroll-behavior: smooth; }
        
        @keyframes fade-in {
          from { opacity: 0; filter: blur(20px); transform: scale(1.05); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* --------------------------------------
           無重力パーティクルアニメーション (antigravity)
           -------------------------------------- */
        @keyframes antigravity {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-110vh) translateX(30px) scale(0.5); opacity: 0; }
        }

        /* Aboutセクションの装飾用フワフワ */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(3deg) scale(1.05); }
          50% { transform: translateY(-15px) rotate(1deg) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        /* --------------------------------------
           スクロールアニメーション：基本フェードアップ
           -------------------------------------- */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal-on-scroll.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* --------------------------------------
           スクロールアニメーション：ブラー付きフェードイン
           -------------------------------------- */
        .blur-reveal {
          opacity: 0;
          filter: blur(10px);
          transform: scale(0.95);
          transition: opacity 1.5s ease-out, filter 1.5s ease-out, transform 1.5s ease-out;
        }
        .blur-reveal.is-revealed {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        /* --------------------------------------
           スクロールアニメーション：グリッチ風出現（終末事変用）
           -------------------------------------- */
        @keyframes glitch-in {
          0% { opacity: 0; transform: translateX(-10px) skewX(20deg); filter: blur(5px) hue-rotate(90deg); }
          20% { opacity: 0.8; transform: translateX(10px) skewX(-20deg); filter: blur(0) hue-rotate(-90deg); }
          40% { opacity: 0.4; transform: translateX(-5px) skewX(10deg); filter: blur(2px) hue-rotate(45deg); }
          60% { opacity: 1; transform: translateX(5px) skewX(-10deg); filter: blur(0); }
          80% { opacity: 0.8; transform: translateX(-2px) skewX(5deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0); filter: hue-rotate(0); }
        }
        .glitch-reveal {
          opacity: 0;
        }
        .glitch-reveal.is-revealed {
          animation: glitch-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}} />
        </div>
    );
}