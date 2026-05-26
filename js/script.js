/* =============================================
   TRAVEL NEEDS AUSTRALIA — script.js
   ============================================= */

(function () {
  'use strict';

  // ---- DOM References ----
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const backToTop   = document.getElementById('backToTop');
  const heroBg      = document.querySelector('.hero-bg');
  const serviceCards = document.querySelectorAll('.service-card');
  const allNavLinks  = document.querySelectorAll('.nav-links a');

  // =============================================
  // 1. NAVBAR — Scroll behaviour
  // =============================================
  function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky with background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // =============================================
  // 2. HAMBURGER MENU
  // =============================================
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // =============================================
  // 3. HERO BG — Ken Burns on load
  // =============================================
  if (heroBg) {
    window.addEventListener('load', function () {
      heroBg.classList.add('loaded');
    });
  }

  // =============================================
  // 4. SCROLL ANIMATIONS — Intersection Observer
  // =============================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // Service cards staggered reveal
  const serviceObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = parseInt(card.getAttribute('data-delay') || '0', 10);
        setTimeout(function () {
          card.classList.add('visible');
        }, delay);
        serviceObserver.unobserve(card);
      }
    });
  }, observerOptions);

  serviceCards.forEach(function (card) {
    serviceObserver.observe(card);
  });

  // Generic fade-in for explore cards, testimonials, products
  const fadeElements = document.querySelectorAll(
    '.explore-card, .testimonial-card, .product-card, .feature-item'
  );

  const genericObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        genericObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(function (el, index) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${(index % 4) * 80}ms, transform 0.5s ease ${(index % 4) * 80}ms`;
    genericObserver.observe(el);
  });

  // =============================================
  // 5. SMOOTH SCROLL for anchor links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // =============================================
  // 6. BACK TO TOP button
  // =============================================
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =============================================
  // 7. ACTIVE NAV LINK on scroll (highlight current section)
  // =============================================
  const sections = document.querySelectorAll('section[id], footer[id]');

  function highlightNavLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollMid >= top && scrollMid < bottom) {
          allNavLinks.forEach(l => l.style.color = '');
          link.style.color = '#ffffff';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // =============================================
  // 8. PRODUCT IMAGE lazy loading fallback
  // =============================================
  document.querySelectorAll('.product-img-wrap img').forEach(function (img) {
    img.addEventListener('error', function () {
      const label = this.alt || 'Image';
      this.src = `https://placehold.co/400x300/e2e8f0/94a3b8?text=${encodeURIComponent(label)}`;
    });
  });

  // =============================================
  // 9. INIT
  // =============================================
  handleScroll(); // Run on page load

})();
