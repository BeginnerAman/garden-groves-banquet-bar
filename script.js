/* ============================================================
   Garden Groves — Navbar Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Element References ----
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('navMobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.navbar__mobile-link');

  // ---- Scroll → Compact Navbar ----
  const SCROLL_THRESHOLD = 60;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Passive listener for performance
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Run once on load in case the page is already scrolled
  handleScroll();

  // ---- Hamburger Toggle ----
  const openMenu = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  };

  hamburger.addEventListener('click', toggleMenu);

  // ---- Close mobile menu when a link is clicked ----
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ---- Close on Escape key ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ---- Active link highlighting based on current section ----
  // (Will become functional as sections are added in future tasks)
  const navLinks = document.querySelectorAll('.navbar__link');

  const setActiveLink = (hash) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  };

  // Set Home as active by default
  setActiveLink('#home');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      setActiveLink(link.getAttribute('href'));
    });
  });

  // ---- Scroll-Reveal for Offering Cards ----
  const revealElements = document.querySelectorAll('.offering-card');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});
