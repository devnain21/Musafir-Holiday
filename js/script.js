/* ============================================
   MUSAFIR HOLIDAY - JavaScript
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 600);
        });
        // Fallback: hide preloader after 3 seconds
        setTimeout(() => preloader.classList.add('hidden'), 3000);
    }

    // --- Lazy Background Images (hero slides) ---
    document.querySelectorAll('[data-bg]').forEach(el => {
        const url = el.getAttribute('data-bg');
        if (url) {
            const img = new Image();
            img.onload = () => { el.style.backgroundImage = `url('${url}')`; };
            img.src = url;
        }
    });

    // --- Hero Slider ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideInterval;

    function setSlide(index) {
        const liveDots = document.querySelectorAll('.hero-dot');
        slides.forEach((s, i) => {
            s.classList.remove('active');
            s.querySelectorAll('.animate-slide').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            });
        });
        liveDots.forEach(d => d.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (liveDots[currentSlide]) liveDots[currentSlide].classList.add('active');
        // Re-enable transitions after a frame, then clear inline styles to trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slides[currentSlide].querySelectorAll('.animate-slide').forEach(el => {
                    el.style.transition = '';
                    el.style.opacity = '';
                    el.style.transform = '';
                });
            });
        });
    }

    function nextSlide() { setSlide(currentSlide + 1); }
    function startSlider() { slideInterval = setInterval(nextSlide, 5000); }
    function resetSlider() { clearInterval(slideInterval); startSlider(); }

    if (slides.length > 0) {
        setSlide(0);
        startSlider();
        const prevBtn = document.querySelector('.hero-nav.prev');
        const nextBtn = document.querySelector('.hero-nav.next');
        if (prevBtn) prevBtn.addEventListener('click', () => { setSlide(currentSlide - 1); resetSlider(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { setSlide(currentSlide + 1); resetSlider(); });
    }

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    // --- Back to Top ---
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- Generate Hero Dots ---
    const dotsContainer = document.getElementById('heroDots');
    if (dotsContainer && slides.length > 0) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('hero-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { setSlide(i); resetSlider(); });
            dotsContainer.appendChild(dot);
        });
    }
    // Update dots reference after generation
    const allDots = document.querySelectorAll('.hero-dot');
    // Patch setSlide to use live dots
    const origSetSlide = setSlide;

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;
    function animateCounters() {
        if (counterAnimated) return;
        counterAnimated = true;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = current + suffix;
                }
            }, 25);
        });
    }
    if (counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
            });
        }, { threshold: 0.3 });
        const statsSection = document.querySelector('.stats-bar');
        if (statsSection) statsObserver.observe(statsSection);
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Form Submissions ---
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const origText = btn ? btn.textContent : '';
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }
            setTimeout(() => {
                alert('Thank you! Your enquiry has been submitted. Our team will contact you soon.');
                form.reset();
                if (btn) { btn.textContent = origText; btn.disabled = false; }
            }, 1000);
        });
    });

});
