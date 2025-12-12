document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // Transform hamburger to X
            const bars = menuBtn.querySelectorAll('.bar');
            if (menuBtn.classList.contains('active')) {
                // Add simple CSS manipulation for the icon or handle in CSS class
                // For simplicity, we toggle a class and handle visuals in CSS
            }
        });
    }

    // Header Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');

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


    // Opening Animation
    const overlay = document.getElementById('opening-overlay');
    const wrapper = document.querySelector('.opening-wrapper');

    if (overlay && wrapper) {
        // Generate 32 particles
        const particleCount = 32;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('burst-particle');

            // Random direction and distance
            const angle = (Math.PI * 2 * i) / particleCount; // Evenly distributed angles or use random
            // Add some randomness to angle
            const randomAngle = angle + (Math.random() - 0.5) * 0.5;

            const distance = 300 + Math.random() * 400; // Fly out 300-700px
            const tx = Math.cos(randomAngle) * distance;
            const ty = Math.sin(randomAngle) * distance;
            const tr = Math.random() * 720 - 360; // Rotate up to 360deg

            // Randomize size slightly
            const scale = 0.5 + Math.random() * 1.0;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--tr', `${tr}deg`);
            // We can also randomize current scale if we want via another var, but strictly CSS animation handles scale

            wrapper.appendChild(particle);
        }

        // Animation length is 1.8s + particle fade out
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }, 3200); // Extended for smooth 2-step zoom + particle fix
    }

    // Initialize Swiper
    const swiper = new Swiper('.services-swiper', {
        slidesPerView: 'auto', // CSS controls width
        centeredSlides: true, // Active slide in center
        spaceBetween: 20, // Narrow gap
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // No grid breakpoints needed as 'auto' handles it via CSS width
    });

});
