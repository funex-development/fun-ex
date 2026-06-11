document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // Optional: Toggle body scroll lock
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // トランジションを一時的に無効化して即座に閉じる（ページ遷移時のカクつき防止）
                mobileMenu.style.transition = 'none';
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Header Scroll Effect - Hide on scroll down, show on scroll up
    const navbar = document.querySelector('.navbar');
    // スクロールプログレスバー（トップページのみ存在。共有スクリプトのため null ガード）
    const progressBar = document.querySelector('.scroll-progress-bar');
    let lastScrollTop = 0;
    let scrollTicking = false;

    // passive:true でメインスレッドブロック回避 + requestAnimationFrameでスロットル
    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            } else {
                navbar.style.transform = 'translateY(0)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.padding = '5px 0';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.8)';
                navbar.style.padding = '8px 0';
                navbar.style.boxShadow = 'none';
            }

            // プログレスバー更新（transform のみ。既存 rAF に相乗り＝追加リスナーなし）
            if (progressBar) {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                const progress = max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
                progressBar.style.transform = `scaleX(${progress})`;
                // 先端ノードはバーの scaleX を受けて潰れるため、逆数で打ち消して正円を保つ
                progressBar.style.setProperty('--progress-inv', progress > 0.01 ? (1 / progress).toFixed(3) : '1');
            }
            scrollTicking = false;
        });
    }, { passive: true });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (menuBtn) menuBtn.classList.remove('active');
                document.body.style.overflow = '';

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });




    // Services Swiper — モバイルのみループカルーセルとして有効化
    let servicesSwiper = null;
    const servicesSwiperEl = document.querySelector('.services-swiper');

    function initServicesSwiper() {
        const isMobile = window.innerWidth < 769;
        if (!servicesSwiperEl) return;

        if (isMobile && !servicesSwiper) {
            servicesSwiper = new Swiper('.services-swiper', {
                slidesPerView: 'auto',
                centeredSlides: true,
                loop: true,
                loopAdditionalSlides: 3,
                spaceBetween: 16,
                grabCursor: true,
                speed: 500,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },
                pagination: {
                    el: '.services-swiper .swiper-pagination',
                    clickable: true,
                },
                on: {
                    // 初期化直後とリサイズ時にレイアウトを再計算して中央ズレを防止
                    init: function () {
                        requestAnimationFrame(() => this.update());
                    },
                    resize: function () {
                        requestAnimationFrame(() => this.update());
                    },
                    // スライド切替時にアクティブカードを1回だけ光らせる
                    // （ホバー時シャインスイープのモバイル代替演出）
                    slideChangeTransitionEnd: function () {
                        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                        const slide = this.slides[this.activeIndex];
                        const card = slide && slide.querySelector('.magic-card');
                        if (!card || card.classList.contains('shine-once')) return;
                        card.classList.add('shine-once');
                        // アイコン等の animationend が伝播してくるため animationName で絞る
                        card.addEventListener('animationend', function handler(e) {
                            if (e.animationName !== 'shineSweep') return;
                            card.classList.remove('shine-once');
                            card.removeEventListener('animationend', handler);
                        });
                    }
                }
            });
        } else if (!isMobile && servicesSwiper) {
            servicesSwiper.destroy(true, true);
            servicesSwiper = null;
        }
    }

    initServicesSwiper();

    // リサイズ時にモバイル⇔PC切替を処理（デバウンス）
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initServicesSwiper, 200);
    });



    // スクロールリビール — .reveal 要素が画面に入ったらふわっと表示
    // JS無効環境では .js-reveal が付かないため、コンテンツは常に表示される
    const revealEls = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealEls.length > 0 && 'IntersectionObserver' in window && !prefersReducedMotion) {
        document.documentElement.classList.add('js-reveal');

        // 時間差は「同時に画面へ入ったバッチ内」で 0.12s ずつ動的に付与する。
        // （ロード時にセクション内連番で一括付与すると、要素数の多いページで
        //   後方の要素だけ発火が数百ms遅れてしまうため）
        const revealObserver = new IntersectionObserver((entries) => {
            const batch = entries
                .filter(entry => entry.isIntersecting)
                .map(entry => entry.target)
                // entries の順序は仕様上保証されないため DOM 順に並べ直す
                .sort((a, b) =>
                    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
                );

            batch.forEach((el, i) => {
                el.style.transitionDelay = `${i * 0.12}s`;
                el.classList.add('is-visible');
                // リビール完了後はディレイを消す（カード等のホバー反応が遅れるのを防ぐ）
                el.addEventListener('transitionend', () => {
                    el.style.transitionDelay = '';
                }, { once: true });
                revealObserver.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }


    // 画面外セクションの常時アニメを停止（省電力・合成コスト削減）
    // CSS 側で is-inview が無い間は animation-play-state: paused になる。
    // トップページ（body.home）以外では対象 0 件で何もしない
    const animSections = document.querySelectorAll('.home .about, .home .services, .home .contact-cta');
    if (animSections.length > 0 && 'IntersectionObserver' in window) {
        const inviewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-inview', entry.isIntersecting);
            });
        }, { rootMargin: '120px 0px' });
        animSections.forEach(el => inviewObserver.observe(el));
    }

});
