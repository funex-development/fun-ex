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
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Header Scroll Effect - Hide on scroll down, show on scroll up
    const navbar = document.querySelector('.navbar');
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
                mobileMenu.classList.remove('active');
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




    // Swiper disabled - now using static grid layout
    /*
    const swiper = new Swiper('.services-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        loopAdditionalSlides: 5,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 3,
                centeredSlides: true,
                spaceBetween: 30,
            }
        }
    });
    */



});
