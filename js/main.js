document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.querySelector('.main-nav');

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            burgerMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                burgerMenu.classList.remove('open');
            }
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                burgerMenu.classList.remove('open');
            });
        });
    }

    // 2. Scroll Animations (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly to trigger before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.section-header, .service-card, .feature-item, .pricing-card, .info-card, .form-card, .hero-content, .testimonial-card, .ethics-col');

    animatedElements.forEach(el => {
        el.classList.add('fade-in-up'); // Ensure class is added
        observer.observe(el);
    });

    // 3. Header Scroll Effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                header.style.background = "rgba(255, 255, 255, 0.95)";
            } else {
                header.style.boxShadow = "none";
                header.style.boxShadow = "0 1px 0 rgba(0,0,0,0.05)";
                header.style.background = "rgba(250, 249, 246, 0.9)";
            }
        });
    }
});
